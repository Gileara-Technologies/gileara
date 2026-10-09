/**
 * Row and domain shapes for the careers portal data layer.
 * Schema: migrations/0001_create-portal-schema.sql + 0003_add-application-status.sql
 * (binding `gileara_careers_db` in wrangler.toml).
 *
 * RoleRow / ApplicationRow mirror the D1 columns 1:1 (snake_case); the three
 * role list fields arrive as JSON TEXT and are parsed by the db layer.
 * ParsedRole is the domain shape consumers use — it is OpenRole-compatible
 * (src/content/roles.ts): every OpenRole field exists here, with the list
 * fields parsed to string[].
 */

export type RoleStatus = "open" | "paused" | "closed";

/**
 * Application review state (migration 0003). `new` is the schema default and
 * means "nobody has moved this yet" — the same applications 0001 collected
 * while HR tracked everything in their inbox.
 */
export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

/** Raw `roles` row as stored in D1. List fields are serialized JSON arrays. */
export interface RoleRow {
  id: string;
  title: string;
  openings: number;
  icon: string;
  location: string;
  description: string;
  /** JSON string array, e.g. '["a","b"]' */
  responsibilities: string;
  /** JSON string array */
  required_skills: string;
  /** JSON string array */
  nice_to_have: string;
  status: RoleStatus;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Parsed role — an OpenRole-compatible superset. Adds `status`, ordering,
 * and timestamp fields the portal needs but src/content/roles.ts lacks.
 */
export interface ParsedRole {
  id: string;
  title: string;
  openings: number;
  icon: string;
  location: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  niceToHave: string[];
  status: RoleStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Raw `applications` row as stored in D1. */
export interface ApplicationRow {
  id: number;
  role_id: string;
  name: string;
  email: string;
  phone: string | null;
  /** R2 object key; "" until the apply flow uploads */
  resume_key: string;
  resume_filename: string;
  cover_letter: string | null;
  why_this_role: string | null;
  created_at: string;
  /** Review state; schema default 'new' (migration 0003). */
  status: ApplicationStatus;
  /** D1 datetime of the last transition; null until someone moves it. */
  status_updated_at: string | null;
  /** Admin email that made the last transition; null until someone moves it. */
  status_updated_by: string | null;
}