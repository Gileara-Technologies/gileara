-- Migration number: 0004
-- CMS foundation, FAQ slice (docs/CMS-PLAN.md): the first content type
-- moved off a src/content/*.ts module and into D1, proving the pipeline
-- (admin CRUD -> D1 -> public page) before Insights and Playbooks follow
-- the same shape.
--
-- Reuses the existing gileara_careers_db binding rather than a second D1
-- database -- these tables have no relationship to roles/applications,
-- and splitting them would double the operational surface for no real
-- benefit at this scale.
--
-- status mirrors the draft/published convention the rest of the CMS will
-- use: a new FAQ starts as a draft so an editor can write it without it
-- going live immediately. updated_by is the signed-in content-editor
-- email (isAllowedContentEditorEmail), the same audit-trail shape as
-- applications.status_updated_by in 0003.

CREATE TABLE cms_faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);

CREATE INDEX idx_cms_faqs_status_order ON cms_faqs (status, display_order);
