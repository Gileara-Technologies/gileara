-- Migration number: 0007
-- CMS, People slice (docs/CMS-PLAN.md): fourth content type, same
-- gileara_careers_db binding and draft/published + audit-trail shape as
-- cms_faqs (0004), cms_posts (0005), and cms_scenarios (0006).
--
-- Replaces src/content/team.ts's two hand-maintained arrays (foundation,
-- roster) with one table distinguished by person_group. Named
-- person_group rather than the bare word "group" -- SQLite accepts
-- "group" as a column name, but it is a reserved keyword in standard SQL
-- and in SQLite's own GROUP BY clause, so every other column in this
-- codebase that could collide with a keyword is already prefixed
-- (scenario_status, not status, on cms_scenarios) -- same reasoning here.
--
-- Two groups, one table, rather than two tables: a "person" is the same
-- kind of record in both places (name, role, optional portrait) with the
-- about page choosing a different visual treatment per group (Foundation
-- gets a full quote; Roster gets a department tag) -- that is a rendering
-- decision, not a schema one. display_order is scoped within a group at
-- read time (ORDER BY person_group, display_order, id); nothing enforces
-- the two groups share a numbering space.
--
-- department is free TEXT, not a CHECK-constrained enum: the admin form
-- offers the known list from src/content/team.ts's DEPARTMENTS export as
-- a <select>, which is enough enforcement for a content-editor tool, and
-- keeps a sixth department from ever needing a new migration. quote is
-- only ever populated for person_group = 'foundation' today, but nothing
-- stops a future roster entry from carrying one -- the about page simply
-- doesn't render it there yet.
--
-- image is nullable at the schema level (roster members render initials
-- when absent, same as today), but the admin form requires it when
-- person_group = 'foundation' -- every founder has always had a photo,
-- and that is a form-validation rule, not a schema one, same split as
-- cms_posts.image (schema-nullable, UI-optional) vs this (schema-nullable,
-- UI-conditionally-required).

CREATE TABLE cms_people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  person_group TEXT NOT NULL CHECK (person_group IN ('foundation', 'roster')),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  quote TEXT,
  image TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);

CREATE INDEX idx_cms_people_group_status ON cms_people (person_group, status, display_order);
