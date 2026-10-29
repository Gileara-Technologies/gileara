import { describe, expect, it, vi } from "vitest";
import {
  fallbackPosts,
  getPublicPost,
  getPublicPosts,
  selectPublicPosts,
} from "@/lib/cms/public-posts";
import { posts } from "@/content/posts";

describe("fallbackPosts", () => {
  it("returns every src/content/posts.ts entry unchanged", () => {
    const result = fallbackPosts();
    expect(result).toHaveLength(posts.length);
    expect(result[0]).toEqual(posts[0]);
  });
});

describe("selectPublicPosts", () => {
  it("uses the D1 rows when at least one is present", () => {
    const rows = [{ ...posts[0], slug: "from-d1" }];
    expect(selectPublicPosts(rows)).toEqual(rows);
  });

  it("falls back to src/content/posts.ts when the D1 result is empty", () => {
    expect(selectPublicPosts([])).toEqual(fallbackPosts());
  });

  it("falls back to src/content/posts.ts when the D1 result is null/undefined", () => {
    expect(selectPublicPosts(null)).toEqual(fallbackPosts());
    expect(selectPublicPosts(undefined)).toEqual(fallbackPosts());
  });
});

// ---------------------------------------------------------------------------
// Fallback chain without a Cloudflare context (the state of plain
// `next dev` / `next build` / vitest): getPublicPosts must not throw.
// ---------------------------------------------------------------------------

describe("getPublicPosts without a Cloudflare context", () => {
  it("falls back to src/content/posts.ts", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(getPublicPosts()).resolves.toEqual(fallbackPosts());
    warn.mockRestore();
  });
});

describe("getPublicPost", () => {
  it("resolves a known fallback slug and null for unknown ones", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const known = fallbackPosts()[0];
    await expect(getPublicPost(known.slug)).resolves.toEqual(known);
    await expect(getPublicPost("does-not-exist")).resolves.toBeNull();
    warn.mockRestore();
  });
});
