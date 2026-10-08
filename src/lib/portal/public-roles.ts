/**
 * Public careers read side (Phase 5): /careers and /careers/[slug] fetch
 * their roles through this module so every public page shares one source
 * of truth and one fallback rule.
 *
 * Approved decision Q5 (docs/PORTAL-PLAN.md): hybrid — read open roles
 * from D1 first and fall back to src/content/roles.ts whenever D1 is
 * empty or unreachable. "Unreachable" is the normal state under plain
 * `next dev` / `next build`: the Cloudflare context only exists on the
 * deployed worker (or after initOpenNextCloudflareForDev() is added to
 * next.config.mjs, which is deliberately not wired up yet).
 *
 * The pure helpers (raw-row mapping, fallback selection, slug lookup)
 * are exported separately so tests can exercise them without a D1
 * binding, network access, or component rendering — see
 * tests/lib/portal/public-roles.test.ts.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { listRoles, parseRoleRow, type D1Like } from "@/lib/portal/db";
import type { ParsedRole, RoleRow, RoleStatus } from "@/lib/portal/types";
import { openRoles, type OpenRole } from "@/content/roles";

const isRoleStatus = (value: unknown): value is RoleStatus =>
  value === "open" || value === "paused" || value === "closed";

/**
 * Map a raw roles row (as D1 hands it back — an untyped object) to the
 * parsed domain shape. db.ts keeps its own row coercion private, so the
 * tolerant field pass happens here, then the JSON-array parsing is
 * delegated to db.ts's exported `parseRoleRow` (invalid or missing JSON
 * falls back to []). Returns null for anything that is not an object
 * with a string id.
 */
export function mapRoleRow(value: unknown): ParsedRole | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const row = value as Partial<RoleRow>;
  if (typeof row.id !== "string") {
    return null;
  }
  return parseRoleRow({
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
  });
}

/**
 * Map one src/content/roles.ts entry into the ParsedRole shape the portal
 * uses, so the fallback source and a D1 row are interchangeable downstream.
 * The content module has no status/timestamps: fallback roles are always
 * "open" with empty timestamp strings.
 */
export function openRoleToParsed(role: OpenRole, displayOrder: number): ParsedRole {
  return {
    id: role.id,
    title: role.title,
    openings: role.openings,
    icon: role.icon,
    location: role.location,
    description: role.description,
    responsibilities: [...role.responsibilities],
    requiredSkills: [...role.requiredSkills],
    niceToHave: [...role.niceToHave],
    status: "open",
    displayOrder,
    createdAt: "",
    updatedAt: "",
  };
}

/** The fallback list: every open role from src/content/roles.ts. */
export function fallbackRoles(): ParsedRole[] {
  return openRoles.map((role, index) => openRoleToParsed(role, index));
}

/**
 * Fallback selection (decision Q5): use the D1 result when it has at
 * least one role, otherwise fall back to src/content/roles.ts.
 */
export function selectPublicRoles(rows: ParsedRole[] | null | undefined): ParsedRole[] {
  return rows && rows.length > 0 ? rows : fallbackRoles();
}

/**
 * Slug lookup for /careers/[slug]: exact id match on an open role only,
 * so paused/closed roles and unknown slugs both yield null (the page
 * turns that into a 404).
 */
export function findPublicRole(
  roles: ParsedRole[],
  slug: string,
): ParsedRole | null {
  return roles.find((role) => role.id === slug && role.status === "open") ?? null;
}

/** Read open roles from D1. Throws when the context/binding is absent. */
async function readOpenRolesFromD1(): Promise<ParsedRole[]> {
  const { env } = getCloudflareContext();
  const db = (env as unknown as { gileara_careers_db?: D1Like }).gileara_careers_db;
  if (!db) {
    throw new Error("gileara_careers_db binding is missing from the Cloudflare env");
  }
  return listRoles(db, "open");
}

/**
 * Open roles for the public careers pages. Tries D1 first; on any
 * failure (no Cloudflare context in dev/build, D1 error) or an empty
 * table it falls back to src/content/roles.ts.
 */
export async function getPublicRoles(): Promise<ParsedRole[]> {
  try {
    const rows = await readOpenRolesFromD1();
    if (rows.length === 0) {
      console.warn(
        "[careers] D1 returned no open roles, falling back to src/content/roles.ts.",
      );
    }
    return selectPublicRoles(rows);
  } catch (error) {
    console.warn(
      "[careers] D1 unavailable, falling back to src/content/roles.ts:",
      error,
    );
    return fallbackRoles();
  }
}

/** Single open role by slug, or null (callers use notFound()). */
export async function getPublicRole(slug: string): Promise<ParsedRole | null> {
  return findPublicRole(await getPublicRoles(), slug);
}
