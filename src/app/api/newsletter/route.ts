import { NextResponse } from "next/server";

/**
 * POST /api/newsletter — subscribe an email to the Resend Audience.
 *
 * Body: { email: string, honeypot?: string }
 *   - email: required, valid email format
 *   - honeypot: hidden field; if filled, we silently 200 (bots get
 *     nothing useful back) and never call Resend.
 *
 * Status codes:
 *   200  — subscribed (or silently accepted as honeypot)
 *   400  — invalid email
 *   502  — upstream (Resend) error
 *   503  — feature disabled (no audience id configured)
 *
 * Required env vars:
 *   RESEND_API_KEY       — full-access Resend API key
 *   RESEND_AUDIENCE_ID   — the Audience ID to add subscribers to
 *
 * The /newsletterEnabled flag in src/content/site-config.ts lets you
 * turn the feature off (and the form 404s) without removing the
 * route. Useful for legal hold or provider outages.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterBody {
  email?: unknown;
  honeypot?: unknown;
}

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && EMAIL_RE.test(value);
}

export async function POST(request: Request) {
  // Feature flag — return 404 when disabled so the form quietly
  // disappears from the UI (the client treats 404 as "not present").
  if (process.env.NEWSLETTER_ENABLED !== "1") {
    return NextResponse.json({ error: "disabled" }, { status: 404 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    return NextResponse.json(
      { error: "newsletter not configured" },
      { status: 503 },
    );
  }

  let body: NewsletterBody;
  try {
    body = (await request.json()) as NewsletterBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // Honeypot: a real user never fills this. A bot fills everything.
  // Silently accept (200) so the bot doesn't retry, but never call Resend.
  if (typeof body.honeypot === "string" && body.honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (typeof body.email !== "string" || !isValidEmail(body.email.trim())) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();

  // Resend Audiences API: POST /audiences/{audience_id}/contacts
  // Docs: https://resend.com/docs/api-reference/audiences/create-contact
  const resendRes = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
      }),
    },
  );

  if (!resendRes.ok) {
    // Resend returns 422 if the contact already exists — treat that
    // as success from the user's perspective (idempotent).
    if (resendRes.status === 422) {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }
    
    // Log the full error for debugging
    const errorBody = await resendRes.text().catch(() => '(no body)');
    console.error('Resend API error:', {
      status: resendRes.status,
      statusText: resendRes.statusText,
      body: errorBody,
      audienceId,
    });
    
    return NextResponse.json(
      { 
        error: "upstream",
        debug: `Resend returned ${resendRes.status}: ${errorBody.substring(0, 200)}`
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
