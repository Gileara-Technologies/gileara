-- Migration number: 0001 	 2026-10-08T05:23:12.230Z
-- Careers portal schema (docs/PORTAL-PLAN.md, phases 1-2).
--
-- roles mirrors the src/content/roles.ts OpenRole shape; the three list
-- fields are stored as JSON arrays to keep the SQL simple and the row
-- payload a direct match for the TS interface.
--
-- applications intentionally has NO status column: docs/PORTAL-DESIGN.md
-- scopes HR follow-up to email, no candidate tracking.

CREATE TABLE roles (
  id TEXT PRIMARY KEY,                -- slug, e.g. 'full-stack-engineer'
  title TEXT NOT NULL,
  openings INTEGER NOT NULL DEFAULT 1,
  icon TEXT NOT NULL DEFAULT 'assignment',   -- Material Symbols glyph
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT NOT NULL DEFAULT '[]',  -- JSON string array
  required_skills TEXT NOT NULL DEFAULT '[]',   -- JSON string array
  nice_to_have TEXT NOT NULL DEFAULT '[]',      -- JSON string array
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'paused', 'closed')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_roles_status_order ON roles (status, display_order);

CREATE TABLE applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id TEXT NOT NULL REFERENCES roles (id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  -- R2 object key. Empty until R2 is enabled on the account and the
  -- apply flow uploads; resume_filename still preserves the original name.
  resume_key TEXT NOT NULL DEFAULT '',
  resume_filename TEXT NOT NULL,
  cover_letter TEXT,
  why_this_role TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_applications_role ON applications (role_id, created_at DESC);
CREATE INDEX idx_applications_email ON applications (email);
