/**
 * R2 resume storage for the apply flow (docs/PORTAL-PLAN.md open question #2,
 * approved format):
 *
 *   applications/{roleSlug}/{timestamp-ms}-{applicationId}.{ext}
 *
 * The route inserts the application first (resume_key "") because the key
 * embeds the D1 autoincrement id, then calls `persistResume` to upload the
 * bytes and backfill `applications.resume_key`.
 *
 * `persistResume` is STRICTLY FAIL-OPEN: any storage problem (missing
 * `gileara_resumes` binding, `put` throwing, the D1 backfill failing) is
 * caught, logged with an "[apply]" prefix, and reported as `false` — a
 * candidate must never see an error caused by storage, and `resume_key`
 * simply stays "" (the admin download route already answers 404 for "" keys).
 *
 * Structural typing mirrors src/app/api/admin/resumes/[id]/route.ts: the
 * put-side `R2PutLike` surface is declared here (never imported from the
 * admin route, never from an R2 SDK) so a real R2 binding satisfies it
 * structurally and tests can inject a trivial fake bucket. Bytes stay in
 * memory only (File.arrayBuffer() → R2 put); nothing touches disk.
 *
 * Tests: tests/lib/portal/resume-storage.test.ts.
 */

import type { D1Like } from "@/lib/portal/db";
import { slugify } from "@/lib/portal/slug";

/** Key prefix shared by every stored resume (Q2 decision). */
const KEY_PREFIX = "applications";

/** Key segment used when the role slug cannot be resolved/sanitized. */
const FALLBACK_ROLE_SLUG = "general";

/** Fallback extension when the filename yields no safe token (Q2 `{ext}`). */
const FALLBACK_EXTENSION = "bin";

/** Put-side options this module uses (structural subset of R2PutOptions). */
export interface R2PutOptionsLike {
  httpMetadata?: { contentType?: string };
}

/** Put-side structural type for the `gileara_resumes` R2 binding. */
export interface R2PutLike {
  put(
    key: string,
    value: ArrayBuffer,
    options?: R2PutOptionsLike,
  ): Promise<unknown>;
}

/** The in-memory file surface this module reads (never written to disk). */
export interface ResumeFileLike {
  name: string;
  type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
}

/**
 * Sanitize the role slug segment of the key: `slugify` collapses anything
 * outside [a-z0-9] (slashes, dots, spaces, case) into single dashes and
 * trims the ends, so path traversal is impossible; "" falls back to
 * "general" (the Q2 fallback for unresolved roles).
 */
export function sanitizeRoleSlug(value: string): string {
  return slugify(value) || FALLBACK_ROLE_SLUG;
}

/**
 * Sanitize an extension token: lowercase and accept only a 1–16 char
 * alphanumeric run, otherwise fall back to "bin".
 */
function sanitizeExtension(value: string): string {
  const lower = value.toLowerCase();
  return /^[a-z0-9]{1,16}$/.test(lower) ? lower : FALLBACK_EXTENSION;
}

/**
 * Lowercased extension from a validated resume filename: the trailing
 * alphanumeric run after the last "." (e.g. "Resume.PDF" → "pdf"). No
 * extension (or nothing safe) → "bin".
 */
export function resumeExtension(filename: string): string {
  const match = /\.([A-Za-z0-9]+)$/.exec(filename.trim());
  return sanitizeExtension(match?.[1] ?? "");
}

/**
 * Pure Q2 key builder:
 * `applications/{roleSlug}/{timestampMs}-{applicationId}.{ext}`.
 * Exported for tests (tests/lib/portal/resume-storage.test.ts).
 */
export function buildResumeObjectKey(params: {
  roleSlug: string;
  applicationId: number;
  extension: string;
  timestampMs: number;
}): string {
  const slug = sanitizeRoleSlug(params.roleSlug);
  const ext = sanitizeExtension(params.extension);
  return `${KEY_PREFIX}/${slug}/${params.timestampMs}-${params.applicationId}.${ext}`;
}

/**
 * Backfill `applications.resume_key` for an already-inserted row through the
 * same structural D1Like binding used everywhere else (db.ts has no update
 * helper and must not change).
 */
export async function updateResumeKey(
  db: D1Like,
  applicationId: number,
  resumeKey: string,
): Promise<void> {
  await db
    .prepare("UPDATE applications SET resume_key = ? WHERE id = ?")
    .bind(resumeKey, applicationId)
    .run();
}

export interface PersistResumeDeps {
  /** `env.gileara_resumes` — may be undefined on pre-binding deploys. */
  bucket: R2PutLike | null | undefined;
  /** The D1 binding that holds the already-inserted application row. */
  db: D1Like;
  /** D1 autoincrement id of the freshly inserted application. */
  applicationId: number;
  /** Resolved role id/slug ("general" when nothing resolved). */
  roleSlug: string;
  /** The uploaded resume; bytes are read via arrayBuffer(), never to disk. */
  file: ResumeFileLike;
  /** Injectable clock for tests; defaults to Date.now(). */
  nowMs?: number;
}

/**
 * Upload the resume to R2 and backfill `resume_key`. Returns true only when
 * BOTH the put and the D1 update succeeded. Never throws: every failure path
 * logs an "[apply]"-prefixed console.warn and returns false, leaving
 * `resume_key` "" so the application still succeeds unchanged.
 *
 * Order (Q2): key needs the id, so the caller inserts first; here it is
 * 1) build key, 2) read bytes in memory, 3) R2 put, 4) D1 resume_key update.
 */
export async function persistResume(deps: PersistResumeDeps): Promise<boolean> {
  try {
    const { db, applicationId, file } = deps;
    if (!deps.bucket || typeof deps.bucket.put !== "function") {
      throw new Error("gileara_resumes R2 binding is missing from the Cloudflare env");
    }
    const key = buildResumeObjectKey({
      roleSlug: deps.roleSlug,
      applicationId,
      extension: resumeExtension(file.name),
      timestampMs: deps.nowMs ?? Date.now(),
    });
    const bytes = await file.arrayBuffer();
    await deps.bucket.put(
      key,
      bytes,
      file.type ? { httpMetadata: { contentType: file.type } } : {},
    );
    await updateResumeKey(db, applicationId, key);
    return true;
  } catch (error) {
    console.warn(
      "[apply] Resume was not stored in R2; resume_key left empty and the application still succeeds:",
      error,
    );
    return false;
  }
}
