# Roadmap

> Project version: `0.1.0` — Pre-release. Target: `1.0.0` (public launch).

---

## Short Term

- [x] **Testing infrastructure** — Vitest in place (`npm test`); unit tests cover the request proxy, all three API routes' validation/error branches, and `maintenance-routes`. Component rendering tests still open.
- [x] **ESLint configuration** — ESLint 9 flat config with `next/core-web-vitals` + `next/typescript`; repo lints with 0 errors (7 documented warnings).
- [x] **Fix broken assets** — Gemini-generated image references removed.
- [x] **Remove duplicate file** — `src/BentoGrid.tsx` deleted; component lives at `src/components/BentoGrid.tsx`.
- [ ] **Performance optimization** — Re-measure Lighthouse on a fresh deploy first (the 34.9s LCP snapshot is stale). Then address:
  - 4 remaining `<img>` usages flagged by lint (`loading.tsx`, `ServicesPageClient.tsx`, `BentoGrid.tsx`, `GlobalLoading.tsx`) → migrate to `next/image`
  - Large hero image, external font requests, Framer Motion bundle size

## Medium Term

- [x] **SEO improvements** — JSON-LD structured data, `src/app/sitemap.ts`, `robots.txt` shipped.
- [x] **Maintenance mode** — Full-site + per-route takedowns via `src/proxy.ts`, with secret bypass cookie.
- [ ] **Contact form submission** — Implement email notification for `/api/contact` (currently logs to console and redirects)
- [ ] **Booking confirmation email** — Send email confirmation to user when a calendar event is created
- [ ] **Booking availability UI** — Show real-time availability in the scheduling stepper (fetch from Google Calendar free/busy API)
- [ ] **Analytics integration** — Add privacy-respecting analytics (Plausible, Umami, or similar)
- [ ] **Accessibility audit** — Run axe-core, fix any violations
- [ ] **Secrets hygiene** — Move the Google service-account private key from `wrangler.toml [vars]` to `wrangler secret put`
- [ ] **i18n** — Multi-language support (at minimum, handle RTL layouts)
- [ ] **Content management** — Evaluate headless CMS (Sanity, Strapi) for non-developer content editing
- [ ] **Component tests** — Extend Vitest coverage to component rendering (needs jsdom/RTL)

## Long Term

- [x] **Blog / case studies section** — Shipped as `/insights` and `/case-studies` (static-data driven rather than MDX)
- [ ] **Client portal** — Authenticated area for existing clients to track project progress
- [ ] **Live chat / chatbot** — Embed AI-powered support for lead qualification
- [ ] **Automated Lighthouse CI** — Run Lighthouse in CI, enforce performance budgets
- [ ] **R2 caching** — Enable OpenNext R2 incremental cache for improved Workers performance
- [ ] **Automated visual regression testing** — Add Playwright or Chromatic for visual diffs
- [ ] **OpenTelemetry / observability** — Integrate Cloudflare Workers observability (already scaffolded in `wrangler.toml`, disabled by default)
