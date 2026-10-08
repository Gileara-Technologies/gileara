import { describe, expect, it } from "vitest";
import {
  CLOSE_ACTION,
  DEFAULT_ICON,
  ROLE_STATUSES,
  canClose,
  formatDbTimestamp,
  statusActionFor,
  statusLabel,
  validateRoleForm,
  validateStatusActionForm,
} from "@/app/admin/form-logic";

/** Build the role-form FormData the server actions receive. */
function roleForm(overrides: Record<string, string | string[]> = {}): FormData {
  const values: Record<string, string | string[]> = {
    title: "Full Stack Engineer",
    openings: "2",
    icon: "",
    location: "Accra · Hybrid",
    description: "Ship features across the stack.",
    responsibilities: "Build features",
    requiredSkills: "TypeScript",
    niceToHave: "",
    ...overrides,
  };
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value)) {
      for (const entry of value) {
        formData.append(key, entry);
      }
    } else {
      formData.set(key, value);
    }
  }
  return formData;
}

describe("validateRoleForm", () => {
  it("accepts a well-formed form and returns schema-shaped values", () => {
    const result = validateRoleForm(roleForm());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({
      title: "Full Stack Engineer",
      openings: 2,
      icon: DEFAULT_ICON,
      location: "Accra · Hybrid",
      description: "Ship features across the stack.",
      responsibilities: ["Build features"],
      requiredSkills: ["TypeScript"],
      niceToHave: [],
      status: "open",
    });
  });

  it("keeps a custom icon instead of the default", () => {
    const result = validateRoleForm(roleForm({ icon: "  code_blocks " }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.icon).toBe("code_blocks");
  });

  it("trims list rows and drops empty placeholder rows", () => {
    const result = validateRoleForm(
      roleForm({
        responsibilities: ["  Ship features  ", "", "   ", "Write tests"],
        niceToHave: [""],
      }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.responsibilities).toEqual(["Ship features", "Write tests"]);
    expect(result.value.niceToHave).toEqual([]);
  });

  it("defaults status to open when the field is absent", () => {
    const result = validateRoleForm(roleForm());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.status).toBe("open");
  });

  it("accepts a posted paused status", () => {
    const result = validateRoleForm(roleForm({ status: "paused" }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.status).toBe("paused");
  });

  it("falls back to open for an unrecognized status value", () => {
    const result = validateRoleForm(roleForm({ status: "archived" }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.status).toBe("open");
  });

  it("rejects a missing title", () => {
    const result = validateRoleForm(roleForm({ title: "   " }));
    expect(result).toEqual({ ok: false, error: "Give the role a title." });
  });

  it("rejects a title with no letters or numbers (slug would be empty)", () => {
    const result = validateRoleForm(roleForm({ title: "***" }));
    expect(result).toEqual({
      ok: false,
      error: "Use a title with at least one letter or number.",
    });
  });

  it("rejects a missing location", () => {
    const result = validateRoleForm(roleForm({ location: "" }));
    expect(result).toEqual({ ok: false, error: "Add a location for the role." });
  });

  it("rejects a missing description", () => {
    const result = validateRoleForm(roleForm({ description: "" }));
    expect(result).toEqual({
      ok: false,
      error: "Add a description for the role.",
    });
  });

  it.each([
    ["empty", ""],
    ["non-numeric", "two"],
    ["zero", "0"],
    ["negative", "-1"],
    ["fractional", "1.5"],
  ])("rejects %s openings", (_label, openings) => {
    const result = validateRoleForm(roleForm({ openings }));
    expect(result).toEqual({
      ok: false,
      error: "Openings must be a whole number of 1 or more.",
    });
  });

  it("accepts a single opening", () => {
    const result = validateRoleForm(roleForm({ openings: "1" }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.openings).toBe(1);
  });
});

describe("status actions", () => {
  it("offers Pause for an open role", () => {
    expect(statusActionFor("open")).toEqual({
      next: "paused",
      label: "Pause",
      icon: "pause",
    });
  });

  it("offers Resume for a paused role", () => {
    expect(statusActionFor("paused")).toEqual({
      next: "open",
      label: "Resume",
      icon: "play_arrow",
    });
  });

  it("offers Resume (reopen) for a closed role", () => {
    expect(statusActionFor("closed")).toEqual({
      next: "open",
      label: "Resume",
      icon: "restart_alt",
    });
  });

  it("closes open and paused roles but never closed ones", () => {
    expect(CLOSE_ACTION.next).toBe("closed");
    expect(canClose("open")).toBe(true);
    expect(canClose("paused")).toBe(true);
    expect(canClose("closed")).toBe(false);
  });

  it("labels every known status", () => {
    expect(ROLE_STATUSES.map(statusLabel)).toEqual(["Open", "Paused", "Closed"]);
  });
});

describe("validateStatusActionForm", () => {
  it("accepts a role id with a known target status", () => {
    const formData = new FormData();
    formData.set("id", "full-stack-engineer");
    formData.set("status", "paused");
    expect(validateStatusActionForm(formData)).toEqual({
      id: "full-stack-engineer",
      status: "paused",
    });
  });

  it("rejects an unknown status", () => {
    const formData = new FormData();
    formData.set("id", "full-stack-engineer");
    formData.set("status", "archived");
    expect(validateStatusActionForm(formData)).toBeNull();
  });

  it("rejects a missing or blank id", () => {
    const missing = new FormData();
    missing.set("status", "closed");
    expect(validateStatusActionForm(missing)).toBeNull();

    const blank = new FormData();
    blank.set("id", "   ");
    blank.set("status", "closed");
    expect(validateStatusActionForm(blank)).toBeNull();
  });

  it("rejects an empty form", () => {
    expect(validateStatusActionForm(new FormData())).toBeNull();
  });
});

describe("formatDbTimestamp", () => {
  it("renders D1 datetime('now') text as date and minutes", () => {
    expect(formatDbTimestamp("2026-10-08 14:23:01")).toBe("2026-10-08 14:23");
  });

  it("tolerates ISO timestamps with T and trailing Z", () => {
    expect(formatDbTimestamp("2026-10-08T14:23:01.000Z")).toBe("2026-10-08 14:23");
  });

  it("returns an empty string for blank input", () => {
    expect(formatDbTimestamp("")).toBe("");
    expect(formatDbTimestamp("   ")).toBe("");
  });
});
