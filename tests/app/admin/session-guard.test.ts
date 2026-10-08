import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mutable cookie jar backing the mocked next/headers cookies() store.
const cookieJar = new Map<string, string>();
const redirects: string[] = [];

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: (name: string) =>
      cookieJar.has(name) ? { name, value: cookieJar.get(name)! } : undefined,
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    redirects.push(url);
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

import { ADMIN_SESSION_COOKIE, requireAdminSession } from "@/app/admin/session-guard";
import { createSessionPayload, createSessionToken } from "@/lib/portal/session";

const SECRET = "guard-test-secret";

describe("requireAdminSession", () => {
  beforeEach(() => {
    cookieJar.clear();
    redirects.length = 0;
    process.env.SESSION_KEY = SECRET;
  });

  afterEach(() => {
    delete process.env.SESSION_KEY;
    vi.restoreAllMocks();
  });

  it("redirects to the login page when SESSION_KEY is missing", async () => {
    delete process.env.SESSION_KEY;
    const token = await createSessionPayload("hr@gileara.org");
    cookieJar.set(ADMIN_SESSION_COOKIE, await createSessionToken(token, SECRET));

    await expect(requireAdminSession()).rejects.toThrow("NEXT_REDIRECT:/admin/login");
    expect(redirects).toEqual(["/admin/login"]);
  });

  it("redirects when the session cookie is absent", async () => {
    await expect(requireAdminSession()).rejects.toThrow("NEXT_REDIRECT:/admin/login");
    expect(redirects).toEqual(["/admin/login"]);
  });

  it("redirects when the token is garbage", async () => {
    cookieJar.set(ADMIN_SESSION_COOKIE, "not-a-real-token");

    await expect(requireAdminSession()).rejects.toThrow("NEXT_REDIRECT:/admin/login");
    expect(redirects).toEqual(["/admin/login"]);
  });

  it("redirects when the token was signed with a different secret", async () => {
    const payload = createSessionPayload("hr@gileara.org");
    cookieJar.set(ADMIN_SESSION_COOKIE, await createSessionToken(payload, "other-secret"));

    await expect(requireAdminSession()).rejects.toThrow("NEXT_REDIRECT:/admin/login");
    expect(redirects).toEqual(["/admin/login"]);
  });

  it("redirects when the token is expired", async () => {
    const expired = { email: "hr@gileara.org", exp: Math.floor(Date.now() / 1000) - 60 };
    cookieJar.set(ADMIN_SESSION_COOKIE, await createSessionToken(expired, SECRET));

    await expect(requireAdminSession()).rejects.toThrow("NEXT_REDIRECT:/admin/login");
    expect(redirects).toEqual(["/admin/login"]);
  });

  it("returns the payload for a valid session", async () => {
    const payload = createSessionPayload("  HR.Gileara@Gileara.ORG  ");
    cookieJar.set(ADMIN_SESSION_COOKIE, await createSessionToken(payload, SECRET));

    const result = await requireAdminSession();
    expect(result.email).toBe("hr.gileara@gileara.org");
    expect(result.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    expect(redirects).toEqual([]);
  });
});
