/**
 * Shared server-rendered pieces for the admin pages: status badges, the
 * database-unavailable notice, the dashboard error banner, and a back link.
 * No hooks and no "use client", so every admin server component can import
 * these directly.
 */

import Link from "next/link";
import type { ApplicationStatus, RoleStatus } from "@/lib/portal/types";
import { DB_UNAVAILABLE_MESSAGE } from "./admin-db";
import { applicationStatusLabel, statusLabel } from "./form-logic";

const STATUS_BADGE_CLASSES: Record<RoleStatus, string> = {
  open: "bg-secondary-container text-on-secondary-container",
  paused: "bg-tertiary-container text-on-tertiary-container",
  closed: "bg-surface-container-highest text-on-surface-variant",
};

export function StatusBadge({ status }: { status: RoleStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}

const APPLICATION_STATUS_BADGE_CLASSES: Record<ApplicationStatus, string> = {
  new: "bg-secondary-container text-on-secondary-container",
  reviewing: "bg-tertiary-container text-on-tertiary-container",
  shortlisted: "bg-primary-container text-on-primary-container",
  rejected: "bg-error-container text-on-error-container",
  hired: "bg-primary text-on-primary",
};

/** Review-state pill for one application (Phase 7, migrations/0003). */
export function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium ${APPLICATION_STATUS_BADGE_CLASSES[status]}`}
    >
      {applicationStatusLabel(status)}
    </span>
  );
}

/** Shown on any admin page when the D1 binding cannot be reached. */
export function DbUnavailableNotice() {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-md border border-outline-variant bg-surface-container-low p-4"
    >
      <span
        className="material-symbols-outlined text-base text-on-surface-variant"
        aria-hidden="true"
      >
        cloud_off
      </span>
      <div className="text-sm">
        <p className="font-medium text-on-surface">{DB_UNAVAILABLE_MESSAGE}</p>
        <p className="mt-1 text-on-surface-variant">
          Roles and applications live in the portal database, which this
          environment cannot reach right now. Nothing was changed.
        </p>
      </div>
    </div>
  );
}

const ACTION_ERROR_MESSAGES: Record<string, string> = {
  unavailable: DB_UNAVAILABLE_MESSAGE,
  invalid: "That action was not valid, so nothing changed.",
  save: "That change could not be saved, so nothing changed.",
};

/** Banner for `?error=` codes appended by the status server action. */
export function ActionErrorBanner({ code }: { code?: string }) {
  if (!code) {
    return null;
  }
  const message = ACTION_ERROR_MESSAGES[code];
  if (!message) {
    return null;
  }
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-md border border-error bg-error-container p-4 text-sm text-on-error-container"
    >
      <span className="material-symbols-outlined text-base" aria-hidden="true">
        error
      </span>
      <p>{message}</p>
    </div>
  );
}

export function BackToDashboard() {
  return (
    <Link
      href="/admin"
      className="inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
    >
      <span className="material-symbols-outlined text-base" aria-hidden="true">
        arrow_back
      </span>
      Dashboard
    </Link>
  );
}
