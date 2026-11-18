import { describe, expect, it, vi } from "vitest";
import {
  getPublicInstagramPosts,
  selectVisibleInstagramPosts,
  INSTAGRAM_PROFILE_URL,
} from "@/lib/instagram/public-instagram";
import type { InstagramPostRow } from "@/lib/instagram/db";

function row(overrides: Partial<InstagramPostRow> = {}): InstagramPostRow {
  return {
    id: "1",
    media_type: "IMAGE",
    media_url: "https://example.com/1.jpg",
    permalink: "https://instagram.com/p/1",
    caption: "caption",
    thumbnail_url: null,
    posted_at: "2026-01-01T00:00:00+0000",
    display_order: null,
    visible: true,
    synced_at: "2026-01-01T00:00:00.000Z",
    account_handle: null,
    ...overrides,
  };
}

describe("selectVisibleInstagramPosts", () => {
  it("drops hidden rows", () => {
    const rows = [row({ id: "visible", visible: true }), row({ id: "hidden", visible: false })];
    const result = selectVisibleInstagramPosts(rows, 10);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("visible");
  });

  it("returns [] for an empty cache", () => {
    expect(selectVisibleInstagramPosts([], 10)).toEqual([]);
  });

  it("orders by display_order ascending, NULLs last", () => {
    const rows = [
      row({ id: "no-order", display_order: null, posted_at: "2026-01-05T00:00:00+0000" }),
      row({ id: "order-2", display_order: 2 }),
      row({ id: "order-1", display_order: 1 }),
    ];
    const result = selectVisibleInstagramPosts(rows, 10);
    expect(result.map((p) => p.id)).toEqual(["order-1", "order-2", "no-order"]);
  });

  it("falls back to posted_at descending when display_order ties or is absent", () => {
    const rows = [
      row({ id: "older", display_order: null, posted_at: "2026-01-01T00:00:00+0000" }),
      row({ id: "newer", display_order: null, posted_at: "2026-02-01T00:00:00+0000" }),
    ];
    const result = selectVisibleInstagramPosts(rows, 10);
    expect(result.map((p) => p.id)).toEqual(["newer", "older"]);
  });

  it("caps the result to the given limit", () => {
    const rows = [row({ id: "a" }), row({ id: "b" }), row({ id: "c" })];
    expect(selectVisibleInstagramPosts(rows, 2)).toHaveLength(2);
  });

  it("maps D1 column names to the public camelCase shape", () => {
    const result = selectVisibleInstagramPosts(
      [row({ id: "1", media_type: "VIDEO", thumbnail_url: "https://example.com/thumb.jpg", account_handle: "gileara" })],
      10,
    );
    expect(result[0]).toEqual({
      id: "1",
      mediaType: "VIDEO",
      mediaUrl: "https://example.com/1.jpg",
      permalink: "https://instagram.com/p/1",
      caption: "caption",
      thumbnailUrl: "https://example.com/thumb.jpg",
      postedAt: "2026-01-01T00:00:00+0000",
      accountHandle: "gileara",
    });
  });
});

describe("getPublicInstagramPosts without a Cloudflare context", () => {
  it("returns [] rather than throwing or returning fabricated content", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(getPublicInstagramPosts()).resolves.toEqual([]);
    warn.mockRestore();
  });
});

describe("INSTAGRAM_PROFILE_URL", () => {
  it("points at the primary account, @gileara", () => {
    expect(INSTAGRAM_PROFILE_URL).toBe("https://www.instagram.com/gileara/");
  });
});
