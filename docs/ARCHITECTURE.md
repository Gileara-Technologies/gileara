# Architecture

## Overview

Gileara is a **single-page corporate landing site** built with Next.js 16 App Router and deployed to **Cloudflare Workers**. The site is fully static-rendered (no SSR) with client-side interactivity for animations and booking.

## Route Design

```
/                     → Section-scroll homepage
/privacy              → Static privacy policy
/terms                → Static terms of service
/security             → Static security page
/api/contact [POST]   → Contact form handler
/api/schedule [POST]  → Calendar booking API
/api/schedule [GET]   → Healthcheck
```

All content routes are server components by default. Client components (`"use client"`) are used only where necessary (Framer Motion, state, browser APIs).

## Component Tree

```
<RootLayout>
  <ThemeProvider>              ← next-themes, forces dark default
    <Navbar />                  ← Fixed, includes theme toggle
    <main>
      <Hero />                  ← Mesh gradient background, CTA
      <CinematicStory />        ← Scroll-triggered Framer Motion
      <BentoGrid />             ← Service capabilities grid
      <Positioning />           ← Market differentiators
      <Approach />              ← Methodology
      <Founders />              ← Team cards
      <ContactCTA />            ← Scheduling stepper or link
    </main>
    <Footer />                  ← Legal links
  </ThemeProvider>
</RootLayout>
```

## Design System

### Theming (CSS Custom Properties)

| Context | Light | Dark |
|---|---|---|
| Background | `#f7f9fb` | `#081420` |
| Surface | `#f7f9fb` | `#081420` |
| Primary (RGB) | `0 28 56` (navy) | `68 221 193` (teal) |
| Secondary (RGB) | `0 105 110` (teal) | `187 198 226` (blue-gray) |
| Hero mesh | Low-opacity radial gradients | Higher-opacity teal/blue radial gradients |

Tokens are defined in `globals.css` `:root` / `.dark` blocks and mapped to Tailwind in `tailwind.config.js`.

### Typography

| Role | Font | Usage |
|---|---|---|
| Sans | Inter | Body text |
| Display | Hanken Grotesk | Headings (h1-h4) |
| Mono | JetBrains Mono | Code/monospace |

Additional fonts loaded in `layout.tsx`: Plus Jakarta Sans, Space Grotesk (for specific design elements).

### Component Classes (globals.css)

- `.glass-card` — Frosted glass effect with backdrop blur
- `.teal-gradient-btn` / `.btn-primary` — Primary CTA gradient button
- `.btn-outline` — Outlined secondary button
- `.gradient-text` — Text with background-clip gradient

## Animation Strategy

- **Framer Motion** for scroll-triggered reveals, parallax, and entrance animations
- CSS `@keyframes` for `float` animation (subtle floating elements)
- `.reveal` / `.reveal-active` classes for intersection-observer-based fade-in
- All animation components are `"use client"` due to Framer Motion's DOM dependency

## API Architecture

### Contact Form (`/api/contact`)

- Accepts `formData` (standard HTML form submission)
- Currently logs and redirects — no persistence layer
- Ready for integration with email service (Resend, SendGrid, etc.)

### Schedule Booking (`/api/schedule`)

- **No external auth libraries** — uses native `crypto.subtle` for RS256 JWT signing
- JWT is asserted to Google's OAuth2 endpoint for an access token
- Creates a 45-minute Google Calendar event via Calendar API v3
- Runs on Edge Runtime (Cloudflare Workers `nodejs_compat` flag)
- Private key is parsed from PEM format with `\n` literal handling

## Security

- No authentication dependencies (zero external auth libraries)
- Service account private key never committed (gitignored, set via `wrangler.toml` vars)
- JWT assertion uses PKCS8 private key import with `RSASSA-PKCS1-v1_5` / `SHA-256`
- OAuth2 token exchange uses server-side `fetch` only (no client secrets exposed)

## Performance Considerations

Current Lighthouse scores indicate significant optimization opportunities:

- LCP: 34.9s (target <2.5s) — large hero PNG asset
- TBT: 6.5s (target <200ms) — bundle size, Framer Motion
- Speed Index: 8.9s (target <3.4s)

Key areas for improvement: image optimization (WebP/AVIF), code splitting, font display swap, and reducing Framer Motion bundle impact.
