# Security incident log

This file tracks secret rotations and security incidents. Incidents are
logged here for audit purposes, but the sensitive details (which key,
which commit) live in a private runbook.

## 2026-09-06 — Google service account private key + Resend API key exposure

**What happened:**
- The Google Calendar service-account private key was committed to
  `wrangler.toml` in plaintext and pushed to the public GitHub repo
  `Gileara-Technologies/gileara`. The key was present in at least
  commit `3ef1e9b` (and possibly earlier).
- A Resend API key was nearly committed to `.env.example` but caught
  in the working tree before staging (never reached the index or a
  commit).

**Impact:**
- The Google key grants read/write access to the service account's
  authorized calendar (`3427f035...@group.calendar.google.com`). Anyone
  with the key could impersonate the service account and create/modify
  calendar events.
- The Resend key grants full access to the Resend account (send emails,
  manage audiences, read contacts).

**Timeline:**
- 2026-09-06 11:00 UTC — Resend API key pasted into `.env.example`
  during newsletter setup, caught ~10 seconds later before `git add`
- 2026-09-06 17:00 UTC — Discovered the `wrangler.toml` exposure during
  secrets-policy work
- 2026-09-06 17:23 UTC — Stripped the key from `wrangler.toml`, added
  docs/SECRETS.md, pre-commit hook, GitHub Action scan

**Actions taken:**
1. Removed `GOOGLE_PRIVATE_KEY` from `wrangler.toml` (commit pending)
2. Added `docs/SECRETS.md` policy forbidding secrets in tracked files
3. Updated `AGENTS.md` to reflect the new policy
4. Added a pre-commit hook (`scripts/scan-secrets.mjs`) that blocks
   commits containing secret patterns
5. Added a CI secret scan to `.github/workflows/smart-tests.yml`
6. **TODO (user action required):**
   - Rotate the Google service account key in Google Cloud Console
   - Rotate the Resend API key in the Resend dashboard
   - Set the new keys as Cloudflare Secrets:
     ```
     npx wrangler secret put GOOGLE_PRIVATE_KEY
     npx wrangler secret put RESEND_API_KEY
     npx wrangler secret put NEWSLETTER_ENABLED  # value: 1
     npx wrangler secret put RESEND_AUDIENCE_ID  # value: 88fe6734-...
     ```
   - Redeploy `main` after the secrets are set

**Lesson learned:**
The convenience of putting secrets in `wrangler.toml` `[vars]` is not
worth the exposure risk. Cloudflare Secrets are encrypted, free, and
accessed via the same `process.env` interface — there's no reason to
use `[vars]` for sensitive values.

## How to rotate a leaked key

### Google service account key
1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts
2. Click the service account (`homepage@giltech-494822.iam...`)
3. Keys tab → Add Key → Create new key → JSON
4. Download the JSON file (do NOT commit it)
5. Copy the `private_key` field value (the full `-----BEGIN...END-----` block)
6. Run `npx wrangler secret put GOOGLE_PRIVATE_KEY`, paste the key
7. Delete the old key from the Keys tab
8. Delete the downloaded JSON file from your machine

### Resend API key
1. Go to https://resend.com/api-keys
2. Create a new API key (Full Access)
3. Copy the key (starts with `re_`)
4. Run `npx wrangler secret put RESEND_API_KEY`, paste the key
5. Delete the old key from the dashboard

### After rotation
- Redeploy `main` (Cloudflare picks up the new secrets automatically)
- Test the affected endpoints (`/api/schedule`, `/api/newsletter`)
- Mark this incident as resolved in this file
