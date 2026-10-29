// Admin-only CSV export of every application across every role. Requires
// the same session cookie check as src/app/admin/layout.tsx — this is a
// plain GET so the admin layout's redirect-based guard never runs for it,
// same reasoning as /api/admin/resumes/[id].

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { listAllApplications, listRoles } from "@/lib/portal/db";
import { csvRow } from "@/lib/portal/csv";
import { readSessionToken } from "@/lib/portal/session";
import { tryGetPortalDb, DB_UNAVAILABLE_MESSAGE } from "@/app/admin/admin-db";
import { formatDbTimestamp } from "@/app/admin/form-logic";

export const dynamic = "force-dynamic";

function plain(message: string, status: number): NextResponse {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

const CSV_HEADER = [
  "id",
  "role_title",
  "role_id",
  "name",
  "email",
  "phone",
  "status",
  "submitted_at",
  "status_updated_at",
  "status_updated_by",
] as const;

export async function GET(): Promise<NextResponse> {
  const sessionSecret = process.env.SESSION_KEY;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionSecret || !sessionToken) {
    return plain("Sign in to export applications.", 401);
  }
  const payload = await readSessionToken(sessionToken, sessionSecret);
  if (!payload) {
    return plain("Your session has expired. Sign in again.", 401);
  }

  const db = tryGetPortalDb();
  if (!db) {
    return plain(DB_UNAVAILABLE_MESSAGE, 503);
  }

  let rows: string;
  try {
    const [applications, roles] = await Promise.all([listAllApplications(db), listRoles(db)]);
    const roleTitleById = new Map(roles.map((r) => [r.id, r.title] as const));
    rows =
      csvRow(CSV_HEADER) +
      applications
        .map((app) =>
          csvRow([
            app.id,
            roleTitleById.get(app.role_id) ?? app.role_id,
            app.role_id,
            app.name,
            app.email,
            app.phone,
            app.status,
            formatDbTimestamp(app.created_at),
            app.status_updated_at ? formatDbTimestamp(app.status_updated_at) : "",
            app.status_updated_by ?? "",
          ]),
        )
        .join("");
  } catch {
    return plain(DB_UNAVAILABLE_MESSAGE, 503);
  }

  const today = new Date().toISOString().slice(0, 10);
  return new NextResponse(rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications-${today}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
