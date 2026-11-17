/**
 * Public /about read side: the Foundation and Roster sections each fetch
 * through this module so the page shares one source of truth and one
 * fallback rule. Same hybrid rule as public-roles.ts / public-faqs.ts /
 * public-posts.ts / public-scenarios.ts: read published people from D1
 * first, fall back to src/content/team.ts whenever D1 is empty or
 * unreachable.
 *
 * Two public entry points (getPublicFoundation / getPublicRoster)
 * rather than one that returns everything, mirroring how AboutPageClient
 * already wants `foundation` and `roster` as two separate arrays --
 * nothing downstream needs to re-filter a combined list by group.
 *
 * Long-term intent (docs/CMS-PLAN.md): once D1 is proven in production,
 * delete src/content/team.ts and this fallback branch.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { listPeopleByGroup } from "@/lib/cms/db";
import type { D1Like } from "@/lib/portal/db";
import type { PersonRow } from "@/lib/cms/types";
import {
  foundation as fallbackFoundationEntries,
  roster as fallbackRosterEntries,
  type FoundationMember,
  type RosterMember,
} from "@/content/team";

function toFoundationMember(row: PersonRow): FoundationMember {
  return {
    name: row.name,
    role: row.role,
    quote: row.quote ?? "",
    image: row.image ?? "",
  };
}

function toRosterMember(row: PersonRow): RosterMember {
  return {
    name: row.name,
    role: row.role,
    department: row.department ?? "Engineering",
    image: row.image ?? undefined,
  };
}

/** The fallback list: every foundation entry from src/content/team.ts, unchanged. */
export function fallbackFoundation(): FoundationMember[] {
  return [...fallbackFoundationEntries];
}

/** The fallback list: every roster entry from src/content/team.ts, unchanged. */
export function fallbackRoster(): RosterMember[] {
  return [...fallbackRosterEntries];
}

/** Fallback selection: use the D1 result when it has at least one row. */
export function selectPublicFoundation(
  rows: FoundationMember[] | null | undefined,
): FoundationMember[] {
  return rows && rows.length > 0 ? rows : fallbackFoundation();
}

/** Fallback selection: use the D1 result when it has at least one row. */
export function selectPublicRoster(rows: RosterMember[] | null | undefined): RosterMember[] {
  return rows && rows.length > 0 ? rows : fallbackRoster();
}

function getPortalDbOrThrow(): D1Like {
  const { env } = getCloudflareContext();
  const db = (env as unknown as { gileara_careers_db?: D1Like }).gileara_careers_db;
  if (!db) {
    throw new Error("gileara_careers_db binding is missing from the Cloudflare env");
  }
  return db;
}

/**
 * Published Foundation members for /about. Tries D1 first; on any
 * failure (no Cloudflare context in dev/build, D1 error) or an empty
 * result it falls back to src/content/team.ts's `foundation` array.
 */
export async function getPublicFoundation(): Promise<FoundationMember[]> {
  try {
    const db = getPortalDbOrThrow();
    const rows = await listPeopleByGroup(db, "foundation", "published");
    if (rows.length === 0) {
      console.warn(
        "[about] D1 returned no published foundation members, falling back to src/content/team.ts.",
      );
    }
    return selectPublicFoundation(rows.map(toFoundationMember));
  } catch (error) {
    console.warn("[about] D1 unavailable, falling back to src/content/team.ts (foundation):", error);
    return fallbackFoundation();
  }
}

/**
 * Published Roster members for /about. Tries D1 first; on any failure
 * or an empty result it falls back to src/content/team.ts's `roster`
 * array.
 */
export async function getPublicRoster(): Promise<RosterMember[]> {
  try {
    const db = getPortalDbOrThrow();
    const rows = await listPeopleByGroup(db, "roster", "published");
    if (rows.length === 0) {
      console.warn(
        "[about] D1 returned no published roster members, falling back to src/content/team.ts.",
      );
    }
    return selectPublicRoster(rows.map(toRosterMember));
  } catch (error) {
    console.warn("[about] D1 unavailable, falling back to src/content/team.ts (roster):", error);
    return fallbackRoster();
  }
}
