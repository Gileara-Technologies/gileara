# Gileara Technologies — Corporate Landing Page

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 6** — Turbopack dev server
- **Tailwind CSS 3** — CSS custom property tokens (Material Design 3-like), `dark` class mode
- **Deployment**: Cloudflare Workers via OpenNext (`open-next.config.ts`)
- **Animations**: Framer Motion (`"use client"`), Google Material Symbols (class `material-symbols-outlined`)
- **Fonts**: Inter (sans), Hanken Grotesk (display), JetBrains Mono (mono) — loaded in `globals.css`; Plus Jakarta Sans & Space Grotesk loaded in `layout.tsx`
- **Auth/API**: `jose` for JWT, Google Calendar API v3 (service account)

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Turbopack dev server |
| `npm run build` | Standard Next.js build |
| `npm run lint` | `next lint` (no ESLint config yet) |
| `npm run build:cf` | OpenNext Cloudflare build |
| `npm run preview` | `build:cf` + local preview |
| `npm run deploy:worker` | `build:cf` + deploy to CF Workers |

## Architecture

### Routes (`src/app/`)
- `/` — Section-scroll homepage: Navbar, Hero, CinematicStory, BentoGrid, Positioning, Approach, Founders, ContactCTA, Footer
- `/privacy`, `/terms`, `/security` — Static legal pages (Navbar + Footer layout)
- `/api/contact` — `POST` only, reads `formData`, returns redirect
- `/api/schedule` — `POST` only, Edge Runtime, JSON body, creates Google Calendar event via service account JWT

### Key conventions
- **Path alias**: `@/*` maps to `./src/*`
- **Client components**: Marked `"use client"` when using Framer Motion, React state, or browser APIs
- **Theme**: `next-themes` with `attribute="class" defaultTheme="dark" enableSystem={false}` — default is always dark
- **CSS**: Tailwind utility classes + CSS custom properties in `globals.css` (light/dark `:root` / `.dark` blocks)

## Environment

Required vars (copy `.env.example`):
```
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_CALENDAR_ID=
CONTACT_EMAIL=tech.gileara@gmail.com
```

> `.env*.local` is gitignored. Google private key is expected with literal `\n` (not real newlines). Do **not** commit `giltech-keys.json` (gitignored).

## Notable

- **No tests** exist — no test framework, no test files
- **No ESLint config** — `npm run lint` uses Next.js defaults
- **Duplicate file**: `src/BentoGrid.tsx` exists alongside `src/components/BentoGrid.tsx` — the component import uses the latter
- **GitHub workflows** in `.github/workflows/` are scaffolding templates (AI review, stale cleanup, smart test selection) — the smart-tests workflow runs `npm run build` but has no actual test step
- **Lighthouse report** in `lighthouse.json` is a static snapshot, not maintained
- **Single code owner**: `@thehiddendeveloper` per CODEOWNERS
