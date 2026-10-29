import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/apply/route";
import { APPLY_RATE_LIMIT_MAX } from "@/lib/portal/rate-limit";

const BASE = "http://localhost:3000/api/apply";

/**
 * Cloudflare context stub. `null` reproduces the real behavior outside
 * Workers (getCloudflareContext throws), which is what most tests
 * exercise; tests that need a context install one.
 */
const cfState = vi.hoisted(() => ({
  context: null as null | {
    env: unknown;
    ctx: { waitUntil: (promise: Promise<unknown>) => void };
  },
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => {
    if (!cfState.context) {
      throw new Error("Cloudflare context is not available");
    }
    return cfState.context;
  },
}));

function makeForm(overrides: Partial<Record<string, string | File>> = {}) {
  const form = new FormData();
  form.set("name", "Jane Candidate");
  form.set("email", "jane@example.com");
  form.set("position", "frontend");
  form.set(
    "resume",
    new File(["resume content"], "resume.pdf", { type: "application/pdf" }),
  );
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      form.delete(key);
    } else {
      form.set(key, value);
    }
  }
  return form;
}

/**
 * Every POST gets its own TEST-NET-2 address unless a test asks for a
 * specific one. The route rate-limits per IP, so sharing a key across tests
 * would make them depend on execution order.
 */
let ipCounter = 0;
function nextIp(): string {
  ipCounter += 1;
  return `198.51.100.${(ipCounter % 250) + 1}`;
}

function post(body: BodyInit, ip: string = nextIp()) {
  return POST(
    new Request(BASE, {
      method: "POST",
      body,
      headers: { "cf-connecting-ip": ip },
    }),
  );
}

/** Set env vars for one test, restoring whatever was there before. */
async function withEnv(vars: Record<string, string>, run: () => Promise<void>) {
  const previous = new Map(
    Object.keys(vars).map((key) => [key, process.env[key]] as const),
  );
  for (const [key, value] of Object.entries(vars)) {
    process.env[key] = value;
  }
  try {
    await run();
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

interface FakeRoleSeed {
  id: string;
  title: string;
  status: string;
}

/** Mirrors production: one open role, one closed role. */
const DEFAULT_ROLES: FakeRoleSeed[] = [
  { id: "full-stack-engineer", title: "Full-Stack Engineer", status: "open" },
  {
    id: "administration-officer",
    title: "Administration Officer",
    status: "closed",
  },
];

/**
 * Minimal D1 fake — just the surface the apply route touches: role lookups
 * (getRole / listRoles), the INSERT via run(), then SELECT-by-id via first(),
 * so a POST can take the real saved=true path instead of the legacy fallback.
 */
function makeFakeD1(options: { roles?: FakeRoleSeed[] } = {}) {
  const roles = options.roles ?? DEFAULT_ROLES;
  const rows: Record<string, unknown>[] = [];
  let nextId = 1;
  return {
    rows,
    prepare(sql: string) {
      const binds: unknown[] = [];
      const statement = {
        bind(...values: unknown[]) {
          binds.splice(0, binds.length, ...values);
          return statement;
        },
        async run() {
          if (sql.startsWith("INSERT INTO applications")) {
            const id = nextId;
            nextId += 1;
            rows.push({
              id,
              role_id: binds[0],
              name: binds[1],
              email: binds[2],
              phone: binds[3],
              resume_key: binds[4],
              resume_filename: binds[5],
              cover_letter: binds[6],
              why_this_role: binds[7],
              created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
              status: "new",
              status_updated_at: null,
              status_updated_by: null,
            });
            return { success: true, meta: { last_row_id: id } };
          }
          return { success: true, meta: { last_row_id: null } };
        },
        async first() {
          if (sql.startsWith("SELECT * FROM applications WHERE id")) {
            return rows.find((row) => row.id === binds[0]) ?? null;
          }
          if (sql.startsWith("SELECT * FROM roles WHERE id")) {
            return roles.find((role) => role.id === binds[0]) ?? null;
          }
          return null;
        },
        async all() {
          if (sql.startsWith("SELECT * FROM roles")) {
            return { results: roles };
          }
          return { results: [] };
        },
      };
      return statement;
    },
  };
}

describe("POST /api/apply", () => {
  it("accepts a complete application", async () => {
    const res = await post(makeForm());
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ success: true });
  });

  it("rejects submissions missing required fields", async () => {
    const res = await post(makeForm({ resume: undefined }));
    expect(res.status).toBe(400);
    const body: unknown = await res.json();
    expect((body as { error: string }).error).toContain("Missing");
  });

  it("rejects resumes over the 5MB limit", async () => {
    const bigFile = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.pdf", {
      type: "application/pdf",
    });
    const res = await post(makeForm({ resume: bigFile }));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toMatchObject({
      error: expect.stringContaining("5MB"),
    });
  });

  it("returns 500 when the body is not valid form data", async () => {
    const res = await post("not-a-form");
    // A plain-text body makes formData() throw; the route should handle it.
    expect([400, 500]).toContain(res.status);
  });

  // Regression: the notification used to be a floating promise, which the
  // Workers runtime cancelled as soon as the response was returned, so no
  // HR email was ever sent. It must be handed to ctx.waitUntil.
  it("hands the HR notification to ctx.waitUntil instead of dropping it", async () => {
    const waitUntil = vi.fn();
    cfState.context = { env: {}, ctx: { waitUntil } };
    const previous = process.env.APPLICATION_NOTIFY_ENABLED;
    // Force the offline early-return path; this test is about the hand-off,
    // not the Resend call.
    process.env.APPLICATION_NOTIFY_ENABLED = "0";

    try {
      const res = await post(makeForm());
      expect(res.status).toBe(200);
      expect(waitUntil).toHaveBeenCalledTimes(1);
      const passed = waitUntil.mock.calls[0][0] as Promise<unknown>;
      expect(passed).toBeInstanceOf(Promise);
      await expect(passed).resolves.toBe(false);
    } finally {
      cfState.context = null;
      if (previous === undefined) {
        delete process.env.APPLICATION_NOTIFY_ENABLED;
      } else {
        process.env.APPLICATION_NOTIFY_ENABLED = previous;
      }
    }
  });

  // Phase 7: the candidate receipt rides the same waitUntil hand-off as the
  // HR notification — but ONLY after the row exists, so an unauthenticated
  // POST cannot be turned into a way to email addresses we never stored.
  it("hands the candidate confirmation to ctx.waitUntil once the application is saved", async () => {
    const waitUntil = vi.fn();
    cfState.context = {
      env: { gileara_careers_db: makeFakeD1() },
      ctx: { waitUntil },
    };
    const notify = process.env.APPLICATION_NOTIFY_ENABLED;
    const confirm = process.env.APPLICATION_CONFIRM_ENABLED;
    // Both senders short-circuit without touching the network; the assertion
    // is the hand-off itself.
    process.env.APPLICATION_NOTIFY_ENABLED = "0";
    process.env.APPLICATION_CONFIRM_ENABLED = "0";

    try {
      const res = await post(makeForm({ roleId: "full-stack-engineer" }));
      expect(res.status).toBe(200);
      expect(waitUntil).toHaveBeenCalledTimes(2); // HR notification + receipt
      const promises = waitUntil.mock.calls.map(
        (call) => call[0] as Promise<unknown>,
      );
      for (const promise of promises) {
        expect(promise).toBeInstanceOf(Promise);
        await expect(promise).resolves.toBe(false);
      }
    } finally {
      cfState.context = null;
      if (notify === undefined) {
        delete process.env.APPLICATION_NOTIFY_ENABLED;
      } else {
        process.env.APPLICATION_NOTIFY_ENABLED = notify;
      }
      if (confirm === undefined) {
        delete process.env.APPLICATION_CONFIRM_ENABLED;
      } else {
        process.env.APPLICATION_CONFIRM_ENABLED = confirm;
      }
    }
  });

  it("does not queue a candidate confirmation when the application was not saved", async () => {
    const waitUntil = vi.fn();
    // A context exists (so the HR hand-off is observable) but there is no D1
    // binding, so the POST takes the legacy, unsaved path. The confirmation
    // flag is deliberately left ON: only the `saved` gate stops it.
    cfState.context = { env: {}, ctx: { waitUntil } };
    const notify = process.env.APPLICATION_NOTIFY_ENABLED;
    process.env.APPLICATION_NOTIFY_ENABLED = "0";

    try {
      const res = await post(makeForm());
      expect(res.status).toBe(200);
      expect(waitUntil).toHaveBeenCalledTimes(1); // HR only, no receipt
    } finally {
      cfState.context = null;
      if (notify === undefined) {
        delete process.env.APPLICATION_NOTIFY_ENABLED;
      } else {
        process.env.APPLICATION_NOTIFY_ENABLED = notify;
      }
    }
  });

  // Hardening (docs/PORTAL-PLAN.md, "Hardening note"). The honeypot mirrors
  // /api/newsletter: answer like a stored application so a bot has nothing to
  // learn, but write nothing and send nothing.
  it("accepts a honeypot submission silently, without a write or an email", async () => {
    const waitUntil = vi.fn();
    const db = makeFakeD1();
    cfState.context = { env: { gileara_careers_db: db }, ctx: { waitUntil } };

    try {
      const res = await post(
        makeForm({
          roleId: "full-stack-engineer",
          position: "Full-Stack Engineer",
          honeypot: "http://spam.example",
        }),
      );
      expect(res.status).toBe(200);
      // Indistinguishable from the real thing, on purpose.
      await expect(res.json()).resolves.toMatchObject({
        success: true,
        message: expect.stringContaining("5 business days"),
      });
      expect(db.rows).toHaveLength(0);
      expect(waitUntil).not.toHaveBeenCalled();
    } finally {
      cfState.context = null;
    }
  });

  it("lets a submission through when the honeypot is present but empty", async () => {
    const db = makeFakeD1();
    cfState.context = {
      env: { gileara_careers_db: db },
      ctx: { waitUntil: vi.fn() },
    };

    try {
      await withEnv(
        {
          APPLICATION_NOTIFY_ENABLED: "0",
          APPLICATION_CONFIRM_ENABLED: "0",
        },
        async () => {
          const res = await post(
            makeForm({
              roleId: "full-stack-engineer",
              position: "Full-Stack Engineer",
              honeypot: "",
            }),
          );
          expect(res.status).toBe(200);
          expect(db.rows).toHaveLength(1);
        },
      );
    } finally {
      cfState.context = null;
    }
  });

  it("answers 429 with Retry-After once one address exceeds the limit", async () => {
    const ip = "203.0.113.77";
    // These submissions fail validation — and still count: the limiter runs
    // before the body is read, which is exactly what makes it cheap.
    const incomplete = makeForm({ resume: undefined });

    for (let i = 0; i < APPLY_RATE_LIMIT_MAX; i += 1) {
      const res = await post(incomplete, ip);
      expect(res.status).toBe(400);
    }

    const limited = await post(incomplete, ip);
    expect(limited.status).toBe(429);
    const retryAfter = Number(limited.headers.get("Retry-After"));
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(600);
    await expect(limited.json()).resolves.toMatchObject({
      error: expect.stringContaining("Too many applications"),
    });

    // Another network is untouched by that address's spending.
    const other = await post(incomplete, "203.0.113.78");
    expect(other.status).toBe(400);
  });

  it("refuses an application for a role that is not open", async () => {
    const waitUntil = vi.fn();
    const db = makeFakeD1();
    cfState.context = { env: { gileara_careers_db: db }, ctx: { waitUntil } };

    try {
      const res = await post(
        makeForm({
          roleId: "administration-officer",
          position: "Administration Officer",
        }),
      );
      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toMatchObject({
        error: expect.stringContaining("isn't accepting applications"),
      });
      expect(db.rows).toHaveLength(0);
      expect(waitUntil).not.toHaveBeenCalled();
    } finally {
      cfState.context = null;
    }
  });

  // Regression: the route used to fall back to slugify(position), which saved
  // applications against ids that exist in no table — invisible in the admin,
  // because applications are read per role.
  it("refuses a role id that does not exist instead of inventing a slug", async () => {
    const db = makeFakeD1();
    cfState.context = {
      env: { gileara_careers_db: db },
      ctx: { waitUntil: vi.fn() },
    };

    try {
      const res = await post(
        makeForm({
          roleId: "chief-vibes-officer",
          position: "Chief Vibes Officer",
        }),
      );
      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toMatchObject({
        error: expect.stringContaining("don't recognise that role"),
      });
      expect(db.rows).toHaveLength(0);
    } finally {
      cfState.context = null;
    }
  });

  it("resolves the general form's position title against the roles table", async () => {
    const db = makeFakeD1();
    cfState.context = {
      env: { gileara_careers_db: db },
      ctx: { waitUntil: vi.fn() },
    };

    try {
      await withEnv(
        {
          APPLICATION_NOTIFY_ENABLED: "0",
          APPLICATION_CONFIRM_ENABLED: "0",
        },
        async () => {
          // No roleId: same shape the /careers form sends.
          const res = await post(makeForm({ position: "Full-Stack Engineer" }));
          expect(res.status).toBe(200);
          expect(db.rows).toHaveLength(1);
          expect(db.rows[0].role_id).toBe("full-stack-engineer");
        },
      );
    } finally {
      cfState.context = null;
    }
  });

  it("refuses a position title that matches no role", async () => {
    const db = makeFakeD1();
    cfState.context = {
      env: { gileara_careers_db: db },
      ctx: { waitUntil: vi.fn() },
    };

    try {
      const res = await post(makeForm({ position: "Astronaut" }));
      expect(res.status).toBe(400);
      expect(db.rows).toHaveLength(0);
    } finally {
      cfState.context = null;
    }
  });
});
