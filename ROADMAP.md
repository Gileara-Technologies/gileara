# Roadmap

> Project version: `0.0.0` — Pre-release. Target: `1.0.0` (public launch).

---

## Short Term

- [ ] **Testing infrastructure** — Add a test framework (Vitest or Jest), write unit tests for API routes and component rendering
- [ ] **ESLint configuration** — Set up ESLint with `next/core-web-vitals` and strict TypeScript rules
- [ ] **Performance optimization** — Address Lighthouse findings:
  - LCP is currently 34.9s (target: <2.5s)
  - TBT is 6.5s (target: <200ms)
  - Main thread work is 18.4s
  - Likely causes: large hero image, external font requests, Framer Motion bundle size
- [ ] **Fix broken assets** — Replace missing Gemini-generated images (`fintech_dashboard_preview`, `healthtech_security_grid`) with real assets
- [ ] **Remove duplicate file** — Delete `src/BentoGrid.tsx` (unused; component lives at `src/components/BentoGrid.tsx`)

## Medium Term

- [ ] **Contact form submission** — Implement email notification for `/api/contact` (currently logs to console and redirects)
- [ ] **Booking confirmation email** — Send email confirmation to user when a calendar event is created
- [ ] **Booking availability UI** — Show real-time availability in the scheduling stepper (fetch from Google Calendar free/busy API)
- [ ] **Analytics integration** — Add privacy-respecting analytics (Plausible, Umami, or similar)
- [ ] **SEO improvements** — Structured data (JSON-LD), sitemap.xml, robots.txt
- [ ] **Accessibility audit** — Run axe-core, fix any violations (Lighthouse report shows axe-core 4.11.3 was used)
- [ ] **i18n** — Multi-language support (at minimum, handle RTL layouts)
- [ ] **Content management** — Evaluate headless CMS (Sanity, Strapi) for non-developer content editing

## Long Term

- [ ] **Blog / case studies section** — `/blog` and `/case-studies` routes with MDX content
- [ ] **Client portal** — Authenticated area for existing clients to track project progress
- [ ] **Live chat / chatbot** — Embed AI-powered support for lead qualification
- [ ] **Automated Lighthouse CI** — Run Lighthouse in CI, enforce performance budgets
- [ ] **R2 caching** — Enable OpenNext R2 incremental cache for improved Workers performance
- [ ] **Automated visual regression testing** — Add Playwright or Chromatic for visual diffs
- [ ] **OpenTelemetry / observability** — Integrate Cloudflare Workers observability (already scaffolded in `wrangler.toml`, disabled by default)
