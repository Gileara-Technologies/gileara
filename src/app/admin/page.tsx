// Admin dashboard overview: at-a-glance numbers, where the pipeline stands
// by status, and the most recent applications across every role. The full
// roles board lives at /admin/roles now; this page answers "how are we
// doing" rather than "manage a role." Reads D1 per request; force-dynamic
// keeps it out of build-time prerendering.

import Link from "next/link";
import { listAllApplications, listRoles } from "@/lib/portal/db";
import type { ApplicationRow, ApplicationStatus, ParsedRole } from "@/lib/portal/types";
import { tryGetPortalDb } from "./admin-db";
import { applicationStatusLabel, parseDbTimestampMs } from "./form-logic";
import { ActionErrorBanner, ApplicationStatusBadge, DbUnavailableNotice } from "./ui";

export const dynamic = "force-dynamic";

const STATUS_ORDER: readonly ApplicationStatus[] = [
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
];

/** Bar-fill colors, matching the badge palette used everywhere else so the
 *  chart and the pills on the applications board read as the same system. */
const STATUS_BAR_CLASSES: Record<ApplicationStatus, string> = {
  new: "bg-secondary",
  reviewing: "bg-tertiary",
  shortlisted: "bg-primary-container",
  rejected: "bg-error",
  hired: "bg-primary",
};

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="op-card rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
          {label}
        </span>
        <span className="material-symbols-outlined text-lg text-primary" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="font-mono text-3xl tabular-nums text-on-background">{value}</div>
      {sub && <p className="mt-1 text-xs text-on-surface-variant">{sub}</p>}
    </div>
  );
}

function StatusBreakdown({ applications }: { applications: ApplicationRow[] }) {
  const total = applications.length;
  const counts: Record<ApplicationStatus, number> = {
    new: 0,
    reviewing: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0,
  };
  for (const app of applications) {
    counts[app.status] += 1;
  }

  return (
    <div className="op-card rounded-lg p-5">
      <h3 className="mb-4 font-display text-lg">Pipeline by status</h3>
      {total === 0 ? (
        <p className="text-sm text-on-surface-variant">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {STATUS_ORDER.map((status) => {
            const count = counts[status];
            const pct = total === 0 ? 0 : Math.round((count / total) * 100);
            return (
              <div key={status} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs text-on-surface-variant">
                  {applicationStatusLabel(status)}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className={`h-full rounded-full ${STATUS_BAR_CLASSES[status]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums text-on-surface-variant">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecentActivity({
  applications,
  roleById,
}: {
  applications: ApplicationRow[];
  roleById: Map<string, ParsedRole>;
}) {
  const recent = applications.slice(0, 7);
  return (
    <div className="op-card rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg">Recent applications</h3>
        <Link href="/admin/applications" className="text-xs font-medium text-primary hover:underline">
          View all →
        </Link>
      </div>
      {recent.length === 0 ? (
        <p className="text-sm text-on-surface-variant">No applications yet.</p>
      ) : (
        <ul className="divide-y divide-outline-variant">
          {recent.map((app) => {
            const role = roleById.get(app.role_id);
            return (
              <li key={app.id}>
                <Link
                  href={`/admin/roles/${app.role_id}`}
                  className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-surface-container-low"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-on-surface">{app.name}</p>
                    <p className="truncate text-xs text-on-surface-variant">
                      {role?.title ?? app.role_id}
                    </p>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface AdminDashboardPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const { error } = await searchParams;
  const db = tryGetPortalDb();
  if (!db) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <ActionErrorBanner code={error} />
        <DbUnavailableNotice />
      </div>
    );
  }

  let roles: ParsedRole[] = [];
  let applications: ApplicationRow[] = [];
  let failed = false;
  try {
    [roles, applications] = await Promise.all([listRoles(db), listAllApplications(db)]);
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <ActionErrorBanner code={error} />
        <DbUnavailableNotice />
      </div>
    );
  }

  const openRoles = roles.filter((r) => r.status === "open").length;
  const pausedRoles = roles.filter((r) => r.status === "paused").length;
  const hiredCount = applications.filter((a) => a.status === "hired").length;

  const weekAgoMs = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = applications.filter((a) => {
    const ms = parseDbTimestampMs(a.created_at);
    return !Number.isNaN(ms) && ms >= weekAgoMs;
  }).length;

  const roleById = new Map(roles.map((r) => [r.id, r] as const));

  return (
    <div className="space-y-6">
      <PageHeader />
      <ActionErrorBanner code={error} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="work"
          label="Open roles"
          value={openRoles}
          sub={pausedRoles > 0 ? `${pausedRoles} paused` : `${roles.length} total`}
        />
        <StatCard icon="inbox" label="Total applications" value={applications.length} />
        <StatCard
          icon="calendar_month"
          label="New this week"
          value={newThisWeek}
          sub="last 7 days"
        />
        <StatCard icon="badge" label="Hired to date" value={hiredCount} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StatusBreakdown applications={applications} />
        <RecentActivity applications={applications} roleById={roleById} />
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl">Dashboard</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          How the hiring pipeline stands right now, across every open role.
        </p>
      </div>
      <Link
        href="/admin/roles/new"
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          add
        </span>
        New role
      </Link>
    </div>
  );
}
