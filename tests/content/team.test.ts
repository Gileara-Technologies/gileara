import { describe, expect, it } from "vitest";
import { foundation, roster } from "@/content/team";

/**
 * Validates the team content module:
 *  - 3 founding partners (Amos, Julian, Rodney) with images and quotes
 *  - roster: 8 people, one flat list tagged by department (no section
 *    grouping) — Wisdom Segbedzi and Lawrence Adusu have been removed,
 *    Owusu Joe (Creative Director) has been added
 *  - Removed members (Garnett Dussey, Kelvin, Wisdom Segbedzi,
 *    Lawrence Adusu) are not present anywhere
 *  - All foundation members have a portrait image
 *  - Founders point at the canonical portrait files (Julian.jpg, rodney.jpg)
 *
 * The reporting-structure org chart (previously tested here too) has been
 * removed from the page and from this content module — see git history
 * if it needs to come back.
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

  it("roster has exactly 8 people, including the newly added Creative Director", () => {
    expect(roster).toHaveLength(8);
    expect(roster.map((m) => m.name)).toEqual([
      "Jude Elorm Agbesinyale",
      "Owusu Joe",
      "Daniel Akpabli",
      "Theophilus Bruce",
      "Mekitonima Aliodi",
      "Mohammed Murshid",
      "Gyening Patrick Nyarko",
      "Samuel Quansah",
    ]);
  });

  it("Owusu Joe is the Creative Director, tagged with the Creative department", () => {
    const joe = roster.find((m) => m.name === "Owusu Joe");
    expect(joe?.role).toBe("Creative Director");
    expect(joe?.department).toBe("Creative");
  });

  it("every roster member has a name, role, and department", () => {
    for (const m of roster) {
      expect(m.name, "roster member name").toBeTruthy();
      expect(m.role, `${m.name} role`).toBeTruthy();
      expect(m.department, `${m.name} department`).toBeTruthy();
    }
  });

  it("roster members with photos reference real files (elorm.jpg, Daniel.jpg)", () => {
    const elorm = roster.find((m) => m.name === "Jude Elorm Agbesinyale");
    const daniel = roster.find((m) => m.name === "Daniel Akpabli");
    expect(elorm?.image).toBe("/assets/images/elorm.jpg");
    expect(daniel?.image).toBe("/assets/images/Daniel.jpg");
  });

  it("roster members without a photo on file have no image field (render initials)", () => {
    const theophilus = roster.find((m) => m.name === "Theophilus Bruce");
    const mekitonima = roster.find((m) => m.name === "Mekitonima Aliodi");
    const joe = roster.find((m) => m.name === "Owusu Joe");
    expect(theophilus?.image).toBeUndefined();
    expect(mekitonima?.image).toBeUndefined();
    expect(joe?.image).toBeUndefined();
  });

  it("roster is tagged with the right departments", () => {
    const byName = (name: string) => roster.find((m) => m.name === name)?.department;
    expect(byName("Jude Elorm Agbesinyale")).toBe("Marketing");
    expect(byName("Owusu Joe")).toBe("Creative");
    expect(byName("Daniel Akpabli")).toBe("Communication");
    expect(byName("Theophilus Bruce")).toBe("Finance");
    for (const name of ["Mekitonima Aliodi", "Mohammed Murshid", "Gyening Patrick Nyarko", "Samuel Quansah"]) {
      expect(byName(name)).toBe("Engineering");
    }
  });

  it("removed members (Garnett Dussey, Kelvin, Wisdom Segbedzi, Lawrence Adusu) are not present anywhere", () => {
    const allNames = [...foundation.map((f) => f.name), ...roster.map((m) => m.name)];
    expect(allNames.some((n) => n.includes("Garnett"))).toBe(false);
    expect(allNames.some((n) => /^Kelvin\b/.test(n) || n.includes("Kelvin "))).toBe(false);
    expect(allNames.some((n) => n.includes("Wisdom"))).toBe(false);
    expect(allNames.some((n) => n.includes("Lawrence"))).toBe(false);
  });

  it("Daniel is in the roster once, correctly titled — single source of truth", () => {
    const matches = roster.filter((m) => m.name === "Daniel Akpabli");
    expect(matches).toHaveLength(1);
    expect(matches[0].role).toBe("Head of Communication & Executive Secretary");
  });
});
