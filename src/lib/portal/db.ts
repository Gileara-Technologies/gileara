/**
 * Typed helpers for the careers-portal D1 database.
 * Schema: migrations/0001_create-portal-schema.sql; binding name
 * `gileara_careers_db` (wrangler.toml). Tests: tests/lib/portal/db.test.ts.
 *
 * ---- Reaching the D1 binding under the OpenNext Cloudflare adapter ----
 * D1 bindings are NOT process.env. On the deployed worker the entrypoint
 * exposes them on the Cloudflare context object, read via
 * `getCloudflareContext()` from `@opennextjs/cloudflare` (sync mode works
 * inside a request; `getCloudflareContext({ async: true })` is the
 * SSG/async-safe variant). Recommended call-site pattern in a route handler:
 *
 *   import { getCloudflareContext } from "@opennextjs/cloudflare";
 *   import { listRoles } from "@/lib/portal/db";
 *
 *   const { env } = getCloudflareContext();
 *   const openRoles = await listRoles(env.gileara_careers_db, "open");
 *
 * The binding is not declared on the adapter's global `CloudflareEnv`
 * interface, so the caller must either add a declaration-merging .d.ts
 *   declare global {
 *     interface CloudflareEnv { gileara_careers_db: D1Like; }
 *   }
 * (with `import type { D1Like } from "@/lib/portal/db"`), or cast at the
 * call site (`env.gileara_careers_db as D1Like`). Which one the admin
 * routes pick is up to them — this module never reads the context itself.
 *
 * Local `next dev` caveat: the context is populated only after
 * `initOpenNextCloudflareForDev()` is added to next.config.mjs, or when
 * running via `opennextjs-cloudflare dev` / the deployed worker.
 *
 * ---- Testing ----
 * Every function takes the binding as its first argument, so tests inject
 * an in-memory fake implementing D1Like (no wrangler/miniflare needed).
 */

import type {
  ApplicationRow,
  ParsedRole,
  RoleRow,
  RoleStatus,
} from "@/lib/portal/types";
import { uniqueSlug } from "@/lib/portal/slug";

/**
 * Minimal structural type for a Cloudflare D1 prepared statement — exactly
 * the surface this module calls, so the real D1 binding satisfies it
 * structurally (and a test fake can implement it trivially).
 */
export interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike;
  all<T = unknown>(): Promise<{ results: T[] }>;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<{ success: boolean; meta: { last_row_id: number | null } }>;
}

/** Minimal structural type for a Cloudflare D1 binding. */
export interface D1Like {
  prepare(query: string): D1PreparedStatementLike;
}

/** Input for createRole. `id` is generated via uniqueSlug when omitted. */
export interface CreateRoleInput {
  id?: string;
  title: string;
  openings: number;
  icon: string;
  location: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  niceToHave: string[];
  status?: RoleStatus;
  displayOrder?: number;
}

/** Partial update for updateRole. `id` itself is not patchable. */
export interface RolePatch {
  title?: string;
  openings?: number;
  icon?: string;
  location?: string;
  description?: string;
  responsibilities?: string[];
  requiredSkills?: string[];
  niceToHave?: string[];
  status?: RoleStatus;
  displayOrder?: number;
}

/** Input for createApplication. Nullable fields default to null. */
export interface CreateApplicationInput {
  roleId: string;
  name: string;
  email: string;
  phone?: string | null;
  resumeKey?: string;
  resumeFilename: string;
  coverLetter?: string | null;
  whyThisRole?: string | null;
}

const SELECT_ROLES =
  "SELECT * FROM roles ORDER BY display_order ASC, id ASC";
const SELECT_ROLES_BY_STATUS =
  "SELECT * FROM roles WHERE status = ? ORDER BY display_order ASC, id ASC";
const SELECT_ROLE_BY_ID = "SELECT * FROM roles WHERE id = ?";
const SELECT_ROLE_IDS = "SELECT id FROM roles";
const SELECT_APPLICATIONS_BY_ROLE =
  "SELECT * FROM applications WHERE role_id = ? ORDER BY created_at DESC, id DESC";
const SELECT_APPLICATION_BY_ID = "SELECT * FROM applications WHERE id = ?";
const COUNT_APPLICATIONS_BY_ROLE =
  "SELECT role_id, COUNT(*) AS count FROM applications GROUP BY role_id";

const INSERT_ROLE = `INSERT INTO roles (id, title, openings, icon, location, description, responsibilities, required_skills, nice_to_have, status, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const INSERT_APPLICATION = `INSERT INTO applications (role_id, name, email, phone, resume_key, resume_filename, cover_letter, why_this_role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
const UPDATE_ROLE_STATUS =
  "UPDATE roles SET status = ?, updated_at = datetime('now') WHERE id = ?";

/**
 * Parse a stored JSON string-array column. Anything that is not a non-empty
 * JSON array of strings (invalid JSON, missing field, wrong shape) safely
 * falls back to [].
 */
function parseJsonList(value: string | null | undefined): string[] {
  if (typeof value !== "string" || value.trim() === "") {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

const isRoleStatus = (value: unknown): value is RoleStatus =>
  value === "open" || value === "paused" || value === "closed";

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;

/** Tolerant row coercion: missing/scalar-typed fields get safe defaults. */
function toRoleRow(value: unknown): RoleRow | null {
  const row = asRecord(value);
  if (!row || typeof row.id !== "string") {
    return null;
  }
  return {
    id: row.id,
    title: typeof row.title === "string" ? row.title : "",
    openings: typeof row.openings === "number" ? row.openings : 0,
    icon: typeof row.icon === "string" ? row.icon : "",
    location: typeof row.location === "string" ? row.location : "",
    description: typeof row.description === "string" ? row.description : "",
    responsibilities:
      typeof row.responsibilities === "string" ? row.responsibilities : "",
    required_skills:
      typeof row.required_skills === "string" ? row.required_skills : "",
    nice_to_have: typeof row.nice_to_have === "string" ? row.nice_to_have : "",
    status: isRoleStatus(row.status) ? row.status : "open",
    display_order: typeof row.display_order === "number" ? row.display_order : 0,
    created_at: typeof row.created_at === "string" ? row.created_at : "",
    updated_at: typeof row.updated_at === "string" ? row.updated_at : "",
  };
}

/** Map a raw roles row to the parsed domain shape (lists → string[]). */
export function parseRoleRow(row: RoleRow): ParsedRole {
  return {
    id: row.id,
    title: row.title,
    openings: row.openings,
    icon: row.icon,
    location: row.location,
    description: row.description,
    responsibilities: parseJsonList(row.responsibilities),
    requiredSkills: parseJsonList(row.required_skills),
    niceToHave: parseJsonList(row.nice_to_have),
    status: row.status,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Tolerant row coercion: missing/scalar-typed fields get safe defaults. */
function toApplicationRow(value: unknown): ApplicationRow | null {
  const row = asRecord(value);
  if (!row || typeof row.id !== "number" || typeof row.role_id !== "string") {
    return null;
  }
  return {
    id: row.id,
    role_id: row.role_id,
    name: typeof row.name === "string" ? row.name : "",
    email: typeof row.email === "string" ? row.email : "",
    phone: typeof row.phone === "string" ? row.phone : null,
    resume_key: typeof row.resume_key === "string" ? row.resume_key : "",
    resume_filename:
      typeof row.resume_filename === "string" ? row.resume_filename : "",
    cover_letter: typeof row.cover_letter === "string" ? row.cover_letter : null,
    why_this_role: typeof row.why_this_role === "string" ? row.why_this_role : null,
    created_at: typeof row.created_at === "string" ? row.created_at : "",
  };
}

/** All roles, optionally filtered by status. Ordered by display_order, id. */
export async function listRoles(
  db: D1Like,
  status?: RoleStatus,
): Promise<ParsedRole[]> {
  const stmt =
    status === undefined
      ? db.prepare(SELECT_ROLES)
      : db.prepare(SELECT_ROLES_BY_STATUS).bind(status);
  const { results } = await stmt.all();
  return results
    .map(toRoleRow)
    .filter((row): row is RoleRow => row !== null)
    .map(parseRoleRow);
}

/** Single role by id, or null. */
export async function getRole(
  db: D1Like,
  id: string,
): Promise<ParsedRole | null> {
  const raw = await db.prepare(SELECT_ROLE_BY_ID).bind(id).first();
  if (!raw) {
    return null;
  }
  const row = toRoleRow(raw);
  return row ? parseRoleRow(row) : null;
}

async function listRoleIds(db: D1Like): Promise<string[]> {
  const { results } = await db.prepare(SELECT_ROLE_IDS).all();
  return results
    .map((row) => {
      const record = asRecord(row);
      return typeof record?.id === "string" ? record.id : "";
    })
    .filter((id) => id !== "");
}

/**
 * Insert a role. Resolves the id via uniqueSlug against existing ids when
 * `input.id` is omitted, so titles may repeat without colliding.
 * Returns the stored row (with DB-generated timestamps), or null on failure.
 */
export async function createRole(
  db: D1Like,
  input: CreateRoleInput,
): Promise<ParsedRole | null> {
  const id = input.id ?? uniqueSlug(input.title, await listRoleIds(db));
  await db
    .prepare(INSERT_ROLE)
    .bind(
      id,
      input.title,
      input.openings,
      input.icon,
      input.location,
      input.description,
      JSON.stringify(input.responsibilities),
      JSON.stringify(input.requiredSkills),
      JSON.stringify(input.niceToHave),
      input.status ?? "open",
      input.displayOrder ?? 0,
    )
    .run();
  return getRole(db, id);
}

/**
 * Apply a partial patch to a role and bump `updated_at`. An empty patch is a
 * no-op read. Returns the updated row, or null if the id does not exist.
 */
export async function updateRole(
  db: D1Like,
  id: string,
  patch: RolePatch,
): Promise<ParsedRole | null> {
  const sets: string[] = [];
  const values: unknown[] = [];
  const push = (column: string, value: unknown): void => {
    sets.push(`${column} = ?`);
    values.push(value);
  };
  if (patch.title !== undefined) push("title", patch.title);
  if (patch.openings !== undefined) push("openings", patch.openings);
  if (patch.icon !== undefined) push("icon", patch.icon);
  if (patch.location !== undefined) push("location", patch.location);
  if (patch.description !== undefined) push("description", patch.description);
  if (patch.responsibilities !== undefined)
    push("responsibilities", JSON.stringify(patch.responsibilities));
  if (patch.requiredSkills !== undefined)
    push("required_skills", JSON.stringify(patch.requiredSkills));
  if (patch.niceToHave !== undefined)
    push("nice_to_have", JSON.stringify(patch.niceToHave));
  if (patch.status !== undefined) push("status", patch.status);
  if (patch.displayOrder !== undefined) push("display_order", patch.displayOrder);
  if (sets.length === 0) {
    return getRole(db, id);
  }
  await db
    .prepare(
      `UPDATE roles SET ${sets.join(", ")}, updated_at = datetime('now') WHERE id = ?`,
    )
    .bind(...values, id)
    .run();
  return getRole(db, id);
}

/** Flip a role's status (open|paused|closed) and bump updated_at. */
export async function setRoleStatus(
  db: D1Like,
  id: string,
  status: RoleStatus,
): Promise<ParsedRole | null> {
  await db.prepare(UPDATE_ROLE_STATUS).bind(status, id).run();
  return getRole(db, id);
}

/** Applications for one role, newest first. */
export async function listApplications(
  db: D1Like,
  roleId: string,
): Promise<ApplicationRow[]> {
  const { results } = await db.prepare(SELECT_APPLICATIONS_BY_ROLE).bind(roleId).all();
  return results
    .map(toApplicationRow)
    .filter((row): row is ApplicationRow => row !== null);
}

/** Insert an application and return the stored row (with its autoincrement id). */
export async function createApplication(
  db: D1Like,
  input: CreateApplicationInput,
): Promise<ApplicationRow | null> {
  const result = await db
    .prepare(INSERT_APPLICATION)
    .bind(
      input.roleId,
      input.name,
      input.email,
      input.phone ?? null,
      input.resumeKey ?? "",
      input.resumeFilename,
      input.coverLetter ?? null,
      input.whyThisRole ?? null,
    )
    .run();
  const { last_row_id: lastRowId } = result.meta;
  if (lastRowId === null) {
    return null;
  }
  const raw = await db.prepare(SELECT_APPLICATION_BY_ID).bind(lastRowId).first();
  return toApplicationRow(raw);
}

/** Applications count keyed by role id (roles with none are absent). */
export async function countApplicationsByRole(
  db: D1Like,
): Promise<Record<string, number>> {
  const { results } = await db.prepare(COUNT_APPLICATIONS_BY_ROLE).all();
  const counts: Record<string, number> = {};
  for (const row of results) {
    const record = asRecord(row);
    if (!record || typeof record.role_id !== "string") {
      continue;
    }
    counts[record.role_id] = Number(record.count) || 0;
  }
  return counts;
}