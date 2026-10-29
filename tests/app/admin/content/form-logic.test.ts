import { describe, expect, it } from "vitest";
import { validateFaqForm, validatePostForm } from "@/app/admin/content/form-logic";

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
