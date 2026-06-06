# Deployment

Deployed to **Cloudflare Workers** via [OpenNext](https://opennext.js.org).

---

## Prerequisites

- Node.js 20+
- A Cloudflare account with Workers enabled
- `wrangler.toml` configured (see below)

## wrangler.toml

```toml
name = "gileara-homepage"
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

## Deploy Commands

```bash
# Full build + deploy
npm run deploy:worker

# Preview locally first
npm run preview

# Build only (inspect output)
npm run build:cf
```

## CI/CD

GitHub Actions workflows are in `.github/workflows/`:

- **smart-tests.yml** — Runs `npm run build` on PRs, automatically selecting relevant test suites based on changed files
- **ai-review.yml** — Automated code review via Claude API on PRs (requires `ANTHROPIC_API_KEY` secret)

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

## Environment Variables

| Variable | Source | Required |
|---|---|---|
| `GOOGLE_CLIENT_EMAIL` | Google Cloud Console → IAM → Service Accounts | Yes |
| `GOOGLE_PRIVATE_KEY` | Service account key (PEM) | Yes |
| `GOOGLE_CALENDAR_ID` | Google Calendar settings → Integrate calendar | Yes |
| `CONTACT_EMAIL` | Email address for contact form notifications | Yes |

For local development, copy `.env.example` → `.env.local`. For Cloudflare, set in `wrangler.toml` `[vars]` (and `[env.production.vars]` for production environment).
