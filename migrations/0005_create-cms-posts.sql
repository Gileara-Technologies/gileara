-- Migration number: 0005
-- CMS, Insights slice (docs/CMS-PLAN.md): second content type after FAQs
-- (0004). Same gileara_careers_db binding, same draft/published +
-- audit-trail shape.
--
-- body stores the lightweight markdown-subset source (src/lib/cms/markdown.ts),
-- parsed into the existing PostBlock[] shape at read time -- the parsed
-- result is never stored, so editing a post shows back the exact source
-- that was written, not a lossy reconstruction.
--
-- post_date is an editorial field the author sets (matches the existing
-- src/content/posts.ts `date` field), not derived from created_at/
-- updated_at -- an author may want to backdate or schedule posts in a
-- specific order independent of when the row happened to be saved.
--
-- tag is constrained to the same fixed taxonomy as src/content/posts.ts's
-- POST_TAGS -- "do not invent new ones casually" applies in the CMS too.
--
-- image is a plain text path/URL for now (an existing /public/assets/...
-- file, or an external URL). The CMS plan's public R2 bucket for
-- uploaded cover images has not been provisioned yet.

CREATE TABLE cms_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  post_date TEXT NOT NULL,
  author TEXT NOT NULL,
  tag TEXT NOT NULL
    CHECK (tag IN ('Packages', 'Operations', 'Growth', 'Automation', 'Small business')),
  image TEXT,
  body TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);

CREATE INDEX idx_cms_posts_status_date ON cms_posts (status, post_date DESC);
