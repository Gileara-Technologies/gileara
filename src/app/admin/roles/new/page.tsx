// Create-role form. The D1 binding check runs up front so a plain
// `next dev` environment shows a clear notice instead of a dead form.

import Link from "next/link";
import { tryGetPortalDb } from "../../admin-db";
import { DbUnavailableNotice } from "../../ui";
import { RoleForm } from "../role-form";

export const dynamic = "force-dynamic";

export default function NewRolePage() {
  const dbAvailable = tryGetPortalDb() !== null;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            arrow_back
          </span>
          Dashboard
        </Link>
        <h2 className="mt-3 text-2xl font-semibold">New role</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          The slug is generated from the title when you save. New roles start
          as open, and you can pause or close them from the dashboard.
        </p>
      </div>
      {!dbAvailable && <DbUnavailableNotice />}
      <RoleForm mode="create" />
    </div>
  );
}
