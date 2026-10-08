// Admin logout - server action (POST only).
//
// This deliberately replaces the old GET route: Next.js prefetches visible
// <Link> targets in production, and a GET handler with side effects logged
// everyone out of the admin the moment the dashboard rendered.

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "../session-guard";

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
