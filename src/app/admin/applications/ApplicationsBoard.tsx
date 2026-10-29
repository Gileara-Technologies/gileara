"use client";

// Global applications pipeline: every candidate, across every role, with
// status tabs and a search box. Expand/collapse and the status-change form
// are the exact zero-extra-JS pattern from the per-role board (native
// <details>, a plain server-action <form>) — only the tab/search filtering
// needs client state, since that's genuine interactivity a server render
// can't do on its own.

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ApplicationRow, ApplicationStatus } from "@/lib/portal/types";
import { setApplicationStatusAction } from "../actions";
import { APPLICATION_STATUSES, applicationStatusLabel, formatDbTimestamp } from "../form-logic";
import { ApplicationStatusBadge } from "../ui";

/** An application row enriched with its role's title, resolved server-side
 *  (the raw row only has role_id). */
export interface EnrichedApplication extends ApplicationRow {
  roleTitle: string;
}

/** Status-change forms on this board redirect back here, not to the
 *  per-role page — see the `returnTo` field on validateApplicationStatusForm. */
const RETURN_TO = "/admin/applications";

function Paragraph({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
        {label}
      </h4>
      <p className="mt-1 whitespace-pre-wrap text-sm text-on-surface">{value}</p>
    </div>
  );
}

function StatusControl({ application }: { application: EnrichedApplication }) {
  const submitted = formatDbTimestamp(application.created_at);
  const moved =
    application.status_updated_at && application.status_updated_by
      ? `Moved to ${applicationStatusLabel(application.status)} by ${application.status_updated_by} · ${formatDbTimestamp(application.status_updated_at)}`
      : `Not moved yet — still queued as received${submitted ? ` (${submitted})` : ""}.`;
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
        Status
      </h4>
      <form action={setApplicationStatusAction} className="mt-1.5 flex flex-wrap items-center gap-2">
        <input type="hidden" name="id" value={application.id} />
        <input type="hidden" name="roleId" value={application.role_id} />
        <input type="hidden" name="returnTo" value={RETURN_TO} />
        <label htmlFor={`app-status-${application.id}`} className="sr-only">
          Status for {application.name}
        </label>
        <select
          id={`app-status-${application.id}`}
          name="status"
          defaultValue={application.status}
          className="rounded-md border border-outline-variant bg-surface-container-lowest px-2.5 py-1.5 text-sm text-on-surface"
        >
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {applicationStatusLabel(status)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-outline-variant px-3 py-1.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-highest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Update
        </button>
      </form>
      <p className="mt-1.5 text-xs text-on-surface-variant">{moved}</p>
    </div>
  );
}

function ApplicationItem({ application }: { application: EnrichedApplication }) {
  const submitted = formatDbTimestamp(application.created_at);
  return (
    <li>
      <details className="group p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 items-center gap-3">
            <span className="material-symbols-outlined text-xl text-on-surface-variant" aria-hidden="true">
              person
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">{application.name}</span>
              <span className="block truncate text-sm text-on-surface-variant">
                {application.roleTitle} · {application.email}
              </span>
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3 text-sm text-on-surface-variant">
            <ApplicationStatusBadge status={application.status} />
            {submitted && (
              <time dateTime={application.created_at.replace(" ", "T")} className="hidden sm:inline">
                {submitted}
              </time>
            )}
            <span className="material-symbols-outlined transition-transform group-open:rotate-180" aria-hidden="true">
              expand_more
            </span>
          </span>
        </summary>
        <div className="mt-4 space-y-4 pl-0 sm:pl-9">
          <StatusControl application={application} />
          {application.cover_letter && (
            <Paragraph label="Cover letter" value={application.cover_letter} />
          )}
          {application.why_this_role && (
            <Paragraph label="Why this role" value={application.why_this_role} />
          )}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
              Resume
            </h4>
            {application.resume_key ? (
              <a
                href={`/api/admin/resumes/${application.id}`}
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80"
              >
                <span className="material-symbols-outlined text-base" aria-hidden="true">
                  download
                </span>
                {application.resume_filename || "Download resume"}
              </a>
            ) : (
              <p className="mt-1 text-sm text-on-surface-variant">No resume attached.</p>
            )}
          </div>
          <Link
            href={`/admin/roles/${application.role_id}`}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View the {application.roleTitle} role →
          </Link>
        </div>
      </details>
    </li>
  );
}

type StatusFilter = "all" | ApplicationStatus;

export default function ApplicationsBoard({
  applications,
}: {
  applications: EnrichedApplication[];
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const tally: Record<StatusFilter, number> = {
      all: applications.length,
      new: 0,
      reviewing: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    };
    for (const app of applications) {
      tally[app.status] += 1;
    }
    return tally;
  }, [applications]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return applications.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        app.name.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        app.roleTitle.toLowerCase().includes(query)
      );
    });
  }, [applications, statusFilter, search]);

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    ...APPLICATION_STATUSES.map((status) => ({ key: status, label: applicationStatusLabel(status) })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            aria-pressed={statusFilter === tab.key}
            className={`rounded-pill px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === tab.key
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {tab.label} <span className="opacity-70">({counts[tab.key]})</span>
          </button>
        ))}
        <div className="relative ml-auto">
          <span
            className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-base text-on-surface-variant"
            aria-hidden="true"
          >
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, role"
            aria-label="Search applications"
            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest py-1.5 pl-9 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant sm:w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-outline-variant p-6 text-sm text-on-surface-variant">
          {applications.length === 0 ? "No applications yet." : "No applications match this filter."}
        </p>
      ) : (
        <ul className="divide-y divide-outline-variant rounded-lg border border-outline-variant bg-surface-container-lowest">
          {filtered.map((application) => (
            <ApplicationItem key={application.id} application={application} />
          ))}
        </ul>
      )}
    </div>
  );
}
