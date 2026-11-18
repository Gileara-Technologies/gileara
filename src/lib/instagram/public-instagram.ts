/**
 * Public Instagram feed read side: src/components/InstagramFeed.tsx
 * reads through this module so the public site has one source of truth
 * for "which cached posts are visible, in what order." Same
 * `gileara_careers_db` D1 binding as the rest of the CMS.
 *
 * Deliberately DIFFERENT from every other public-{type}.ts module in this
 * codebase (public-faqs.ts, public-posts.ts, public-scenarios.ts): there
 * is NO hardcoded content-module fallback array here. Those fallbacks
 * exist because the real content was hand-authored and a safe static
 * copy of it could live in src/content/*.ts too. Instagram posts are
 * someone else's real photos and captions -- there is nothing honest to
 * fabricate as a stand-in, so when D1 is unreachable or the cache is
 * empty, this returns an empty array and the component renders a plain
 * "Follow us on Instagram" link instead of fake post tiles. See
 * docs/INSTAGRAM-CONNECTOR-PLAN.md for the explicit design call.
 *
 * Tests: tests/lib/instagram/public-instagram.test.ts.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Like } from "@/lib/portal/db";
import { listInstagramPosts, type InstagramPostRow } from "@/lib/instagram/db";
import { instagramAccounts } from "@/content/site-config";

/** The primary account (@gileara) -- the default "follow us" link. Both
 *  accounts are listed in src/content/site-config.ts's `instagramAccounts`. */
export const INSTAGRAM_PROFILE_URL: string = instagramAccounts[0].url;

export interface InstagramPost {
  id: string;
  mediaType: InstagramPostRow["media_type"];
  mediaUrl: string;
  permalink: string;
  caption: string | null;
  thumbnailUrl: string | null;
  postedAt: string;
  /** "gileara" / "ins.gileara" (no "@"), or null for rows synced before migration 0009. */
  accountHandle: string | null;
}

function toPublicPost(row: InstagramPostRow): InstagramPost {
  return {
    id: row.id,
    mediaType: row.media_type,
    mediaUrl: row.media_url,
    permalink: row.permalink,
    caption: row.caption,
    thumbnailUrl: row.thumbnail_url,
    postedAt: row.posted_at,
    accountHandle: row.account_handle,
  };
}

/**
 * Sort rows the way the public feed wants them: visible only,
 * display_order ascending with NULLs last (editors who never set an
 * override keep posted_at order), then posted_at descending, then id as
 * a stable tiebreaker. Exported for tests -- pure, no I/O.
 */
export function selectVisibleInstagramPosts(
  rows: InstagramPostRow[],
  limit: number,
): InstagramPost[] {
  return rows
    .filter((row) => row.visible)
    .slice()
    .sort((a, b) => {
      const aOrder = a.display_order;
      const bOrder = b.display_order;
      if (aOrder === null && bOrder !== null) return 1;
      if (aOrder !== null && bOrder === null) return -1;
      if (aOrder !== null && bOrder !== null && aOrder !== bOrder) return aOrder - bOrder;
      if (a.posted_at !== b.posted_at) return a.posted_at < b.posted_at ? 1 : -1;
      return a.id < b.id ? 1 : -1;
    })
    .slice(0, limit)
    .map(toPublicPost);
}

/** Read every cached row from D1. Throws when the context/binding is
 *  absent -- the caller (getPublicInstagramPosts) is the one that turns
 *  that into the documented "return []" behavior. */
async function readInstagramPostsFromD1(): Promise<InstagramPostRow[]> {
  const { env } = getCloudflareContext();
  const db = (env as unknown as { gileara_careers_db?: D1Like }).gileara_careers_db;
  if (!db) {
    throw new Error("gileara_careers_db binding is missing from the Cloudflare env");
  }
  return listInstagramPosts(db);
}

/**
 * Visible Instagram posts for the public feed, newest/override-ordered
 * first, capped to `limit` (default 9 -- a clean 3x3 grid). On any
 * failure (no Cloudflare context in dev/build, D1 error) or an empty
 * cache, returns [] -- never a fallback array. See this module's header
 * for why that is the deliberate, documented choice here.
 */
export async function getPublicInstagramPosts(limit = 9): Promise<InstagramPost[]> {
  try {
    const rows = await readInstagramPostsFromD1();
    return selectVisibleInstagramPosts(rows, limit);
  } catch (error) {
    console.warn("[instagram] D1 unavailable, no posts to show:", error);
    return [];
  }
}
