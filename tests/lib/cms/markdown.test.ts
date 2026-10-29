import { describe, expect, it } from "vitest";
import { countWords, parsePostBody } from "@/lib/cms/markdown";

describe("parsePostBody", () => {
  it("parses a single paragraph", () => {
    expect(parsePostBody("Just one paragraph of text.")).toEqual([
      { type: "paragraph", text: "Just one paragraph of text." },
    ]);
  });

  it("parses multiple paragraphs separated by a blank line", () => {
    const body = "First paragraph.\n\nSecond paragraph.";
    expect(parsePostBody(body)).toEqual([
      { type: "paragraph", text: "First paragraph." },
      { type: "paragraph", text: "Second paragraph." },
    ]);
  });

  it("collapses internal line breaks within one paragraph to spaces", () => {
    const body = "Line one\nline two\nline three.";
    expect(parsePostBody(body)).toEqual([
      { type: "paragraph", text: "Line one line two line three." },
    ]);
  });

  it("treats a single line starting with '## ' as a heading", () => {
    const body = "## The quote is not the price";
    expect(parsePostBody(body)).toEqual([
      { type: "heading", text: "The quote is not the price" },
    ]);
  });

  it("parses headings and paragraphs together in order", () => {
    const body = [
      "Intro paragraph.",
      "",
      "## First heading",
      "",
      "Body after the heading.",
      "",
      "## Second heading",
      "",
      "Final paragraph.",
    ].join("\n");
    expect(parsePostBody(body)).toEqual([
      { type: "paragraph", text: "Intro paragraph." },
      { type: "heading", text: "First heading" },
      { type: "paragraph", text: "Body after the heading." },
      { type: "heading", text: "Second heading" },
      { type: "paragraph", text: "Final paragraph." },
    ]);
  });

  it("parses a ::: cta ... ::: fence into a cta block", () => {
    const body = [
      "::: cta",
      "Every Gileara package publishes its full tier matrix up front.",
      "href: /services",
      "label: See the packages",
      ":::",
    ].join("\n");
    expect(parsePostBody(body)).toEqual([
      {
        type: "cta",
        text: "Every Gileara package publishes its full tier matrix up front.",
        href: "/services",
        label: "See the packages",
      },
    ]);
  });

  it("is case-insensitive and whitespace-tolerant on the cta fence", () => {
    const body = [":::CTA", "Text here.", "HREF:   /contact", "Label:See pricing", ":::"].join("\n");
    expect(parsePostBody(body)).toEqual([
      { type: "cta", text: "Text here.", href: "/contact", label: "See pricing" },
    ]);
  });

  it("drops a cta fence missing href or label rather than failing the whole post", () => {
    const body = [
      "Paragraph before.",
      "",
      ":::cta",
      "Text with no href.",
      "label: Click me",
      ":::",
      "",
      "Paragraph after.",
    ].join("\n");
    expect(parsePostBody(body)).toEqual([
      { type: "paragraph", text: "Paragraph before." },
      { type: "paragraph", text: "Paragraph after." },
    ]);
  });

  it("supports multiple text lines inside a cta fence, joined with spaces", () => {
    const body = ["::: cta", "Line one of the pitch.", "Line two of the pitch.", "href: /x", "label: Go", ":::"].join(
      "\n",
    );
    expect(parsePostBody(body)[0]).toEqual({
      type: "cta",
      text: "Line one of the pitch. Line two of the pitch.",
      href: "/x",
      label: "Go",
    });
  });

  it("returns [] for an empty or whitespace-only body", () => {
    expect(parsePostBody("")).toEqual([]);
    expect(parsePostBody("   \n\n  ")).toEqual([]);
  });

  it("collapses extra blank lines between chunks", () => {
    const body = "First.\n\n\n\nSecond.";
    expect(parsePostBody(body)).toEqual([
      { type: "paragraph", text: "First." },
      { type: "paragraph", text: "Second." },
    ]);
  });

  it("normalizes CRLF line endings", () => {
    const body = "First.\r\n\r\nSecond.";
    expect(parsePostBody(body)).toEqual([
      { type: "paragraph", text: "First." },
      { type: "paragraph", text: "Second." },
    ]);
  });

  it("round-trips the exact shape of a real seeded post's content", () => {
    const body = [
      "Ask any business what surprised them most.",
      "",
      "## The quote is not the price",
      "",
      "Software has two costs: building it and keeping it alive.",
      "",
      "::: cta",
      "Every Gileara package publishes its full tier matrix up front.",
      "href: /services",
      "label: See the packages",
      ":::",
    ].join("\n");
    const result = parsePostBody(body);
    expect(result).toHaveLength(4);
    expect(result[0].type).toBe("paragraph");
    expect(result[1].type).toBe("heading");
    expect(result[2].type).toBe("paragraph");
    expect(result[3].type).toBe("cta");
  });
});

describe("countWords", () => {
  it("counts words across plain paragraphs", () => {
    expect(countWords("one two three")).toBe(3);
  });

  it("strips heading markers and cta fence lines before counting", () => {
    const body = ["## A heading here", "", "Four real words only.", "", "::: cta", "href: /x", "label: Go", ":::"].join(
      "\n",
    );
    // "A heading here" (3) + "Four real words only." (4) = 7
    expect(countWords(body)).toBe(7);
  });

  it("returns 0 for an empty body", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
  });
});
