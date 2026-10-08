/**
 * Local helper for reaching the careers-portal bindings from admin pages,
 * server actions, and API routes. src/lib/portal/db.ts deliberately never
 * reads the Cloudflare context itself (its docs document this call-site
 * pattern), so the wiring lives here.
 *
 * Plain `next dev` without `initOpenNextCloudflareForDev()` has no context,
 * so every accessor returns null instead of throwing; callers render a clear
 * "Database unavailable" state instead of crashing the page.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Like } from "@/lib/portal/db";

/** Message shown whenever the D1 binding cannot be reached. */
export const DB_UNAVAILABLE_MESSAGE = "Database unavailable in this environment.";

/**
 * The Cloudflare context env object as a plain record, or null when the
 * context is missing (plain next dev) or the sync read throws.
 */
export function tryGetCloudflareEnv(): Record<string, unknown> | null {
  try {
    const { env } = getCloudflareContext();
    return env as unknown as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * The D1 binding (`gileara_careers_db` in wrangler.toml), or null when the
 * context or binding is unavailable.
 */
export function tryGetPortalDb(): D1Like | null {
  const env = tryGetCloudflareEnv();
  if (!env) {
    return null;
  }
  const db = env.gileara_careers_db;
  if (!db || typeof (db as D1Like).prepare !== "function") {
    return null;
  }
  return db as D1Like;
}
