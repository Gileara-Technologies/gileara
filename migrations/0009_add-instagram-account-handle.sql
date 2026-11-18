-- Migration number: 0009
-- Instagram connector: the site now pulls from two Instagram accounts
-- (@gileara and @ins.gileara), so each cached post records which
-- account it came from. Nullable: rows synced before this migration
-- have no handle, and the public feed simply omits the label for them.
-- The next sync fills it in (the upsert writes account_handle on
-- conflict too).

ALTER TABLE cms_instagram_posts ADD COLUMN account_handle TEXT;
