import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_FROM,
  buildApplicationEmail,
  buildCandidateConfirmationEmail,
  isApplicationNotifyEnabled,
  isCandidateConfirmationEnabled,
  notifyCandidateByEmail,
  notifyHrByEmail,
  resolveHrRecipient,
  type ApplicationEmailInput,
  type FetchLike,
} from "@/lib/portal/notify";

/**
 * Phase 6 HR notification (docs/PORTAL-PLAN.md):
 *  - buildApplicationEmail: subject/body content, empty optional fields
 *    omitted, plain wording (no em dashes / banned AI words)
 *  - resolveHrRecipient: APPLICATION_NOTIFY_EMAIL → CONTACT_EMAIL → none
 *  - gating: APPLICATION_NOTIFY_ENABLED === "0" disables, default enabled
 *  - notifyHrByEmail with an injected fake fetch: success, non-2xx, throw —
 *    never rejects upward, never touches the network
 */

const FULL_APP: ApplicationEmailInput = {
  position: "Frontend Engineer",
  name: "Jane Candidate",
  email: "jane@example.com",
  phone: "+233 20 123 4567",
  coverLetter: "I have spent four years building accessible interfaces.",
  whyThisRole: "I want to work with a team that ships for real users.",
  submittedAt: "2026-02-14T10:30:00.000Z",
};

describe("buildApplicationEmail", () => {
  it("uses the design-doc subject format", () => {
    const { subject } = buildApplicationEmail(FULL_APP);
    expect(subject).toBe("New application: Jane Candidate for Frontend Engineer");
  });

  it("includes every required field in the body", () => {
    const { text } = buildApplicationEmail(FULL_APP);
    expect(text).toContain("You received a new application for Frontend Engineer.");
    expect(text).toContain("Candidate: Jane Candidate");
    expect(text).toContain("Email: jane@example.com");
    expect(text).toContain("Phone: +233 20 123 4567");
    expect(text).toContain("Submitted: 2026-02-14T10:30:00.000Z");
    expect(text).toContain("Cover letter:");
    expect(text).toContain("I have spent four years building accessible interfaces.");
    expect(text).toContain("Why this role:");
    expect(text).toContain("I want to work with a team that ships for real users.");
    expect(text).toContain("Sent from Gileara Careers Portal");
  });

  it("omits phone, cover letter and why-this-role when they are empty", () => {
    const { text } = buildApplicationEmail({
      position: "Product Manager",
      name: "Kofi Applicant",
      email: "kofi@example.com",
      phone: "  ",
      coverLetter: "",
      whyThisRole: undefined,
      submittedAt: "2026-03-01T08:00:00.000Z",
    });
    expect(text).not.toContain("Phone:");
    expect(text).not.toContain("Cover letter:");
    expect(text).not.toContain("Why this role:");
    // Required lines still present.
    expect(text).toContain("Candidate: Kofi Applicant");
    expect(text).toContain("Email: kofi@example.com");
    expect(text).toContain("Submitted: 2026-03-01T08:00:00.000Z");
  });

  it("stays in plain human voice: no em dashes or banned AI words", () => {
    const { subject, text } = buildApplicationEmail(FULL_APP);
    const combined = `${subject}\n${text}`.toLowerCase();
    expect(combined).not.toContain("—");
    const banned = [
      "delve",
      "leverage",
      "seamless",
      "robust",
      "game-changer",
      "revolutioniz",
      "unlock",
      "elevate",
      "testament",
      "fast-paced",
      "in conclusion",
    ];
    for (const word of banned) {
      expect(combined).not.toContain(word);
    }
  });
});

describe("resolveHrRecipient", () => {
  it("prefers APPLICATION_NOTIFY_EMAIL over CONTACT_EMAIL", () => {
    expect(
      resolveHrRecipient({
        APPLICATION_NOTIFY_EMAIL: "hr@gileara.org",
        CONTACT_EMAIL: "tech.gileara@gmail.com",
      }),
    ).toBe("hr@gileara.org");
  });

  it("falls back to CONTACT_EMAIL when APPLICATION_NOTIFY_EMAIL is unset", () => {
    expect(
      resolveHrRecipient({ CONTACT_EMAIL: "tech.gileara@gmail.com" }),
    ).toBe("tech.gileara@gmail.com");
  });

  it("returns null when neither is set", () => {
    expect(resolveHrRecipient({})).toBeNull();
    expect(
      resolveHrRecipient({ APPLICATION_NOTIFY_EMAIL: "   ", CONTACT_EMAIL: "" }),
    ).toBeNull();
  });
});

describe("isApplicationNotifyEnabled", () => {
  it("is enabled by default and when set to anything but 0", () => {
    expect(isApplicationNotifyEnabled({})).toBe(true);
    expect(isApplicationNotifyEnabled({ APPLICATION_NOTIFY_ENABLED: "1" })).toBe(
      true,
    );
  });

  it("is disabled only when APPLICATION_NOTIFY_ENABLED === '0'", () => {
    expect(
      isApplicationNotifyEnabled({ APPLICATION_NOTIFY_ENABLED: "0" }),
    ).toBe(false);
  });
});

describe("buildCandidateConfirmationEmail", () => {
  it("opens with the wording the candidate already saw on screen", () => {
    const { subject, text } = buildCandidateConfirmationEmail(FULL_APP);
    expect(subject).toBe("We received your application for Frontend Engineer");
    expect(text).toContain("Hi Jane Candidate,");
    expect(text).toContain(
      "We received your application for Frontend Engineer.",
    );
    // Must agree with CONFIRMATION_MESSAGE in src/app/api/apply/route.ts.
    expect(text).toContain(
      "We'll review it and reach out within 5 business days.",
    );
    expect(text).toContain("Submitted: 2026-02-14T10:30:00.000Z");
    expect(text).toContain("Sent from Gileara Careers Portal");
  });

  it("does not echo the cover letter, phone number or address back", () => {
    const { text } = buildCandidateConfirmationEmail(FULL_APP);
    expect(text).not.toContain("four years building accessible interfaces");
    expect(text).not.toContain("+233");
    expect(text).not.toContain("jane@example.com");
  });

  it("stays in plain human voice: no em dashes or banned AI words", () => {
    const { subject, text } = buildCandidateConfirmationEmail(FULL_APP);
    const combined = `${subject}\n${text}`.toLowerCase();
    expect(combined).not.toContain("—");
    const banned = [
      "delve",
      "leverage",
      "seamless",
      "robust",
      "game-changer",
      "revolutioniz",
      "unlock",
      "elevate",
      "testament",
      "fast-paced",
      "in conclusion",
    ];
    for (const word of banned) {
      expect(combined).not.toContain(word);
    }
  });
});

describe("isCandidateConfirmationEnabled", () => {
  it("is enabled by default and when set to anything but 0", () => {
    expect(isCandidateConfirmationEnabled({})).toBe(true);
    expect(
      isCandidateConfirmationEnabled({ APPLICATION_CONFIRM_ENABLED: "1" }),
    ).toBe(true);
  });

  it("is disabled only when APPLICATION_CONFIRM_ENABLED === '0'", () => {
    expect(
      isCandidateConfirmationEnabled({ APPLICATION_CONFIRM_ENABLED: "0" }),
    ).toBe(false);
  });
});

describe("notifyCandidateByEmail", () => {
  const originalEnv = { ...process.env };
  const fetchMock = vi.fn<FetchLike>();
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock.mockReset();
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    process.env = { ...originalEnv };
    delete process.env.APPLICATION_CONFIRM_ENABLED;
    delete process.env.RESEND_FROM;
    process.env.RESEND_API_KEY = "re_test_xxxxxxxxxxxx";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  it("addresses the receipt to the candidate's submitted email on 2xx", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));

    const sent = await notifyCandidateByEmail(FULL_APP, {
      fetchImpl: fetchMock,
    });

    expect(sent).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init?.method).toBe("POST");
    const payload = JSON.parse(String(init?.body)) as {
      from: string;
      to: string[];
      subject: string;
      text: string;
    };
    expect(payload.to).toEqual(["jane@example.com"]);
    expect(payload.from).toBe(DEFAULT_FROM);
    expect(payload.subject).toBe(
      "We received your application for Frontend Engineer",
    );
    expect(payload.text).toContain("Hi Jane Candidate,");
  });

  it("honours an explicit recipient and RESEND_FROM override", async () => {
    process.env.RESEND_FROM = "Gileara Careers <careers@gileara.org>";
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));

    const sent = await notifyCandidateByEmail(FULL_APP, {
      fetchImpl: fetchMock,
      recipient: "qa@gileara.org",
    });

    expect(sent).toBe(true);
    const [, init] = fetchMock.mock.calls[0];
    const payload = JSON.parse(String(init?.body)) as {
      from: string;
      to: string[];
    };
    expect(payload.to).toEqual(["qa@gileara.org"]);
    expect(payload.from).toBe("Gileara Careers <careers@gileara.org>");
  });

  it("resolves false on a non-2xx response without throwing upward", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("upstream exploded", {
        status: 500,
        statusText: "Internal Server Error",
      }),
    );

    await expect(
      notifyCandidateByEmail(FULL_APP, { fetchImpl: fetchMock }),
    ).resolves.toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[apply] Candidate confirmation failed"),
      expect.anything(),
    );
  });

  it("resolves false when fetch throws without rejecting upward", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));

    await expect(
      notifyCandidateByEmail(FULL_APP, { fetchImpl: fetchMock }),
    ).resolves.toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(
      "[apply] Candidate confirmation failed:",
      expect.anything(),
    );
  });

  it("skips and resolves false when APPLICATION_CONFIRM_ENABLED === '0'", async () => {
    process.env.APPLICATION_CONFIRM_ENABLED = "0";

    await expect(
      notifyCandidateByEmail(FULL_APP, { fetchImpl: fetchMock }),
    ).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("APPLICATION_CONFIRM_ENABLED=0"),
    );
  });

  it("skips when the application carries no usable email address", async () => {
    await expect(
      notifyCandidateByEmail(
        { ...FULL_APP, email: "   " },
        { fetchImpl: fetchMock },
      ),
    ).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("no email address"),
    );
  });

  it("skips when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;

    await expect(
      notifyCandidateByEmail(FULL_APP, { fetchImpl: fetchMock }),
    ).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("[apply] Candidate confirmation skipped"),
    );
  });
});

describe("notifyHrByEmail", () => {
  const originalEnv = { ...process.env };
  const fetchMock = vi.fn<FetchLike>();
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock.mockReset();
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    process.env = { ...originalEnv };
    delete process.env.APPLICATION_NOTIFY_EMAIL;
    delete process.env.APPLICATION_NOTIFY_ENABLED;
    delete process.env.RESEND_FROM;
    process.env.CONTACT_EMAIL = "tech.gileara@gmail.com";
    process.env.RESEND_API_KEY = "re_test_xxxxxxxxxxxx";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  it("posts the built email to Resend and resolves true on 2xx", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));

    const sent = await notifyHrByEmail(FULL_APP, { fetchImpl: fetchMock });

    expect(sent).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toMatchObject({
      Authorization: "Bearer re_test_xxxxxxxxxxxx",
      "Content-Type": "application/json",
    });
    const payload = JSON.parse(String(init?.body)) as {
      from: string;
      to: string[];
      subject: string;
      text: string;
    };
    expect(payload.from).toBe(DEFAULT_FROM);
    expect(payload.to).toEqual(["tech.gileara@gmail.com"]);
    expect(payload.subject).toBe(
      "New application: Jane Candidate for Frontend Engineer",
    );
    expect(payload.text).toContain("Candidate: Jane Candidate");
  });

  it("honours APPLICATION_NOTIFY_EMAIL and RESEND_FROM overrides", async () => {
    process.env.APPLICATION_NOTIFY_EMAIL = "hr@gileara.org";
    process.env.RESEND_FROM = "Gileara Careers <careers@gileara.org>";
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));

    const sent = await notifyHrByEmail(FULL_APP, { fetchImpl: fetchMock });

    expect(sent).toBe(true);
    const [, init] = fetchMock.mock.calls[0];
    const payload = JSON.parse(String(init?.body)) as {
      from: string;
      to: string[];
    };
    expect(payload.to).toEqual(["hr@gileara.org"]);
    expect(payload.from).toBe("Gileara Careers <careers@gileara.org>");
  });

  it("resolves false on a non-2xx response without throwing upward", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("upstream exploded", { status: 500, statusText: "Internal Server Error" }),
    );

    await expect(notifyHrByEmail(FULL_APP, { fetchImpl: fetchMock })).resolves.toBe(
      false,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[apply] HR email notification failed"),
      expect.anything(),
    );
  });

  it("resolves false when fetch throws without rejecting upward", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));

    await expect(
      notifyHrByEmail(FULL_APP, { fetchImpl: fetchMock }),
    ).resolves.toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(
      "[apply] HR email notification failed:",
      expect.anything(),
    );
  });

  it("skips and resolves false when APPLICATION_NOTIFY_ENABLED === '0'", async () => {
    process.env.APPLICATION_NOTIFY_ENABLED = "0";

    await expect(
      notifyHrByEmail(FULL_APP, { fetchImpl: fetchMock }),
    ).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("skips when no recipient is configured (no env fallback either)", async () => {
    delete process.env.CONTACT_EMAIL;

    await expect(
      notifyHrByEmail(FULL_APP, { fetchImpl: fetchMock }),
    ).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("skips when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;

    await expect(
      notifyHrByEmail(FULL_APP, { fetchImpl: fetchMock }),
    ).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("[apply] HR email notification skipped"),
    );
  });
});
