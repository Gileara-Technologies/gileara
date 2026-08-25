import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/contact/route";

const BASE = "http://localhost:3000/api/contact";

describe("POST /api/contact", () => {
  it("redirects back to the contact section with a success flag", async () => {
    const form = new FormData();
    form.set("name", "Jane");
    form.set("email", "jane@example.com");
    form.set("goal", "software");
    form.set("message", "Hello!");

    const res = await POST(
      new Request(BASE, { method: "POST", body: form }),
    );

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/?success=true#contact",
    );
  });

  it("keeps the redirect on the request origin", async () => {
    const form = new FormData();
    form.set("name", "Jane");

    const res = await POST(
      new Request("https://gileara.com/api/contact", {
        method: "POST",
        body: form,
      }),
    );

    expect(res.headers.get("location")).toBe(
      "https://gileara.com/?success=true#contact",
    );
  });

  it("returns a JSON 500 for unparseable bodies instead of crashing", async () => {
    const res = await POST(
      new Request(BASE, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "}{ broken",
      }),
    );
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toMatchObject({
      error: "Failed to process request",
    });
  });
});
