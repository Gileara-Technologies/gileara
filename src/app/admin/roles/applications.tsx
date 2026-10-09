// Applications received for one role, newest first. Native <details> keeps
// the expandable detail free of client JS. Status (Phase 7, migrations/0003)
// is a plain select + server action inside the detail, so moving an
// application adds no client component either — follow-up replies themselves
// still happen by email.

import type { ApplicationRow } from "@/lib/portal/types";
import { ApplicationStatusBadge } from "../ui";
import { setApplicationStatusAction } from "../actions";
import {
  APPLICATION_STATUSES,
  applicationStatusLabel,
  formatDbTimestamp,
} from "../form-logic";

function Paragraph({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
        {label}
      </h4>
      <p className="mt-1 whitespace-pre-wrap text-sm text-on-surface">
        {value}
      </p>
    </div>
  );
}

/**
 * Status control for one application: hidden ids + a select of every status
 * + an Update button, posted to the server action. `defaultValue` (not
 * `value`) keeps this a plain server form — no client JS, no hydration.
 */
function StatusControl({ application }: { application: ApplicationRow }) {
  const submitted = formatDbTimestamp(application.created_at);
  const moved =
    application.status_updated_at && application.status_updated_by
      ? `Moved to ${applicationStatusLabel(application.status)} by ${
          application.status_updated_by
        } · ${formatDbTimestamp(application.status_updated_at)}`
      : `Not moved yet — still queued as received${submitted ? ` (${submitted})` : ""}.`;
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
        Status
      </h4>
      <form
        action={setApplicationStatusAction}
        className="mt-1.5 flex flex-wrap items-center gap-2"
      >
        <input type="hidden" name="id" value={application.id} />
        <input type="hidden" name="roleId" value={application.role_id} />
        <label
          htmlFor={`application-status-${application.id}`}
          className="sr-only"
        >
          Status for {application.name}
        </label>
        <select
          id={`application-status-${application.id}`}
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

function ApplicationItem({ application }: { application: ApplicationRow }) {
  const submitted = formatDbTimestamp(application.created_at);
  return (
    <li>
      <details className="group p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 items-center gap-3">
            <span
              className="material-symbols-outlined text-xl text-on-surface-variant"
              aria-hidden="true"
            >
              person
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">
                {application.name}
              </span>
              <span className="block truncate text-sm text-on-surface-variant">
                {application.email}
                {application.phone ? ` · ${application.phone}` : ""}
              </span>
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3 text-sm text-on-surface-variant">
            <ApplicationStatusBadge status={application.status} />
            {submitted && (
              <time dateTime={application.created_at.replace(" ", "T")}>
                {submitted}
              </time>
            )}
            <span
              className="material-symbols-outlined transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
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
              <p className="mt-1 text-sm text-on-surface-variant">
                No resume attached.
              </p>
            )}
          </div>
        </div>
      </details>
    </li>
  );
}

export function ApplicationsSection({
  applications,
}: {
  applications: ApplicationRow[];
}) {
  return (
    <section aria-labelledby="applications-heading" className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 id="applications-heading" className="text-lg font-semibold">
          Applications
        </h3>
        <span className="inline-flex items-center rounded-pill bg-surface-container-highest px-2.5 py-0.5 text-xs font-medium text-on-surface-variant">
          {applications.length}
        </span>
      </div>
      {applications.length === 0 ? (
        <p className="rounded-lg border border-dashed border-outline-variant p-6 text-sm text-on-surface-variant">
          No applications yet.
        </p>
      ) : (
        <ul className="divide-y divide-outline-variant rounded-lg border border-outline-variant bg-surface-container-lowest">
          {applications.map((application) => (
            <ApplicationItem key={application.id} application={application} />
          ))}
        </ul>
      )}
    </section>
  );
}
