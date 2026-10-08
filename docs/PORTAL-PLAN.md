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