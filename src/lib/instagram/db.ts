/**
 * Admin-side reads/writes for the Instagram cache table
 * (migrations/0008_create-cms-instagram-posts.sql). Separate from
 * sync.ts, which owns writing synced data; this module is the small
 * "list everything, flip one row's visible flag" surface the admin
 * status page (src/app/admin/content/instagram/page.tsx) needs --
 * mirrors src/lib/cms/db.ts's shape (D1Like-first-argument, every
 * function independently testable) without pulling the sync/network
 * concerns into the same file.
 *
 * Tests: tests/lib/instagram/db.test.ts.
 */

import type { D1Like } from "@/lib/portal/db";
import type { InstagramMediaType } from "@/lib/instagram/sync";

/** Raw `cms_instagram_posts` row as stored in D1. */
export interface InstagramPostRow {
  id: string;
  media_type: InstagramMediaType;
  media_url: string;
  permalink: string;
  caption: string | null;
  thumbnail_url: string | null;
  posted_at: string;
  display_order: number | null;
  visible: boolean;
  synced_at: string;
  /** "gileara" / "ins.gileara" (no "@"); null for rows synced before migration 0009. */
  account_handle: string | null;
}

const SELECT_INSTAGRAM_POSTS =
  "SELECT * FROM cms_instagram_posts ORDER BY posted_at DESC, id DESC";
const UPDATE_INSTAGRAM_POST_VISIBLE =
  "UPDATE cms_instagram_posts SET visible = ? WHERE id = ?";
const SELECT_INSTAGRAM_POST_BY_ID = "SELECT * FROM cms_instagram_posts WHERE id = ?";

const KNOWN_MEDIA_TYPES = ["IMAGE", "VIDEO", "CAROUSEL_ALBUM"] as const;

const isMediaType = (value: unknown): value is InstagramMediaType =>
  (KNOWN_MEDIA_TYPES as readonly string[]).includes(value as string);

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;

/** Tolerant row coercion: missing/scalar-typed fields get safe defaults,
 *  same convention as every other *Row coercion in this codebase. */
function toInstagramPostRow(value: unknown): InstagramPostRow | null {
  const row = asRecord(value);
  if (!row || typeof row.id !== "string" || row.id === "") {
    return null;
  }
  return {
    id: row.id,
    media_type: isMediaType(row.media_type) ? row.media_type : "IMAGE",
    media_url: typeof row.media_url === "string" ? row.media_url : "",
    permalink: typeof row.permalink === "string" ? row.permalink : "",
    caption: typeof row.caption === "string" ? row.caption : null,
    thumbnail_url: typeof row.thumbnail_url === "string" ? row.thumbnail_url : null,
    posted_at: typeof row.posted_at === "string" ? row.posted_at : "",
    display_order: typeof row.display_order === "number" ? row.display_order : null,
    // D1 stores INTEGER 0/1; a real binding returns a number here, a
    // test fake may already use a boolean -- accept either.
    visible: row.visible === 1 || row.visible === true,
    synced_at: typeof row.synced_at === "string" ? row.synced_at : "",
    account_handle: typeof row.account_handle === "string" && row.account_handle !== "" ? row.account_handle : null,
  };
}

/** Every cached post (visible and hidden), newest first -- powers the
 *  admin status table. */
export async function listInstagramPosts(db: D1Like): Promise<InstagramPostRow[]> {
  const { results } = await db.prepare(SELECT_INSTAGRAM_POSTS).all();
  return results.map(toInstagramPostRow).filter((row): row is InstagramPostRow => row !== null);
}

/** Flip one cached post's visible flag. Returns null if the id doesn't exist. */
export async function setInstagramPostVisible(
  db: D1Like,
  id: string,
  visible: boolean,
): Promise<InstagramPostRow | null> {
  await db.prepare(UPDATE_INSTAGRAM_POST_VISIBLE).bind(visible ? 1 : 0, id).run();
  const raw = await db.prepare(SELECT_INSTAGRAM_POST_BY_ID).bind(id).first();
  return toInstagramPostRow(raw);
}
