import { describe, expect, it, vi } from "vitest";
import {
  fallbackScenarios,
  getPublicScenario,
  getPublicScenarios,
  selectPublicScenarios,
} from "@/lib/cms/public-scenarios";
import { scenarios } from "@/content/scenarios";

describe("fallbackScenarios", () => {
  it("returns every src/content/scenarios.ts entry unchanged", () => {
    const result = fallbackScenarios();
    expect(result).toHaveLength(scenarios.length);
    expect(result[0]).toEqual(scenarios[0]);
  });
});

describe("selectPublicScenarios", () => {
  it("uses the D1 rows when at least one is present", () => {
    const rows = [{ ...scenarios[0], id: "from-d1" }];
    expect(selectPublicScenarios(rows)).toEqual(rows);
  });

  it("falls back to src/content/scenarios.ts when the D1 result is empty", () => {
    expect(selectPublicScenarios([])).toEqual(fallbackScenarios());
  });

  it("falls back to src/content/scenarios.ts when the D1 result is null/undefined", () => {
    expect(selectPublicScenarios(null)).toEqual(fallbackScenarios());
    expect(selectPublicScenarios(undefined)).toEqual(fallbackScenarios());
  });
});

// ---------------------------------------------------------------------------
// Fallback chain without a Cloudflare context (the state of plain
// `next dev` / `next build` / vitest): getPublicScenarios must not throw.
// ---------------------------------------------------------------------------

describe("getPublicScenarios without a Cloudflare context", () => {
  it("falls back to src/content/scenarios.ts", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(getPublicScenarios()).resolves.toEqual(fallbackScenarios());
    warn.mockRestore();
  });
});

describe("getPublicScenario", () => {
  it("resolves a known fallback slug and null for unknown ones", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const known = fallbackScenarios()[0];
    await expect(getPublicScenario(known.id)).resolves.toEqual(known);
    await expect(getPublicScenario("does-not-exist")).resolves.toBeNull();
    warn.mockRestore();
  });
});
