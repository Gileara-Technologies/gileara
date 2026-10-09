# Next Phase Plan: Careers Portal (Phase 2-3)

**Status**: Design complete (`docs/PORTAL-DESIGN.md`, `docs/PORTAL-FLOWS.md`). Implementation paused pending 5 open design questions. Audit UI (section 07) shipped on `feature/np(web)`.

## Goal
Ship a minimal admin-gated Careers Portal to replace manual role management. Candidates can browse/apply; HR can post/edit/pause/close roles and review applications, with resume storage and email notifications.

## 5 Open Design Questions (need answers to start)

1. **Seed roles**: Should we seed the 5 Stage-1 roles from `src/content/roles.ts` into D1 at first migration, or have HR enter them manually via the admin UI?
2. **Resume naming**: What convention for files in R2? (e.g. `applications/{roleSlug}/{timestamp}-{candidateId}.{ext}`, or `applications/{applicationId}/{filename}`?)
3. **HR whitelist**: How to bootstrap HR access? (env var `HR_EMAILS` comma-separated with `@gileara.org` domain check, or hard-code known emails, or allow any `@gileara.org` authenticated via Google OAuth?)
4. **Role slug generation**: Auto-generate from title (slugify), manual entry, or allow both? Must ensure uniqueness.
5. **Current `/careers` page**: Replace entirely with portal-backed page, keep hybrid (read from D1 with fallback to `roles.ts`), or keep static and add separate `/portal`?

## Architecture (high level)

- **Auth**: Google OAuth (NextAuth/Auth.js v5 or custom JWT) restricted to HR whitelist
- **DB**: Cloudflare D1 (SQLite) — `roles` (id, slug, title, status, location, type, salaryRange, description, responsibilities, requirements, benefits, order, publishedAt, closedAt), `applications` (id, roleId, name, email, phone, resumeKey, resumeFilename, coverLetter, status, source, ipHash, createdAt)
- **Storage**: Cloudflare R2 for resumes (private bucket, presigned GET for HR view/download)
- **Email**: Resend for HR notifications on new applications
- **Frontend**: Next.js App Router (server actions + RSC). Keep existing public `/careers` route shape; add `/admin/careers/*` (protected)
- **Infra**: Cloudflare (Workers + D1 + R2) via OpenNext; migrations in `migrations/`

## Phased Plan

### Phase 1 — Infrastructure (2-3h)
- [ ] Create D1 database + bindings in `wrangler.toml`
- [ ] Create R2 bucket + bindings (private)
- [ ] Add env vars: `AUTH_GOOGLE_ID/SECRET`, `HR_EMAILS`, `RESEND_FROM`, `RESEND_HR_EMAIL`
- [ ] Write initial D1 migration (roles + applications + indexes on slug/status/roleId/email)
- [ ] Decide on auth library (Auth.js v5 recommended for Next App Router)

### Phase 2 — Data model + migrations (1-2h)
- [ ] Define types in `src/lib/portal/types.ts`
- [ ] Migration scripts + Drizzle/Prisma not needed (raw SQL D1); keep simple SQL migrations
- [ ] Seed script if Q1 answered "seed from roles.ts"

### Phase 3 — Auth + Admin guards (1-2h)
- [ ] Google OAuth flow, session, HR whitelist enforcement
- [ ] Middleware/route protection for `/admin/*`
- [ ] Admin layout + sign-in/out

### Phase 4 — Admin UI (4-5h)
- [ ] Dashboard: list roles (all statuses), counts
- [ ] Role CRUD: create/edit form with markdown fields (matches existing roles.ts shape)
- [ ] Status actions: publish/pause/close/reopen
- [ ] Applications list per role + detail (view resume via presigned URL)
- [ ] Basic filtering/sorting

### Phase 5 — Public careers (3-4h)
- [ ] `/careers` reads from D1 (respecting Q5). If hybrid, fallback to `roles.ts` when D1 empty
- [ ] `/careers/[slug]` role detail (open roles only)
- [ ] Apply form posts to server action/API, uploads resume to R2, writes to D1
- [ ] Confirmation page, validation (5MB limit, allowed types), honeypot optional (careers app less spam-prone than public form)

### Phase 6 — Email + polish (1-2h)
- [ ] Resend notification to HR on new application (role, candidate, contact, resume link)
- [ ] Error handling, logging, rate limiting
- [ ] Tests for portal routes (basic smoke/integration)

**Total**: ~11-15 hours as estimated in PORTAL-DESIGN.md

## Dependencies
- Answers to 5 questions (block Phase 1/2/5 decisions)
- Cloudflare resources (D1/R2) created in the right account/project
- Auth credentials (Google OAuth client)

## Recommended Next Action
Get answers to the 5 questions above, then start Phase 1 (infra + migrations) in a focused subagent. The audit UI is shipped and independent.

---

## Phase 6 note — HR email notification (implemented)

**Built**
- `src/lib/portal/notify.ts` — pure `buildApplicationEmail(app)` produces the subject/body in the `docs/PORTAL-DESIGN.md` format (`New application: {name} for {role}`; plain-text body with role, candidate name/email/phone, submitted time, cover letter, why-this-role; empty optional fields are omitted). `notifyHrByEmail(app, opts)` POSTs to `https://api.resend.com/emails` with native `fetch` (same pattern as `/api/newsletter`), and accepts an injectable `fetchImpl` so tests never touch the network. It never throws upward: disabled / no recipient / no API key / non-2xx / network error all resolve to `false` after an `[apply]`-prefixed log.
- `src/app/api/apply/route.ts` — dispatch **after** the success decision, on **both** success paths (D1 save and the legacy no-D1 fallback), and handed to `ctx.waitUntil`: a Resend failure can never change the `{ success, message }` response shape or its 200 status, and the candidate never waits on Resend.
  - This route is the cautionary example for the whole feature. The notification was originally a floating promise, "fire and forget". In the Workers runtime the isolate may be torn down the moment the response is returned, which cancelled the Resend request before it left the worker — and because the promise never survived to its first `console.log`, the failure produced **no log line at all**. Every notification was silently dropped until `ctx.waitUntil` was added (guard: `tests/api/apply.test.ts` "hands the HR notification to ctx.waitUntil"). Anything that must outlive a Worker response has to be registered this way.
- `tests/lib/portal/notify.test.ts` — 16 tests: body content (all fields, empty-field omission, plain-wording checks), recipient fallback, gating, and fake-fetch success / non-2xx / throw.
- `tests/api/apply.test.ts` — adds the `ctx.waitUntil` hand-off regression test (the route's Cloudflare context is stubbed; `null` reproduces the real throw outside Workers).

**Env vars in `wrangler.toml` `[vars]`** (added in `chore(portal): bind R2 resume bucket and portal notify env vars`):

| Var | Shipped value | Purpose |
|---|---|---|
| `APPLICATION_NOTIFY_EMAIL` | `hr.gileara@gmail.com` (the HR inbox already in `HR_EMAILS`), or `""` to fall back to `CONTACT_EMAIL` | HR recipient; `APPLICATION_NOTIFY_EMAIL` → `CONTACT_EMAIL` → skip |
| `APPLICATION_NOTIFY_ENABLED` | `"1"` | Opt-out flag: sending is on unless this is exactly `"0"`. Off while gileara.org was unverified — the sandbox sender `onboarding@resend.dev` only delivers to the Resend account address, so HR would never receive the mail. Now enabled: gileara.org is verified in Resend (same account as the newsletter) and `RESEND_FROM = "Gileara Careers <careers@gileara.org>"` |
| `RESEND_FROM` | `"Gileara Careers <careers@gileara.org>"` | Verified-domain sender. Unset falls back to `DEFAULT_FROM` (`onboarding@resend.dev`), which only reaches the Resend account address |

Already provisioned (no change): `RESEND_API_KEY` (Wrangler secret), `CONTACT_EMAIL` (existing fallback recipient). Not part of this note: rate limiting and the remaining Phase 6 polish items.

---

## Phase 7 note — application status tracking + candidate confirmation (implemented)

**Built**

- **Migration** `migrations/0003_add-application-status.sql` — adds `status TEXT NOT NULL DEFAULT 'new'` with a `CHECK` over `new | reviewing | shortlisted | rejected | hired`, plus `status_updated_at` / `status_updated_by`. This reverses a deliberate Phase 1 decision: `0001_create-portal-schema.sql` shipped with *no* status column (follow-up happened over email). `0001` is left untouched as history; the reasoning is recorded in `0003`'s header. SQLite forbids an expression default on `ADD COLUMN`, so both audit columns default to `NULL` and stay `NULL` until the first transition — untouched rows read as "not moved yet".
- **Data layer** — `ApplicationStatus` union in `src/lib/portal/types.ts`; `setApplicationStatus(db, id, status, actorEmail)` in `src/lib/portal/db.ts` updates the row and returns it re-read (`null` for an unknown id). `toApplicationRow` tolerates a pre-`0003` row and reads it as `new`, so a deploy-ahead-of-migration reads fine in both directions.
- **Admin UI** — `applications.tsx` grew an `ApplicationStatusBadge` in the `<summary>` (status is visible without opening the row) and a plain `<form>` inside the detail: hidden `id` + `roleId` (from the row itself), a `<select>` of the five statuses, an Update button, and a "moved by {email} · {time}" line. It posts to `setApplicationStatusAction` in `actions.ts`, which follows the existing action shape: `requireAdminSession()` first (the session email becomes the audit actor), `validateApplicationStatusForm`, `tryGetPortalDb()`, then redirect back to `/admin/roles/{roleId}` — with `?error=invalid|unavailable|save` on failure, banner via the existing `ActionErrorBanner`. No client component was added; `defaultValue` keeps the select server-rendered.
- **Candidate confirmation** — `buildCandidateConfirmationEmail(app)` (pure) and `notifyCandidateByEmail(app, opts)` in `notify.ts` share the never-throws contract of the HR sender, but the recipient is the address *the candidate submitted*. `/api/apply` dispatches it under `ctx.waitUntil` **only when `saved === true`** — an unauthenticated POST must never become a way to make the site email addresses it did not store. The wording reuses the on-screen `CONFIRMATION_MESSAGE`, so the button and the mail agree.
- **Tests** — 26 added, 258 total: `setApplicationStatus` (audit stamp, unknown id, legacy row), `validateApplicationStatusForm` + labels, the candidate builder/gating/fake-fetch matrix, and two route tests: the receipt rides `ctx.waitUntil` after a real D1 save, and it is *not* queued when the application was not saved (the confirmation flag deliberately left on, so only the `saved` gate is under test).

**Env var added to `wrangler.toml` `[vars]` and `[env.production.vars]`**:

| Var | Shipped value | Purpose |
|---|---|---|
| `APPLICATION_CONFIRM_ENABLED` | `"1"` | Opt-out flag like `APPLICATION_NOTIFY_ENABLED`: the candidate receipt is on unless this is exactly `"0"` |

**Not in scope** (unchanged from `PORTAL-DESIGN.md`): candidate-facing status portal, notes on applications, CSV export. Status lives in the admin only; follow-up replies still go out by HR over email.