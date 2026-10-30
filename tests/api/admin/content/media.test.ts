import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mutable cookie jar backing the mocked next/headers cookies() store,
// same pattern as tests/app/admin/session-guard.test.ts.
const cookieJar = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: (name: string) =>
      cookieJar.has(name) ? { name, value: cookieJar.get(name)! } : undefined,
  })),
}));

/** Cloudflare context stub, same pattern as tests/api/apply.test.ts. */
const cfState = vi.hoisted(() => ({
  context: null as null | { env: Record<string, unknown> },
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => {
    if (!cfState.context) {
      throw new Error("Cloudflare context is not available");
    }
    return cfState.context;
  },
}));

import { POST } from "@/app/api/admin/content/media/route";
import { createSessionPayload, createSessionToken } from "@/lib/portal/session";

const BASE = "http://localhost:3000/api/admin/content/media";
const SECRET = "media-route-test-secret";

class FakeBucket {
  puts: Array<{ key: string }> = [];
  put(key: string) {
    this.puts.push({ key });
    return Promise.resolve({});
  }
}

function makeFile(name: string, size: number, type = "image/jpeg"): File {
  return new File([new Uint8Array(size)], name, { type });
}

async function signIn(email: string): Promise<void> {
  const payload = createSessionPayload(email);
  const token = await createSessionToken(payload, SECRET);
  cookieJar.set("admin_session", token);
}

function post(form: FormData): Promise<Response> {
  return POST(new Request(BASE, { method: "POST", body: form }));
}

describe("POST /api/admin/content/media", () => {
  beforeEach(() => {
    cookieJar.clear();
    cfState.context = null;
    process.env.SESSION_KEY = SECRET;
  });

  afterEach(() => {
    delete process.env.SESSION_KEY;
  });

  it("rejects when there is no session cookie", async () => {
    const form = new FormData();
    form.set("prefix", "insights");
    form.set("file", makeFile("x.jpg", 10));
    const res = await post(form);
    expect(res.status).toBe(401);
  });

  it("rejects a session signed with the wrong secret", async () => {
    const payload = createSessionPayload("jude.gileara@gmail.com");
    cookieJar.set("admin_session", await createSessionToken(payload, "a-different-secret"));
    const form = new FormData();
    form.set("prefix", "insights");
    form.set("file", makeFile("x.jpg", 10));
    const res = await post(form);
    expect(res.status).toBe(401);
  });

  it("rejects a valid HR session that isn't a content editor", async () => {
    await signIn("hr@gileara.org");
    const form = new FormData();
    form.set("prefix", "insights");
    form.set("file", makeFile("x.jpg", 10));
    const res = await post(form);
    expect(res.status).toBe(403);
  });

  it("rejects an unknown prefix", async () => {
    await signIn("jude.gileara@gmail.com");
    const form = new FormData();
    form.set("prefix", "not-a-real-type");
    form.set("file", makeFile("x.jpg", 10));
    const res = await post(form);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("rejects a missing file", async () => {
    await signIn("jude.gileara@gmail.com");
    const form = new FormData();
    form.set("prefix", "insights");
    const res = await post(form);
    expect(res.status).toBe(400);
  });

  it("rejects a file over the 5MB limit", async () => {
    await signIn("jude.gileara@gmail.com");
    const form = new FormData();
    form.set("prefix", "insights");
    form.set("file", makeFile("big.jpg", 5 * 1024 * 1024 + 1));
    const res = await post(form);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/5MB/);
  });

  it("rejects a disallowed file type", async () => {
    await signIn("jude.gileara@gmail.com");
    const form = new FormData();
    form.set("prefix", "insights");
    form.set("file", makeFile("script.exe", 10, "application/x-msdownload"));
    const res = await post(form);
    expect(res.status).toBe(400);
  });

  it("returns 503 when the Cloudflare context is unavailable", async () => {
    await signIn("jude.gileara@gmail.com");
    const form = new FormData();
    form.set("prefix", "insights");
    form.set("file", makeFile("x.jpg", 10));
    const res = await post(form);
    expect(res.status).toBe(503);
  });

  it("uploads successfully and returns the public serve path", async () => {
    await signIn("jude.gileara@gmail.com");
    const bucket = new FakeBucket();
    cfState.context = { env: { gileara_cms_media: bucket } };
    const form = new FormData();
    form.set("prefix", "playbooks");
    form.set("file", makeFile("photo.png", 10, "image/png"));
    const res = await post(form);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.path).toMatch(/^\/api\/cms\/media\/playbooks\/.+\.png$/);
    expect(bucket.puts).toHaveLength(1);
  });

  it("accepts an image allowed only by extension (no matching MIME type)", async () => {
    await signIn("jude.gileara@gmail.com");
    const bucket = new FakeBucket();
    cfState.context = { env: { gileara_cms_media: bucket } };
    const form = new FormData();
    form.set("prefix", "insights");
    form.set("file", makeFile("cover.webp", 10, "application/octet-stream"));
    const res = await post(form);
    expect(res.status).toBe(200);
  });
});
