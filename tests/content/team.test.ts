import { describe, expect, it } from "vitest";
import { foundation, leaders, teamGroups } from "@/content/team";

/**
 * Validates the team content module:
 *  - 3 founding partners (Amos, Julian, Rodney) with images and quotes
 *  - 3 leaders (department heads under Julian)
 *  - 2 team groups (Engineering, Operations) with members
 *  - Removed members (Garnett Dussey, Kelvin) are not present anywhere
 *  - All members have a name and role
 *  - All foundation members have a portrait image
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

  it("teamGroups has Engineering and Operations", () => {
    const labels = teamGroups.map((g) => g.label);
    expect(labels).toContain("Engineering");
    expect(labels).toContain("Operations");
  });

  it("engineering team includes Lawrence Adusu (added under Rodney)", () => {
    const eng = teamGroups.find((g) => g.label === "Engineering");
    expect(eng).toBeDefined();
    expect(eng?.members.some((m) => m.name === "Lawrence Adusu" && m.role === "Full Stack Engineer")).toBe(true);
  });

  it("operations team includes Theophilus Bruce (Finance Secretary)", () => {
    const ops = teamGroups.find((g) => g.label === "Operations");
    expect(ops).toBeDefined();
    expect(ops?.members.some((m) => m.name === "Theophilus Bruce" && m.role === "Finance Secretary")).toBe(true);
  });

  it("every team member has a name and role", () => {
    for (const g of teamGroups) {
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
      ...teamGroups.flatMap((g) => g.members.map((m) => m.name)),
    ];
    expect(allNames.some((n) => n.includes("Garnett"))).toBe(false);
    expect(allNames.some((n) => /^Kelvin\b/.test(n) || n.includes("Kelvin "))).toBe(false);
  });

  it("every group has a non-empty lead caption", () => {
    for (const g of teamGroups) {
      expect(g.lead, `${g.label} lead`).toMatch(/\w/);
    }
  });
});
