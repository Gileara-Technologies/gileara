# Instagram Connector Plan

**Status**: Built, committed, and **dormant**. Migrations 0008 and 0009
are applied to the production D1 database. Nothing has run against the
real Instagram API yet because that requires secrets only a human
operator can produce (a Meta Developer App and a completed Business
Login for Instagram flow per account) — there is no API access in this
environment to provision them. Until they are set as Cloudflare Secrets,
the homepage section renders "Follow @gileara" / "Follow @ins.gileara"
links instead of posts and the admin page shows each account as "Not
set" — the site works correctly either way.

## Two accounts (added 2026-11-18)

The site pulls from **@gileara** and **@ins.gileara**, listed once in
`src/content/site-config.ts` (`instagramAccounts`) and reused by the
footer, the homepage feed, the admin page, and Organization JSON-LD
`sameAs`. Instagram Login issues a token per account, so each account
has its own pair of Cloudflare Secrets:

| Account | Token secret | Account-id secret |
|---|---|---|
| @gileara | `INSTAGRAM_ACCESS_TOKEN` | `INSTAGRAM_BUSINESS_ACCOUNT_ID` |
| @ins.gileara | `INSTAGRAM_ACCESS_TOKEN_INS` | `INSTAGRAM_BUSINESS_ACCOUNT_ID_INS` |

The original names were kept for @gileara so nothing already set
breaks. Run the operator steps below once per account. "Sync now" syncs
every account that has both secrets set, skips the rest, and reports a
partial failure separately from a full one. Each cached row records its
`account_handle` (migration 0009), shown as a label on the public feed.
Wherever the rest of this document says "the two secrets," read "the two
secrets for that account."

## Goal

Pull Gileara's recent Instagram posts onto the public site (homepage)
without hand-copying captions and photos, and let a content editor hide
an individual cached post without touching code. Same architectural
instinct as docs/CMS-PLAN.md — extend the existing admin portal (D1,
session guard, admin shell) rather than add a new service — but this is
explicitly **not** a CMS content type: nothing here is authored, drafted,
or reviewed. It is a read-through cache of someone else's real data, with
one editor-controlled bit per row (shown / hidden).

## Research — current Instagram Graph API shape (confirmed just now)

Meta shut down the **Instagram Basic Display API** in December 2024; it
is not usable and this connector does not target it. Current state, as
of this plan (sourced from `developers.facebook.com/docs/instagram-platform/*`
via Wayback Machine snapshots dated 2025-12 / 2026-01/02, since this
environment's web_search tool was unavailable and the live docs pages
render via client-side JS that the fetch tool cannot execute — flagging
this chain of evidence plainly rather than asserting from memory):

1. **Two parallel paths exist today**: "Instagram API with Instagram
   Login" (login directly against an Instagram professional account,
   endpoint host `graph.instagram.com`) and "Instagram API with Facebook
   Login" (the older Page-linked flow, endpoint host `graph.facebook.com`,
   needs `pages_show_list`/`pages_read_engagement` and a connected
   Facebook Page). **This plan targets Instagram API with Instagram
   Login** — it needs only an Instagram professional (Business or
   Creator) account, no Facebook Page dependency, which is the simpler
   and more future-proof of the two (Meta's own docs lead with it).
2. **Account type required**: an Instagram **professional account**
   (Business or Creator) — `account_type` returned by the API is
   `Business` or `Media_Creator`. A personal account cannot be used at
   all (`/<IG_ID>/media` only returns data for professional accounts).
3. **App/credentials required**: a Meta Developer App created with
   **Business** app type, with the Instagram product added and "Business
   Login for Instagram" configured in the App Dashboard. That dashboard
   screen issues an **Instagram App ID** and **Instagram App Secret**
   (used only during the one-time OAuth/token-exchange a human performs
   to mint the token this app will consume — never stored in this repo).
   Scopes, per Meta's January 2025 scope-rename changelog: the modern
   names are `instagram_business_basic` (read access — all this
   connector needs), plus `instagram_business_content_publish`,
   `instagram_business_manage_messages`, `instagram_business_manage_comments`
   for capabilities this connector does not use. The older
   `instagram_basic`/`business_basic` names are deprecated (cutover was
   January 27, 2025) — do not request those.
4. **Media-list endpoint and fields** (current API version at the time
   of research: **v24.0** — Meta ships a new major version roughly every
   6–12 months and old ones eventually sunset, so re-check the version
   before this goes live if much time has passed):
   ```
   GET https://graph.instagram.com/v24.0/<IG_ID>/media
     ?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp
     &access_token=<LONG_LIVED_TOKEN>
     &limit=25
   ```
   Confirmed field set on the `IG Media` reference: `id`, `caption`,
   `media_type` (`IMAGE` | `VIDEO` | `CAROUSEL_ALBUM`), `media_url`,
   `permalink`, `thumbnail_url` (video only), `timestamp` (ISO 8601),
   `username`. This is exactly the field list `src/lib/instagram/sync.ts`
   requests and maps — one-to-one with `cms_instagram_posts`' columns.
5. **Token lifetime and refresh** (confirmed on the Business Login for
   Instagram doc): the OAuth code-exchange yields a **short-lived token
   (1 hour)**; exchanging that via `GET https://graph.instagram.com/access_token
   ?grant_type=ig_exchange_token` yields a **long-lived token valid 60
   days**. A long-lived token can be refreshed for another 60 days via
   `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token`,
   provided it is **at least 24 hours old, still valid, and was granted
   `instagram_business_basic`**. A token that is never refreshed within
   60 days of its own expiry cannot be refreshed afterward and must be
   re-minted from scratch via the login flow. **This connector does not
   automate refresh** (see "Deliberately excluded" below) — a human must
   refresh the token at least once every ~60 days, or sync silently
   starts failing with an expired-token error visible on the admin page.
6. **Rate limits**: Meta's official formula for the Instagram Platform is
   roughly impression-based per professional account per rolling 24h
   window (approximately `4800 + 150 × recent impressions`), not a flat
   request count — Meta's own wording on this has shifted over the years
   and the exact constants are not guaranteed stable, so treat this as
   "order of magnitude: thousands of calls/day," not a number to code
   against. A manual button-triggered sync (at most a few calls/day) is
   nowhere near this ceiling regardless of the exact formula; this is
   flagged as an area of real uncertainty rather than asserted precisely.

## Design decisions

1. **Instagram API with Instagram Login, not Facebook Login or Basic
   Display.** Simpler credential model (no Facebook Page required),
   matches Meta's current recommended path, and Basic Display is dead.
2. **Secrets**: `INSTAGRAM_ACCESS_TOKEN` (the long-lived user access
   token) and `INSTAGRAM_BUSINESS_ACCOUNT_ID` (the IG professional
   account's numeric id, the `<IG_ID>` in the endpoint path). Both set
   as **Cloudflare Secrets** (`wrangler secret put NAME`, or pasted in
   the dashboard) in production, `.env.local` in dev — never in
   `wrangler.toml [vars]`, per docs/SECRETS.md, which this plan also
   updates. There is deliberately no admin-UI field to paste a token
   into; `src/lib/instagram/sync.ts` and the "Sync now" action read them
   only via the Cloudflare env/`process.env`, exactly like every other
   secret in this codebase.
3. **Cache table, not a CMS content type.** `cms_instagram_posts`
   (migration `0008`) has no `status: draft/published` column — see the
   migration's own comment for why: nothing is ever drafted here, there
   is only a binary `visible` override on an already-real, already-
   published Instagram post. `id` is the Instagram media id itself (TEXT
   PRIMARY KEY), because this is an upsert-by-remote-id cache, not
   editor-authored content with no natural key — every sync does
   `INSERT ... ON CONFLICT(id) DO UPDATE`, preserving `display_order`/
   `visible` (those two columns are never written by the sync's INSERT
   column list or its `ON CONFLICT` `SET` clause).
4. **Sync trigger: a manual "Sync now" button today; a documented, not
   built, Cron Trigger for later.** `wrangler.toml` has no `[triggers]`
   block and no `src/`/`open-next.config.ts` precedent for a non-HTTP
   Cloudflare entry point in this codebase today — OpenNext's Cloudflare
   adapter does support a `scheduled` handler, but wiring one here would
   mean a second worker-level entry point this build has never needed
   before, plus the question of where a cron-triggered sync gets its D1
   binding and env vars from outside a request context. That is a real
   but separable piece of work, not something to half-wire silently.
   Given the token-refresh reality above (a human has to touch this at
   least every ~60 days anyway), a human clicking "Sync now" on a normal
   cadence is sufficient for v1 and is what ships today. **Future step**:
   add `[triggers] crons = ["0 3 * * *"]` to `wrangler.toml` and a
   `scheduled()` export (OpenNext Cloudflare supports this — see
   `@opennextjs/cloudflare`'s docs) that calls the same
   `syncInstagramPosts()` this plan built, reusing 100% of the sync
   logic — only the trigger and the env-binding plumbing would be new.
5. **No fallback array on the public read side — a deliberate deviation
   from the rest of this CMS.** Every other `public-{type}.ts` module in
   this codebase (`public-faqs.ts`, `public-posts.ts`,
   `public-scenarios.ts`) falls back to a hand-authored
   `src/content/*.ts` module when D1 is empty or unreachable, because
   that fallback content is real, honest, hand-written copy. There is no
   honest hand-authored stand-in for "Gileara's actual recent Instagram
   photos" — fabricating placeholder post tiles would be exactly the
   kind of invented content this project's honesty conventions
   (`docs/IMAGERY.md`, the goals-not-results framing on `/how-we-transform`)
   exist to prevent. `getPublicInstagramPosts()` returns `[]` on any
   failure or empty cache, full stop, and `InstagramFeed.tsx` renders a
   plain "Follow us on Instagram" link instead of a grid when the list
   is empty — never fake tiles, never an obviously-broken empty section.

## Architecture

- **DB**: Cloudflare D1, the shared `gileara_careers_db` binding (same
  reasoning as every CMS table before it — no relationship to
  roles/applications/CMS content, and a second database would double
  the operational surface for no benefit at this scale). Migration:
  `migrations/0008_create-cms-instagram-posts.sql` (`0007` was already
  claimed by the concurrent People slice, confirmed before writing this
  migration).
- **Sync** (`src/lib/instagram/sync.ts`): `syncInstagramPosts(deps)`
  takes `{ db, fetchFn, accessToken, businessAccountId, limit?, nowIso? }`
  as explicit parameters — never reads `process.env` itself, same
  "env-reading lives at the call site" discipline as
  `src/app/admin/admin-db.ts`. Calls `GET
  https://graph.instagram.com/v24.0/<IG_ID>/media` with the field list
  above, maps each item to a cache row (malformed items are skipped, not
  fatal), and upserts every row. Never throws — every failure path
  (missing credentials, non-OK HTTP response, thrown network error)
  returns `{ ok: false, fetched: 0, error }`.
- **Admin read/write** (`src/lib/instagram/db.ts`): `listInstagramPosts`,
  `setInstagramPostVisible` — the small "list everything, flip one row's
  visible flag" surface the admin page needs, kept separate from
  `sync.ts` so that file stays single-purpose (network + upsert) as the
  task asked.
- **Public read** (`src/lib/instagram/public-instagram.ts`):
  `getPublicInstagramPosts(limit = 9)` reads only `visible = 1` rows,
  ordered by `display_order` ascending (NULLs last) then `posted_at`
  descending. No fallback array (see design decision 5).
- **Admin UI** (`src/app/admin/content/instagram/page.tsx`): status page,
  not a form — last-synced time, cached/visible counts, a "Sync now"
  button, a configured/unconfigured notice, and a table with a
  show/hide toggle per row. Server actions live in
  `src/app/admin/content/instagram-actions.ts` (a new file, not the
  shared `actions.ts` the concurrent People change may also be editing).
  `requireContentEditorSession()` first in every action and the page
  itself, `tryGetPortalDb()` / `tryGetCloudflareEnv()` for D1 and the two
  secrets, `export const dynamic = "force-dynamic"` — all matching the
  FAQs admin slice exactly.
- **Public UI** (`src/components/InstagramFeed.tsx`): a small grid
  reusing `Roster.tsx`'s portrait-forward card and `IndustryStrip.tsx`'s
  image-with-gradient-caption idiom — dark-mode-only Tailwind + the
  `globals.css` custom-property tokens, Material Symbols, no new
  libraries. Placed on the homepage (`src/app/page.tsx`) directly after
  `<IndustryStrip />` and before `<CinematicStory />` (see "Homepage
  placement" below).
- **Fallback/empty-state behavior**: three independent layers can be
  "off" — no Cloudflare D1 context (plain `next dev`), D1 reachable but
  the table empty (connector not yet synced), or the two Instagram
  secrets unset (connector not yet configured) — and all three collapse
  to the same public behavior: `getPublicInstagramPosts()` returns `[]`,
  `InstagramFeed` renders its "Follow us on Instagram" link. The admin
  page additionally distinguishes "D1 unreachable" (shows
  `DbUnavailableNotice`) from "D1 fine but secrets unset" (shows an
  explicit configuration notice next to the Sync button) so an operator
  knows which of the two to fix.

## What a human operator must do before this goes live

This environment has no Meta/Facebook API access — unlike the Cloudflare
work earlier in this project, which had real `wrangler` auth, there is no
equivalent credential-provisioning step available here. A human with
access to the Gileara Instagram account and a Meta Developer account
must, outside this environment:

1. Confirm the Gileara Instagram account is a **professional account**
   (Business or Creator) — convert it in the Instagram app if it is
   still personal.
2. Create a Meta Developer App at developers.facebook.com, **Business**
   type, and add the **Instagram** product.
3. In **App Dashboard → Instagram → API setup with Instagram login**,
   configure **Business Login for Instagram** (redirect URI, scopes —
   at minimum `instagram_business_basic`) and note the **Instagram App
   ID** / **Instagram App Secret** shown there.
4. Run through the Business Login flow once (the embed URL from step 3,
   or the "Generate token" button directly in the App Dashboard next to
   the connected Instagram account) to obtain a **short-lived token**,
   then exchange it for a **long-lived token** (60 days) via
   `GET https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=...&access_token=...`.
   Also note the account's numeric **Instagram User ID** returned
   alongside it (`GET /me?fields=user_id,username`).
5. Set `INSTAGRAM_ACCESS_TOKEN` (the long-lived token) and
   `INSTAGRAM_BUSINESS_ACCOUNT_ID` (the numeric user id) as **Cloudflare
   Secrets** on the `v1` worker (`wrangler secret put INSTAGRAM_ACCESS_TOKEN`,
   etc., or paste in the dashboard — see docs/SECRETS.md).
6. Click **"Sync now"** on `/admin/content/instagram` once signed in as a
   content editor. The homepage section and the admin table should both
   populate within the same request.
7. **Ongoing**: refresh the long-lived token before it turns 60 days old
   (`GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=...`)
   and update the Cloudflare Secret with the new value — there is no
   automated refresh in this build (see design decision 4's "future
   step"). A simple calendar reminder is enough at this volume; a Cron
   Trigger that also handles refresh is the natural next build if this
   becomes a recurring chore.

Until step 5 is done, the site is fully functional: the homepage shows
the "Follow us on Instagram" link, and the admin page shows an
unconfigured notice next to a Sync button that will fail loudly (an
`?error=sync-failed` banner) rather than silently.

## Deliberately excluded

- **Automated token refresh.** Needs a scheduled trigger (see design
  decision 4) and a place to persist the refreshed token back into
  Cloudflare Secrets — Workers cannot write their own secrets from
  inside a request/scheduled handler via the standard `env` bindings
  surface, so this would need either a separate out-of-band script
  (e.g. a GitHub Action calling the Cloudflare API with a different,
  more privileged credential) or accepting a human re-pastes the secret
  periodically. Out of scope for this build; flagged above as an
  ongoing manual step.
- **Cloudflare Cron Trigger for automatic periodic sync.** Discussed in
  design decision 4 — the manual button is what ships; the cron
  wiring is a documented future step, not built, because this codebase
  has no existing non-HTTP Workers entry point to extend and adding one
  is a separable decision (new worker entry point, new env-access path
  outside a request) from "build the connector."
- **Pagination beyond the first page of recent media.** `syncInstagramPosts`
  requests `limit=25` (configurable via `deps.limit`) and does not follow
  the Graph API's `paging.cursors` — a small business's homepage feed
  needs "the dozen or so most recent posts," not the full historical
  archive. Revisit if the cache ever needs more than one page's worth.
- **Publishing, comments, insights, or any write-to-Instagram capability.**
  This connector is read-only by design (`instagram_business_basic`
  only) — publishing content back to Instagram from this site was never
  part of the brief and would need additional scopes
  (`instagram_business_content_publish`) and a materially larger app
  review from Meta.
- **A second content-editor permission tier specific to Instagram.**
  Reuses `requireContentEditorSession()` / `isAllowedContentEditorEmail`
  unchanged — the same people who edit FAQs/Insights/Playbooks/People
  can sync and hide Instagram posts; no new permission concept needed.
