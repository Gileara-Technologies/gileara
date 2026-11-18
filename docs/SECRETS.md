# Secrets policy

This repo is a **public GitHub repository**. Anything committed to a
tracked file is, by definition, public. This document is the policy
for how secrets (API keys, private keys, tokens) are handled so they
never become part of the repository history.

## The rule

> **No secret lives in a tracked file. Ever.**

Tracked files include (not exhaustive):
- `wrangler.toml`
- `.env.example`
- Any source file under `src/`, `tests/`, `scripts/`, `docs/`
- Any config under `.github/`
- Any Markdown that gets committed

## Where secrets actually live

| Environment | Where | How it's set |
|---|---|---|
| Local dev | `.env.local` (gitignored) | You paste it once per dev machine |
| Production (Cloudflare Worker) | Cloudflare dashboard → Workers → `v1` → Settings → Variables → **Type: Secret** | `wrangler secret put NAME` or paste in dashboard |
| CI (GitHub Actions) | Repository Settings → Secrets and variables → Actions | Workflow references `${{ secrets.NAME }}` |

Cloudflare Secrets are encrypted at rest, scoped to the worker, and
visible to the runtime via `process.env.NAME` (same interface as
regular env vars). They never appear in `wrangler.toml`.

## What counts as a secret

- API keys (Resend, Stripe, Twilio, etc.)
- Service-account private keys (Google, AWS, etc.)
- OAuth client secrets
- Database connection strings with passwords
- Session signing secrets
- Anything shaped like: `re_…`, `sk_…`, `AKIA…`, `-----BEGIN … PRIVATE KEY-----`, JWTs longer than 200 chars

When in doubt: **it is a secret.**

## Instagram connector (docs/INSTAGRAM-CONNECTOR-PLAN.md)

Four more names follow the same rule as everything else above, one pair
per Instagram account (Instagram Login issues a token per account):

- `INSTAGRAM_ACCESS_TOKEN_INS` / `INSTAGRAM_BUSINESS_ACCOUNT_ID_INS` —
  the same pair for the second account, **@ins.gileara**. Everything
  below about the first pair applies to these too.
- `INSTAGRAM_ACCESS_TOKEN` — a long-lived Instagram User access token
  for **@gileara**
- `INSTAGRAM_BUSINESS_ACCOUNT_ID` — not itself sensitive (it is a public
  account id), but kept alongside the token for one reason: there is no
  admin-UI text field for entering either value, so both are set the
  same way, in the same place, by the same human operator action
  (`wrangler secret put NAME` or the Cloudflare dashboard), per the
  table above. Setting a non-secret value as a Cloudflare Secret instead
  of a plain `[vars]` entry costs nothing and keeps the two values
  rotating together.

Neither value is ever typed into this app — there is no "paste your
Instagram token here" admin page, deliberately, so the token never
transits anywhere this codebase could accidentally log, store in D1, or
echo back to a browser.

## Verification — how do I know my file has no secret?

Run the local scanner before committing:

```bash
npm run secrets:scan
```

The pre-commit hook runs the same scanner. CI runs it again on every
PR. Three layers of defence.

## If a secret leaks

1. **Rotate it** in the issuing service's dashboard (do this first; you have no idea who has it)
2. Delete the file from the working tree
3. Commit the fix on a fresh branch
4. Bump the file in git history with `git filter-repo` or open a
   GitHub support ticket to scrub cached views (this is best-effort;
   the rotation is the actual fix)
5. Add the rotation to `docs/SECRETS-INCIDENTS.md` (or a private
   runbook — incidents don't need to be public)

## Why we don't put secrets in `wrangler.toml` `[vars]`

It seems convenient because the build picks them up automatically.
But:

- `wrangler.toml` is committed to the repo
- Anything in `[vars]` ends up in plaintext in the deployed worker
  bundle (visible to anyone who downloads the worker code)
- GitHub caches the file; even if you delete it, the cached version
  on a fork or in `git log` may persist for a while
- Cloudflare Secrets are **free**, **encrypted**, and **do the same
  thing** — there is no benefit to plaintext `[vars]` for sensitive
  values

Cloudflare's own docs recommend Secrets for sensitive values:
https://developers.cloudflare.com/workers/configuration/secrets/

## Tooling

- `npm run secrets:scan` — local scan of staged + working-tree changes
- Pre-commit hook (husky) — blocks `git commit` if scan finds a match
- GitHub Actions (`smart-tests.yml`) — scans every PR for new secrets
- Baseline file (`.gitleaks.toml`) — known historical leaks that
  we've already rotated, so we can keep working without re-flagging
  them every run
