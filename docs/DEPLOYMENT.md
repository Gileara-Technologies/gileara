# Deployment

Deployed to **Cloudflare Workers** via [OpenNext](https://opennext.js.org).

Production is deployed automatically by Cloudflare's git integration — **merging to `main` ships to production**. Manual `wrangler` commands are a fallback, not the normal path.

---

## How deploys happen

1. Work lands on a feature branch and is merged into `dev` via PR
2. When ready to ship, open a PR from `dev` → `main`
3. Merging that PR triggers Cloudflare's build of `main` (OpenNext) and deploys the worker

- **Worker**: `v1` (see `name` in `wrangler.toml`)
- **Live URLs**: <https://v1.gileara.workers.dev> · <https://gileara.org>
- A failed build on `main` means production did not update — fix and re-merge

## Prerequisites (manual deploys only)

- Node.js 20+
- A Cloudflare account with Workers enabled
- Authenticated `wrangler` (`npx wrangler login`, or set `CLOUDFLARE_API_TOKEN` in non-interactive environments)

## wrangler.toml

```toml
name = "v1"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
main = ".open-next/worker.js"
assets = { directory = ".open-next/assets" }

[observability.logs]
enabled = true
head_sampling_rate = 1
persist = true
invocation_logs = true

[vars]
CONTACT_EMAIL="tech.gileara@gmail.com"
GOOGLE_CLIENT_EMAIL="homepage@your-project.iam.gserviceaccount.com"
GOOGLE_CALENDAR_ID="your-calendar-id@group.calendar.google.com"
GOOGLE_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n'
```

> **Important**: The `GOOGLE_PRIVATE_KEY` must be a single-quoted TOML literal string with literal `\n` sequences (not actual newlines). This preserves the PEM format for the Workers runtime.

> **Note**: The config defines both a top-level environment and `[env.production]`. When deploying manually, target one explicitly (`npm run deploy:worker` uses top-level; pass `-e production` for the named environment) — otherwise Wrangler warns about ambiguity.

## Deploy Commands (fallback)

```bash
# Full build + deploy
npm run deploy:worker

# Preview locally first
npm run preview

# Build only (inspect output)
npm run build:cf
```

These require local Cloudflare auth and duplicate what the git integration does on `main`. Prefer merging to ship.

## CI/CD

GitHub Actions workflows are in `.github/workflows/`:

- **smart-tests.yml** — On PRs: unit tests (`npm test`), lint (`npm run lint`), and build (`npm run build`)
- **ai-review.yml** — Automated code review via Claude API on PRs (requires `ANTHROPIC_API_KEY` secret)
- **issue-triage.yml / stale.yml / branch-cleanup.yml / auto-rebase.yml** — Repo maintenance automation

## OpenNext Config

See `open-next.config.ts`:

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
```

For production, consider enabling **R2 incremental caching**:

```ts
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
```

## Known constraint: no middleware

Next 16 compiles `middleware.ts`/`proxy.ts` files to **Node.js middleware**, which `@opennextjs/cloudflare` cannot bundle yet ("Node.js middleware is not currently supported") — a proxy file in the tree breaks every deploy, including the git integration. Security headers therefore live in `next.config.mjs` `headers()`, and the request-routing logic (maintenance modes) is parked as a plain module at `src/lib/request-proxy.ts` until the adapter gains support.

## Environment Variables

| Variable | Source | Required |
|---|---|---|
| `GOOGLE_CLIENT_EMAIL` | Google Cloud Console → IAM → Service Accounts | Yes |
| `GOOGLE_PRIVATE_KEY` | Service account key (PEM) | Yes |
| `GOOGLE_CALENDAR_ID` | Google Calendar settings → Integrate calendar | Yes |
| `CONTACT_EMAIL` | Email address for contact form notifications | Yes |

For local development, copy `.env.example` → `.env.local`. For Cloudflare, set in `wrangler.toml` `[vars]` (and `[env.production.vars]` for the production environment).
