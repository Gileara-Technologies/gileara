# Maintenance Mode

Reroute all page traffic to a `/maintenance` page by toggling a single environment variable. No code changes, no rebuild needed.

---

## How It Works

A Next.js [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) (`src/proxy.ts`) runs at the Cloudflare edge on every request. It reads two env vars:

| Variable | Purpose |
|---|---|
| `MAINTENANCE_MODE` | When truthy (`"1"`, `"true"`), maintenance mode is active |
| `MAINTENANCE_BYPASS_SECRET` | Secret string that authorises admin access to the live site |

### Request Flow

```
Request → proxy.ts
            │
            ▼
   MAINTENANCE_MODE is set?
            │
     NO ───► Pass through — site runs normally
            │
     YES ───► Checks:
               ├── Is it /maintenance, favicon.ico, site.webmanifest?      → Allow
               ├── Has valid __maintenance_bypass cookie?                  → Allow
               ├── Has valid ?__mbp=<secret> query param?                  → Set cookie, redirect clean
               ├── Is it /api/*?                                           → JSON 503
               └── Everything else                                         → Rewrite to /maintenance
```

### Rewrite, Not Redirect

The proxy uses `NextResponse.rewrite()` — the browser stays at the original URL but receives the `/maintenance` page content. This means:

- Bookmarks are preserved when maintenance ends
- Search engines see a transient page with `<meta name="robots" content="noindex">` (already set on `/maintenance`)
- No 302 redirect chain

---

## Activation

### Via Cloudflare Dashboard (Recommended — Instant, No Deploy)

1. Go to **Cloudflare Dashboard → Workers & Pages → gileara → Settings → Variables**
2. Add or edit:
   - `MAINTENANCE_MODE = "1"`
   - `MAINTENANCE_BYPASS_SECRET = "your-secure-random-string"`
3. Save — changes take effect immediately
4. To deactivate, delete the variable or set it to an empty string

### Via wrangler.toml (Requires Deploy)

Set values in `wrangler.toml` under `[vars]`:

```toml
[vars]
MAINTENANCE_MODE = "1"
MAINTENANCE_BYPASS_SECRET = "your-secure-random-string"
```

Then run:

```bash
npm run deploy:worker
```

### Via wrangler CLI

```bash
npx wrangler secret put MAINTENANCE_MODE     # enter "1"
npx wrangler secret put MAINTENANCE_BYPASS_SECRET  # enter your secret
npx wrangler deploy
```

---

## Admin Bypass

When maintenance is active, authorised users can still browse the live site.

### One-Time Bypass Link

Visit `https://gileara.org/?__mbp=your-secure-random-string`

The proxy sets a cookie (`__maintenance_bypass`, httpOnly, 24-hour expiry) and redirects to the clean URL. All subsequent requests include the cookie and pass through.

### Clearing the Bypass

- Close the browser (session cookie cleared if no persistent storage)
- Or clear cookies manually for `gileara.org` via browser DevTools

---

## API Routes During Maintenance

All `/api/*` endpoints return a JSON 503 response:

```json
{
  "error": "Service temporarily unavailable due to scheduled maintenance"
}
```

Status code: **503 Service Unavailable**

---

## Files

| File | Purpose |
|---|---|
| `src/proxy.ts` | Edge proxy — the gate |
| `src/app/maintenance/page.tsx` | Maintenance page (pre-existing) |
| `src/components/UnderMaintenance.tsx` | Maintenance UI component (pre-existing) |
| `wrangler.toml` (lines 26-27) | Env var declarations for Cloudflare Workers |
| `.env.example` (lines 14-19) | Env var documentation for local development |

---

## Local Development

To test maintenance mode locally, create a `.env.local` file:

```env
MAINTENANCE_MODE=1
MAINTENANCE_BYPASS_SECRET=dev-secret-123
```

Then:

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll see the maintenance page.

To bypass, visit `http://localhost:3000/?__mbp=dev-secret-123`.
