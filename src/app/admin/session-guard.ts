// Admin session guards shared by the layout, the content area, and every
// server action.
//
// The layout guard alone is NOT enough for server actions: with middleware
// parked (Node runtime breaks the Cloudflare build), an action POST executes
// without rendering the layout, so an unauthenticated request could mutate
// D1. Every action must call requireAdminSession() first.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  isAllowedContentEditorEmail,
  readSessionToken,
  type SessionPayload,
} from "@/lib/portal/session";

export const ADMIN_SESSION_COOKIE = "admin_session";

/**
 * Validate the admin_session cookie for the current request.
 * Redirects to /admin/login when the secret, cookie, or token is missing,
 * tampered with, or expired.
 */
export async function requireAdminSession(): Promise<SessionPayload> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const sessionSecret = process.env.SESSION_KEY;

  if (!sessionSecret) {
    redirect("/admin/login");
  }

  if (!sessionToken) {
    redirect("/admin/login");
  }

  const payload = await readSessionToken(sessionToken, sessionSecret);
  if (!payload) {
    redirect("/admin/login");
  }

  return payload;
}

/**
 * Validate the admin_session cookie AND that the signed-in email matches
 * the content-editor convention (isAllowedContentEditorEmail). Content
 * editing is a separate permission tier from HR: a valid, signed-in HR
 * session that doesn't match redirects to /admin rather than /admin/login
 * -- the user IS authenticated, just not authorized for this specific
 * area, so bouncing them to the sign-in screen would be misleading.
 */
export async function requireContentEditorSession(): Promise<SessionPayload> {
  const payload = await requireAdminSession();
  if (!isAllowedContentEditorEmail(payload.email)) {
    redirect("/admin?error=content-forbidden");
  }
  return payload;
}
