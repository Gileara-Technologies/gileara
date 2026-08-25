import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import proxy from "@/lib/request-proxy";

vi.mock("@/maintenance-routes", () => ({
  default: ["/insights"],
}));

const BASE = "http://localhost:3000";

function req(path: string, headers?: Record<string, string>) {
  return new NextRequest(new URL(path, BASE), { headers });
}

describe("proxy", () => {
  beforeEach(() => {
    vi.stubEnv("MAINTENANCE_MODE", "");
    vi.stubEnv("MAINTENANCE_BYPASS_SECRET", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("adds security headers to regular responses", () => {
    const res = proxy(req("/"));
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(
      res.headers.get("Strict-Transport-Security"),
    ).toContain("max-age=63072000");
    expect(res.headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
  });

  it("does not touch exempt paths with maintenance markers", () => {
    const res = proxy(req("/favicon.ico"));
    expect(res.headers.get("X-Robots-Tag")).toBeNull();
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
  });

  it("rewrites routes under maintenance with a noindex marker", () => {
    const res = proxy(req("/insights"));
    expect(res.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("matches nested routes under a maintenance route", () => {
    const res = proxy(req("/insights/building-scalable-mvps"));
    expect(res.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("leaves unrelated routes alone when only some routes are down", () => {
    const res = proxy(req("/careers"));
    expect(res.headers.get("X-Robots-Tag")).toBeNull();
  });

  describe("full-site maintenance mode", () => {
    beforeEach(() => {
      vi.stubEnv("MAINTENANCE_MODE", "1");
    });

    it("rewrites page requests to /maintenance", () => {
      const res = proxy(req("/anything"));
      expect(res.headers.get("X-Robots-Tag")).toBe("noindex");
    });

    it("returns 503 JSON for API requests", async () => {
      const res = proxy(req("/api/contact"));
      expect(res.status).toBe(503);
      await expect(res.json()).resolves.toMatchObject({
        error: expect.stringContaining("maintenance"),
      });
    });
  });

  describe("maintenance bypass", () => {
    const SECRET = "test-bypass-secret";

    beforeEach(() => {
      vi.stubEnv("MAINTENANCE_MODE", "1");
      vi.stubEnv("MAINTENANCE_BYPASS_SECRET", SECRET);
    });

    it("exchanges a valid __mbp query param for an httpOnly cookie and clean redirect", () => {
      const res = proxy(req("/careers?__mbp=test-bypass-secret"));
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe(`${BASE}/careers`);
      const cookie = res.headers.get("set-cookie") ?? "";
      expect(cookie).toContain("__maintenance_bypass=test-bypass-secret");
      expect(cookie).toContain("HttpOnly");
    });

    it("rejects an invalid bypass param", () => {
      const res = proxy(req("/careers?__mbp=wrong"));
      expect(res.headers.get("X-Robots-Tag")).toBe("noindex");
      expect(res.headers.get("set-cookie")).toBeNull();
    });

    it("lets requests with a valid bypass cookie through", () => {
      const res = proxy(
        req("/careers", { cookie: `__maintenance_bypass=${SECRET}` }),
      );
      expect(res.headers.get("X-Robots-Tag")).toBeNull();
      expect(res.headers.get("set-cookie")).toBeNull();
    });
  });
});
