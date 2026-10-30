// Authenticated CMS media upload. Posted to by the client-side upload
// widget in the Insights/Playbooks admin forms (src/app/admin/content/media-upload-field.tsx).
//
// This is a plain Route Handler, not a page or server action, so it
// can't use requireContentEditorSession() (that one redirects on
// failure, meant for page renders). Same manual cookie-check shape as
// the resume download route instead, plus the content-editor pattern
// check on top -- HR alone is not enough here.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAllowedContentEditorEmail, readSessionToken } from "@/lib/portal/session";
import { isMediaPrefix, persistMedia, type R2PutLike } from "@/lib/cms/media-storage";
import { tryGetCloudflareEnv, DB_UNAVAILABLE_MESSAGE } from "@/app/admin/admin-db";

export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB, same limit as resume uploads
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif)$/i;

function isAllowedImageFile(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.has(file.type) || ALLOWED_IMAGE_EXTENSIONS.test(file.name);
}

function json(body: Record<string, unknown>, status: number): NextResponse {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  const sessionSecret = process.env.SESSION_KEY;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionSecret || !sessionToken) {
    return json({ ok: false, error: "Sign in to upload images." }, 401);
  }
  const payload = await readSessionToken(sessionToken, sessionSecret);
  if (!payload) {
    return json({ ok: false, error: "Your session has expired. Sign in again." }, 401);
  }
  if (!isAllowedContentEditorEmail(payload.email)) {
    return json({ ok: false, error: "Your account isn't set up for content editing." }, 403);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: "That upload could not be read." }, 400);
  }

  const prefixRaw = String(formData.get("prefix") ?? "");
  if (!isMediaPrefix(prefixRaw)) {
    return json({ ok: false, error: "Unknown content type for this upload." }, 400);
  }
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return json({ ok: false, error: "Choose an image to upload." }, 400);
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return json({ ok: false, error: "Image file size exceeds the 5MB limit." }, 400);
  }
  if (!isAllowedImageFile(file)) {
    return json({ ok: false, error: "Image must be a JPEG, PNG, WebP, or GIF file." }, 400);
  }

  const env = tryGetCloudflareEnv();
  if (!env) {
    return json({ ok: false, error: DB_UNAVAILABLE_MESSAGE }, 503);
  }
  const bucket = env.gileara_cms_media as R2PutLike | undefined;

  const result = await persistMedia({ bucket, prefix: prefixRaw, file });
  if (!result.ok) {
    return json({ ok: false, error: result.error ?? "The image could not be uploaded." }, 500);
  }
  return json({ ok: true, path: result.path }, 200);
}
