import { describe, expect, it, vi } from "vitest";
import {
  fallbackFoundation,
  fallbackRoster,
  getPublicFoundation,
  getPublicRoster,
  selectPublicFoundation,
  selectPublicRoster,
} from "@/lib/cms/public-people";
import { foundation, roster } from "@/content/team";

describe("fallbackFoundation", () => {
  it("returns every src/content/team.ts foundation entry unchanged", () => {
    const result = fallbackFoundation();
    expect(result).toHaveLength(foundation.length);
    expect(result[0]).toEqual(foundation[0]);
  });
});

describe("fallbackRoster", () => {
  it("returns every src/content/team.ts roster entry unchanged", () => {
    const result = fallbackRoster();
    expect(result).toHaveLength(roster.length);
    expect(result[0]).toEqual(roster[0]);
  });
});

describe("selectPublicFoundation", () => {
  it("uses the D1 rows when at least one is present", () => {
    const rows = [{ ...foundation[0], name: "From D1" }];
    expect(selectPublicFoundation(rows)).toEqual(rows);
  });

  it("falls back to src/content/team.ts when the D1 result is empty, null, or undefined", () => {
    expect(selectPublicFoundation([])).toEqual(fallbackFoundation());
    expect(selectPublicFoundation(null)).toEqual(fallbackFoundation());
    expect(selectPublicFoundation(undefined)).toEqual(fallbackFoundation());
  });
});

describe("selectPublicRoster", () => {
  it("uses the D1 rows when at least one is present", () => {
    const rows = [{ ...roster[0], name: "From D1" }];
    expect(selectPublicRoster(rows)).toEqual(rows);
  });

  it("falls back to src/content/team.ts when the D1 result is empty, null, or undefined", () => {
    expect(selectPublicRoster([])).toEqual(fallbackRoster());
    expect(selectPublicRoster(null)).toEqual(fallbackRoster());
    expect(selectPublicRoster(undefined)).toEqual(fallbackRoster());
  });
});

// ---------------------------------------------------------------------------
// Fallback chain without a Cloudflare context (the state of plain
// `next dev` / `next build` / vitest): neither function must throw.
// ---------------------------------------------------------------------------

describe("getPublicFoundation without a Cloudflare context", () => {
  it("falls back to src/content/team.ts", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(getPublicFoundation()).resolves.toEqual(fallbackFoundation());
    warn.mockRestore();
  });
});

describe("getPublicRoster without a Cloudflare context", () => {
  it("falls back to src/content/team.ts", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(getPublicRoster()).resolves.toEqual(fallbackRoster());
    warn.mockRestore();
  });
});
