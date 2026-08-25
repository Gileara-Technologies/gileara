import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/schedule/route";

const BASE = "http://localhost:3000/api/schedule";

function post(body: string) {
  return POST(
    new Request(BASE, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }),
  );
}

describe("GET /api/schedule healthcheck", () => {
  beforeEach(() => {
    vi.stubEnv("GOOGLE_CLIENT_EMAIL", "");
    vi.stubEnv("GOOGLE_PRIVATE_KEY", "");
    vi.stubEnv("GOOGLE_CALENDAR_ID", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reports which env vars are configured", async () => {
    const res = await GET();
    expect(res.headers.get("content-type")).toContain("application/json");
    await expect(res.json()).resolves.toEqual({
      ok: true,
      email: false,
      key: false,
      cal: false,
    });
  });
});

describe("POST /api/schedule", () => {
  beforeEach(() => {
    vi.stubEnv("GOOGLE_CLIENT_EMAIL", "");
    vi.stubEnv("GOOGLE_PRIVATE_KEY", "");
    vi.stubEnv("GOOGLE_CALENDAR_ID", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("fails gracefully when server config is incomplete", async () => {
    const payload = JSON.stringify({
      name: "Jane",
      email: "jane@example.com",
      goal: "software",
      message: "hi",
      date: "2026-07-01",
      time: "10:00",
    });

    const res = await post(payload);
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toMatchObject({
      success: false,
      message: "Server configuration incomplete",
    });
  });

  it("returns a handled 500 for invalid JSON bodies", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toMatchObject({ success: false });
  });
});
