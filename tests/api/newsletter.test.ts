import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/newsletter/route";

/**
 * Validates the newsletter subscription endpoint:
 *  - 200 with valid email and Resend returns 200
 *  - 200 with valid email when Resend returns 422 (already subscribed)
 *  - 400 with invalid email
 *  - 400 with missing email
 *  - 400 with malformed JSON
 *  - 200 silently when honeypot is filled (no Resend call)
 *  - 404 when feature is disabled (NEWSLETTER_ENABLED != "1")
 *  - 503 when env vars are missing
 *  - 502 when Resend returns other 4xx/5xx
 */

// Mock the global fetch so we can capture the Resend call without
// hitting the network. The route uses `fetch(...)` directly.
const fetchMock = vi.fn();

describe("POST /api/newsletter", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    process.env.NEWSLETTER_ENABLED = "1";
    process.env.RESEND_API_KEY = "re_test_xxxxxxxxxxxx";
    process.env.RESEND_AUDIENCE_ID = "aud_test_id";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  function makeRequest(body: unknown): Request {
    return new Request("http://localhost/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("subscribes a valid email and returns 200", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: "abc" }), { status: 200 }),
    );

    const res = await POST(makeRequest({ email: "hello@example.com" }));
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/audiences/aud_test_id/contacts");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      email: "hello@example.com",
      unsubscribed: false,
    });
  });

  it("normalises email to lowercase before sending to Resend", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: "abc" }), { status: 200 }),
    );

    await POST(makeRequest({ email: "  Hello@Example.COM  " }));
    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body).email).toBe("hello@example.com");
  });

  it("treats Resend 422 (already subscribed) as success", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "exists" }), { status: 422 }),
    );

    const res = await POST(makeRequest({ email: "hello@example.com" }));
    expect(res.status).toBe(200);
    const data = (await res.json()) as { alreadySubscribed?: boolean };
    expect(data.alreadySubscribed).toBe(true);
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 400 for missing email", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed JSON body", async () => {
    const req = new Request("http://localhost/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json{",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("silently accepts when honeypot is filled (no Resend call)", async () => {
    const res = await POST(
      makeRequest({ email: "bot@spam.example", honeypot: "Acme Inc" }),
    );
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 404 when NEWSLETTER_ENABLED != '1'", async () => {
    process.env.NEWSLETTER_ENABLED = "0";
    const res = await POST(makeRequest({ email: "hello@example.com" }));
    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 404 when NEWSLETTER_ENABLED is unset", async () => {
    delete process.env.NEWSLETTER_ENABLED;
    const res = await POST(makeRequest({ email: "hello@example.com" }));
    expect(res.status).toBe(404);
  });

  it("returns 503 when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const res = await POST(makeRequest({ email: "hello@example.com" }));
    expect(res.status).toBe(503);
  });

  it("returns 503 when RESEND_AUDIENCE_ID is missing", async () => {
    delete process.env.RESEND_AUDIENCE_ID;
    const res = await POST(makeRequest({ email: "hello@example.com" }));
    expect(res.status).toBe(503);
  });

  it("returns 502 when Resend returns a 5xx", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("internal", { status: 500 }),
    );
    const res = await POST(makeRequest({ email: "hello@example.com" }));
    expect(res.status).toBe(502);
  });
});
