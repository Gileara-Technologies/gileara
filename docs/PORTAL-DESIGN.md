# Careers Portal — Design & Implementation Plan

**Status**: Design review (not started)  
**Reviewed**: 2026-09-08  
**Priority**: Phase 2-3 (after newsletter ✓)

---

## What we're building

A **minimal admin-gated careers portal** where HR can post roles and receive applications via email. No complex ATS, no status tracking — just role posting + application capture.

### User flows

#### HR (authenticated)
1. Sign in with Google OAuth (any `@gileara.org` email)
2. Dashboard shows list of roles (open/paused/closed) + "New role" button
3. Create role form: title, team, location, type, responsibilities (list), requirements (list), nice-to-have (optional list), what we offer (list)
4. Role goes live immediately at `/careers/{slug}` (auto-generated from title)
5. Edit/pause/close existing roles
6. View applications per role (name, email, phone, submitted date)
7. No status tracking — HR manages follow-ups via email

#### Candidate (public)
1. Visit `/careers` → see all open roles
2. Click a role → `/careers/{slug}` shows role detail
3. Fill apply form (name, email, phone, resume upload, cover letter, why-this-role)
4. Submit → resume uploads to R2, application saves to D1, HR gets email notification
5. Confirmation page: "Thanks — we'll review and reach out within 5 business days"

---

## Architecture

### Auth
- **Google OAuth** (Sign in with Google)
- Whitelist: any email ending in `@gileara.org`
- Session stored in encrypted cookie (7-day expiry)
- No password, no magic link — just OAuth

### Data (Cloudflare D1 — SQLite at edge)

```sql
-- Roles posted by HR
CREATE TABLE roles (
  id TEXT PRIMARY KEY,              -- slug: full-stack-engineer
  title TEXT NOT NULL,              -- Full Stack Engineer
  team TEXT NOT NULL,               -- Engineering | Design | Operations | Marketing
  location TEXT NOT NULL,           -- Accra, Ghana · Hybrid
  type TEXT NOT NULL,               -- Full-time | Part-time | Contract | Internship
  status TEXT NOT NULL DEFAULT 'open',  -- open | paused | closed
  summary TEXT NOT NULL,            -- 1-line pitch (shows on /careers list)
  responsibilities TEXT NOT NULL,   -- JSON array of strings
  requirements TEXT NOT NULL,       -- JSON array of strings
  nice_to_have TEXT,                -- JSON array of strings (optional)
  what_we_offer TEXT NOT NULL,      -- JSON array of strings
  posted_at TEXT NOT NULL,          -- ISO timestamp
  updated_at TEXT NOT NULL,         -- ISO timestamp
  posted_by TEXT NOT NULL           -- email of HR who posted it
);

-- Applications submitted by candidates
CREATE TABLE applications (
  id TEXT PRIMARY KEY,              -- uuid
  role_id TEXT NOT NULL,            -- foreign key → roles.id
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cover_letter TEXT,
  why_this_role TEXT,
  resume_r2_key TEXT,               -- path in R2: resumes/{applicationId}/{filename}
  submitted_at TEXT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- HR users (whitelist)
CREATE TABLE hr_users (
  email TEXT PRIMARY KEY,           -- julian@gileara.org, wisdom@gileara.org, etc.
  added_at TEXT NOT NULL,
  added_by TEXT                     -- which HR user added this one
);
```

### Storage
- **D1** (SQLite) — roles + applications metadata
- **R2** (object storage) — resume files at `resumes/{applicationId}/{filename}.pdf`
- **Resend** — email notifications to HR

### Routes

#### Public
- `GET /careers` — list all open roles (SSR from D1)
- `GET /careers/[slug]` — role detail + apply form (SSR from D1)
- `POST /api/apply` — submit application (multipart/form-data with resume file)

#### Admin (OAuth-gated)
- `GET /admin/login` — redirect to Google OAuth
- `GET /admin/callback` — OAuth callback, set session cookie
- `GET /admin` — dashboard: list roles + new-role button
- `GET /admin/roles/new` — create role form
- `POST /api/admin/roles` — create role (JSON body)
- `GET /admin/roles/[id]` — edit role + view applications
- `PATCH /api/admin/roles/[id]` — update role (JSON body)
- `GET /admin/logout` — clear session, redirect to /

---

## What's NOT in scope

❌ **Application status tracking** — HR manages follow-ups in their inbox  
❌ **In-app notes/comments** — HR discusses candidates via email/Slack  
❌ **CSV export** — use D1 console or write a one-off query  
❌ **Candidate portal** — no login for applicants to check status  
❌ **Interview scheduling** — HR uses the existing `/api/schedule` route  
❌ **Automated rejection emails** — HR sends personal replies  
❌ **Resume parsing** — files are stored as-is, HR downloads to review  
❌ **Multiple HR roles/permissions** — all HR users have full access  

---

## Technical decisions

### Why Google OAuth (not magic link)
- Everyone at Gileara already has a Google Workspace account
- No password to manage, no email delivery issues
- Standard OAuth flow, well-documented
- Can restrict to `@gileara.org` domain

### Why D1 (not external DB)
- Same vendor as Workers deployment (Cloudflare)
- ~1M reads/day free tier
- SQL queries (familiar, powerful)
- No additional vendor to manage
- Automatic backups via Cloudflare

### Why R2 (not S3)
- Already using Cloudflare Workers
- No egress fees (S3 charges $0.09/GB to serve files)
- Same dashboard as Workers + D1
- 10GB storage free, then $0.015/GB/month

### Why email notifications (not in-app alerts)
- HR already checks email constantly
- No need to build a notification system
- Simpler, more reliable
- Can include resume link + full application details

---

## Email notification format

**Subject**: New application: {candidateName} for {roleTitle}

**Body**:
```
You received a new application for {roleTitle}.

Candidate: {name}
Email: {email}
Phone: {phone}

Cover letter:
{coverLetter}

Why this role:
{whyThisRole}

Resume: https://gileara.org/admin/resumes/{applicationId}
(Link expires in 7 days — download to keep)

View all applications for this role:
https://gileara.org/admin/roles/{roleId}

---
Sent from Gileara Careers Portal
```

---

## Open design questions

### 1. Should we seed the existing 5 Stage-1 roles into D1?

Current roles in `src/content/roles.ts`:
- Full-Stack Engineer (×2)
- UI/UX Designer
- DevOps Engineer
- Product Manager

**Option A**: Seed them automatically on first deploy (migration script)  
**Option B**: HR enters them by hand via admin (clean slate)  
**Option C**: Keep static `roles.ts` for now, admin is additive (both sources)

**Your choice?**

---

### 2. Resume file naming

**Option A**: `resumes/{applicationId}/{originalFilename}.pdf` (preserve original name)  
**Option B**: `resumes/{applicationId}/resume.pdf` (normalize to "resume.pdf")  
**Option C**: `resumes/{roleSlug}/{timestamp}-{candidateName}.pdf` (human-readable in R2 browser)

**Your choice?**

---

### 3. HR user whitelist — how is the first user added?

**Option A**: Seed from env var (`HR_ADMIN_EMAIL=wisdom@gileara.org`) on first deploy  
**Option B**: Hard-code the first user in the migration (`INSERT INTO hr_users ...`)  
**Option C**: Any `@gileara.org` email can sign in (no whitelist, just domain check)

**Your choice?**

---

### 4. Role slug generation

**Option A**: Auto-generate from title (e.g. "Full Stack Engineer" → `full-stack-engineer`)  
**Option B**: HR manually enters slug (more control, risk of typos)  
**Option C**: Use UUID as slug (ugly URLs but zero collision risk)

**Your choice?**

---

### 5. What happens to `/careers` when the admin is live?

Current `/careers` page renders from static `src/content/roles.ts`.

**Option A**: Replace it entirely — read from D1, delete `roles.ts`  
**Option B**: Hybrid — show D1 roles + static roles (two sources)  
**Option C**: Keep static for now, admin is a separate `/careers/admin` experience

**Your choice?**

---

## Estimated timeline

| Phase | Work | Time |
|---|---|---|
| **Phase 1: Infrastructure** | D1 migrations, R2 binding, OAuth setup | 2-3 hours |
| **Phase 2: Admin** | Login, dashboard, create/edit role forms, list applications | 4-5 hours |
| **Phase 3: Public** | `/careers` reads from D1, `/careers/[slug]` detail, apply form, R2 upload | 3-4 hours |
| **Phase 4: Email + polish** | Resend notification, error handling, tests | 2-3 hours |
| **Total** | | **11-15 hours** |

---

## What do you want to change before we start?

Review the open questions above and tell me:
1. Which options you prefer (1-5)
2. Any scope changes (add/remove features)
3. Ready to start, or more questions?

