/**
 * Email notifications for careers applications (Phase 6 HR notification,
 * Phase 7 candidate receipt — docs/PORTAL-PLAN.md). Sends through the Resend
 * HTTP API with a native `fetch`, mirroring the pattern in
 * src/app/api/newsletter/route.ts — no SDK, no new dependencies.
 *
 * Design:
 *  - `buildApplicationEmail(app)` and `buildCandidateConfirmationEmail(app)`
 *    are PURE: they only map an application to `{ subject, text }` and touch
 *    nothing else. Tests assert their output directly, no network involved.
 *  - `notifyHrByEmail(app, opts)` performs the HR POST;
 *    `notifyCandidateByEmail(app, opts)` posts the candidate receipt. Both
 *    NEVER throw or reject: every failure (disabled, no recipient, no API
 *    key, non-2xx, network error) resolves to `false` after a
 *    `console.error`/`warn` with an `[apply]` prefix, so /api/apply can call
 *    them without ever risking the candidate's response. The `fetchImpl`
 *    option lets tests inject a fake fetch.
 *
 *    Callers on Workers MUST register the returned promise with
 *    `ctx.waitUntil`, not leave it floating: the runtime may tear the
 *    isolate down as soon as the response is returned, which silently
 *    cancels the request (see docs/PORTAL-PLAN.md, Phase 6 note).
 *
 * Env vars (see wrangler.toml [vars]; RESEND_API_KEY is a Wrangler secret):
 *  - APPLICATION_NOTIFY_EMAIL — HR recipient; falls back to CONTACT_EMAIL
 *  - CONTACT_EMAIL            — existing fallback recipient
 *  - APPLICATION_NOTIFY_ENABLED — set to "0" to disable; default enabled
 *  - APPLICATION_CONFIRM_ENABLED — set to "0" to stop the candidate receipt
 *  - RESEND_FROM              — sender; falls back to DEFAULT_FROM
 *  - RESEND_API_KEY           — already provisioned (newsletter)
 */

/** The application facts the email is built from. No invented fields. */
export interface ApplicationEmailInput {
  /** Role title the candidate applied for. */
  position: string;
  name: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  whyThisRole?: string;
  /** ISO timestamp of the submission; always shown. */
  submittedAt: string;
}

export interface BuiltEmail {
  subject: string;
  text: string;
}

/**
 * Fallback sender when RESEND_FROM is unset. Resend's own onboarding
 * identity: it only delivers to the address on the Resend account, so
 * production should set RESEND_FROM to a verified-domain sender (e.g.
 * "Gileara Careers <careers@gileara.org>"). The newsletter route never
 * sets a from address (the Audiences endpoint does not take one), so
 * there is no existing pattern to reuse here.
 */
export const DEFAULT_FROM = "Gileara Careers <onboarding@resend.dev>";

/** Resend transactional-email endpoint (same API the newsletter uses). */
const RESEND_EMAILS_URL = "https://api.resend.com/emails";

/** Narrow injectable fetch so tests never touch the network. */
export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

/**
 * Pure builder: maps an application to the HR notification email.
 *
 * Subject follows docs/PORTAL-DESIGN.md:
 *   New application: {candidateName} for {roleTitle}
 *
 * Body is plain text: role, candidate contact, submitted time, and the
 * cover letter / why-this-role answers when they were provided. Empty
 * optional fields are omitted entirely rather than printed blank.
 */
export function buildApplicationEmail(app: ApplicationEmailInput): BuiltEmail {
  const subject = `New application: ${app.name} for ${app.position}`;

  const lines: string[] = [
    `You received a new application for ${app.position}.`,
    "",
    `Candidate: ${app.name}`,
    `Email: ${app.email}`,
  ];

  const phone = app.phone?.trim();
  if (phone) {
    lines.push(`Phone: ${phone}`);
  }
  lines.push(`Submitted: ${app.submittedAt}`);

  const coverLetter = app.coverLetter?.trim();
  if (coverLetter) {
    lines.push("", "Cover letter:", coverLetter);
  }

  const whyThisRole = app.whyThisRole?.trim();
  if (whyThisRole) {
    lines.push("", "Why this role:", whyThisRole);
  }

  lines.push("", "---", "Sent from Gileara Careers Portal");

  return { subject, text: lines.join("\n") };
}

/**
 * Recipient resolution: APPLICATION_NOTIFY_EMAIL wins, then the existing
 * CONTACT_EMAIL, then null ("do not send").
 */
export function resolveHrRecipient(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const preferred = env.APPLICATION_NOTIFY_EMAIL?.trim();
  if (preferred) return preferred;
  const fallback = env.CONTACT_EMAIL?.trim();
  if (fallback) return fallback;
  return null;
}

/**
 * Pure builder: the receipt sent to the CANDIDATE (Phase 7).
 *
 * The opening lines reuse the approved on-screen wording from
 * CONFIRMATION_MESSAGE in src/app/api/apply/route.ts, so the button the
 * candidate clicked and the email they receive say the same thing. The body
 * is deliberately thin: no links, no status promises, nothing HR has not
 * actually committed to.
 */
export function buildCandidateConfirmationEmail(
  app: ApplicationEmailInput,
): BuiltEmail {
  const subject = `We received your application for ${app.position}`;
  const lines: string[] = [
    `Hi ${app.name},`,
    "",
    `We received your application for ${app.position}. It's with the team now.`,
    "",
    "We'll review it and reach out within 5 business days.",
    "",
    `Submitted: ${app.submittedAt}`,
    "",
    "---",
    "Sent from Gileara Careers Portal",
  ];
  return { subject, text: lines.join("\n") };
}

/** Gating: sending is on unless APPLICATION_CONFIRM_ENABLED === "0". */
export function isCandidateConfirmationEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return env.APPLICATION_CONFIRM_ENABLED !== "0";
}

/** Gating: sending is on unless APPLICATION_NOTIFY_ENABLED === "0". */
export function isApplicationNotifyEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return env.APPLICATION_NOTIFY_ENABLED !== "0";
}

export interface NotifyHrOptions {
  /** Injected fetch (tests). Defaults to the global fetch. */
  fetchImpl?: FetchLike;
  /** Override recipient resolution; `null` forces a skip. */
  recipient?: string | null;
  /** Override the API key lookup (tests). */
  apiKey?: string;
  /** Override the sender lookup (tests). */
  from?: string;
}

/**
 * Send the HR notification for one application. Resolves `true` only when
 * Resend accepted the message (2xx). Resolves `false` when disabled, not
 * configured, or when the upstream call fails — it never throws upward,
 * so callers may dispatch it without guarding the candidate's response.
 * Register the promise with `ctx.waitUntil` on Workers.
 */
export async function notifyHrByEmail(
  app: ApplicationEmailInput,
  opts: NotifyHrOptions = {},
): Promise<boolean> {
  try {
    if (!isApplicationNotifyEnabled()) {
      console.warn(
        "[apply] HR email notification skipped: APPLICATION_NOTIFY_ENABLED=0",
      );
      return false;
    }

    const recipient =
      opts.recipient !== undefined ? opts.recipient : resolveHrRecipient();
    if (!recipient) {
      console.warn(
        "[apply] HR email notification skipped: no recipient (set APPLICATION_NOTIFY_EMAIL or CONTACT_EMAIL)",
      );
      return false;
    }

    const apiKey = opts.apiKey ?? process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn(
        "[apply] HR email notification skipped: RESEND_API_KEY is not set",
      );
      return false;
    }

    const from = opts.from ?? process.env.RESEND_FROM ?? DEFAULT_FROM;
    const { subject, text } = buildApplicationEmail(app);
    const doFetch: FetchLike =
      opts.fetchImpl ?? ((url: string, init?: RequestInit) => fetch(url, init));

    const response = await doFetch(RESEND_EMAILS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [recipient], subject, text }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[apply] HR email notification failed: Resend returned ${response.status} ${response.statusText}`,
        detail.slice(0, 300),
      );
      return false;
    }

    console.log(`[apply] HR email notification sent to ${recipient}`);
    return true;
  } catch (error) {
    console.error("[apply] HR email notification failed:", error);
    return false;
  }
}

/**
 * Send the confirmation receipt for one application to the candidate
 * (Phase 7). Same contract as notifyHrByEmail: never throws upward, always
 * resolves to a boolean, register the promise with `ctx.waitUntil` on
 * Workers.
 *
 * The recipient defaults to the address the candidate submitted, so callers
 * must only dispatch this after the application was actually stored —
 * otherwise an unauthenticated POST could make this endpoint email arbitrary
 * addresses (an amplification vector). That gate lives at the call site in
 * /api/apply, where the `saved` flag is known.
 *
 * The fetch is intentionally written out rather than shared with the HR
 * sender: notifyHrByEmail's log lines are asserted by its 16 tests and by
 * live `wrangler tail` traces, and this codebase prefers mirrored,
 * independently-readable senders (the same reason /api/apply repeats the
 * /api/newsletter Resend pattern instead of importing it).
 */
export async function notifyCandidateByEmail(
  app: ApplicationEmailInput,
  opts: NotifyHrOptions = {},
): Promise<boolean> {
  try {
    if (!isCandidateConfirmationEnabled()) {
      console.warn(
        "[apply] Candidate confirmation skipped: APPLICATION_CONFIRM_ENABLED=0",
      );
      return false;
    }

    const recipient =
      opts.recipient !== undefined ? opts.recipient : app.email.trim();
    if (!recipient) {
      console.warn(
        "[apply] Candidate confirmation skipped: the application has no email address",
      );
      return false;
    }

    const apiKey = opts.apiKey ?? process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn(
        "[apply] Candidate confirmation skipped: RESEND_API_KEY is not set",
      );
      return false;
    }

    const from = opts.from ?? process.env.RESEND_FROM ?? DEFAULT_FROM;
    const { subject, text } = buildCandidateConfirmationEmail(app);
    const doFetch: FetchLike =
      opts.fetchImpl ?? ((url: string, init?: RequestInit) => fetch(url, init));

    const response = await doFetch(RESEND_EMAILS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [recipient], subject, text }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[apply] Candidate confirmation failed: Resend returned ${response.status} ${response.statusText}`,
        detail.slice(0, 300),
      );
      return false;
    }

    console.log(`[apply] Candidate confirmation sent to ${recipient}`);
    return true;
  } catch (error) {
    console.error("[apply] Candidate confirmation failed:", error);
    return false;
  }
}
