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
import { instagramAccounts } from "@/content/site-config";
import { readInstagramCredentials } from "@/lib/instagram/accounts";
import { tryGetCloudflareEnv, tryGetPortalDb } from "../admin-db";
import { requireContentEditorSession } from "../session-guard";

const INSTAGRAM_LIST_PATH = "/admin/content/instagram";

/**
 * "Sync now" -- pulls recent media from every configured Instagram
 * account (@gileara, @ins.gileara) and upserts it into
 * cms_instagram_posts. Credentials are read from the Cloudflare env here
 * (the one centralized call site) and passed into syncInstagramPosts,
 * which never reads process.env itself.
 *
 * Accounts with no secrets set are skipped, not treated as failures, so
 * one account can go live before the other. If no account is configured,
 * or every configured account fails, the editor sees "sync-failed". If
 * some succeed and some fail, the editor sees the success count plus
 * `partial=1`, so a half-working sync never looks fully healthy.
 */
export async function syncInstagramPostsAction(): Promise<void> {
  await requireContentEditorSession();

  const db = tryGetPortalDb();
  if (!db) {
    redirect(`${INSTAGRAM_LIST_PATH}?error=unavailable`);
  }

  const env = tryGetCloudflareEnv() ?? {};
  let fetched = 0;
  let attempted = 0;
  let failed = 0;

  for (const account of instagramAccounts) {
    const creds = readInstagramCredentials(env, account);
    if (!creds) continue;
    attempted += 1;
    const result = await syncInstagramPosts({
      db,
      fetchFn: fetch,
      accessToken: creds.accessToken,
      businessAccountId: creds.businessAccountId,
      accountHandle: account.handle,
    });
    if (result.ok) {
      fetched += result.fetched;
    } else {
      failed += 1;
      console.warn(`[instagram] Sync failed for @${account.handle}:`, result.error);
    }
  }

  if (attempted === 0 || failed === attempted) {
    redirect(`${INSTAGRAM_LIST_PATH}?error=sync-failed`);
  }
  redirect(`${INSTAGRAM_LIST_PATH}?synced=${fetched}${failed > 0 ? "&partial=1" : ""}`);
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
