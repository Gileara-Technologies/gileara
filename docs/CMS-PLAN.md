# CMS Plan — Content Management Foundation

**Status**: FAQ slice shipped (proof of pipeline). Insights and Playbooks not started.

## Goal

Let non-developers edit site content without a code change and a deploy. Extend the existing admin portal (Google OAuth, D1, the dashboard shell) rather than adopt a third-party headless CMS — the architecture is already proven end to end by the careers Roles system; this generalizes that exact pattern to other content types.

## 5 Design Questions — answered

1. **Scope for v1**: FAQs, then Insights, then Playbooks (How We Transform). Approved as proposed.
2. **Who edits content?** A separate permission tier from HR, not the same `HR_EMAILS` allowlist. Gated by email format: `{name}.gileara@gmail.com` (one or more dot-separated name segments, then `.gileara@gmail.com`). `isAllowedContentEditorEmail()` in `src/lib/portal/session.ts`. Someone can be HR, a content editor, both, or neither — these are independent checks.
3. **New D1 database or reuse `gileara_careers_db`?** Reuse. No foreign-key relationship to roles/applications, and a second binding would double the operational surface (two things to provision, migrate, back up) for no real benefit at this scale.
4. **Images**: a new, separate **public** R2 bucket when the first image-bearing content type (Insights) is built — not the existing `gileara_resumes` bucket, which is private and session-gated. Served directly from R2's public URL, not routed through Next's image optimizer (which needs `sharp`, unavailable in the Workers/OpenNext runtime this site deploys to). Not yet provisioned — no content type needs it yet.
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

### 2. Insights (blog posts) — not started, highest business value

Current shape (`src/content/posts.ts`): `slug, title, excerpt, date, author, tag, image?, content: PostBlock[]`. Planned change: replace `content: PostBlock[]` (paragraph/heading/cta block array) with a single **Markdown** `body` field, rendered through `remark`/`rehype` at request time — not a WYSIWYG/block editor, which is a much larger separate project (sanitization, schema versioning, a heavier admin bundle) that doesn't fit this codebase's bias toward plain, typed data. Needs the public R2 bucket from design question 4 for cover images.

### 3. How We Transform (playbooks) — not started

`status` (`scenario → pilot → case-study`) is itself a content-editing action that currently requires a code change and a deploy — exactly the friction this CMS exists to remove. Schema is more complex (`painPoints[]`, `implementation[]` steps, `packageIds[]` referencing `packages.ts`) but still fully structured.

### Deliberately excluded

- **Homepage marketing copy** (Hero, Approach, CinematicStory, Positioning). Tightly coupled to hand-tuned layouts (e.g. `Approach.tsx` constrains step descriptions to `max-w-[26ch]`) — a freely-typed longer sentence would visibly break the grid. Stays in code.
- **Legal pages** (privacy/terms/security). Low edit frequency, high correctness stakes.
- **Services/pricing** (`packages.ts`). Feeds `Offer`/`Service` JSON-LD directly; a later phase at most, with stricter validation than content editing needs elsewhere.

## Recommended Next Action

Insights next: provision the public R2 bucket (design question 4), add the Markdown body field + `remark`/`rehype` rendering pipeline, then the same migration → data layer → admin CRUD → public-page-swap shape the FAQ slice just proved.
