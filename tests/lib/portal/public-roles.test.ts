import { describe, expect, it, vi } from "vitest";
import {
  fallbackRoles,
  findPublicRole,
  getPublicRole,
  getPublicRoles,
  mapRoleRow,
  openRoleToParsed,
  selectPublicRoles,
} from "@/lib/portal/public-roles";
import { openRoles } from "@/content/roles";
import type { RoleRow } from "@/lib/portal/types";

// ---------------------------------------------------------------------------
// Pure mapping: raw D1-shaped row -> ParsedRole (JSON parsing reuses
// db.ts's exported parseRoleRow; this file never touches the network
// or a real D1 binding).
// ---------------------------------------------------------------------------

function fullRow(overrides: Partial<RoleRow> = {}): RoleRow {
  return {
    id: "full-stack-engineer",
    title: "Full-Stack Engineer",
    openings: 2,
    icon: "code_blocks",
    location: "Accra · Hybrid",
    description: "Ship the systems small businesses run on.",
    responsibilities: '["Build features","Write tests"]',
    required_skills: '["TypeScript","SQL"]',
    nice_to_have: '["Cloudflare Workers"]',
    status: "open",
    display_order: 1,
    created_at: "2026-10-08 05:23:12",
    updated_at: "2026-10-09 10:00:00",
    ...overrides,
  };
}

describe("mapRoleRow", () => {
  it("maps a full row to ParsedRole with JSON lists parsed", () => {
    const parsed = mapRoleRow(fullRow());
    expect(parsed).not.toBeNull();
    expect(parsed).toMatchObject({
      id: "full-stack-engineer",
      title: "Full-Stack Engineer",
      openings: 2,
      icon: "code_blocks",
      location: "Accra · Hybrid",
      responsibilities: ["Build features", "Write tests"],
      requiredSkills: ["TypeScript", "SQL"],
      niceToHave: ["Cloudflare Workers"],
      status: "open",
      displayOrder: 1,
      createdAt: "2026-10-08 05:23:12",
      updatedAt: "2026-10-09 10:00:00",
    });
  });

  it("falls back to [] when a list field holds invalid JSON", () => {
    const parsed = mapRoleRow(
      fullRow({ responsibilities: "{not json", required_skills: "", nice_to_have: "null" }),
    );
    expect(parsed).not.toBeNull();
    expect(parsed?.responsibilities).toEqual([]);
    expect(parsed?.requiredSkills).toEqual([]);
    expect(parsed?.niceToHave).toEqual([]);
  });

  it("keeps only string entries in a list field", () => {
    const parsed = mapRoleRow(fullRow({ responsibilities: '["Keep", 2, null]' }));
    expect(parsed?.responsibilities).toEqual(["Keep"]);
  });

  it("defaults missing optional fields instead of leaking undefined", () => {
    const parsed = mapRoleRow({ id: "only-id" });
    expect(parsed).toMatchObject({
      id: "only-id",
      title: "",
      openings: 0,
      status: "open",
      displayOrder: 0,
      responsibilities: [],
      requiredSkills: [],
      niceToHave: [],
      createdAt: "",
      updatedAt: "",
    });
  });

  it("returns null for rows without a string id", () => {
    expect(mapRoleRow(null)).toBeNull();
    expect(mapRoleRow("row")).toBeNull();
    expect(mapRoleRow({ title: "No id" })).toBeNull();
  });

  it("coerces an invalid status back to open", () => {
    const parsed = mapRoleRow(fullRow({ status: "archived" as RoleRow["status"] }));
    expect(parsed?.status).toBe("open");
  });
});

// ---------------------------------------------------------------------------
// Fallback mapping and selection (decision Q5: D1 first, roles.ts fallback)
// ---------------------------------------------------------------------------

describe("openRoleToParsed", () => {
  it("maps a content role into the ParsedRole shape as an open role", () => {
    const parsed = openRoleToParsed(openRoles[0], 7);
    expect(parsed).toEqual({
      ...openRoles[0],
      status: "open",
      displayOrder: 7,
      createdAt: "",
      updatedAt: "",
    });
  });

  it("copies the list fields so callers cannot mutate roles.ts", () => {
    const parsed = openRoleToParsed(openRoles[0], 0);
    parsed.responsibilities.push("extra");
    parsed.requiredSkills.push("extra");
    expect(openRoles[0].responsibilities).not.toContain("extra");
    expect(openRoles[0].requiredSkills).not.toContain("extra");
  });
});

describe("fallbackRoles", () => {
  it("maps every src/content/roles.ts entry in order", () => {
    const fallback = fallbackRoles();
    expect(fallback).toHaveLength(openRoles.length);
    expect(fallback.map((role) => role.id)).toEqual(openRoles.map((role) => role.id));
    expect(fallback.every((role) => role.status === "open")).toBe(true);
    expect(fallback.map((role) => role.displayOrder)).toEqual(
      openRoles.map((_, index) => index),
    );
  });
});

describe("selectPublicRoles", () => {
  it("uses the D1 result when it has roles", () => {
    const rows = [openRoleToParsed(openRoles[0], 0)];
    expect(selectPublicRoles(rows)).toBe(rows);
  });

  it("falls back to roles.ts when D1 returns an empty list", () => {
    expect(selectPublicRoles([])).toEqual(fallbackRoles());
  });

  it("falls back to roles.ts for null/undefined input", () => {
    expect(selectPublicRoles(null)).toEqual(fallbackRoles());
    expect(selectPublicRoles(undefined)).toEqual(fallbackRoles());
  });
});

// ---------------------------------------------------------------------------
// Slug lookup for /careers/[slug]
// ---------------------------------------------------------------------------

describe("findPublicRole", () => {
  const open = openRoleToParsed(openRoles[0], 0);
  const paused = { ...open, id: "paused-role", status: "paused" as const };

  it("finds an open role by slug", () => {
    expect(findPublicRole([open, paused], "full-stack-engineer")).toEqual(open);
  });

  it("does not match paused/closed roles", () => {
    expect(findPublicRole([paused], "paused-role")).toBeNull();
  });

  it("returns null for unknown slugs", () => {
    expect(findPublicRole([open], "qa-engineer")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Fallback chain without a Cloudflare context (the state of plain
// `next dev` / `next build` / vitest): getPublicRoles must not throw.
// ---------------------------------------------------------------------------

describe("getPublicRoles without a Cloudflare context", () => {
  it("falls back to src/content/roles.ts", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(getPublicRoles()).resolves.toEqual(fallbackRoles());
    warn.mockRestore();
  });

  it("resolves a known fallback slug and rejects unknown ones", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(getPublicRole("ui-ux-designer")).resolves.toEqual(
      fallbackRoles().find((role) => role.id === "ui-ux-designer"),
    );
    await expect(getPublicRole("does-not-exist")).resolves.toBeNull();
    warn.mockRestore();
  });
});
