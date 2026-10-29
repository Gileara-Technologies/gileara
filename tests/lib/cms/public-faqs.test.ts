import { describe, expect, it, vi } from "vitest";
import {
  fallbackFaqs,
  getPublicFaqs,
  selectPublicFaqs,
} from "@/lib/cms/public-faqs";
import { faqs } from "@/content/faqs";

describe("fallbackFaqs", () => {
  it("maps every src/content/faqs.ts entry to the public shape", () => {
    const result = fallbackFaqs();
    expect(result).toHaveLength(faqs.length);
    expect(result[0]).toEqual({ question: faqs[0].question, answer: faqs[0].answer });
  });
});

describe("selectPublicFaqs", () => {
  it("uses the D1 rows when at least one is present", () => {
    const rows = [{ question: "Q1?", answer: "A1." }];
    expect(selectPublicFaqs(rows)).toEqual(rows);
  });

  it("falls back to src/content/faqs.ts when the D1 result is empty", () => {
    expect(selectPublicFaqs([])).toEqual(fallbackFaqs());
  });

  it("falls back to src/content/faqs.ts when the D1 result is null/undefined", () => {
    expect(selectPublicFaqs(null)).toEqual(fallbackFaqs());
    expect(selectPublicFaqs(undefined)).toEqual(fallbackFaqs());
  });
});

// ---------------------------------------------------------------------------
// Fallback chain without a Cloudflare context (the state of plain
// `next dev` / `next build` / vitest): getPublicFaqs must not throw.
// ---------------------------------------------------------------------------

describe("getPublicFaqs without a Cloudflare context", () => {
  it("falls back to src/content/faqs.ts", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(getPublicFaqs()).resolves.toEqual(fallbackFaqs());
    warn.mockRestore();
  });
});
