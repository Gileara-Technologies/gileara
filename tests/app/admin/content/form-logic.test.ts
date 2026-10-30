import { describe, expect, it } from "vitest";
import {
  formImplementationSteps,
  validateFaqForm,
  validatePostForm,
  validateScenarioForm,
} from "@/app/admin/content/form-logic";

function formData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value);
  }
  return fd;
}

/** Builds a FormData where some fields are multi-value (dynamic list
 *  rows posted as repeated same-name inputs) via FormData.append. */
function multiFormData(fields: Record<string, string | string[]>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        fd.append(key, v);
      }
    } else {
      fd.set(key, value);
    }
  }
  return fd;
}

describe("validateFaqForm", () => {
  it("accepts a question and answer, defaulting displayOrder to 0", () => {
    const result = validateFaqForm(formData({ question: "Q?", answer: "A." }));
    expect(result).toEqual({ ok: true, value: { question: "Q?", answer: "A.", displayOrder: 0 } });
  });

  it("accepts an explicit displayOrder", () => {
    const result = validateFaqForm(formData({ question: "Q?", answer: "A.", displayOrder: "5" }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.displayOrder).toBe(5);
    }
  });

  it("trims whitespace from question and answer", () => {
    const result = validateFaqForm(formData({ question: "  Q?  ", answer: "  A.  " }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.question).toBe("Q?");
      expect(result.value.answer).toBe("A.");
    }
  });

  it("rejects a missing or blank question", () => {
    expect(validateFaqForm(formData({ answer: "A." }))).toEqual({
      ok: false,
      error: "Give the FAQ a question.",
    });
    expect(validateFaqForm(formData({ question: "   ", answer: "A." })).ok).toBe(false);
  });

  it("rejects a missing or blank answer", () => {
    expect(validateFaqForm(formData({ question: "Q?" }))).toEqual({
      ok: false,
      error: "Add an answer.",
    });
  });

  it("rejects a non-integer displayOrder", () => {
    const result = validateFaqForm(formData({ question: "Q?", answer: "A.", displayOrder: "abc" }));
    expect(result).toEqual({ ok: false, error: "Display order must be a whole number." });
  });

  it("rejects an empty form", () => {
    expect(validateFaqForm(new FormData()).ok).toBe(false);
  });
});

describe("validatePostForm", () => {
  const valid = {
    title: "A Post",
    excerpt: "An excerpt.",
    postDate: "2026-06-01",
    author: "Jude",
    tag: "Growth",
    body: "Body text.",
  };

  it("accepts a fully filled form", () => {
    const result = validatePostForm(formData(valid));
    expect(result).toEqual({
      ok: true,
      value: {
        title: "A Post",
        excerpt: "An excerpt.",
        postDate: "2026-06-01",
        author: "Jude",
        tag: "Growth",
        image: undefined,
        body: "Body text.",
      },
    });
  });

  it("accepts an optional image path", () => {
    const result = validatePostForm(formData({ ...valid, image: "/assets/insights/cover.jpg" }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.image).toBe("/assets/insights/cover.jpg");
    }
  });

  it("rejects a missing title", () => {
    const { title: _title, ...rest } = valid;
    expect(validatePostForm(formData(rest))).toEqual({ ok: false, error: "Give the post a title." });
  });

  it("rejects a missing excerpt", () => {
    const { excerpt: _excerpt, ...rest } = valid;
    expect(validatePostForm(formData(rest))).toEqual({ ok: false, error: "Add an excerpt." });
  });

  it("rejects a missing or unparseable post date", () => {
    expect(validatePostForm(formData({ ...valid, postDate: "" }))).toEqual({
      ok: false,
      error: "Add a valid post date.",
    });
    expect(validatePostForm(formData({ ...valid, postDate: "not a date" }))).toEqual({
      ok: false,
      error: "Add a valid post date.",
    });
  });

  it("rejects a missing author", () => {
    const { author: _author, ...rest } = valid;
    expect(validatePostForm(formData(rest))).toEqual({ ok: false, error: "Add an author." });
  });

  it("rejects an unknown tag", () => {
    expect(validatePostForm(formData({ ...valid, tag: "Not A Real Tag" }))).toEqual({
      ok: false,
      error: "Choose a valid tag.",
    });
  });

  it("rejects a missing body", () => {
    const { body: _body, ...rest } = valid;
    expect(validatePostForm(formData(rest))).toEqual({ ok: false, error: "Write the post body." });
  });

  it("rejects an empty form", () => {
    expect(validatePostForm(new FormData()).ok).toBe(false);
  });
});

describe("formImplementationSteps", () => {
  it("zips paired phase/detail rows by index", () => {
    const fd = multiFormData({
      implementationPhase: ["Diagnose", "Implement"],
      implementationDetail: ["Map the flow", "Build the thing"],
    });
    expect(formImplementationSteps(fd)).toEqual([
      { phase: "Diagnose", detail: "Map the flow" },
      { phase: "Implement", detail: "Build the thing" },
    ]);
  });

  it("drops a row where either phase or detail is blank", () => {
    const fd = multiFormData({
      implementationPhase: ["Diagnose", ""],
      implementationDetail: ["", "Build the thing"],
    });
    expect(formImplementationSteps(fd)).toEqual([]);
  });

  it("handles mismatched array lengths", () => {
    const fd = multiFormData({
      implementationPhase: ["Diagnose", "Implement"],
      implementationDetail: ["Map the flow"],
    });
    expect(formImplementationSteps(fd)).toEqual([{ phase: "Diagnose", detail: "Map the flow" }]);
  });

  it("returns [] for an empty form", () => {
    expect(formImplementationSteps(new FormData())).toEqual([]);
  });
});

describe("validateScenarioForm", () => {
  const validFields = {
    vertical: "Pharmacy",
    headline: "The pharmacy that always knows its stock",
    ghanaContext: "Sales arrive over several channels.",
    painPoints: ["Stock counts live in notebooks"],
    implementationPhase: ["Diagnose"],
    implementationDetail: ["Map the flow"],
    targetOutcomes: ["Reorder alerts arrive before stockouts"],
    packageIds: ["business-operations"],
  };

  it("accepts a fully filled form", () => {
    const result = validateScenarioForm(multiFormData(validFields));
    expect(result).toEqual({
      ok: true,
      value: {
        vertical: "Pharmacy",
        icon: "business_center",
        headline: "The pharmacy that always knows its stock",
        painPoints: ["Stock counts live in notebooks"],
        packageIds: ["business-operations"],
        implementation: [{ phase: "Diagnose", detail: "Map the flow" }],
        targetOutcomes: ["Reorder alerts arrive before stockouts"],
        ghanaContext: "Sales arrive over several channels.",
        image: undefined,
        scenarioStatus: "scenario",
      },
    });
  });

  it("uses an explicit icon when given", () => {
    const result = validateScenarioForm(multiFormData({ ...validFields, icon: "medication" }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.icon).toBe("medication");
    }
  });

  it("accepts an explicit scenarioStatus", () => {
    const result = validateScenarioForm(multiFormData({ ...validFields, scenarioStatus: "pilot" }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.scenarioStatus).toBe("pilot");
    }
  });

  it("falls back to 'scenario' for an invalid scenarioStatus", () => {
    const result = validateScenarioForm(multiFormData({ ...validFields, scenarioStatus: "bogus" }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.scenarioStatus).toBe("scenario");
    }
  });

  it("drops a packageIds value that isn't a real package id", () => {
    const result = validateScenarioForm(
      multiFormData({ ...validFields, packageIds: ["business-operations", "not-a-real-package"] }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.packageIds).toEqual(["business-operations"]);
    }
  });

  it("accepts an optional image path", () => {
    const result = validateScenarioForm(multiFormData({ ...validFields, image: "/assets/photo.jpg" }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.image).toBe("/assets/photo.jpg");
    }
  });

  it("rejects a missing vertical", () => {
    const { vertical: _vertical, ...rest } = validFields;
    expect(validateScenarioForm(multiFormData(rest))).toEqual({
      ok: false,
      error: "Give the playbook a vertical (e.g. Pharmacy).",
    });
  });

  it("rejects a missing headline", () => {
    const { headline: _headline, ...rest } = validFields;
    expect(validateScenarioForm(multiFormData(rest))).toEqual({ ok: false, error: "Add a headline." });
  });

  it("rejects a missing ghanaContext", () => {
    const { ghanaContext: _ghanaContext, ...rest } = validFields;
    expect(validateScenarioForm(multiFormData(rest))).toEqual({
      ok: false,
      error: "Add the local-context paragraph.",
    });
  });

  it("rejects when painPoints is empty", () => {
    const { painPoints: _painPoints, ...rest } = validFields;
    expect(validateScenarioForm(multiFormData(rest))).toEqual({
      ok: false,
      error: "Add at least one pain point.",
    });
  });

  it("rejects when there are no complete implementation steps", () => {
    const { implementationPhase: _p, implementationDetail: _d, ...rest } = validFields;
    expect(validateScenarioForm(multiFormData(rest))).toEqual({
      ok: false,
      error: "Add at least one implementation step with both a phase and a detail.",
    });
  });

  it("rejects when targetOutcomes is empty", () => {
    const { targetOutcomes: _targetOutcomes, ...rest } = validFields;
    expect(validateScenarioForm(multiFormData(rest))).toEqual({
      ok: false,
      error: "Add at least one target outcome.",
    });
  });

  it("rejects an empty form", () => {
    expect(validateScenarioForm(new FormData()).ok).toBe(false);
  });
});
