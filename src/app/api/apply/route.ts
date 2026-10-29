import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  createApplication,
  getRole,
  listRoles,
  type D1Like,
} from "@/lib/portal/db";
import {
  APPLY_RATE_LIMIT_MAX,
  APPLY_RATE_LIMIT_WINDOW_MS,
  createRateLimiter,
} from "@/lib/portal/rate-limit";
import { notifyCandidateByEmail, notifyHrByEmail } from "@/lib/portal/notify";
import { persistResume, type R2PutLike } from "@/lib/portal/resume-storage";

/**
 * POST /api/apply — store a careers application and notify both sides.
 *
 * Guards, cheapest first: per-IP rate limit (before the body is even read),
 * honeypot field, then the field/file validation below, then a check that
 * the named role exists and is still open. Only then is anything written.
 *
 * Status codes:
 *   200 — stored (also the honeypot's answer, so bots learn nothing)
 *   400 — missing/invalid fields, or a role that is unknown or not open
 *   429 — too many submissions from this IP; see Retry-After
 *   500 — unexpected failure (unparseable body, and the like)
 */

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_RESUME_EXTENSIONS = /\.(pdf|doc|docx)$/i;

/** Per-field length caps (abuse protection; the form mirrors the text ones). */
const MAX_LENGTHS = {
  name: 200,
  email: 320,
  phone: 40,
  position: 200,
  coverLetter: 10000,
  whyThisRole: 10000,
  roleId: 100,
};

/** Approved confirmation wording (docs/PORTAL-DESIGN.md). */
const CONFIRMATION_MESSAGE = "Thanks — we'll review and reach out within 5 business days.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function isAllowedResumeFile(file: File): boolean {
  return (
    ALLOWED_RESUME_TYPES.has(file.type) ||
    ALLOWED_RESUME_EXTENSIONS.test(file.name)
  );
}

/**
 * Per-isolate counter, deliberately module-level so it survives between
 * requests. Rate limiting is best-effort on Workers (see rate-limit.ts).
 */
const applyLimiter = createRateLimiter({
  limit: APPLY_RATE_LIMIT_MAX,
  windowMs: APPLY_RATE_LIMIT_WINDOW_MS,
});

/** Copy for a refused role. Both read as instructions, not as error codes. */
const ROLE_REJECTION_MESSAGES = {
  unknown:
    "We don't recognise that role. Please pick one from the careers page and try again.",
  closed: "That role isn't accepting applications right now.",
} as const;

type RoleResolution =
  | { ok: true; roleId: string }
  | { ok: false; reason: string; message: string };

/**
 * Resolve the role an application belongs to, and refuse anything that is
 * not an open role in the roles table.
 *
 * The form only offers open roles, but a POST can name any id or any
 * position string, so the check has to live here. Without it an application
 * lands against a closed role — or against an id that exists nowhere — and
 * then shows up in no admin view, because applications are read per role.
 */
async function resolveRoleForApplication(
  db: D1Like,
  roleId: string,
  position: string,
): Promise<RoleResolution> {
  if (roleId) {
    const role = await getRole(db, roleId);
    if (!role) {
      return {
        ok: false,
        reason: `unknown-role "${roleId}"`,
        message: ROLE_REJECTION_MESSAGES.unknown,
      };
    }
    if (role.status !== "open") {
      return {
        ok: false,
        reason: `role "${role.id}" is ${role.status}`,
        message: ROLE_REJECTION_MESSAGES.closed,
      };
    }
    return { ok: true, roleId: role.id };
  }

  // The general form on /careers sends a position title instead of an id.
  const roles = await listRoles(db);
  const match = roles.find(
    (role) => role.title.toLowerCase() === position.toLowerCase(),
  );
  if (!match) {
    return {
      ok: false,
      reason: `unknown-position "${position}"`,
      message: ROLE_REJECTION_MESSAGES.unknown,
    };
  }
  if (match.status !== "open") {
    return {
      ok: false,
      reason: `role "${match.id}" is ${match.status}`,
      message: ROLE_REJECTION_MESSAGES.closed,
    };
  }
  return { ok: true, roleId: match.id };
}

export async function POST(request: Request) {
  try {
    // Cheapest guard first: decide not to read the body at all. Cloudflare
    // injects cf-connecting-ip, so a missing header means we are off
    // Cloudflare (local dev, unit tests) and there is nothing to count.
    const clientIp = request.headers.get("cf-connecting-ip")?.trim();
    if (clientIp) {
      const rate = applyLimiter.check(clientIp);
      if (!rate.allowed) {
        console.warn(
          `[apply] Rate limited ${clientIp} — retry in ${rate.retryAfterSeconds}s`,
        );
        return NextResponse.json(
          {
            error:
              "Too many applications have come from this network. Please try again shortly.",
          },
          {
            status: 429,
            headers: { "Retry-After": String(rate.retryAfterSeconds) },
          },
        );
      }
    }

    const formData = await request.formData();

    // Honeypot, the same trick as /api/newsletter: a field no applicant can
    // see, so a filled one means a bot walking the inputs. Answer exactly
    // like a stored application — a bot that gets an error just retries —
    // and skip D1, R2 and Resend entirely.
    if (asText(formData.get("honeypot")) !== "") {
      console.warn(
        `[apply] Honeypot filled (${clientIp ?? "unknown ip"}) — submission ignored`,
      );
      return NextResponse.json(
        { success: true, message: CONFIRMATION_MESSAGE },
        { status: 200 },
      );
    }

    const name = asText(formData.get("name"));
    const email = asText(formData.get("email"));
    const position = asText(formData.get("position"));
    const phone = asText(formData.get("phone"));
    const coverLetter = asText(formData.get("coverLetter"));
    const whyThisRole = asText(formData.get("whyThisRole"));
    const roleId = asText(formData.get("roleId"));
    const resumeEntry = formData.get("resume");
    const resume =
      resumeEntry !== null && typeof resumeEntry !== "string" ? resumeEntry : null;

    // Required fields: at least as strict as the previous implementation.
    if (!name || !email || !position || !resume) {
      return NextResponse.json(
        { error: "Missing required fields or resume document." },
        { status: 400 },
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    const lengthsOk =
      name.length <= MAX_LENGTHS.name &&
      email.length <= MAX_LENGTHS.email &&
      phone.length <= MAX_LENGTHS.phone &&
      position.length <= MAX_LENGTHS.position &&
      coverLetter.length <= MAX_LENGTHS.coverLetter &&
      whyThisRole.length <= MAX_LENGTHS.whyThisRole &&
      roleId.length <= MAX_LENGTHS.roleId;
    if (!lengthsOk) {
      return NextResponse.json(
        { error: "A form field is longer than allowed." },
        { status: 400 },
      );
    }

    // Server-side file validation (5MB limit, as before)
    if (resume.size > MAX_RESUME_BYTES) {
      return NextResponse.json(
        { error: "Resume file size exceeds the 5MB limit." },
        { status: 400 },
      );
    }
    if (!isAllowedResumeFile(resume)) {
      return NextResponse.json(
        { error: "Resume must be a PDF, DOC, or DOCX file." },
        { status: 400 },
      );
    }

    let saved = false;
    let usedD1Path = false;

    try {
      // Only attempt R2 on the D1 success path (Cloudflare context needed).
      const { env } = getCloudflareContext();
      const db = (env as unknown as { gileara_careers_db?: D1Like })
        .gileara_careers_db;
      if (!db) {
        throw new Error("gileara_careers_db binding is missing from the Cloudflare env");
      }

      // Role enforcement: it must exist and still be open. A refusal returns
      // before anything is written or emailed.
      const roleResolution = await resolveRoleForApplication(
        db,
        roleId,
        position,
      );
      if (!roleResolution.ok) {
        console.warn(`[apply] Rejected application — ${roleResolution.reason}`);
        return NextResponse.json(
          { error: roleResolution.message },
          { status: 400 },
        );
      }
      const resolvedRoleId = roleResolution.roleId;

      // Order matters: insert first (resume_key "") to get autoincrement id,
      // then upload to R2, then update resume_key (fail-open).
      const stored = await createApplication(db, {
        roleId: resolvedRoleId,
        name,
        email,
        phone: phone || null,
        resumeKey: "",
        resumeFilename: resume.name,
        coverLetter: coverLetter || null,
        whyThisRole: whyThisRole || null,
      });
      if (!stored) {
        throw new Error("createApplication did not store the application");
      }
      usedD1Path = true;

      const bucket = (env as unknown as { gileara_resumes?: R2PutLike })
        .gileara_resumes;
      // Awaited so the worker cannot freeze before the R2 put lands;
      // persistResume never throws, so the candidate is never affected.
      await persistResume({
        bucket,
        db,
        applicationId: stored.id,
        roleSlug: resolvedRoleId,
        file: resume,
      });

      console.log(
        `[apply] Stored application #${stored.id} for role "${resolvedRoleId}" (${name} <${email}>)`,
      );
      saved = true;
    } catch (error) {
      // If we already inserted but storage/update failed mid-flight, the
      // application row exists with resume_key "" (fail-open) — still count as
      // saved so candidate gets success response. If D1 was unreachable before
      // insert, fall back to legacy logging path.
      if (usedD1Path) {
        console.warn(
          "[apply] Resume storage failed after D1 insert (fail-open):",
          error,
        );
        saved = true;
      } else {
        console.warn(
          "[apply] Application was not saved to D1, responding without a database write:",
          error,
        );
        saved = false;
      }
    }

    if (!saved) {
      // Pre-portal behavior: log the submission so local dev keeps a record.
      console.log(`[apply] New application (not saved to D1):
      Name: ${name}
      Email: ${email}
      Position: ${position}
      Resume: ${resume.name} (${Math.round(resume.size / 1024)} KB)
    `);
    }

    // Success decision made above: the candidate gets the same
    // { success, message } response whether or not D1 was reachable.
    const response = NextResponse.json(
      { success: true, message: CONFIRMATION_MESSAGE },
      { status: 200 },
    );

    // Phase 6: HR notification (docs/PORTAL-PLAN.md). Sent on BOTH success
    // paths (D1 save and the legacy fallback), only after the response
    // content is decided.
    //
    // Registered with ctx.waitUntil rather than left as a floating promise:
    // the Workers runtime is free to tear the isolate down the moment the
    // response is returned, which cancelled the Resend fetch before it left
    // the worker. The failure was invisible — the promise never survived to
    // its first log line — so every notification was silently dropped.
    const submittedAt = new Date().toISOString();
    const notification = notifyHrByEmail({
      position,
      name,
      email,
      phone,
      coverLetter,
      whyThisRole,
      submittedAt,
    }).catch((error: unknown) => {
      console.error("[apply] HR email notification dispatch failed:", error);
    });

    try {
      getCloudflareContext().ctx.waitUntil(notification);
    } catch {
      // No Cloudflare context (unit tests, plain `next dev`): the promise
      // still settles, it just is not kept alive by the runtime.
      void notification;
    }

    // Phase 7: the candidate gets a receipt too — but ONLY when the row
    // exists. Dispatching it on an unsaved POST would email an address we
    // never stored, which is exactly how a public endpoint becomes an
    // amplification vector. `saved` is the gate; Resend failure still can
    // never touch the response.
    if (saved) {
      const confirmation = notifyCandidateByEmail({
        position,
        name,
        email,
        phone,
        coverLetter,
        whyThisRole,
        submittedAt,
      }).catch((error: unknown) => {
        console.error("[apply] Candidate confirmation dispatch failed:", error);
      });

      try {
        getCloudflareContext().ctx.waitUntil(confirmation);
      } catch {
        void confirmation;
      }
    }

    return response;
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your application." },
      { status: 500 },
    );
  }
}
