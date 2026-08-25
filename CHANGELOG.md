# Changelog

All notable changes to this project are documented here.

The format adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (targeting v1.0.0 at launch).

---

## Unreleased

### Added

- **Test infrastructure** — Vitest suite (`npm test`, 22 tests) covering the request proxy (security headers, full-site and per-route maintenance modes, bypass cookie exchange), all three API routes' validation and error branches, and the maintenance-routes list shape
- **ESLint 9 flat config** (`eslint.config.mjs`) with `next/core-web-vitals` + `next/typescript`; `npm run lint` works again on Next 16 (`next lint` was removed upstream)
- Unit tests and lint wired into the smart-tests CI workflow

### Changed

- **Migrated `middleware.ts` → `proxy.ts`** for the Next 16 proxy convention (removes the build deprecation warning); function renamed accordingly, behavior unchanged
- `tsconfig.json` target raised `es5` → `es2022` (ES5 is deprecated in TypeScript 6)
- Fixed all ESLint errors: escaped JSX apostrophes across 8 files, replaced `any` types in `/api/schedule` and ContactStepper with proper typing, rewrote ThemeToggle's mount check with `useSyncExternalStore` (no setState-in-effect), removed unused imports
- Bumped version to `0.1.0`

### Removed

- Stray `.txt` scratch file from repo root

---

## 2026-06-11 — Sprint: Careers portal & UI polish

### Added

- **Careers Portal** (`/careers`) — dedicated route with CareersNavbar, CareersHero, WhyJoinUs, OpenRoles, and ApplicationForm components
- `POST /api/apply` route for job application submissions (FormData with resume file upload)
- `OpenRoles` component listing 5 positions: Frontend, Backend, QA, DevOps, and UI/UX Designer with skill tags
- `ApplicationForm` component with full client-side validation, file upload (PDF/DOC/DOCX, 5MB limit), experience level selector with descriptions, and success/error states
- `CareersNavbar` with sticky design, active section highlighting via IntersectionObserver, and mobile drawer overlay
- `WhyJoinUs` section highlighting 6 culture benefits (career growth, learning, collaboration, modern tech stack, flexibility, meaningful impact)
- Work group images (`public/assets/wg_*.jpg`)
- `react-icons` dependency for Heroicons v2 and Font Awesome 6 icon sets

### Changed

- **Navbar** — replaced Material Symbols with `react-icons` (HiBars3/HiXMark), improved mobile menu UX, added arrow icons to CTA buttons with hover animation, increased font size to `text-base`
- **Hero** — added arrow icons to CTA buttons with translate/opacity hover animations
- **ThemeToggle** — replaced Material Symbols with `react-icons` (HiSun/HiMoon)
- **Founders** — replaced LinkedIn image URL with `FaLinkedin` icon from react-icons, added `aria-label` for accessibility
- **Footer** — removed newsletter signup form, updated layout
- **ContactStepper** — updated placeholder text, formatting cleanup
- `layout.tsx` — responsive spacing adjustments
- `page.tsx` — added careers link integration

### Documentation

- Updated README with careers portal structure, component breakdown, and API route documentation

---

## 2026-06-04 — Sprint: Cloudflare deployment & JWT auth

### Merged

- **PR #3** — Google Calendar key management
- **PR #2** — dev branch sync
- **PR #1** — UI overhaul (feature branch)

### Changed

- Moved Google private key to `wrangler.toml` vars using single-quoted TOML literal strings
- Replaced `jose` library with native Web Crypto API (`crypto.subtle`) for JWT generation
- Removed `runtime: "edge"` from schedule route and fixed PEM regex for Cloudflare Workers compatibility
- Updated layout responsive spacing, added scrollbar utility
- Migrated to design tokens (CSS custom properties), updated global theme naming conventions
- Redesigned Hero section, updated Navbar layout, replaced Pricing with Positioning component

### Added

- `GET /api/schedule` healthcheck endpoint to verify Google Calendar env configuration

---

## 2026-05-01 — Sprint: Legal pages & UI refinement

### Changed

- Enhanced global UI/UX consistency
- Updated footer links
- Implemented privacy, terms, and security static pages (`/privacy`, `/terms`, `/security`)

---

## 2026-04-30 — Sprint: Deployment pipeline & error handling

### Changed

- Improved API error handling, validation, and debugging for schedule route
- Fixed private key parsing logic, added debug logging
- Renamed project to `gileara-homepage` in `wrangler.toml`
- Renamed deploy script to `deploy:worker`, removed redundant build execution

### Added

- Cloudflare Workers deployment support via OpenNext
- Improved Google Calendar API authentication robustness

---

## 2026-04-29 — Sprint: Calendar integration & component overhaul

### Added

- Google Calendar API integration (service account JWT auth)
- Scheduling stepper component (`CalendarStep.tsx`, `ContactStepper.tsx`)
- CinematicStory section with scroll-triggered animations
- Founders (team) section
- `giltech-keys.json` to `.gitignore`

### Changed

- Replaced deprecated components with CinematicStory and Founders
- Refined BentoGrid layout
- Cleaned up unused files

---

## 2026-04-28 — Sprint: Project foundation

### Added

- Initial project with Next.js App Router architecture
- Custom Tailwind CSS design system with Material Design 3–inspired tokens
- Dark mode support via `next-themes`
- Framer Motion animations
- GitHub CI/CD workflows (AI review, smart tests, stale management, branch cleanup, auto rebase, issue triage)

---

## 2026-04-24 — Sprint: Scaffolding

### Added

- Tailwind integration with custom theme tokens
- Brand-aligned UI updates
- Vite project structure with custom assets and core frontend logic
