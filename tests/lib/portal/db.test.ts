import { describe, expect, it } from "vitest";
import {
  countApplicationsByRole,
  createApplication,
  createRole,
  getRole,
  listApplications,
  listRoles,
  parseRoleRow,
  setApplicationStatus,
  setRoleStatus,
  updateRole,
  type D1Like,
} from "@/lib/portal/db";
import type { ApplicationRow, RoleRow } from "@/lib/portal/types";

// ---------------------------------------------------------------------------
// Tiny in-memory fake D1: implements exactly the surface db.ts calls
// (prepare().bind().all()/first()/run()) by interpreting the handful of SQL
// statements db.ts issues. State is inspectable/mutable via `fake.state` so
// tests can seed rows and control the clock.
// ---------------------------------------------------------------------------

type FakeResult = { results: unknown[]; lastRowId?: number };

function makeFakeD1(seeded: { roles?: RoleRow[]; applications?: ApplicationRow[] } = {}) {
  const state = {
    roles: [...(seeded.roles ?? [])],
    applications: [...(seeded.applications ?? [])],
    nextApplicationId: (seeded.applications?.length ?? 0) + 1,
    /** SQLite datetime('now')-shaped clock; tests may override it. */
    now: (): string => new Date().toISOString().slice(0, 19).replace("T", " "),
  };

  const byOrder = (a: RoleRow, b: RoleRow): number =>
    a.display_order - b.display_order || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const byAppDesc = (a: ApplicationRow, b: ApplicationRow): number =>
    a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : b.id - a.id;

  const execute = (sql: string, binds: unknown[]): FakeResult => {
    if (sql.startsWith("UPDATE roles SET status")) {
      const [status, id] = binds as unknown as [RoleRow["status"], string];
      const row = state.roles.find((r) => r.id === id);
      if (row) {
        row.status = status;
        row.updated_at = state.now();
      }
      return { results: [] };
    }
    if (sql.startsWith("UPDATE roles SET")) {
      const setPart = sql.slice(sql.indexOf("SET") + 3, sql.indexOf("WHERE id = ?"));
      const columns = setPart
        .split(",")
        .map((c) => c.trim().split("=")[0].trim());
      const id = binds[binds.length - 1] as string;
      const row = state.roles.find((r) => r.id === id);
      if (row) {
        columns.forEach((column, index) => {
          if (column === "updated_at") {
            row.updated_at = state.now();
          } else {
            (row as unknown as Record<string, unknown>)[column] = binds[index];
          }
        });
      }
      return { results: [] };
    }
    if (sql.startsWith("UPDATE applications SET status")) {
      const [status, actorEmail, id] = binds as unknown as [
        ApplicationRow["status"],
        string,
        number,
      ];
      const row = state.applications.find((a) => a.id === id);
      if (row) {
        row.status = status;
        row.status_updated_at = state.now();
        row.status_updated_by = actorEmail;
      }
      return { results: [] };
    }
    if (sql.startsWith("INSERT INTO roles")) {      const [id, title, openings, icon, location, description, responsibilities, requiredSkills, niceToHave, status, displayOrder] =
        binds as unknown as [
          string,
          string,
          number,
          string,
          string,
          string,
          string,
          string,
          string,
          RoleRow["status"],
          number,
        ];
      const ts = state.now();
      state.roles.push({
        id,
        title,
        openings,
        icon,
        location,
        description,
        responsibilities,
        required_skills: requiredSkills,
        nice_to_have: niceToHave,
        status,
        display_order: displayOrder,
        created_at: ts,
        updated_at: ts,
      });
      return { results: [], lastRowId: state.roles.length };
    }
    if (sql.startsWith("SELECT * FROM roles WHERE status")) {
      const [status] = binds as unknown as [RoleRow["status"]];
      return { results: state.roles.filter((r) => r.status === status).sort(byOrder) };
    }
    if (sql.startsWith("SELECT * FROM roles WHERE id")) {
      const [id] = binds as unknown as [string];
      return { results: state.roles.filter((r) => r.id === id) };
    }
    if (sql.startsWith("SELECT id FROM roles")) {
      return { results: state.roles.map((r) => ({ id: r.id })) };
    }
    if (sql.startsWith("SELECT * FROM roles")) {
      return { results: [...state.roles].sort(byOrder) };
    }
    if (sql.startsWith("SELECT * FROM applications WHERE role_id")) {
      const [roleId] = binds as unknown as [string];
      return { results: state.applications.filter((a) => a.role_id === roleId).sort(byAppDesc) };
    }
    if (sql.startsWith("SELECT * FROM applications WHERE id")) {
      const [id] = binds as unknown as [number];
      return { results: state.applications.filter((a) => a.id === id) };
    }
    if (sql.startsWith("INSERT INTO applications")) {
      const [roleId, name, email, phone, resumeKey, resumeFilename, coverLetter, whyThisRole] =
        binds as unknown as [string, string, string, string | null, string, string, string | null, string | null];
      const row: ApplicationRow = {
        id: state.nextApplicationId,
        role_id: roleId,
        name,
        email,
        phone,
        resume_key: resumeKey,
        resume_filename: resumeFilename,
        cover_letter: coverLetter,
        why_this_role: whyThisRole,
        created_at: state.now(),
        // Migration 0003 defaults: untouched rows sit in 'new' with no
        // audit stamp.
        status: "new",
        status_updated_at: null,
        status_updated_by: null,
      };
      state.nextApplicationId += 1;
      state.applications.push(row);
      return { results: [], lastRowId: row.id };
    }
    if (sql.startsWith("SELECT role_id, COUNT(")) {
      const perRole = new Map<string, number>();
      for (const app of state.applications) {
        perRole.set(app.role_id, (perRole.get(app.role_id) ?? 0) + 1);
      }
      return { results: [...perRole.entries()].map(([role_id, count]) => ({ role_id, count })) };
    }
    throw new Error(`fake D1: unhandled query: ${sql}`);
  };

  const db: D1Like = {
    prepare(sql: string) {
      const binds: unknown[] = [];
      const statement = {
        bind(...values: unknown[]) {
          binds.splice(0, binds.length, ...values);
          return statement;
        },
        async all<T = unknown>() {
          const { results } = execute(sql, binds);
          return { results: results as T[] };
        },
        async first<T = unknown>() {
          const { results } = execute(sql, binds);
          return (results[0] ?? null) as T | null;
        },
        async run() {
          const { lastRowId } = execute(sql, binds);
          return { success: true, meta: { last_row_id: lastRowId ?? null } };
        },
      };
      return statement;
    },
  };

  return { db, state };
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function role(overrides: Partial<RoleRow> = {}): RoleRow {
  return {
    id: "full-stack-engineer",
    title: "Full-Stack Engineer",
    openings: 2,
    icon: "code_blocks",
    location: "Accra · Hybrid",
    description: "Ship the systems small businesses run on.",
    responsibilities: JSON.stringify(["Build end-to-end features", "Write tests"]),
    required_skills: JSON.stringify(["TypeScript", "React"]),
    nice_to_have: JSON.stringify(["Cloudflare Workers"]),
    status: "open",
    display_order: 1,
    created_at: "2026-01-01 00:00:00",
    updated_at: "2026-01-01 00:00:00",
    ...overrides,
  };
}

function application(overrides: Partial<ApplicationRow> = {}): ApplicationRow {
  return {
    id: 1,
    role_id: "full-stack-engineer",
    name: "Ama Owusu",
    email: "ama@example.com",
    phone: "+233 20 000 0000",
    resume_key: "applications/full-stack-engineer/ama.pdf",
    resume_filename: "ama-owusu.pdf",
    cover_letter: "I would love to join Gileara.",
    why_this_role: "The mission resonates with me.",
    created_at: "2026-01-02 00:00:00",
    status: "new",
    status_updated_at: null,
    status_updated_by: null,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Row mapping
// ---------------------------------------------------------------------------

describe("parseRoleRow", () => {
  it("parses valid JSON list fields into string arrays", () => {
    const parsed = parseRoleRow(role());
    expect(parsed.responsibilities).toEqual(["Build end-to-end features", "Write tests"]);
    expect(parsed.requiredSkills).toEqual(["TypeScript", "React"]);
    expect(parsed.niceToHave).toEqual(["Cloudflare Workers"]);
  });

  it("maps snake_case columns to camelCase domain keys", () => {
    const parsed = parseRoleRow(role());
    expect(parsed).toMatchObject({
      id: "full-stack-engineer",
      title: "Full-Stack Engineer",
      status: "open",
      displayOrder: 1,
      createdAt: "2026-01-01 00:00:00",
    });
  });

  it("falls back to [] for invalid JSON in a list field", () => {
    const parsed = parseRoleRow(role({ responsibilities: "{not json" }));
    expect(parsed.responsibilities).toEqual([]);
    expect(parsed.requiredSkills).toEqual(["TypeScript", "React"]);
  });

  it("falls back to [] for missing list fields", () => {
    const parsed = parseRoleRow({ ...role(), nice_to_have: undefined } as unknown as RoleRow);
    expect(parsed.niceToHave).toEqual([]);
    expect(parsed.responsibilities).toEqual(["Build end-to-end features", "Write tests"]);
  });

  it("filters non-string entries out of list fields", () => {
    const parsed = parseRoleRow(
      role({ responsibilities: JSON.stringify(["keep", 42, null, "drop-me", false]) }),
    );
    expect(parsed.responsibilities).toEqual(["keep", "drop-me"]);
  });
});

// ---------------------------------------------------------------------------
// listRoles / getRole
// ---------------------------------------------------------------------------

describe("listRoles", () => {
  it("returns parsed roles ordered by display_order then id", async () => {
    const fake = makeFakeD1({
      roles: [
        role({ id: "beta", display_order: 2 }),
        role({ id: "alpha", title: "Alpha Role", display_order: 1 }),
        role({ id: "zeta", display_order: 1 }),
      ],
    });
    const roles = await listRoles(fake.db);
    expect(roles.map((r) => r.id)).toEqual(["alpha", "zeta", "beta"]);
  });

  it("filters by status when one is given", async () => {
    const fake = makeFakeD1({
      roles: [
        role({ id: "open-role" }),
        role({ id: "paused-role", status: "paused" }),
        role({ id: "closed-role", status: "closed" }),
      ],
    });
    expect((await listRoles(fake.db, "open")).map((r) => r.id)).toEqual(["open-role"]);
    expect((await listRoles(fake.db, "paused")).map((r) => r.id)).toEqual(["paused-role"]);
    expect((await listRoles(fake.db, "closed")).map((r) => r.id)).toEqual(["closed-role"]);
  });

  it("returns all roles when no status is given", async () => {
    const fake = makeFakeD1({
      roles: [role({ id: "a" }), role({ id: "b", status: "paused" })],
    });
    const roles = await listRoles(fake.db);
    expect(roles.map((r) => r.id)).toEqual(["a", "b"]);
  });

  it("returns [] for a status no role has", async () => {
    const fake = makeFakeD1({ roles: [role()] });
    expect(await listRoles(fake.db, "closed")).toEqual([]);
  });

  it("skips rows that are not identifiable role rows", async () => {
    const fake = makeFakeD1({ roles: [role(), { nonsense: true } as unknown as RoleRow] });
    const roles = await listRoles(fake.db);
    expect(roles.map((r) => r.id)).toEqual(["full-stack-engineer"]);
  });

  it("tolerates rows with missing list columns", async () => {
    const sparse = {
      ...role(),
      responsibilities: undefined,
      nice_to_have: undefined,
    } as unknown as RoleRow;
    const fake = makeFakeD1({ roles: [sparse] });
    const roles = await listRoles(fake.db);
    expect(roles).toHaveLength(1);
    expect(roles[0].responsibilities).toEqual([]);
    expect(roles[0].niceToHave).toEqual([]);
    expect(roles[0].requiredSkills).toEqual(["TypeScript", "React"]);
  });
});

describe("getRole", () => {
  it("returns the parsed role for an existing id", async () => {
    const fake = makeFakeD1({ roles: [role()] });
    const found = await getRole(fake.db, "full-stack-engineer");
    expect(found?.id).toBe("full-stack-engineer");
    expect(found?.responsibilities).toEqual(["Build end-to-end features", "Write tests"]);
  });

  it("returns null for an unknown id", async () => {
    const fake = makeFakeD1({ roles: [role()] });
    expect(await getRole(fake.db, "ghost-role")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// createRole / updateRole / setRoleStatus
// ---------------------------------------------------------------------------

describe("createRole", () => {
  const input = {
    title: "Full-Stack Engineer",
    openings: 2,
    icon: "code_blocks",
    location: "Remote (GMT overlap)",
    description: "Own the path from git push to production.",
    responsibilities: ["Build features", "Write tests"],
    requiredSkills: ["TypeScript", "Next.js"],
    niceToHave: ["OpenNext"],
  };

  it("generates a slug id from the title", async () => {
    const fake = makeFakeD1();
    const created = await createRole(fake.db, input);
    expect(created?.id).toBe("full-stack-engineer");
  });

  it("appends -2 when the slug is already taken", async () => {
    const fake = makeFakeD1({ roles: [role()] });
    const created = await createRole(fake.db, { ...input, title: "Full-Stack Engineer" });
    expect(created?.id).toBe("full-stack-engineer-2");
  });

  it("increments suffixes for repeated titles", async () => {
    const fake = makeFakeD1({ roles: [role(), role({ id: "full-stack-engineer-2" })] });
    const created = await createRole(fake.db, { ...input, title: "Full-Stack Engineer" });
    expect(created?.id).toBe("full-stack-engineer-3");
  });

  it("honors an explicit id", async () => {
    const fake = makeFakeD1();
    const created = await createRole(fake.db, { ...input, id: "senior-full-stack" });
    expect(created?.id).toBe("senior-full-stack");
  });

  it("defaults status to open and displayOrder to 0", async () => {
    const fake = makeFakeD1();
    const created = await createRole(fake.db, input);
    expect(created?.status).toBe("open");
    expect(created?.displayOrder).toBe(0);
  });

  it("persists JSON-encoded list fields and round-trips them", async () => {
    const fake = makeFakeD1();
    const created = await createRole(fake.db, input);
    expect(created?.responsibilities).toEqual(["Build features", "Write tests"]);
    expect(created?.requiredSkills).toEqual(["TypeScript", "Next.js"]);
    expect(created?.niceToHave).toEqual(["OpenNext"]);
    const stored = fake.state.roles[0];
    expect(JSON.parse(stored.responsibilities)).toEqual(["Build features", "Write tests"]);
  });

  it("returns the stored row with DB-generated timestamps", async () => {
    const fake = makeFakeD1();
    const created = await createRole(fake.db, input);
    expect(created?.createdAt).toBeTruthy();
    expect(created?.createdAt).toBe(created?.updatedAt);
  });
});

describe("updateRole", () => {
  it("patches scalar and list fields and bumps updated_at", async () => {
    const fake = makeFakeD1({ roles: [role()] });
    const updated = await updateRole(fake.db, "full-stack-engineer", {
      title: "Senior Full-Stack Engineer",
      niceToHave: ["OpenNext", "AWS fundamentals"],
      displayOrder: 5,
    });
    expect(updated?.title).toBe("Senior Full-Stack Engineer");
    expect(updated?.niceToHave).toEqual(["OpenNext", "AWS fundamentals"]);
    expect(updated?.displayOrder).toBe(5);
    expect(updated?.responsibilities).toEqual(["Build end-to-end features", "Write tests"]);
    expect(updated?.updatedAt).not.toBe("2026-01-01 00:00:00");
    expect(updated?.createdAt).toBe("2026-01-01 00:00:00");
  });

  it("an empty patch is a no-op read", async () => {
    const fake = makeFakeD1({ roles: [role()] });
    const updated = await updateRole(fake.db, "full-stack-engineer", {});
    expect(updated).toEqual(await getRole(fake.db, "full-stack-engineer"));
  });

  it("returns null for an unknown id", async () => {
    const fake = makeFakeD1();
    expect(await updateRole(fake.db, "ghost-role", { title: "X" })).toBeNull();
  });
});

describe("setRoleStatus", () => {
  it("flips the status and bumps updated_at", async () => {
    const fake = makeFakeD1({ roles: [role()] });
    const updated = await setRoleStatus(fake.db, "full-stack-engineer", "paused");
    expect(updated?.status).toBe("paused");
    expect(updated?.updatedAt).not.toBe("2026-01-01 00:00:00");
    expect((await getRole(fake.db, "full-stack-engineer"))?.status).toBe("paused");
  });

  it("returns null for an unknown id", async () => {
    const fake = makeFakeD1();
    expect(await setRoleStatus(fake.db, "ghost-role", "closed")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

describe("setApplicationStatus", () => {
  it("moves the row and stamps who did it and when", async () => {
    const fake = makeFakeD1({ applications: [application()] });

    const updated = await setApplicationStatus(
      fake.db,
      1,
      "reviewing",
      "hr.gileara@gmail.com",
    );

    expect(updated?.status).toBe("reviewing");
    expect(updated?.status_updated_by).toBe("hr.gileara@gmail.com");
    expect(updated?.status_updated_at).toBeTruthy();

    const [stored] = await listApplications(fake.db, "full-stack-engineer");
    expect(stored?.status).toBe("reviewing");
  });

  it("overwrites the audit stamp on a later move", async () => {
    const fake = makeFakeD1({ applications: [application()] });
    await setApplicationStatus(fake.db, 1, "shortlisted", "a.gileara@gmail.com");

    const second = await setApplicationStatus(
      fake.db,
      1,
      "hired",
      "b.gileara@gmail.com",
    );

    expect(second?.status).toBe("hired");
    expect(second?.status_updated_by).toBe("b.gileara@gmail.com");
  });

  it("returns null for an unknown id and changes nothing", async () => {
    const fake = makeFakeD1({ applications: [application()] });

    expect(
      await setApplicationStatus(fake.db, 999, "rejected", "hr.gileara@gmail.com"),
    ).toBeNull();

    const [stored] = await listApplications(fake.db, "full-stack-engineer");
    expect(stored?.status).toBe("new");
    expect(stored?.status_updated_at).toBeNull();
  });

  it("reads a row without audit columns (pre-migration-0003) as 'new'", async () => {
    const legacy = application({ status: undefined, status_updated_at: undefined });
    expect(legacy.status).toBeUndefined();

    const fake = makeFakeD1({ applications: [legacy] });
    const [stored] = await listApplications(fake.db, "full-stack-engineer");

    expect(stored?.status).toBe("new");
    expect(stored?.status_updated_at).toBeNull();
  });
});

describe("createApplication", () => {
  it("inserts with defaults for omitted nullable fields", async () => {
    const fake = makeFakeD1();
    const app = await createApplication(fake.db, {
      roleId: "full-stack-engineer",
      name: "Ama Owusu",
      email: "ama@example.com",
      resumeFilename: "ama-owusu.pdf",
    });
    expect(app).toMatchObject({
      role_id: "full-stack-engineer",
      name: "Ama Owusu",
      email: "ama@example.com",
      phone: null,
      resume_key: "",
      resume_filename: "ama-owusu.pdf",
      cover_letter: null,
      why_this_role: null,
    });
    expect(typeof app?.id).toBe("number");
    expect(app?.created_at).toBeTruthy();
  });

  it("persists provided phone, resume key, and letters", async () => {
    const fake = makeFakeD1();
    const app = await createApplication(fake.db, {
      roleId: "ui-ux-designer",
      name: "Kofi Mensah",
      email: "kofi@example.com",
      phone: "+233 24 555 5555",
      resumeKey: "applications/ui-ux-designer/kofi.pdf",
      resumeFilename: "kofi-mensah.pdf",
      coverLetter: "Design systems are my craft.",
      whyThisRole: "I want to serve MSME owners.",
    });
    expect(app).toMatchObject({
      role_id: "ui-ux-designer",
      phone: "+233 24 555 5555",
      resume_key: "applications/ui-ux-designer/kofi.pdf",
      cover_letter: "Design systems are my craft.",
      why_this_role: "I want to serve MSME owners.",
    });
  });
});

describe("listApplications", () => {
  it("returns only the role's applications, newest first", async () => {
    const fake = makeFakeD1({
      applications: [
        application({ id: 1, role_id: "role-a", created_at: "2026-01-02 00:00:00" }),
        application({ id: 2, role_id: "role-a", created_at: "2026-01-03 00:00:00" }),
        application({ id: 3, role_id: "role-b", created_at: "2026-01-04 00:00:00" }),
      ],
    });
    const apps = await listApplications(fake.db, "role-a");
    expect(apps.map((a) => a.id)).toEqual([2, 1]);
  });

  it("breaks same-timestamp ties by id descending", async () => {
    const fake = makeFakeD1({
      applications: [
        application({ id: 1, created_at: "2026-01-02 00:00:00" }),
        application({ id: 2, created_at: "2026-01-02 00:00:00" }),
      ],
    });
    const apps = await listApplications(fake.db, "full-stack-engineer");
    expect(apps.map((a) => a.id)).toEqual([2, 1]);
  });

  it("returns [] for a role without applications", async () => {
    const fake = makeFakeD1();
    expect(await listApplications(fake.db, "devops-engineer")).toEqual([]);
  });
});

describe("countApplicationsByRole", () => {
  it("tallies applications per role", async () => {
    const fake = makeFakeD1({
      applications: [
        application({ id: 1, role_id: "role-a" }),
        application({ id: 2, role_id: "role-a" }),
        application({ id: 3, role_id: "role-b" }),
      ],
    });
    expect(await countApplicationsByRole(fake.db)).toEqual({ "role-a": 2, "role-b": 1 });
  });

  it("omits roles with no applications", async () => {
    const fake = makeFakeD1();
    expect(await countApplicationsByRole(fake.db)).toEqual({});
  });
});