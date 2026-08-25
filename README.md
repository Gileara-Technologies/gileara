# Gileara Technologies

A corporate landing page built with Next.js 16, React 19, and TypeScript 6, deployed on Cloudflare Workers via OpenNext.

[![Stack](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Runtime](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)

---

## Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Language** | TypeScript 6 |
| **Bundler** | Turbopack (dev) |
| **Styling** | Tailwind CSS 3 + CSS custom properties (Material Design 3–inspired tokens) |
| **Animations** | Framer Motion, Google Material Symbols |
| **Auth/API** | Native Web Crypto API (`crypto.subtle`) for JWT assertion, Google Calendar API v3 |
| **Deployment** | Cloudflare Workers via OpenNext |

## Quick Start

```bash
cp .env.example .env.local   # configure environment variables
npm install                   # install dependencies
npm run dev                   # start Turbopack dev server
```

## Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Turbopack dev server (localhost:3000) |
| `npm run build` | Standard Next.js build |
| `npm run build:cf` | OpenNext Cloudflare Workers build |
| `npm run preview` | Build + local Cloudflare preview |
| `npm run deploy:worker` | Build + deploy to Cloudflare Workers |
| `npm run start` | Start production server (Node.js) |
| `npm run lint` | Run Next.js lint |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── contact/route.ts    # Contact form handler (POST, formData)
│   │   └── schedule/route.ts   # Calendar booking (POST, JSON + GET healthcheck)
│   ├── globals.css             # CSS custom properties, component classes, animations
│   ├── layout.tsx              # Root layout (fonts, theme, metadata, global footer)
│   ├── page.tsx                # Homepage (section-scroll)
│   ├── careers/
│   │   └── page.tsx            # Careers portal
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   └── security/page.tsx
├── components/
│   ├── Approach.tsx
│   ├── BentoGrid.tsx
│   ├── CinematicStory.tsx
│   ├── CollaborationFooter.tsx
│   ├── ContactCTA.tsx
│   ├── CareersCTA.tsx
│   ├── Footer.tsx
│   ├── Founders.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Positioning.tsx
│   ├── Pricing.tsx
│   ├── ThemeProvider.tsx
│   ├── ThemeToggle.tsx
│   ├── careers/
│   │   ├── ApplicationForm.tsx
│   │   ├── CareersHero.tsx
│   │   ├── CareersNavbar.tsx
│   │   ├── OpenRoles.tsx
│   │   └── WhyJoinUs.tsx
│   └── scheduling/
│       ├── CalendarStep.tsx
│       └── ContactStepper.tsx
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```
GOOGLE_CLIENT_EMAIL=homepage@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=calendar-id@group.calendar.google.com
CONTACT_EMAIL=tech.gileara@gmail.com
```

> `.env*.local` is gitignored. For Cloudflare deployment, vars are set in `wrangler.toml` (single-quoted TOML literal strings). Do **not** commit service account key files.

## Architecture

### Homepage Sections

The homepage is a single-scroll page composed of these sections (in order):

1. **Navbar** — Fixed top navigation with theme toggle and CTA
2. **Hero** — Full-viewport mesh-gradient hero with headline
3. **CinematicStory** — Brand narrative with scroll-triggered animations
4. **BentoGrid** — Grid showcasing services/capabilities
5. **Positioning** — Market positioning and differentiators
6. **Approach** — Methodology and process
7. **Founders** — Team/leadership section
8. **ContactCTA** — Call-to-action with scheduling
9. **Footer** — Links to privacy, terms, security pages
10. **CollaborationFooter** — Global partnership logos

### Careers Page

The dedicated careers portal `/careers` uses a specialized navigation flow:

1. **CareersNavbar** — Isolated recruitment navigation with intersection observer active-state tracking
2. **CareersHero** — Culture and vision statement
3. **OpenRoles** — Listed positions with required skills
4. **WhyJoinUs** — Benefits and culture highlights
5. **ApplicationForm** — Client-side validated multi-step application simulation

### API Endpoints

| Route | Method | Input | Description |
|---|---|---|---|
| `/api/contact` | POST | `formData` (name, email, goal, message) | Submits contact form; returns redirect |
| `/api/schedule` | POST | JSON (name, email, goal, message, date, time) | Creates Google Calendar event via service account JWT |
| `/api/schedule` | GET | – | Healthcheck (returns env var presence) |
| `/api/apply` | POST | `formData` (name, email, resume file, etc) | Mock endpoint for processing job applications |

### Theme

- `next-themes` with `attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`
- Default is always dark mode
- Light/dark tokens defined as CSS custom properties in `globals.css`
- Tailwind dark mode via `class` strategy

## Deployment

Production deploys automatically: Cloudflare's git integration builds and ships every merge into `main`. The usual flow is feature branch → PR → `dev`, then PR `dev` → `main` to release.

Manual fallback (requires local Cloudflare auth):

```bash
# Deploy to Cloudflare Workers
npm run deploy:worker
```

Uses the `open-next.config.ts` config and requires `wrangler.toml` with the appropriate variables set. For detailed deployment instructions — including live URLs and the middleware constraint — see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## GitHub Workflows

| Workflow | Trigger | Description |
|---|---|---|
| **AI Code Review** | PR opened/synchronized | Reviews diffs via Claude API |
| **Smart Tests** | PR | Selects and runs build based on changed files |
| **Stale Management** | Daily | Marks stale issues/PRs, closes after 14 days |
| **Branch Cleanup** | Weekly | Creates issue listing stale branches |
| **Auto Rebase** | `/rebase` comment | Rebases PR onto main |
| **Issue Triage** | Issue opened | Assigns labels based on title |

## Contributing

1. Fork and clone the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Open a Pull Request

All code is reviewed by AI via the `ai-review.yml` workflow. The sole code owner is `@thehiddendeveloper`.

---

## License

Proprietary — see [LICENSE](LICENSE). All rights reserved. Copyright (c) 2026 Gileara Technologies.
