-- Migration number: 0008
-- Instagram connector (docs/INSTAGRAM-CONNECTOR-PLAN.md): a cache table
-- for recent media pulled from the Instagram Graph API (Instagram API
-- with Instagram Login path), NOT a CMS content type in the
-- draft/published sense docs/CMS-PLAN.md established for cms_faqs (0004),
-- cms_posts (0005), cms_scenarios (0006), cms_people (0007).
--
-- Reuses the existing gileara_careers_db binding -- same reasoning as
-- every CMS table before it: no relationship to roles/applications, and
-- a second D1 database would double the operational surface for no
-- benefit at this scale.
--
-- id is the Instagram media id itself (TEXT PRIMARY KEY), not an
-- AUTOINCREMENT integer: this table is an upsert-by-remote-id cache of
-- someone else's data, not editor-authored content with no natural key.
-- Every sync does INSERT ... ON CONFLICT(id) DO UPDATE, so a post that
-- disappears from the API response simply stops being refreshed --
-- nothing here deletes a row just because one sync didn't see it again.
--
-- No status column (draft/published): nothing is ever "drafted" here,
-- there is only a binary editor override of whether an already-real,
-- already-posted photo is shown on the site. `visible` is that override
-- (defaults to 1 -- shown -- so a freshly-synced post appears
-- immediately without a second admin step). `display_order` is a
-- nullable manual override of sort; NULL means "use posted_at order",
-- which is also why display_order has no DEFAULT 0 the way
-- cms_faqs.display_order does -- 0 would be a real, sortable value here,
-- colliding with an editor who deliberately pins something to position 0.
--
-- `synced_at` is stamped on every upsert (new row or refreshed row)
-- so the admin status page can show "last synced" without a separate
-- metadata table.

CREATE TABLE cms_instagram_posts (
  id TEXT PRIMARY KEY,
  media_type TEXT NOT NULL
    CHECK (media_type IN ('IMAGE', 'VIDEO', 'CAROUSEL_ALBUM')),
  media_url TEXT NOT NULL,
  permalink TEXT NOT NULL,
  caption TEXT,
  thumbnail_url TEXT,
  posted_at TEXT NOT NULL,
  display_order INTEGER,
  visible INTEGER NOT NULL DEFAULT 1,
  synced_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_cms_instagram_posts_visible_order
  ON cms_instagram_posts (visible, display_order, posted_at);
