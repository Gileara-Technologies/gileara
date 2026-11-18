import { describe, expect, it, vi } from "vitest";
import { syncInstagramPosts, type FetchResponseLike } from "@/lib/instagram/sync";
import type { D1Like } from "@/lib/portal/db";

// ---------------------------------------------------------------------------
// Tiny in-memory fake D1 for cms_instagram_posts, implementing exactly the
// upsert-by-id semantics the real table/migration provides -- same pattern
// as tests/lib/cms/db.test.ts's fake, but with ON CONFLICT upsert instead
// of plain INSERT/UPDATE.
// ---------------------------------------------------------------------------

interface FakeRow {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  caption: string | null;
  thumbnail_url: string | null;
  posted_at: string;
  display_order: number | null;
  visible: number;
  synced_at: string;
  account_handle?: string | null;
}

function makeFakeD1(seeded: FakeRow[] = []) {
  const rows = [...seeded];

  const db: D1Like = {
    prepare(sql: string) {
      const binds: unknown[] = [];
      const statement = {
        bind(...values: unknown[]) {
          binds.splice(0, binds.length, ...values);
          return statement;
        },
        async all<T = unknown>() {
          return { results: [...rows] as unknown as T[] };
        },
        async first<T = unknown>() {
          return (rows[0] as unknown as T) ?? null;
        },
        async run() {
          if (sql.includes("INSERT INTO cms_instagram_posts")) {
            const [id, mediaType, mediaUrl, permalink, caption, thumbnailUrl, postedAt, syncedAt, accountHandle] =
              binds as [string, string, string, string, string | null, string | null, string, string, string | null];
            const existing = rows.find((r) => r.id === id);
            if (existing) {
              existing.media_type = mediaType;
              existing.media_url = mediaUrl;
              existing.permalink = permalink;
              existing.caption = caption;
              existing.thumbnail_url = thumbnailUrl;
              existing.posted_at = postedAt;
              existing.synced_at = syncedAt;
              existing.account_handle = accountHandle;
              // display_order / visible are deliberately untouched.
            } else {
              rows.push({
                id,
                media_type: mediaType,
                media_url: mediaUrl,
                permalink,
                caption,
                thumbnail_url: thumbnailUrl,
                posted_at: postedAt,
                display_order: null,
                visible: 1,
                synced_at: syncedAt,
                account_handle: accountHandle,
              });
            }
            return { success: true, meta: { last_row_id: null } };
          }
          throw new Error(`fake D1: unhandled query: ${sql}`);
        },
      };
      return statement;
    },
  };
  return { db, rows };
}

function jsonResponse(status: number, body: unknown): FetchResponseLike {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  };
}

describe("syncInstagramPosts", () => {
  it("returns an error and does not call fetch when credentials are missing", async () => {
    const { db } = makeFakeD1();
    const fetchFn = vi.fn();
    const result = await syncInstagramPosts({
      db,
      fetchFn,
      accessToken: undefined,
      businessAccountId: "123",
    });
    expect(result.ok).toBe(false);
    expect(result.fetched).toBe(0);
    expect(result.error).toBeTruthy();
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("returns an error when businessAccountId is missing, even with a token", async () => {
    const { db } = makeFakeD1();
    const fetchFn = vi.fn();
    const result = await syncInstagramPosts({
      db,
      fetchFn,
      accessToken: "token-abc",
      businessAccountId: undefined,
    });
    expect(result.ok).toBe(false);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("upserts every valid media item on success", async () => {
    const { db, rows } = makeFakeD1();
    const fetchFn = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        data: [
          {
            id: "171234",
            caption: "Hello world",
            media_type: "IMAGE",
            media_url: "https://example.com/a.jpg",
            permalink: "https://instagram.com/p/a",
            timestamp: "2026-01-01T00:00:00+0000",
          },
          {
            id: "171235",
            media_type: "VIDEO",
            media_url: "https://example.com/b.mp4",
            permalink: "https://instagram.com/p/b",
            thumbnail_url: "https://example.com/b-thumb.jpg",
            timestamp: "2026-01-02T00:00:00+0000",
          },
        ],
      }),
    );
    const result = await syncInstagramPosts({
      db,
      fetchFn,
      accessToken: "token-abc",
      businessAccountId: "999",
      nowIso: () => "2026-06-01T00:00:00.000Z",
    });
    expect(result).toEqual({ ok: true, fetched: 2 });
    expect(rows).toHaveLength(2);
    expect(rows.find((r) => r.id === "171234")).toMatchObject({
      media_type: "IMAGE",
      caption: "Hello world",
      display_order: null,
      visible: 1,
      synced_at: "2026-06-01T00:00:00.000Z",
    });
    expect(rows.find((r) => r.id === "171235")).toMatchObject({
      media_type: "VIDEO",
      thumbnail_url: "https://example.com/b-thumb.jpg",
    });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [calledUrl] = fetchFn.mock.calls[0] as [string];
    expect(calledUrl).toContain("https://graph.instagram.com/v24.0/999/media");
    expect(calledUrl).toContain("access_token=token-abc");
  });

  it("skips malformed items without failing the whole sync", async () => {
    const { db, rows } = makeFakeD1();
    const fetchFn = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        data: [
          { id: "ok1", media_type: "IMAGE", media_url: "https://x/a.jpg", permalink: "https://x/p/a", timestamp: "2026-01-01T00:00:00+0000" },
          { id: "bad-type", media_type: "STORY", media_url: "https://x/b.jpg", permalink: "https://x/p/b", timestamp: "2026-01-01T00:00:00+0000" },
          { id: "", media_type: "IMAGE", media_url: "https://x/c.jpg", permalink: "https://x/p/c", timestamp: "2026-01-01T00:00:00+0000" },
          { media_type: "IMAGE", media_url: "https://x/d.jpg", permalink: "https://x/p/d", timestamp: "2026-01-01T00:00:00+0000" },
        ],
      }),
    );
    const result = await syncInstagramPosts({
      db,
      fetchFn,
      accessToken: "t",
      businessAccountId: "1",
    });
    expect(result.ok).toBe(true);
    expect(result.fetched).toBe(1);
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe("ok1");
  });

  it("stores the account handle on every upserted row, and null when none is given", async () => {
    const item = { id: "p1", media_type: "IMAGE", media_url: "https://x/a.jpg", permalink: "https://x/p/a", timestamp: "2026-01-01T00:00:00+0000" };
    const withHandle = makeFakeD1();
    await syncInstagramPosts({
      db: withHandle.db,
      fetchFn: vi.fn().mockResolvedValue(jsonResponse(200, { data: [item] })),
      accessToken: "t",
      businessAccountId: "1",
      accountHandle: "ins.gileara",
    });
    expect(withHandle.rows[0].account_handle).toBe("ins.gileara");

    const withoutHandle = makeFakeD1();
    await syncInstagramPosts({
      db: withoutHandle.db,
      fetchFn: vi.fn().mockResolvedValue(jsonResponse(200, { data: [item] })),
      accessToken: "t",
      businessAccountId: "1",
    });
    expect(withoutHandle.rows[0].account_handle).toBeNull();
  });

  it("returns ok:false with the Graph API's own error message on a non-OK response", async () => {
    const { db } = makeFakeD1();
    const fetchFn = vi.fn().mockResolvedValue(
      jsonResponse(400, { error: { message: "Error validating access token" } }),
    );
    const result = await syncInstagramPosts({
      db,
      fetchFn,
      accessToken: "expired",
      businessAccountId: "1",
    });
    expect(result.ok).toBe(false);
    expect(result.fetched).toBe(0);
    expect(result.error).toBe("Error validating access token");
  });

  it("returns a generic error on a non-OK response with no parseable body", async () => {
    const { db } = makeFakeD1();
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error("not json")),
    });
    const result = await syncInstagramPosts({
      db,
      fetchFn,
      accessToken: "t",
      businessAccountId: "1",
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("500");
  });

  it("never throws when fetch itself rejects", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { db } = makeFakeD1();
    const fetchFn = vi.fn().mockRejectedValue(new Error("network down"));
    const result = await syncInstagramPosts({
      db,
      fetchFn,
      accessToken: "t",
      businessAccountId: "1",
    });
    expect(result.ok).toBe(false);
    expect(result.fetched).toBe(0);
    expect(result.error).toBeTruthy();
    warn.mockRestore();
  });

  it("re-syncing an existing post preserves its display_order and visible override", async () => {
    const { db, rows } = makeFakeD1([
      {
        id: "existing",
        media_type: "IMAGE",
        media_url: "https://x/old.jpg",
        permalink: "https://x/p/old",
        caption: "old caption",
        thumbnail_url: null,
        posted_at: "2025-01-01T00:00:00+0000",
        display_order: 3,
        visible: 0,
        synced_at: "2025-01-01T00:00:00.000Z",
      },
    ]);
    const fetchFn = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        data: [
          {
            id: "existing",
            caption: "new caption",
            media_type: "IMAGE",
            media_url: "https://x/new.jpg",
            permalink: "https://x/p/new",
            timestamp: "2026-01-01T00:00:00+0000",
          },
        ],
      }),
    );
    const result = await syncInstagramPosts({
      db,
      fetchFn,
      accessToken: "t",
      businessAccountId: "1",
      nowIso: () => "2026-06-01T00:00:00.000Z",
    });
    expect(result).toEqual({ ok: true, fetched: 1 });
    expect(rows).toHaveLength(1);
    const row = rows[0];
    // Refreshed fields:
    expect(row.caption).toBe("new caption");
    expect(row.media_url).toBe("https://x/new.jpg");
    expect(row.synced_at).toBe("2026-06-01T00:00:00.000Z");
    // Preserved editor overrides:
    expect(row.display_order).toBe(3);
    expect(row.visible).toBe(0);
  });
});
