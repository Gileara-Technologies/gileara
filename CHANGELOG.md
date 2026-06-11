# Changelog

All notable changes to this project are documented here.

The format adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (targeting v1.0.0 at launch).

---

## Unreleased

- Add test framework (currently none exists)
- Add ESLint configuration
- Resolve Lighthouse performance issues (LCP: 34.9s, TBT: 6.5s)
- Fix broken image references to local Gemini-generated assets
- Remove duplicate `src/BentoGrid.tsx` (component import uses `src/components/BentoGrid.tsx`)

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
