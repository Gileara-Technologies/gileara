// Edit-role form + the applications received for that role. Reads D1 per
// request; force-dynamic keeps the route out of build-time prerendering.

import { notFound } from "next/navigation";
import { getRole, listApplications } from "@/lib/portal/db";
import type { ApplicationRow, ParsedRole } from "@/lib/portal/types";
import { tryGetPortalDb } from "../../admin-db";
import { BackToDashboard, DbUnavailableNotice, StatusBadge } from "../../ui";
import { ActionErrorBanner } from "../../ui";
import { ApplicationsSection } from "../applications";
import { RoleForm } from "../role-form";

export const dynamic = "force-dynamic";

interface EditRolePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditRolePage({
  params,
  searchParams,
}: EditRolePageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const db = tryGetPortalDb();
  if (!db) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <BackToDashboard />
        <DbUnavailableNotice />
      </div>
    );
  }

  let role: ParsedRole | null = null;
  let applications: ApplicationRow[] = [];
  let failed = false;
  try {
    role = await getRole(db, id);
    if (role) {
      applications = await listApplications(db, id);
    }
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <BackToDashboard />
        <DbUnavailableNotice />
      </div>
    );
  }
  if (!role) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <BackToDashboard />
        {error && (
          <div className="mt-3">
            <ActionErrorBanner code={error} />
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold">{role.title}</h2>
          <StatusBadge status={role.status} />
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
          <span>Slug</span>
          <code className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-xs text-on-surface">
            {role.id}
          </code>
          <span>generated from the title. It does not change on edit.</span>
        </p>
      </div>
      <RoleForm mode="edit" roleId={role.id} initial={role} />
      <ApplicationsSection applications={applications} />
    </div>
  );
}
