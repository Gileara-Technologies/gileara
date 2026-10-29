/**
 * Pure helpers for the admin UI: role-form validation, dynamic list-field
 * parsing, status-action mapping (roles and applications), and timestamp
 * display. No I/O, no React, no Cloudflare context — unit tested in
 * tests/lib/portal/admin.test.ts.
 *
 * Fields mirror the roles schema (migrations/0001): title, openings, icon,
 * location, description, and the three JSON list columns. docs/PORTAL-DESIGN.md
 * mentions team/type/what-we-offer in its create-form sketch, but those
 * columns do not exist in the schema, so the form follows the schema.
 */

import { slugify } from "@/lib/portal/slug";
import type { ApplicationStatus, RoleStatus } from "@/lib/portal/types";

/** Result shape returned by the admin server actions to useActionState. */
export interface ActionState {
  error: string | null;
}

/** Schema default for roles.icon (migrations/0001). */
export const DEFAULT_ICON = "assignment";

export const ROLE_STATUSES: readonly RoleStatus[] = ["open", "paused", "closed"];

const ROLE_STATUS_SET: ReadonlySet<string> = new Set(ROLE_STATUSES);

export function isRoleStatus(value: unknown): value is RoleStatus {
  return typeof value === "string" && ROLE_STATUS_SET.has(value);
}

/** Human label for a status (badges, select options). */
export function statusLabel(status: RoleStatus): string {
  if (status === "open") return "Open";
  if (status === "paused") return "Paused";
  return "Closed";
}

/** One status transition offered on a dashboard role row. */
export interface StatusAction {
  next: RoleStatus;
  label: string;
  /** Material Symbols glyph for the button. */
  icon: string;
}

/**
 * Pause/Resume action for the role's current status: open roles pause,
 * paused roles resume, closed roles reopen.
 */
export function statusActionFor(status: RoleStatus): StatusAction {
  if (status === "open") return { next: "paused", label: "Pause", icon: "pause" };
  if (status === "paused") return { next: "open", label: "Resume", icon: "play_arrow" };
  return { next: "open", label: "Resume", icon: "restart_alt" };
}

/** Closing action, offered only while the role is not already closed. */
export const CLOSE_ACTION: StatusAction = {
  next: "closed",
  label: "Close",
  icon: "block",
};

export function canClose(status: RoleStatus): boolean {
  return status !== "closed";
}

// ---------------------------------------------------------------------------
// Application status (migration 0003)
// ---------------------------------------------------------------------------

/** Order offered in the status select. `new` is the schema default. */
export const APPLICATION_STATUSES: readonly ApplicationStatus[] = [
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
];

const APPLICATION_STATUS_SET: ReadonlySet<string> = new Set(
  APPLICATION_STATUSES,
);

export function isApplicationStatus(
  value: unknown,
): value is ApplicationStatus {
  return typeof value === "string" && APPLICATION_STATUS_SET.has(value);
}

const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  hired: "Hired",
};

/** Human label for an application status (badge text, select options). */
export function applicationStatusLabel(status: ApplicationStatus): string {
  return APPLICATION_STATUS_LABELS[status];
}

/**
 * All trimmed, non-empty values posted under `key`. The dynamic list inputs
 * render one named input per row, so FormData.getAll collects them in order
 * and blank placeholder rows fall out here.
 */
export function formList(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .map((entry) => String(entry).trim())
    .filter((entry) => entry !== "");
}

/** Validated, schema-shaped value produced by validateRoleForm. */
export interface RoleFormValue {
  title: string;
  openings: number;
  icon: string;
  location: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  niceToHave: string[];
  status: RoleStatus;
}

export type RoleFormResult =
  | { ok: true; value: RoleFormValue }
  | { ok: false; error: string };

/**
 * Validate the create/edit role form. Status is absent on create (defaults
 * to "open"); an unrecognized status value also falls back to "open" rather
 * than failing the whole save.
 */
export function validateRoleForm(formData: FormData): RoleFormResult {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { ok: false, error: "Give the role a title." };
  }
  if (!slugify(title)) {
    return {
      ok: false,
      error: "Use a title with at least one letter or number.",
    };
  }
  const location = String(formData.get("location") ?? "").trim();
  if (!location) {
    return { ok: false, error: "Add a location for the role." };
  }
  const description = String(formData.get("description") ?? "").trim();
  if (!description) {
    return { ok: false, error: "Add a description for the role." };
  }
  const openingsRaw = String(formData.get("openings") ?? "").trim();
  const openings = Number(openingsRaw);
  if (openingsRaw === "" || !Number.isInteger(openings) || openings < 1) {
    return {
      ok: false,
      error: "Openings must be a whole number of 1 or more.",
    };
  }
  const icon = String(formData.get("icon") ?? "").trim() || DEFAULT_ICON;
  const statusRaw = formData.get("status");
  return {
    ok: true,
    value: {
      title,
      openings,
      icon,
      location,
      description,
      responsibilities: formList(formData, "responsibilities"),
      requiredSkills: formList(formData, "requiredSkills"),
      niceToHave: formList(formData, "niceToHave"),
      status: isRoleStatus(statusRaw) ? statusRaw : "open",
    },
  };
}

export interface StatusActionFormValue {
  id: string;
  status: RoleStatus;
}

/**
 * Validate the hidden fields of a dashboard status form (role id + target
 * status). Returns null when either field is missing or malformed.
 */
export function validateStatusActionForm(
  formData: FormData,
): StatusActionFormValue | null {
  const id = String(formData.get("id") ?? "").trim();
  const status = formData.get("status");
  if (!id || !isRoleStatus(status)) {
    return null;
  }
  return { id, status };
}

export interface ApplicationStatusFormValue {
  id: number;
  status: ApplicationStatus;
  roleId: string;
  /** Where to redirect after a successful save; defaults to the role page. */
  returnTo: string;
}

/**
 * Validate the hidden fields of an application status form (row id, target
 * status, and the role to redirect back to). Returns null when anything is
 * missing or malformed — the action then bounces to /admin?error=invalid
 * instead of writing a bad row.
 *
 * `returnTo` is optional: the per-role applications list doesn't set it
 * (falls back to `/admin/roles/{roleId}`), but the global applications
 * board does, so a status change made there redirects back to the board
 * instead of away to that one role's page. Only an internal /admin/ path
 * is accepted — anything else is ignored rather than trusted, since this
 * value arrives as a plain hidden form field.
 */
export function validateApplicationStatusForm(
  formData: FormData,
): ApplicationStatusFormValue | null {
  const idRaw = String(formData.get("id") ?? "").trim();
  const id = Number(idRaw);
  const status = formData.get("status");
  const roleId = String(formData.get("roleId") ?? "").trim();
  if (!idRaw || !Number.isInteger(id) || id < 1) {
    return null;
  }
  if (!roleId || !isApplicationStatus(status)) {
    return null;
  }
  const returnToRaw = String(formData.get("returnTo") ?? "").trim();
  const returnTo = returnToRaw.startsWith("/admin/") ? returnToRaw : `/admin/roles/${roleId}`;
  return { id, status, roleId, returnTo };
}

/**
 * D1's datetime('now') text (also tolerates ISO with 'T'/trailing 'Z')
 * rendered as 'YYYY-MM-DD HH:MM' for application timestamps.
 */
export function formatDbTimestamp(raw: string): string {
  const trimmed = raw.trim().replace("T", " ").replace(/Z$/, "");
  if (!trimmed) {
    return "";
  }
  return trimmed.slice(0, 16);
}

/**
 * Epoch milliseconds for a D1 timestamp. D1's datetime('now') is UTC with
 * no timezone suffix, so the raw string is explicitly parsed as UTC
 * (appending 'Z') rather than left to the platform default, which reads a
 * bare 'YYYY-MM-DD HH:MM:SS' as local time and would skew the result by the
 * server's offset. Returns NaN for blank/unparseable input — check with
 * Number.isNaN before using the result.
 */
export function parseDbTimestampMs(raw: string): number {
  const trimmed = raw.trim();
  if (!trimmed) {
    return NaN;
  }
  const iso = trimmed.endsWith("Z") ? trimmed : `${trimmed.replace(" ", "T")}Z`;
  return new Date(iso).getTime();
}

/**
 * "2h ago" / "3d ago" style relative time for a D1 timestamp, used on the
 * dashboard's recent-activity feed. `now` is injectable so tests don't
 * depend on the clock.
 */
export function formatRelativeTime(raw: string, now: Date = new Date()): string {
  const thenMs = parseDbTimestampMs(raw);
  if (Number.isNaN(thenMs)) {
    return "";
  }
  const then = new Date(thenMs);
  const diffSec = Math.round((now.getTime() - then.getTime()) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffDay < 30) return `${Math.round(diffDay / 7)}w ago`;
  if (diffDay < 365) return `${Math.round(diffDay / 30)}mo ago`;
  return `${Math.round(diffDay / 365)}y ago`;
}
