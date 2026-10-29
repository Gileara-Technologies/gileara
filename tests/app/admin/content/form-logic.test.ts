import { describe, expect, it } from "vitest";
import { validateFaqForm } from "@/app/admin/content/form-logic";

function formData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value);
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
