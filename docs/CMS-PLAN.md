# CMS Plan — Content Management Foundation

**Status**: Done. All three v1 content types (FAQs, Insights, Playbooks) are shipped, the migrations are applied to the real D1 database, and the R2 media-upload pipeline (design question 4) is built and wired into both image fields. Nothing named in this plan is still open.

## Goal

Let non-developers edit site content without a code change and a deploy. Extend the existing admin portal (Google OAuth, D1, the dashboard shell) rather than adopt a third-party headless CMS — the architecture is already proven end to end by the careers Roles system; this generalizes that exact pattern to other content types.

## 5 Design Questions — answered

1. **Scope for v1**: FAQs, then Insights, then Playbooks (How We Transform). Approved as proposed.
2. **Who edits content?** A separate permission tier from HR, not the same `HR_EMAILS` allowlist. Gated by email format: `{name}.gileara@gmail.com` (one or more dot-separated name segments, then `.gileara@gmail.com`). `isAllowedContentEditorEmail()` in `src/lib/portal/session.ts`. Someone can be HR, a content editor, both, or neither — these are independent checks.
3. **New D1 database or reuse `gileara_careers_db`?** Reuse. No foreign-key relationship to roles/applications, and a second binding would double the operational surface (two things to provision, migrate, back up) for no real benefit at this scale.
4. **Images**: a new, separate **public** R2 bucket (`gileara-cms-media`, bound as `gileara_cms_media`) — not the existing `gileara_resumes` bucket, which is private and session-gated. Served through a same-origin route (`/api/cms/media/[...key]`) rather than R2's own public dev URL or a custom domain — avoids any extra Cloudflare dashboard configuration and keeps every image URL on `gileara.org`. Provisioned and wired into both image fields (`src/lib/cms/media-storage.ts`, `src/app/admin/content/media-upload-field.tsx`).
5. **Do the `.ts` content modules stay forever as a fallback?** No — long-term intent is to delete them once D1 is proven in production. They currently serve two purposes: the one-time seed for seeding D1, and a transitional safety net (D1 unreachable/empty → read the module) during this build-out. Unlike `src/content/roles.ts` (which the careers portal treats as a permanent fallback), these are meant to go away.

## Architecture

- **Auth**: existing Google OAuth + `admin_session` cookie. `requireContentEditorSession()` (`src/app/admin/session-guard.ts`) wraps `requireAdminSession()` and additionally checks `isAllowedContentEditorEmail`. A signed-in HR session that doesn't match redirects to `/admin?error=content-forbidden`, not to login — they ARE authenticated, just not authorized for this area.
- **DB**: Cloudflare D1, `gileara_careers_db` binding (shared with careers). One migration per content type, numbered after the careers migrations (`0004` is FAQs).
- **Data layer**: `src/lib/cms/` — `types.ts` (row/input shapes per content type), `db.ts` (CRUD, D1Like from `src/lib/portal/db.ts` reused directly), `public-{type}.ts` (D1-first-with-fallback read side for the public page, mirroring `src/lib/portal/public-roles.ts`).
- **Admin UI**: `src/app/admin/content/{type}/` — list page (table + publish/unpublish + delete), `new/page.tsx`, `[id]/page.tsx`, a shared `{type}-form.tsx` client component on `useActionState`, same shape as the existing role form. `src/app/admin/content/actions.ts` holds the server actions, each starting with `requireContentEditorSession()`.
- **Draft/publish + audit trail**: every content row gets `status` (`draft | published`), `created_at`, `updated_at`, `updated_by` (the signed-in content-editor email) — same shape as `applications.status_updated_by` from migration `0003`.
- **Nav**: `AdminShell.tsx` shows a "FAQs" (etc.) item only when the signed-in user's email passes `isAllowedContentEditorEmail` — computed server-side in `layout.tsx`, passed down as `isContentEditor`. This is a UI convenience, not the security boundary; the boundary is `requireContentEditorSession()` on every content route and action.

## Content types, in priority order

### 1. FAQs — shipped (proof of pipeline)

Simplest content type: no markdown, no images, no relations. Validated the whole chain: migration → data layer → admin CRUD → public page reading D1-first.

- `migrations/0004_create-cms-faqs.sql` — `cms_faqs` table.
- `src/lib/cms/types.ts`, `src/lib/cms/db.ts` — `listFaqs`, `getFaq`, `createFaq`, `updateFaq`, `setFaqStatus`, `deleteFaq`.
- `src/lib/cms/public-faqs.ts` — `getPublicFaqs()`, D1-first with `src/content/faqs.ts` fallback.
- `src/app/admin/content/faqs/` — list, create, edit.
- `src/app/faq/page.tsx` / `FaqClient.tsx` — swapped to read `getPublicFaqs()` server-side, passed down as a prop; FAQPage JSON-LD generated from the same list.
- Tests: `tests/lib/cms/db.test.ts`, `tests/lib/cms/public-faqs.test.ts`, `tests/app/admin/content/form-logic.test.ts`, plus the `isAllowedContentEditorEmail` cases in `tests/lib/portal/session.test.ts`.

### 2. Insights (blog posts) — shipped

Plan changed slightly on implementation: rather than a `remark`/`rehype`-based Markdown pipeline (a new dependency), the body field uses a small **custom markdown-subset parser** (`src/lib/cms/markdown.ts`, zero new npm dependencies) supporting exactly the three constructs the real seeded content ever used — paragraphs, `## heading` lines, and a `::: cta / text / href: / label: / :::` fence. It parses into the existing `PostBlock[]` shape, so `InsightsPostClient.tsx`'s renderer needed no changes at all. No inline bold/italic/links — deliberately, since none of the real content uses them and adding that would mean touching the renderer.

- `migrations/0005_create-cms-posts.sql` — `cms_posts` table (slug generated via `uniqueSlug`, fixed after creation like roles).
- `src/lib/cms/db.ts` — `listPosts`, `getPost`, `createPost`, `updatePost`, `setPostStatus`, `deletePost`.
- `src/lib/cms/public-posts.ts` — `getPublicPosts()` / `getPublicPost(slug)`, D1-first with `src/content/posts.ts` fallback, mapping a D1 row to the same `InsightPost` shape a fallback entry already has.
- `src/app/admin/content/insights/` — list, create, edit; the body field is one textarea with an in-form hint box for the three constructs.
- `/insights`, `/insights/[slug]`, `sitemap.ts` — swapped to the D1-first source, `force-dynamic`, `generateStaticParams` removed (a CMS-created post has no build-time-known slug).
- **Cover image**: `MediaUploadField` (upload button + the original manual path/URL text input, side by side — see "Media pipeline" below).

### 3. How We Transform (playbooks) — shipped

The most structurally complex of the three: four list-shaped fields (`painPoints[]`, `targetOutcomes[]`, `packageIds[]`, and `implementation[]` — the last a list of `{phase, detail}` objects, not flat strings), stored as JSON TEXT columns matching the convention `roles.responsibilities` etc. already used. `packageIds` is constrained to checkboxes built from the real `servicePackages` list rather than freeform text, since pricing/services stayed out of CMS scope — a typo here can't produce a dead reference.

The actual reason this slice exists: `cms_scenarios` has two independent status concepts kept as separate columns — `status` (draft/published, visibility) and `scenario_status` (`scenario → pilot → case-study`, the honesty-contract label). The Playbooks admin list gives `scenario_status` a first-class quick control (a `<select>` + submit, same shape as the applications status control), so that transition — which used to need a code change and a deploy — is now two clicks.

- `migrations/0006_create-cms-scenarios.sql` — `cms_scenarios` table.
- `src/lib/cms/db.ts` — `listScenarios`, `getScenario`, `createScenario`, `updateScenario`, `setScenarioContentStatus` (visibility), `setScenarioStage` (the honesty-contract label), `deleteScenario`. Unlike FAQs/posts, these return the parsed (array-shaped) `ParsedScenario` directly — every JSON column needs parsing on every read anyway.
- `src/lib/cms/public-scenarios.ts` — `getPublicScenarios()` / `getPublicScenario(slug)`, D1-first with `src/content/scenarios.ts` fallback, mapping onto the exact `TransformationScenario` shape a fallback entry already has — `scenarioPackages()` and every renderer needed zero changes.
- `src/app/admin/content/playbooks/` — list (with the stage control), create, edit. The form reuses the role form's `ListField` dynamic-row pattern for the two flat-string lists, plus a new paired phase+detail dynamic list for implementation steps.
- `/how-we-transform`, `/how-we-transform/[slug]`, its OG image route, `sitemap.ts` — swapped to the D1-first source, `force-dynamic`, `generateStaticParams` removed.

### Media pipeline (design question 4)

- `src/lib/cms/media-storage.ts` — structural R2 typing and key building mirror `src/lib/portal/resume-storage.ts` (never imports an R2 SDK; a pure, tested key builder: `{prefix}/{timestampMs}-{random}.{ext}`, `prefix` constrained to `"insights" | "playbooks"`).
- `GET /api/cms/media/[...key]` — public, no auth, streams the R2 object with a one-year immutable `Cache-Control` (safe: keys are content-addressed and never reused).
- `POST /api/admin/content/media` — authenticated upload. Does its own cookie/session/`isAllowedContentEditorEmail` check rather than `requireContentEditorSession()`, since that helper redirects on failure (built for page renders, not a `fetch()`-based JSON API). 5MB size limit, JPEG/PNG/WebP/GIF allowlist — same ceiling and dual MIME-or-extension check style as the resume upload route.
- `src/app/admin/content/media-upload-field.tsx` — one shared client component used by both forms: the manual text input stays (existing `/public` paths and external URLs keep working unchanged), with a file picker next to it that uploads on selection and fills the text input with the returned path.

### Deliberately excluded

- **Homepage marketing copy** (Hero, Approach, CinematicStory, Positioning). Tightly coupled to hand-tuned layouts (e.g. `Approach.tsx` constrains step descriptions to `max-w-[26ch]`) — a freely-typed longer sentence would visibly break the grid. Stays in code.
- **Legal pages** (privacy/terms/security). Low edit frequency, high correctness stakes.
- **Services/pricing** (`packages.ts`). Feeds `Offer`/`Service` JSON-LD directly; a later phase at most, with stricter validation than content editing needs elsewhere.

## Status: complete

All three v1 content types are shipped, the migrations are applied to the real D1 database (confirmed: `cms_faqs`, `cms_posts`, `cms_scenarios` all exist in production), and the R2 media pipeline is live. HR and content editors can create, edit, publish, and (for Playbooks) move the honesty-contract stage — all without a code change or a deploy, which was the entire point.

What's NOT in this plan, should a future round want it: a Markdown/rich-text upgrade beyond the three-construct subset in `src/lib/cms/markdown.ts`, deleting the `src/content/*.ts` fallback modules once D1 has run in production long enough to trust (design question 5's stated long-term intent), and the three deliberately-excluded areas above if priorities ever change.
