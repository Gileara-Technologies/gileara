import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/apply/route";

const BASE = "http://localhost:3000/api/apply";

/**
 * Cloudflare context stub. `null` reproduces the real behavior outside
 * Workers (getCloudflareContext throws), which is what most tests
 * exercise; tests that need a context install one.
 */
const cfState = vi.hoisted(() => ({
  context: null as null | {
    env: unknown;
    ctx: { waitUntil: (promise: Promise<unknown>) => void };
  },
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => {
    if (!cfState.context) {
      throw new Error("Cloudflare context is not available");
    }
    return cfState.context;
  },
}));

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

  // Regression: the notification used to be a floating promise, which the
  // Workers runtime cancelled as soon as the response was returned, so no
  // HR email was ever sent. It must be handed to ctx.waitUntil.
  it("hands the HR notification to ctx.waitUntil instead of dropping it", async () => {
    const waitUntil = vi.fn();
    cfState.context = { env: {}, ctx: { waitUntil } };
    const previous = process.env.APPLICATION_NOTIFY_ENABLED;
    // Force the offline early-return path; this test is about the hand-off,
    // not the Resend call.
    process.env.APPLICATION_NOTIFY_ENABLED = "0";

    try {
      const res = await post(makeForm());
      expect(res.status).toBe(200);
      expect(waitUntil).toHaveBeenCalledTimes(1);
      const passed = waitUntil.mock.calls[0][0] as Promise<unknown>;
      expect(passed).toBeInstanceOf(Promise);
      await expect(passed).resolves.toBe(false);
    } finally {
      cfState.context = null;
      if (previous === undefined) {
        delete process.env.APPLICATION_NOTIFY_ENABLED;
      } else {
        process.env.APPLICATION_NOTIFY_ENABLED = previous;
      }
    }
  });
});
