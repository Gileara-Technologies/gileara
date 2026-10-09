-- Migration number: 0003
-- Phase 7 (docs/PORTAL-PLAN.md): application status tracking.
--
-- 0001 deliberately shipped `applications` WITHOUT a status column, scoping HR
-- follow-up to email outside the portal. Phase 7 reverses that: HR gets an
-- in-system queue (status) plus an audit trail of who moved an application
-- and when. Rows already stored become 'new', which is what an unreviewed
-- application always was.
--
-- status_updated_* stay NULL until the first transition, so a blank cell
-- truthfully means "nobody has moved this yet".
--
-- Apply with: npx wrangler d1 migrations apply gileara-careers-db --remote

ALTER TABLE applications ADD COLUMN status TEXT NOT NULL DEFAULT 'new'
  CHECK (status IN ('new', 'reviewing', 'shortlisted', 'rejected', 'hired'));

ALTER TABLE applications ADD COLUMN status_updated_at TEXT;

ALTER TABLE applications ADD COLUMN status_updated_by TEXT;
