// Public CMS media serve route. No auth check -- unlike the admin resume
// download route, these objects (Insights covers, Playbook photos) must
// be fetchable by anonymous site visitors loading a public page.
//
// Bound to `gileara_cms_media` in wrangler.toml (bucket gileara-cms-media).
// The binding is absent on any worker deployed before that config
// landed, so the route answers 503 with a plain message whenever the
// binding is missing, same convention as the resume download route.
//
// Keys are content-addressed (timestamp + random token, never reused),
// so a long immutable Cache-Control is safe.

import { NextResponse } from "next/server";
import { isMediaPrefix } from "@/lib/cms/media-storage";
import { tryGetCloudflareEnv, DB_UNAVAILABLE_MESSAGE } from "@/app/admin/admin-db";

export const dynamic = "force-dynamic";

const R2_BINDING = "gileara_cms_media";

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

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string[] }> },
) {
  const { key: segments } = await context.params;
  if (!segments || segments.length < 2 || !isMediaPrefix(segments[0])) {
    return plain("Not found.", 404);
  }
  const key = segments.join("/");

  const env = tryGetCloudflareEnv();
  if (!env) {
    return plain(DB_UNAVAILABLE_MESSAGE, 503);
  }
  const bucket = env[R2_BINDING] as R2Like | undefined;
  if (!bucket || typeof bucket.get !== "function") {
    return plain("Media storage is not available yet.", 503);
  }

  let object: R2ObjectLike | null = null;
  try {
    object = await bucket.get(key);
  } catch {
    return plain("The image could not be read right now.", 500);
  }
  if (!object || !object.body) {
    return plain("Not found.", 404);
  }

  return new NextResponse(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
