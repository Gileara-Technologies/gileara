import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createApplication, listRoles, type D1Like } from "@/lib/portal/db";
import { slugify } from "@/lib/portal/slug";
import { notifyHrByEmail } from "@/lib/portal/notify";
import { persistResume, type R2PutLike } from "@/lib/portal/resume-storage";

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

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

      // Role id: role detail pages pass it directly; the general form on
      // /careers only sends the position title, so match it against the
      // roles table (and fall back to the slugified title).
      let resolvedRoleId = roleId;
      if (!resolvedRoleId) {
        const roles = await listRoles(db);
        const match = roles.find(
          (role) => role.title.toLowerCase() === position.toLowerCase(),
        );
        resolvedRoleId = match?.id ?? slugify(position);
        if (!resolvedRoleId) {
          throw new Error(
            `Cannot resolve a role id for position "${position}"`,
          );
        }
      }

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
      const roleSlug = resolvedRoleId || slugify(position) || "general";
      // Awaited so the worker cannot freeze before the R2 put lands;
      // persistResume never throws, so the candidate is never affected.
      await persistResume({
        bucket,
        db,
        applicationId: stored.id,
        roleSlug,
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
    const notification = notifyHrByEmail({
      position,
      name,
      email,
      phone,
      coverLetter,
      whyThisRole,
      submittedAt: new Date().toISOString(),
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

    return response;
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your application." },
      { status: 500 },
    );
  }
}
