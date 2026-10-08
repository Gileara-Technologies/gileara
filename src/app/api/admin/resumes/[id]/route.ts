// Admin-only resume download. Requires the same session cookie check as
// src/app/admin/layout.tsx, then loads the application row from D1 and reads
// the file from R2.
//
// The R2 bucket is NOT bound yet (pending Cloudflare account enablement) and
// no r2_buckets entry may be added to wrangler.toml, so this route answers
// 503 with a plain message whenever the binding is absent. The expected
// binding name is `gileara_resumes`.

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { D1Like } from "@/lib/portal/db";
import { readSessionToken } from "@/lib/portal/session";
import { DB_UNAVAILABLE_MESSAGE, tryGetCloudflareEnv } from "@/app/admin/admin-db";

export const dynamic = "force-dynamic";

/** R2 binding name (to be added to wrangler.toml when the bucket exists). */
const R2_BINDING = "gileara_resumes";

/** The subset of R2ObjectBody this route reads. */
interface R2ObjectLike {
  body?: ReadableStream<Uint8Array> | null;
  httpMetadata?: { contentType?: string };
}

interface R2Like {
  get(key: string): Promise<R2ObjectLike | null>;
}

function plain(message: string, status: number): NextResponse {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/** Strip characters that would break the Content-Disposition header. */
function sanitizeFilename(name: string): string {
  return name.replace(/[\r\n"\\]/g, "").trim();
}

interface ResumeRow {
  resume_key: string;
  resume_filename: string;
}

function toResumeRow(value: unknown): ResumeRow | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const row = value as Record<string, unknown>;
  if (typeof row.resume_key !== "string") {
    return null;
  }
  return {
    resume_key: row.resume_key,
    resume_filename: typeof row.resume_filename === "string" ? row.resume_filename : "",
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  // Same session check as the admin layout: admin_session cookie decrypted
  // with SESSION_KEY. No valid session -> 401.
  const sessionSecret = process.env.SESSION_KEY;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionSecret || !sessionToken) {
    return plain("Sign in to download resumes.", 401);
  }
  const payload = await readSessionToken(sessionToken, sessionSecret);
  if (!payload) {
    return plain("Your session has expired. Sign in again.", 401);
  }

  const { id: rawId } = await context.params;
  const applicationId = Number(rawId);
  if (!Number.isInteger(applicationId) || applicationId <= 0) {
    return plain("Application not found.", 404);
  }

  const env = tryGetCloudflareEnv();
  if (!env) {
    return plain(DB_UNAVAILABLE_MESSAGE, 503);
  }
  const db = env.gileara_careers_db as D1Like | undefined;
  if (!db || typeof db.prepare !== "function") {
    return plain(DB_UNAVAILABLE_MESSAGE, 503);
  }

  let row: ResumeRow | null = null;
  try {
    const raw = await db
      .prepare("SELECT resume_key, resume_filename FROM applications WHERE id = ?")
      .bind(applicationId)
      .first();
    row = toResumeRow(raw);
  } catch {
    return plain(DB_UNAVAILABLE_MESSAGE, 503);
  }
  if (!row) {
    return plain("Application not found.", 404);
  }
  if (!row.resume_key) {
    return plain("This application has no resume attached.", 404);
  }

  const bucket = env[R2_BINDING] as R2Like | undefined;
  if (!bucket || typeof bucket.get !== "function") {
    return plain("Resume storage is not available yet.", 503);
  }

  let object: R2ObjectLike | null = null;
  try {
    object = await bucket.get(row.resume_key);
  } catch {
    return plain("The resume could not be read right now.", 500);
  }
  if (!object || !object.body) {
    return plain("Resume not found in storage.", 404);
  }

  const filename = sanitizeFilename(row.resume_filename) || "resume";
  return new NextResponse(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
