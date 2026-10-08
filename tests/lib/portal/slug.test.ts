import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "@/lib/portal/slug";

describe("slugify", () => {
  it("lowercases the title", () => {
    expect(slugify("Full-Stack Engineer")).toBe("full-stack-engineer");
    expect(slugify("UI/UX Designer")).toBe("ui-ux-designer");
  });

  it("turns spaces and punctuation into single dashes", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
    expect(slugify("Back_end & Front_end")).toBe("back-end-front-end");
    expect(slugify("Project Manager (PM)")).toBe("project-manager-pm");
  });

  it("collapses runs of non-alphanumeric characters", () => {
    expect(slugify("a   b--c")).toBe("a-b-c");
    expect(slugify("A!!B??C")).toBe("a-b-c");
    expect(slugify("React / Next.js (App Router)")).toBe("react-next-js-app-router");
  });

  it("trims leading and trailing dashes", () => {
    expect(slugify("  -- Lead  ")).toBe("lead");
    expect(slugify("-DevOps-Engineer-")).toBe("devops-engineer");
  });

  it("keeps digits", () => {
    expect(slugify("React 19")).toBe("react-19");
    expect(slugify("123")).toBe("123");
  });

  it("is idempotent on already-slugged ids", () => {
    expect(slugify("full-stack-engineer")).toBe("full-stack-engineer");
  });

  it("returns an empty string for titles with no ASCII alphanumerics", () => {
    expect(slugify("日本")).toBe("");
    expect(slugify("!!!")).toBe("");
    expect(slugify("")).toBe("");
    expect(slugify("   ")).toBe("");
  });
});

describe("uniqueSlug", () => {
  it("returns the base slug when it is free", () => {
    expect(uniqueSlug("Full-Stack Engineer", ["ui-ux-designer"])).toBe(
      "full-stack-engineer",
    );
    expect(uniqueSlug("Full-Stack Engineer", [])).toBe("full-stack-engineer");
  });

  it("appends -2 when the base is taken", () => {
    expect(uniqueSlug("Full-Stack Engineer", ["full-stack-engineer"])).toBe(
      "full-stack-engineer-2",
    );
  });

  it("increments past consecutive taken suffixes", () => {
    const existing = ["x", "x-2", "x-3"];
    expect(uniqueSlug("X", existing)).toBe("x-4");
  });

  it("fills gaps: -2 is chosen before -3", () => {
    const existing = ["x", "x-3"];
    expect(uniqueSlug("X", existing)).toBe("x-2");
  });

  it("does not depend on the order of existing ids", () => {
    expect(uniqueSlug("X", ["x-2", "x"])).toBe("x-3");
  });

  it("handles numeric-only titles", () => {
    expect(uniqueSlug("123", ["123"])).toBe("123-2");
    expect(uniqueSlug("123", ["123", "123-2"])).toBe("123-3");
  });

  it("returns an empty string when the base slug is empty", () => {
    expect(uniqueSlug("日本", ["full-stack-engineer"])).toBe("");
    expect(uniqueSlug("", [])).toBe("");
  });
});