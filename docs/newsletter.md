# Newsletter deployment reference

This file is documentation. **No secrets live here.** Real values go into
Cloudflare dashboard (production) or `.env.local` (dev, gitignored).

## Resend configuration

| Setting | Where it's set | Example value |
|---|---|---|
| `NEWSLETTER_ENABLED` | env var | `1` (turns the form on) |
| `RESEND_API_KEY` | env var | `re_xxxxxxxxxxxxxxxxxxxxxx` (full access key from resend.com) |
| `RESEND_AUDIENCE_ID` | env var | `88fe6734-a36f-4cb4-aa06-a0f5c6ac3d94` |

## Production audience (set 2026-09-06)

- **Audience name:** Gileara monthly digest
- **Audience ID:** `88fe6734-a36f-4cb4-aa06-a0f5c6ac3d94`

This is the audience every `/api/newsletter` POST lands in. Manage
unsubscribes + double-opt-in settings in the Resend dashboard at
https://resend.com/audiences.

## Sending the monthly digest

This site does not send the email — Resend's dashboard does.

1. Go to https://resend.com/audiences
2. Click the "Gileara monthly digest" audience
3. Click "Send broadcast"
4. Compose the email (or paste a React Email HTML)
5. Schedule or send

Every broadcast includes a 1-click unsubscribe link managed by Resend.

## Local dev

```
# .env.local (gitignored)
NEWSLETTER_ENABLED=1
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx
RESEND_AUDIENCE_ID=88fe6734-a36f-4cb4-aa06-a0f5c6ac3d94
```

Visit http://localhost:3000, scroll to the footer, submit a test email,
then check the audience in Resend to confirm it landed.

## Production deploy

Set the three env vars in the Cloudflare Workers dashboard:

1. https://dash.cloudflare.com → Workers & Pages → `v1` → Settings → Variables
2. Add:
   - `NEWSLETTER_ENABLED` = `1`
   - `RESEND_API_KEY` = (your key, kept out of git)
   - `RESEND_AUDIENCE_ID` = `88fe6734-a36f-4cb4-aa06-a0f5c6ac3d94`
3. Save, then redeploy (`main` branch auto-deploys, or `npm run deploy:worker`)

## Security note

Real API keys must NEVER be committed. `.env.example` is the
template and stays in git; the production values live in Cloudflare
and `.env.local` only. If a key is accidentally committed, rotate it
in the Resend dashboard immediately.
