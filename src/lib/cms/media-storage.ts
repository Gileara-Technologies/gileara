/**
 * R2 media storage for CMS-authored content images (Insights covers,
 * Playbook photos) -- docs/CMS-PLAN.md design question 4. Structural
 * typing mirrors src/lib/portal/resume-storage.ts: the put-side
 * `R2PutLike` surface is declared here (never imported from an R2 SDK),
 * so a real binding satisfies it structurally and tests can inject a
 * trivial fake bucket. Bytes stay in memory only (File.arrayBuffer() ->
 * R2 put); nothing touches disk.
 *
 * Deliberately NOT the gileara_resumes bucket: that one is private and
 * session-gated (resumes are HR-only); this one (gileara_cms_media) must
 * be fetchable by anonymous site visitors loading a public page, served
 * through src/app/api/cms/media/[...key]/route.ts.
 *
 * Object key: {prefix}/{timestampMs}-{random}.{ext}. `prefix` is
 * constrained to a known content type ("insights" | "playbooks"), not
 * arbitrary caller input -- see isMediaPrefix.
 *
 * Size/MIME-type validation happens at the route (same convention as
 * src/app/api/apply/route.ts's resume validation), not in this module.
 *
 * Tests: tests/lib/cms/media-storage.test.ts.
 */

import { slugify } from "@/lib/portal/slug";

/** The two known content types that can own an uploaded image today. */
const MEDIA_PREFIXES = ["insights", "playbooks"] as const;
export type MediaPrefix = (typeof MEDIA_PREFIXES)[number];

export function isMediaPrefix(value: string): value is MediaPrefix {
  return (MEDIA_PREFIXES as readonly string[]).includes(value);
}

/** Fallback extension when the filename yields no safe token. */
const FALLBACK_EXTENSION = "bin";

/** Put-side options this module uses (structural subset of R2PutOptions). */
export interface R2PutOptionsLike {
  httpMetadata?: { contentType?: string };
}

/** Put-side structural type for the `gileara_cms_media` R2 binding. */
export interface R2PutLike {
  put(key: string, value: ArrayBuffer, options?: R2PutOptionsLike): Promise<unknown>;
}

/** The in-memory file surface this module reads (never written to disk). */
export interface MediaFileLike {
  name: string;
  type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
}

function sanitizeExtension(value: string): string {
  const lower = value.toLowerCase();
  return /^[a-z0-9]{1,8}$/.test(lower) ? lower : FALLBACK_EXTENSION;
}

/** Lowercased extension from a filename: the trailing alphanumeric run
 *  after the last "." (e.g. "Cover.JPG" -> "jpg"). No safe extension -> "bin". */
export function mediaExtension(filename: string): string {
  const match = /\.([A-Za-z0-9]+)$/.exec(filename.trim());
  return sanitizeExtension(match?.[1] ?? "");
}

/** A short random token for the key, built from the same ASCII-only
 *  `slugify` collapse used for resume role slugs -- reusing it here
 *  keeps there being exactly one "make this string path-safe" rule in
 *  the codebase rather than two slightly different ones. */
function randomToken(): string {
  const raw = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).replace(/-/g, "");
  return slugify(raw).slice(0, 12) || "x";
}

/**
 * Pure key builder: `{prefix}/{timestampMs}-{random}.{ext}`. Exported
 * for tests (tests/lib/cms/media-storage.test.ts).
 */
export function buildMediaObjectKey(params: {
  prefix: MediaPrefix;
  extension: string;
  timestampMs: number;
  random: string;
}): string {
  const ext = sanitizeExtension(params.extension);
  const random = slugify(params.random).slice(0, 12) || "x";
  return `${params.prefix}/${params.timestampMs}-${random}.${ext}`;
}

export interface PersistMediaDeps {
  /** `env.gileara_cms_media` -- may be undefined on pre-binding deploys. */
  bucket: R2PutLike | null | undefined;
  prefix: MediaPrefix;
  /** The uploaded image; bytes are read via arrayBuffer(), never to disk. */
  file: MediaFileLike;
  /** Injectable clock/random for tests; default to real values. */
  nowMs?: number;
  random?: string;
}

export interface PersistMediaResult {
  ok: boolean;
  /** Public serve path (/api/cms/media/{key}) on success. */
  path?: string;
  error?: string;
}

/**
 * Upload an image to R2 and return its public serve path. Never throws:
 * every failure path is caught and returned as `{ ok: false, error }`,
 * since this is called from an admin form action, not a public-facing
 * flow that needs the fail-open guarantee persistResume has.
 */
export async function persistMedia(deps: PersistMediaDeps): Promise<PersistMediaResult> {
  try {
    if (!deps.bucket || typeof deps.bucket.put !== "function") {
      return { ok: false, error: "Media storage is not available right now." };
    }
    const key = buildMediaObjectKey({
      prefix: deps.prefix,
      extension: mediaExtension(deps.file.name),
      timestampMs: deps.nowMs ?? Date.now(),
      random: deps.random ?? randomToken(),
    });
    const bytes = await deps.file.arrayBuffer();
    await deps.bucket.put(key, bytes, deps.file.type ? { httpMetadata: { contentType: deps.file.type } } : {});
    return { ok: true, path: `/api/cms/media/${key}` };
  } catch (error) {
    console.warn("[cms-media] Upload failed:", error);
    return { ok: false, error: "The image could not be uploaded. Try again." };
  }
}
