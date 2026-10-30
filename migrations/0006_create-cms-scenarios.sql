-- Migration number: 0006
-- CMS, How We Transform (playbooks) slice (docs/CMS-PLAN.md): third
-- content type, same gileara_careers_db binding and draft/published +
-- audit-trail shape as cms_faqs (0004) and cms_posts (0005).
--
-- Two genuinely different "status" concepts on this table, kept as two
-- separate columns rather than conflated into one:
--   - status           draft/published -- is this playbook visible on
--                       the public site at all (the CMS's own workflow).
--   - scenario_status   scenario/pilot/case-study -- the HONESTY
--                       CONTRACT label from src/content/scenarios.ts:
--                       whether this is a playbook with no client yet, a
--                       real engagement running now, or a completed one
--                       with approved published results. A playbook can
--                       be published (visible) while still scenario_status
--                       'scenario' (no client) -- that's the current
--                       state of every seeded playbook today. Moving a
--                       playbook along scenario -> pilot -> case-study is
--                       the main reason this slice exists: that edit
--                       currently needs a code change and a deploy.
--
-- pain_points, package_ids, implementation, and target_outcomes are JSON
-- TEXT columns, same convention as roles.responsibilities /
-- required_skills / nice_to_have in migrations/0001 -- keeps the SQL
-- simple and the row payload a direct match for the TS interface.
-- implementation is a JSON array of {phase, detail} objects (not a flat
-- string array like the other three).
--
-- package_ids references src/content/packages.ts's servicePackages,
-- which is NOT a CMS-managed table (pricing/services stayed out of CMS
-- scope deliberately -- docs/CMS-PLAN.md). The admin form constrains
-- this to real package ids via checkboxes, not freeform text, so a typo
-- here can't silently produce a dead reference.

CREATE TABLE cms_scenarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  vertical TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'business_center',
  headline TEXT NOT NULL,
  pain_points TEXT NOT NULL DEFAULT '[]',
  package_ids TEXT NOT NULL DEFAULT '[]',
  implementation TEXT NOT NULL DEFAULT '[]',
  target_outcomes TEXT NOT NULL DEFAULT '[]',
  ghana_context TEXT NOT NULL,
  image TEXT,
  scenario_status TEXT NOT NULL DEFAULT 'scenario'
    CHECK (scenario_status IN ('scenario', 'pilot', 'case-study')),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);

CREATE INDEX idx_cms_scenarios_status ON cms_scenarios (status, vertical);
