import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/apply/route";

const BASE = "http://localhost:3000/api/apply";

function makeForm(overrides: Partial<Record<string, string | File>> = {}) {
  const form = new FormData();
  form.set("name", "Jane Candidate");
  form.set("email", "jane@example.com");
  form.set("position", "frontend");
  form.set(
    "resume",
    new File(["resume content"], "resume.pdf", { type: "application/pdf" }),
  );
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      form.delete(key);
    } else {
      form.set(key, value);
    }
  }
  return form;
}

function post(body: BodyInit) {
  return POST(new Request(BASE, { method: "POST", body }));
}

describe("POST /api/apply", () => {
  it("accepts a complete application", async () => {
    const res = await post(makeForm());
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ success: true });
  });

  it("rejects submissions missing required fields", async () => {
    const res = await post(makeForm({ resume: undefined }));
    expect(res.status).toBe(400);
    const body: unknown = await res.json();
    expect((body as { error: string }).error).toContain("Missing");
  });

  it("rejects resumes over the 5MB limit", async () => {
    const bigFile = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.pdf", {
      type: "application/pdf",
    });
    const res = await post(makeForm({ resume: bigFile }));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toMatchObject({
      error: expect.stringContaining("5MB"),
    });
  });

  it("returns 500 when the body is not valid form data", async () => {
    const res = await post("not-a-form");
    // A plain-text body makes formData() throw; the route should handle it.
    expect([400, 500]).toContain(res.status);
  });
});
