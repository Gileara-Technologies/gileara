import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createApplication, listRoles, type D1Like } from "@/lib/portal/db";
import { slugify } from "@/lib/portal/slug";

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
 * Save the application to D1. R2 is not available yet (bucket pending
 * account enablement), so the resume is validated but not stored: the
 * original filename goes into `resume_filename` and `resume_key` stays
 * "" until uploads are wired up. Throws whenever D1 cannot be reached
 * (plain `next dev` / `next build` without a Cloudflare context) so the
 * caller can fall back to the pre-portal success path.
 */
async function saveApplicationToD1(input: {
  roleId: string;
  position: string;
  name: string;
  email: string;
  phone: string;
  resumeFilename: string;
  coverLetter: string;
  whyThisRole: string;
}): Promise<void> {
  const { env } = getCloudflareContext();
  const db = (env as unknown as { gileara_careers_db?: D1Like }).gileara_careers_db;
  if (!db) {
    throw new Error("gileara_careers_db binding is missing from the Cloudflare env");
  }

  // Role id: role detail pages pass it directly; the general form on
  // /careers only sends the position title, so match it against the
  // roles table (and fall back to the slugified title).
  let roleId = input.roleId;
  if (!roleId) {
    const roles = await listRoles(db);
    const match = roles.find(
      (role) => role.title.toLowerCase() === input.position.toLowerCase(),
    );
    roleId = match?.id ?? slugify(input.position);
    if (!roleId) {
      throw new Error(`Cannot resolve a role id for position "${input.position}"`);
    }
  }

  const stored = await createApplication(db, {
    roleId,
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    // R2 upload pending bucket enablement; bytes are intentionally not stored.
    resumeKey: "",
    resumeFilename: input.resumeFilename,
    coverLetter: input.coverLetter || null,
    whyThisRole: input.whyThisRole || null,
  });
  if (!stored) {
    throw new Error("createApplication did not store the application");
  }
  console.log(
    `[apply] Stored application #${stored.id} for role "${roleId}" (${input.name} <${input.email}>)`,
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
    const resume = resumeEntry !== null && typeof resumeEntry !== "string" ? resumeEntry : null;

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
    try {
      await saveApplicationToD1({
        roleId,
        position,
        name,
        email,
        phone,
        resumeFilename: resume.name,
        coverLetter,
        whyThisRole,
      });
      saved = true;
    } catch (error) {
      console.warn(
        "[apply] Application was not saved to D1, responding without a database write:",
        error,
      );
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

    return NextResponse.json(
      { success: true, message: CONFIRMATION_MESSAGE },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your application." },
      { status: 500 },
    );
  }
}
