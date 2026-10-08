// Admin session guard shared by the layout and every server action.
//
// The layout guard alone is NOT enough for server actions: with middleware
// parked (Node runtime breaks the Cloudflare build), an action POST executes
// without rendering the layout, so an unauthenticated request could mutate
// D1. Every action must call requireAdminSession() first.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSessionToken, type SessionPayload } from "@/lib/portal/session";

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
