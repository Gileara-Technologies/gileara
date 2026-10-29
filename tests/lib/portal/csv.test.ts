import { describe, expect, it } from "vitest";
import { csvField, csvRow } from "@/lib/portal/csv";

describe("csvField", () => {
  it("passes plain values through untouched", () => {
    expect(csvField("Jane Doe")).toBe("Jane Doe");
    expect(csvField(42)).toBe("42");
  });

  it("renders null and undefined as an empty field", () => {
    expect(csvField(null)).toBe("");
    expect(csvField(undefined)).toBe("");
  });

  it("quotes a value containing a comma", () => {
    expect(csvField("Accra, Ghana")).toBe('"Accra, Ghana"');
  });

  it("quotes and doubles internal quotes", () => {
    expect(csvField('She said "hello"')).toBe('"She said ""hello"""');
  });

  it("quotes a value containing a newline", () => {
    expect(csvField("line one\nline two")).toBe('"line one\nline two"');
  });
});

describe("csvRow", () => {
  it("joins fields with commas and terminates with CRLF", () => {
    expect(csvRow(["a", "b", "c"])).toBe("a,b,c\r\n");
  });

  it("quotes only the fields that need it", () => {
    expect(csvRow(["Jane", "Accra, Ghana", 7])).toBe('Jane,"Accra, Ghana",7\r\n');
  });

  it("renders an all-empty row as bare commas", () => {
    expect(csvRow([null, undefined, ""])).toBe(",,\r\n");
  });
});
