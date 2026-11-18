/**
 * Instagram connector sync module -- docs/INSTAGRAM-CONNECTOR-PLAN.md.
 * Pulls recent media from the Instagram Graph API (Instagram API with
 * Instagram Login path -- `graph.instagram.com`, NOT the shut-down
 * Instagram Basic Display API) and upserts it into `cms_instagram_posts`
 * (migrations/0008_create-cms-instagram-posts.sql), same `gileara_careers_db`
 * D1 binding and `D1Like` structural type as every other data-layer module
 * (src/lib/portal/db.ts).
 *
 * Structural typing for both external dependencies, same discipline as
 * src/lib/cms/media-storage.ts's `persistMedia`:
 *   - `fetchFn`: a fetch-like function (tests inject a fake returning
 *     canned Graph API JSON instead of hitting the real network).
 *   - `db`: the D1Like binding.
 * `accessToken` / `businessAccountId` are passed in by the caller rather
 * than read from `process.env` here -- same centralize-env-reading-at-the-
 * call-site pattern as src/app/admin/admin-db.ts, and it keeps this module
 * testable without touching process.env at all.
 *
 * Never throws: every failure path (missing credentials, a non-OK HTTP
 * response, a malformed body, a thrown network error) is caught and
 * returned as `{ ok: false, fetched: 0, error }` so the caller (the
 * "Sync now" admin action) can always show a status message.
 *
 * Upsert preserves `display_order` / `visible`: those two columns are
 * never part of the INSERT's column list or the ON CONFLICT UPDATE SET
 * clause, so a fresh row gets the schema defaults (NULL / 1) and an
 * existing row keeps whatever an editor already set, no matter how many
 * times the same post is re-synced.
 *
 * Tests: tests/lib/instagram/sync.test.ts.
 */

import type { D1Like } from "@/lib/portal/db";

/** Instagram Graph API version this module targets. See the plan doc for
 *  why ("Instagram API with Instagram Login", not Basic Display API). */
export const INSTAGRAM_API_VERSION = "v24.0";

/** Minimal structural subset of the real fetch Response this module
 *  reads -- a fake in tests needs to implement nothing else. */
export interface FetchResponseLike {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

/** Structural fetch signature -- the real global `fetch` satisfies this,
 *  and tests inject a function returning canned JSON. */
export type FetchLike = (url: string) => Promise<FetchResponseLike>;

const KNOWN_MEDIA_TYPES = ["IMAGE", "VIDEO", "CAROUSEL_ALBUM"] as const;
export type InstagramMediaType = (typeof KNOWN_MEDIA_TYPES)[number];

function isMediaType(value: unknown): value is InstagramMediaType {
  return (KNOWN_MEDIA_TYPES as readonly string[]).includes(value as string);
}

/** One row ready to upsert into cms_instagram_posts, after mapping and
 *  validating a single Graph API media object. */
interface CacheRow {
  id: string;
  mediaType: InstagramMediaType;
  mediaUrl: string;
  permalink: string;
  caption: string | null;
  thumbnailUrl: string | null;
  postedAt: string;
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;

/**
 * Map one raw Graph API media object to a cache row. Returns null when the
 * item is missing a field this table requires NOT NULL (id, media_type,
 * media_url, permalink, posted_at) -- malformed items are skipped rather
 * than failing the whole sync, same "drop the bad one" judgment as
 * src/lib/portal/db.ts's parseJsonList.
 */
function toCacheRow(value: unknown): CacheRow | null {
  const item = asRecord(value);
  if (!item) {
    return null;
  }
  const id = typeof item.id === "string" ? item.id : "";
  const mediaUrl = typeof item.media_url === "string" ? item.media_url : "";
  const permalink = typeof item.permalink === "string" ? item.permalink : "";
  const timestamp = typeof item.timestamp === "string" ? item.timestamp : "";
  if (!id || !mediaUrl || !permalink || !timestamp || !isMediaType(item.media_type)) {
    return null;
  }
  return {
    id,
    mediaType: item.media_type,
    mediaUrl,
    permalink,
    caption: typeof item.caption === "string" ? item.caption : null,
    thumbnailUrl: typeof item.thumbnail_url === "string" ? item.thumbnail_url : null,
    postedAt: timestamp,
  };
}

const UPSERT_INSTAGRAM_POST = `
  INSERT INTO cms_instagram_posts
    (id, media_type, media_url, permalink, caption, thumbnail_url, posted_at, synced_at, account_handle)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    media_type = excluded.media_type,
    media_url = excluded.media_url,
    permalink = excluded.permalink,
    caption = excluded.caption,
    thumbnail_url = excluded.thumbnail_url,
    posted_at = excluded.posted_at,
    synced_at = excluded.synced_at,
    account_handle = excluded.account_handle
`;

export interface SyncInstagramPostsDeps {
  db: D1Like;
  fetchFn: FetchLike;
  /** `INSTAGRAM_ACCESS_TOKEN` from the caller's env -- read at the call
   *  site (e.g. the "Sync now" server action), not inside this module. */
  accessToken: string | undefined;
  /** `INSTAGRAM_BUSINESS_ACCOUNT_ID` from the caller's env. */
  businessAccountId: string | undefined;
  /** Which account these posts belong to, e.g. "gileara" (no "@").
   *  Stored on every upserted row so the public feed can label it. */
  accountHandle?: string;
  /** How many of the most recent media objects to request. Defaults to 25. */
  limit?: number;
  /** Injectable clock for `synced_at`, defaulting to the real time. */
  nowIso?: () => string;
}

export interface SyncInstagramPostsResult {
  ok: boolean;
  /** Number of media objects successfully upserted. */
  fetched: number;
  error?: string;
}

const MISSING_CREDENTIALS_ERROR =
  "Instagram is not configured: set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID (Cloudflare Secrets) before syncing.";

function buildMediaUrl(params: {
  businessAccountId: string;
  accessToken: string;
  limit: number;
}): string {
  const fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";
  const query = new URLSearchParams({
    fields,
    access_token: params.accessToken,
    limit: String(params.limit),
  });
  return `https://graph.instagram.com/${INSTAGRAM_API_VERSION}/${params.businessAccountId}/media?${query.toString()}`;
}

/** True when the parsed Graph API error body carries a recognizable
 *  message -- used to surface something more useful than "request failed"
 *  when the API itself explains what went wrong (expired token, etc.). */
function extractGraphErrorMessage(body: unknown): string | null {
  const record = asRecord(body);
  const error = record ? asRecord(record.error) : null;
  const message = error?.message;
  return typeof message === "string" && message.trim() !== "" ? message : null;
}

/**
 * Sync recent Instagram media into cms_instagram_posts. Never throws --
 * every failure path returns `{ ok: false, fetched: 0, error }`.
 *
 * On success, every returned media object is upserted with
 * INSERT ... ON CONFLICT(id) DO UPDATE, preserving any existing
 * display_order / visible override (see migration 0008's comment and
 * this module's header for why those two columns are never written here).
 */
export async function syncInstagramPosts(
  deps: SyncInstagramPostsDeps,
): Promise<SyncInstagramPostsResult> {
  const { db, fetchFn, accessToken, businessAccountId } = deps;
  if (!accessToken || !businessAccountId) {
    return { ok: false, fetched: 0, error: MISSING_CREDENTIALS_ERROR };
  }

  const limit = deps.limit ?? 25;
  const nowIso = deps.nowIso ?? (() => new Date().toISOString());
  const url = buildMediaUrl({ businessAccountId, accessToken, limit });

  try {
    const response = await fetchFn(url);
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (!response.ok) {
      const message = extractGraphErrorMessage(body);
      return {
        ok: false,
        fetched: 0,
        error: message ?? `Instagram API request failed (HTTP ${response.status}).`,
      };
    }

    const record = asRecord(body);
    const rawItems = Array.isArray(record?.data) ? record.data : [];
    const rows = rawItems.map(toCacheRow).filter((row): row is CacheRow => row !== null);

    const syncedAt = nowIso();
    for (const row of rows) {
      await db
        .prepare(UPSERT_INSTAGRAM_POST)
        .bind(
          row.id,
          row.mediaType,
          row.mediaUrl,
          row.permalink,
          row.caption,
          row.thumbnailUrl,
          row.postedAt,
          syncedAt,
          deps.accountHandle ?? null,
        )
        .run();
    }

    return { ok: true, fetched: rows.length };
  } catch (error) {
    console.warn("[instagram] Sync failed:", error);
    return {
      ok: false,
      fetched: 0,
      error: "The Instagram sync could not complete. Try again in a moment.",
    };
  }
}
