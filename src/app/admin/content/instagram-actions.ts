"use server";

/**
 * Server actions for the Instagram connector admin page
 * (src/app/admin/content/instagram/page.tsx). Deliberately a separate
 * file from ../actions.ts (shared by FAQs/Insights/Playbooks/People) --
 * nothing here is authored content, and keeping it separate avoids
 * touching a file another concurrent change may also be editing.
 *
 * Every action starts with requireContentEditorSession() -- same reason
 * as every other content-admin action: a server action runs without
 * rendering the layout, so the layout guard alone would let an
 * authenticated-but-unauthorized session mutate D1.
 */

import { redirect } from "next/navigation";
import { setInstagramPostVisible } from "@/lib/instagram/db";
import { syncInstagramPosts } from "@/lib/instagram/sync";
import { tryGetCloudflareEnv, tryGetPortalDb } from "../admin-db";
import { requireContentEditorSession } from "../session-guard";

const INSTAGRAM_LIST_PATH = "/admin/content/instagram";

/**
 * "Sync now" -- pulls recent media from the Instagram Graph API and
 * upserts it into cms_instagram_posts. Reads INSTAGRAM_ACCESS_TOKEN /
 * INSTAGRAM_BUSINESS_ACCOUNT_ID from the Cloudflare env here (the one
 * centralized call site, same pattern as tryGetPortalDb reading
 * gileara_careers_db) and passes them into syncInstagramPosts, which
 * never reads process.env itself.
 */
export async function syncInstagramPostsAction(): Promise<void> {
  await requireContentEditorSession();

  const db = tryGetPortalDb();
  if (!db) {
    redirect(`${INSTAGRAM_LIST_PATH}?error=unavailable`);
  }

  const env = tryGetCloudflareEnv() ?? {};
  const accessToken =
    typeof env.INSTAGRAM_ACCESS_TOKEN === "string" ? env.INSTAGRAM_ACCESS_TOKEN : undefined;
  const businessAccountId =
    typeof env.INSTAGRAM_BUSINESS_ACCOUNT_ID === "string"
      ? env.INSTAGRAM_BUSINESS_ACCOUNT_ID
      : undefined;

  const result = await syncInstagramPosts({
    db,
    fetchFn: fetch,
    accessToken,
    businessAccountId,
  });

  if (!result.ok) {
    redirect(`${INSTAGRAM_LIST_PATH}?error=sync-failed`);
  }
  redirect(`${INSTAGRAM_LIST_PATH}?synced=${result.fetched}`);
}

/** Posted from the visible/hidden toggle on each row of the cache table. */
export async function setInstagramPostVisibleAction(formData: FormData): Promise<void> {
  await requireContentEditorSession();
  const id = String(formData.get("id") ?? "").trim();
  const visibleRaw = formData.get("visible");
  if (!id || (visibleRaw !== "1" && visibleRaw !== "0")) {
    redirect(`${INSTAGRAM_LIST_PATH}?error=invalid`);
  }

  const db = tryGetPortalDb();
  if (!db) {
    redirect(`${INSTAGRAM_LIST_PATH}?error=unavailable`);
  }

  let saved = false;
  try {
    const updated = await setInstagramPostVisible(db, id, visibleRaw === "1");
    saved = updated !== null;
  } catch {
    saved = false;
  }
  if (!saved) {
    redirect(`${INSTAGRAM_LIST_PATH}?error=save`);
  }
  redirect(INSTAGRAM_LIST_PATH);
}
