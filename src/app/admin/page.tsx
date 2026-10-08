// Admin dashboard: every role with its status, application count, and the
// actions HR needs (edit, pause/resume, close). Reads D1 per request; the
// layout's cookie check already makes the route dynamic, and force-dynamic
// keeps it out of build-time prerendering.

import Link from "next/link";
import { countApplicationsByRole, listRoles } from "@/lib/portal/db";
import type { ParsedRole } from "@/lib/portal/types";
import { setRoleStatusAction } from "./actions";
import { tryGetPortalDb } from "./admin-db";
import { CLOSE_ACTION, canClose, statusActionFor } from "./form-logic";
import { ActionErrorBanner, DbUnavailableNotice, StatusBadge } from "./ui";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ error?: string }>;
}

const rowButtonClass =
  "inline-flex items-center gap-1 rounded border border-outline-variant px-2.5 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";

const primaryButtonClass =
  "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function DashboardHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Roles</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Create roles, pause or close them, and read the applications each
          one has received.
        </p>
      </div>
      <Link href="/admin/roles/new" className={primaryButtonClass}>
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          add
        </span>
        New role
      </Link>
    </div>
  );
}

function StatusForm({
  id,
  action,
}: {
  id: string;
  action: { next: string; label: string; icon: string };
}) {
  return (
    <form action={setRoleStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={action.next} />
      <button type="submit" className={rowButtonClass}>
        <span className="material-symbols-outlined text-sm" aria-hidden="true">
          {action.icon}
        </span>
        {action.label}
      </button>
    </form>
  );
}

function RoleRow({
  role,
  count,
}: {
  role: ParsedRole;
  count: number;
}) {
  const resumeAction = statusActionFor(role.status);
  return (
    <tr className="hover:bg-surface-container-low">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-xl text-primary" aria-hidden="true">
            {role.icon}
          </span>
          <div>
            <Link
              href={`/admin/roles/${role.id}`}
              className="font-medium transition-colors hover:text-primary"
            >
              {role.title}
            </Link>
            <p className="font-mono text-xs text-on-surface-variant">{role.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">{role.openings}</td>
      <td className="px-4 py-3">
        <StatusBadge status={role.status} />
      </td>
      <td className="px-4 py-3">{count}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/roles/${role.id}`} className={rowButtonClass}>
            <span className="material-symbols-outlined text-sm" aria-hidden="true">
              edit
            </span>
            Edit
          </Link>
          <StatusForm id={role.id} action={resumeAction} />
          {canClose(role.status) && <StatusForm id={role.id} action={CLOSE_ACTION} />}
        </div>
      </td>
    </tr>
  );
}

export default async function AdminDashboardPage({ searchParams }: DashboardPageProps) {
  const { error } = await searchParams;
  const db = tryGetPortalDb();
  if (!db) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  let roles: ParsedRole[] = [];
  let counts: Record<string, number> = {};
  let failed = false;
  try {
    [roles, counts] = await Promise.all([
      listRoles(db),
      countApplicationsByRole(db),
    ]);
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <ActionErrorBanner code={error} />
      {roles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant p-10 text-center">
          <span
            className="material-symbols-outlined text-4xl text-on-surface-variant"
            aria-hidden="true"
          >
            work_outline
          </span>
          <p className="mt-3 font-medium">No roles yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Create the first role to open the board.
          </p>
          <Link
            href="/admin/roles/new"
            className={`${primaryButtonClass} mt-4`}
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              add
            </span>
            New role
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-left text-xs uppercase tracking-wide text-on-surface-variant">
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Openings</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Applications</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {roles.map((role) => (
                <RoleRow
                  key={role.id}
                  role={role}
                  count={counts[role.id] ?? 0}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
