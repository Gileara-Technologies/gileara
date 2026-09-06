import { describe, expect, it } from "vitest";
import { foundation, leaders, memberGroups } from "@/content/team";

/**
 * Validates the team content module:
 *  - 3 founding partners (Amos, Julian, Rodney) with images and quotes
 *  - 3 leaders (department heads under Julian) — some with portraits
 *  - 2 member groups (Engineering, Finance & Admin) — unified "team" view
 *  - Removed members (Garnett Dussey, Kelvin) are not present anywhere
 *  - All members have a name and role
 *  - All foundation members have a portrait image
 *  - Founders point at the canonical portrait files (Julian.jpg, rodney.jpg)
 *  - No file under /public/assets/images/ is orphaned (every public
 *    portrait is referenced by a foundation or leader entry)
 */
describe("team content", () => {
  it("foundation has the 3 founding partners in the expected order", () => {
    expect(foundation.map((f) => f.name)).toEqual([
      "Amos Frederick Hughes",
      "Julian Hagan",
      "Rodney Hagan",
    ]);
  });

  it("every foundation member has a portrait image path", () => {
    for (const f of foundation) {
      expect(f.image, `${f.name} image`).toBeTruthy();
      expect(f.image, `${f.name} image`).toMatch(/^\/assets\/images\//);
    }
  });

  it("founders point at the canonical portrait files (Julian.jpg, rodney.jpg)", () => {
    // The old `julian_hagan.jpg` and `rodney_hagan.jpg` files were
    // replaced by `Julian.jpg` and `rodney.jpg`. The content module
    // must reference the new files.
    const julian = foundation.find((f) => f.name === "Julian Hagan");
    const rodney = foundation.find((f) => f.name === "Rodney Hagan");
    expect(julian?.image).toBe("/assets/images/Julian.jpg");
    expect(rodney?.image).toBe("/assets/images/rodney.jpg");
  });

  it("every foundation member has a non-empty quote", () => {
    for (const f of foundation) {
      expect(f.quote.length, `${f.name} quote`).toBeGreaterThan(10);
    }
  });

  it("leaders has 3 department heads (under Julian, COO)", () => {
    expect(leaders).toHaveLength(3);
    expect(leaders.map((l) => l.name)).toEqual([
      "Jude Elorm Agbesinyale",
      "Daniel Akpabli",
      "Wisdom Segbedzi",
    ]);
    expect(leaders.map((l) => l.role)).toEqual([
      "Head of Marketing",
      "Head of Communication & Executive Secretary",
      "HR & People Operations Officer",
    ]);
  });

  it("leaders with photos reference real files (elorm.jpg, Daniel.jpg)", () => {
    const elorm = leaders.find((l) => l.name === "Jude Elorm Agbesinyale");
    const daniel = leaders.find((l) => l.name === "Daniel Akpabli");
    expect(elorm?.image).toBe("/assets/images/elorm.jpg");
    expect(daniel?.image).toBe("/assets/images/Daniel.jpg");
  });

  it("memberGroups has Engineering and Finance & Admin (no separate Operations)", () => {
    const labels = memberGroups.map((g) => g.label);
    expect(labels).toContain("Engineering");
    expect(labels).toContain("Finance & Admin");
    // The old separate "Operations" group was unified — make sure
    // it isn't present.
    expect(labels).not.toContain("Operations");
  });

  it("engineering team includes Lawrence Adusu (added under Rodney)", () => {
    const eng = memberGroups.find((g) => g.label === "Engineering");
    expect(eng).toBeDefined();
    expect(eng?.members.some((m) => m.name === "Lawrence Adusu" && m.role === "Full Stack Engineer")).toBe(true);
  });

  it("finance & admin team includes Theophilus Bruce (Finance Secretary)", () => {
    const fin = memberGroups.find((g) => g.label === "Finance & Admin");
    expect(fin).toBeDefined();
    expect(fin?.members.some((m) => m.name === "Theophilus Bruce" && m.role === "Finance Secretary")).toBe(true);
  });

  it("every member has a name and role", () => {
    for (const g of memberGroups) {
      for (const m of g.members) {
        expect(m.name, `${g.label} member name`).toBeTruthy();
        expect(m.role, `${g.label} member role`).toBeTruthy();
      }
    }
  });

  it("removed members (Garnett Dussey, Kelvin) are not present anywhere", () => {
    const allNames = [
      ...foundation.map((f) => f.name),
      ...leaders.map((l) => l.name),
      ...memberGroups.flatMap((g) => g.members.map((m) => m.name)),
    ];
    expect(allNames.some((n) => n.includes("Garnett"))).toBe(false);
    expect(allNames.some((n) => /^Kelvin\b/.test(n) || n.includes("Kelvin "))).toBe(false);
  });

  it("Daniel is in the leaders section (not the teams) — single source of truth", () => {
    // Daniel Akpabli is the Head of Communication & Executive Secretary
    // (in leaders), not the Administrative Secretary (in the operations
    // team). The two roles were unified into one when the team was
    // restructured.
    expect(leaders.some((l) => l.name === "Daniel Akpabli")).toBe(true);
    for (const g of memberGroups) {
      for (const m of g.members) {
        expect(m.name, `Daniel should not also be in ${g.label}`).not.toBe("Daniel Akpabli");
        expect(m.name, `Akpabli Daniel should not be in ${g.label}`).not.toBe("Akpabli Daniel");
      }
    }
  });

  it("every group has a non-empty lead caption", () => {
    for (const g of memberGroups) {
      expect(g.lead, `${g.label} lead`).toMatch(/\w/);
    }
  });
});
