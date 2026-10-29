// Global applications pipeline: every candidate across every role, in one
// place. Previously the only way to see applications was per-role on the
// edit-role page — this is the first page that shows the whole pipeline at
// once. Reads D1 per request; force-dynamic keeps it out of build-time
// prerendering.

import { listAllApplications, listRoles } from "@/lib/portal/db";
import { tryGetPortalDb } from "../admin-db";
import { DbUnavailableNotice } from "../ui";
import ApplicationsBoard, { type EnrichedApplication } from "./ApplicationsBoard";

export const dynamic = "force-dynamic";

function PageHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl">Applications</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Every candidate, across every role, in one pipeline.
        </p>
      </div>
      <a
        href="/api/admin/export/applications"
        className="inline-flex items-center gap-1.5 rounded-md border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          download
        </span>
        Export CSV
      </a>
    </div>
  );
}

export default async function ApplicationsPage() {
  const db = tryGetPortalDb();
  if (!db) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  let enriched: EnrichedApplication[] = [];
  let failed = false;
  try {
    const [applications, roles] = await Promise.all([listAllApplications(db), listRoles(db)]);
    const titleById = new Map(roles.map((r) => [r.id, r.title] as const));
    enriched = applications.map((app) => ({
      ...app,
      roleTitle: titleById.get(app.role_id) ?? app.role_id,
    }));
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader />
      <ApplicationsBoard applications={enriched} />
    </div>
  );
}
