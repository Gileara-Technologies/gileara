import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/apply/route";

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

function post(body: BodyInit) {
  return POST(new Request(BASE, { method: "POST", body }));
}

/**
 * Minimal D1 fake — just the surface createApplication touches (INSERT via
 * run(), then SELECT-by-id via first()) so a POST can take the real
 * saved=true path instead of the legacy fallback.
 */
function makeFakeD1() {
  const rows: Record<string, unknown>[] = [];
  let nextId = 1;
  return {
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
          return null;
        },
        async all() {
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
});
