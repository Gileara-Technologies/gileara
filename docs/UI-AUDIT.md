# Gileara Technologies — UI/UX & Accessibility Audit

**Date:** 2026-10-11 · **Target:** `http://localhost:3000` (Next.js 16 dev, Turbopack) · **Method:** automated computed-style + geometry measurement via Playwright at 3 viewports (desktop 1432×1000 / tablet 768×1024 / mobile 375×812), across **29 routes**; every numeric claim below was measured in a live browser, cross-checked against source.

**Evidence screenshots:** `C:\Users\rodne\.playwright-mcp\ui-audit\*.jpg` (list at the end). The auditor model is text-only, so screenshots were captured for *human* review while all judgements below rest on computed measurements, not pixel inspection.

---

## Executive summary

The design system is coherent and the dark theme (the only reachable theme) is mostly healthy: **24 of 29 pages have zero WCAG contrast violations**, there is no horizontal overflow at desktop, and mobile/tablet collapse cleanly. But there is one **conversion-breaking defect** (invisible CTAs), one **silent clipping bug** at mobile, one **tab-unreachable-difficulty** at tablet, a **form that is unusable by assistive technology**, and a broad gap between the documented brand system and what ships.

| # | Severity | Finding | Scope |
|---|----------|---------|-------|
| F1 | 🔴 P0 | Undefined `teal-gradient-btn` / `btn-primary` utilities → invisible CTAs | 8 call sites, 2 key conversion surfaces + 404 + mobile menu |
| F2 | 🔴 P0 | `/contact` mobile: 9px horizontal overflow, silently clipped (~352px column in a 319px box) | mobile |
| F3 | 🟠 P1 | `/services` package switcher: 5 tabs, only ~3 visible at 768px (1289px strip in 680px box) | tablet |
| F4 | 🟠 P1 | `ApplicationForm`: 10 of 13 controls have no accessible name; no `required` attributes | /careers |
| F5 | 🟠 P1 | No `<header>` landmark, no skip-to-content link, primary `<nav>` unlabeled | site-wide |
| F6 | 🟡 P2 | Touch targets < 24×24 CSS px on every page (17–24/page) | site-wide |
| F7 | 🟡 P2 | Heading structure: `/maintenance` has no H1; `/contact` H1→H3 (no H2); legal pages render 10px text | /maintenance, /contact, /privacy, /terms |
| F8 | 🟡 P2 | Two brand teals coexist; `--outline` = `--outline-variant`; `<themeColor>` ≠ tokens; radius drift | tokens |
| F9 | 🟡 P2 | Light theme palette defined but unreachable (no toggle) — and if forced, 9–31 contrast failures/page | latent |
| F10 | 🟡 P2 | Vertical rhythm: 4+ section-padding conventions; 192px desktop exceeds documented ~80–120px scale | site-wide |
| F11 | 🟡 P2 | Body line length up to ~100ch (`/security`, `/services`) | 2 pages |
| F12 | 🟢 P3 | Focus: only 1 of 24 tab stops uses the design ring; the rest fall back to the UA default; form fields use a transparent outline + 1px border change | site-wide |
| F13 | 🟢 P3 | H1 text content "We build the systems**your** business runs on." (missing space after `<br>`); same CTA label in 4 font sizes | `/` + all |
| F14 | 🟢 P3 | Docs drift: AGENTS.md/ARCHITECTURE.md describe utilities/fonts/theme toggle that don't exist (no `next-themes` anywhere; no Hanken Grotesk loaded) | repo hygiene |

**Clean (audited, no defects found):** 24/29 pages zero contrast violations (dark); image `alt` handling (all empty alts are in `aria-hidden`/text-bearing-link contexts); single H1 per page everywhere except F7; no desktop or mobile horizontal overflow except F2; mobile menu opens and locks scroll; reduced-motion honoured for all JS-driven motion; fonts subset + favicon already optimised; homepage decorative watermark correctly `aria-hidden`.

---

## F1 (P0) — Undefined CTA utilities → invisible buttons

**Root cause.** Two class names are used across the codebase but defined nowhere: no rule in `src/app/globals.css`, and `tailwind.config.js` has `plugins: []`.

- `teal-gradient-btn` — `src/app/security/page.tsx:218`, `src/app/insights/[slug]/InsightsPostClient.tsx:82`, `src/components/NotFound.tsx:116`, `src/components/Navbar.tsx:268,288`
- `btn-primary` — `src/components/scheduling/ContactStepper.tsx:177`, `src/components/scheduling/CalendarStep.tsx:144`

**Measured (live DOM, dark theme):** “Compare packages” on `/security` → `background-color: rgba(0,0,0,0)`, `background-image: none`, `color: rgb(0,56,47)` (#00382F = dark `--on-primary`) on surface `rgb(31,43,56)` → **contrast 1.1:1** (needs 4.5). Same result for the three insight-article CTAs (“See the packages”, “See the tier details”, “See Business Operations”) and their 24px icon spans (need 3:1). In forced light mode they are equally invisible (white text on light surface, 1.26:1).

The `btn-primary` “Next: Pick a Time” button on `/contact` (68px tall) computes to transparent background, no radius, plain light text — **the primary conversion step of the booking flow has no button affordance**.

Screenshots: `06-security-cta-invisible.jpg`, `07-insights-post-cta-invisible.jpg`, `08-contact-stepper-next-invisible.jpg`, `14-404-invisible-cta.jpg`, `16-mobile-menu-transparent-cta.jpg`.

**Fix (one PR):** replace all 8 call sites with the site’s actual pill system (`bg-accent-bright text-on-background rounded-full font-semibold` — what every other working CTA uses), then grep for both class names to confirm zero remain; update `docs/ARCHITECTURE.md:68`.

---

## F2 (P0) — `/contact` mobile: 9px horizontal overflow, clipped

At 375px: `clientWidth = 367` but `scrollWidth = 376`. A 12-column grid child `div.col-span-12 lg:col-span-5` measures **352px wide at left 24** → right edge 376 (9px past the viewport). The content box is 367 − 48 (px-6) = 319px; the column is 352px because its min-content width (driven by an inner flex row holding an email/location link) exceeds the track and the grid item lacks `min-w-0`.

Because `body { overflow-x: hidden }` (globals.css:96), the page does not scroll horizontally — it **silently clips 9px off the right edge** of the contact column on mobile.

Screenshots: `17-contact-mobile-top.jpg`, `18-contact-mobile-overflow-column.jpg`, `19-contact-mobile-full.jpg`.

**Fix:** add `min-w-0` to that column (and audit the other `lg:col-span-*` children on the page); verify `scrollWidth === clientWidth` at 375/320.

---

## F3 (P1) — `/services` package switcher overflows at tablet

At 768px the tab strip (`div.flex.overflow-x-auto`) is **1289px of content in a 680px box** — “05 — Automation & Efficiency” starts at x=1037. Only ~2.6 of 5 tabs are visible with no fade, arrow, or other affordance; users must discover horizontal scrolling in a vertical page. The same strip fits at desktop (container 1336px). No other tablet overflow on any route (27/29 routes clean).

Screenshot: `22-services-tablet-switcher-overflow.jpg`.

**Fix:** `flex-wrap` below `lg`, or a visible “scroll for more” cue (fade + chevron), or a vertical list at <1024px.

---

## F4 (P1) — `/careers` application form: 10/13 controls unnamed; no `required`

Verified against `src/components/careers/ApplicationForm.tsx` **and** the live DOM:

| Control | Label present visually? | Programmatic name |
|---|---|---|
| `apply-website` (honeypot) | “Website” via `htmlFor` | ✅ — **the only correctly-linked field** |
| name, email, phone, position, github, linkedin, experienceLevel | `<label>` siblings **without `htmlFor`**, inputs have no `id` | ❌ (SR gets placeholder or nothing) |
| coverLetter, whyThisRole | sibling labels, not wrapped | ❌ |
| resume file input | custom button, no label | ❌ |
| newsletter email/company (footer) | `htmlFor` | ✅ |

12 of 14 visible “*” required markers are not backed by `required` attributes — screen readers cannot announce required-ness, and error recovery relies purely on client-side JS.

Screenshot: `10-careers-form-unassociated-labels.jpg`.

**Fix:** give each field an `id` and use `<label htmlFor>` (or wrap inputs in labels); add `required` (+ `aria-describedby` for the existing inline hints); label the file upload.

---

## F5 (P1) — Landmarks: no `<header>`, no skip link, unlabeled primary nav

Measured site-wide: `header` count **0** on every page (the Navbar is a standalone `<nav>`); `main` ✅ and `footer` ✅ everywhere; breadcrumb nav labeled ✅ but the primary nav `aria-label = null`; `/privacy` and `/terms` contain 3 unlabeled `<nav>`s; **no skip-to-content link exists** (first tab stop is the logo link).

**Fix:** wrap the Navbar in `<header>`; add a visually-hidden skip link as the first focusable element (`#main` targets exist); label the primary nav; give the two legal pages’ extra navs explicit labels.

---

## F6 (P2) — Touch targets below 24×24 CSS px on every page

WCAG 2.5.8 minimum (24×24). 17–24 sub-24px targets per page: footer links (83×20), breadcrumb “Home” (38×16), a 16×16 icon link, six carousel dot buttons (18–44px tall), and the mobile menu’s 36px-tall rows. At 44px-recommendation level, essentially every small pill/icon link is under.

**Fix:** `min-h-[44px]`/`min-w-[44px]` on footer+breadcrumb links and dots; menu rows `py-3`+.

---

## F7 (P2) — Heading structure + smallest text

- `/maintenance`: **no H1** (only `<h2>Under Maintenance</h2>`).
- `/contact`: H1 → H3 step headings, **H2 count 0** (level skip).
- `/privacy`, `/terms`: body copy renders at **10px** — below the effective minimum for secondary text and half the label scale’s neighbours.
- Everything else: exactly one H1 per page, no skips ✅.

**Fix:** give `/maintenance` an H1 (visually-hidden if desired); promote contact step headings to H2; floor legal copy at 12px minimum.

---

## F8 (P2) — Token/brand drift (dark-first view)

Measured against the authoritative dark spec (`stitch_gileara_technologies_website/gileara_velocity_dark/DESIGN.md`):

| Axis | Documented | Implementation (measured) |
|---|---|---|
| Primary fill colour | `#44ddc1` | Every filled CTA is `#5EEAD4` (`accent.bright` raw hex) + `#081420` text — a **second teal**; `--primary` (#44DDC1) survives only as text/border/ring accents |
| Outline tiers | neutral outline + brand variant | `--outline` **==** `--outline-variant` (teal) in both themes → no neutral tier; tier-table check cells rely on a 60%-alpha teal |
| Radius | 8px default / 12px md / 16px lg | `borderRadius.DEFAULT: '6px'`; every button is `rounded-full` (9999px); chips/tags `rounded-[16px]` |
| Browser chrome | — | `<meta theme-color>` `#0A0F1A` / `#F5F7FA` vs token `#081420` / `#faf8f3` |
| Light surface | cool `#f7f9fb` | warm cream `#faf8f3`; light primary `#004D59` vs documented `#001c38` |

Button census across 7 pages: **all 26 filled buttons** are the same `#5EEAD4`/`#081420` 9999-radius pill, but the same label (“Book a Free Consultation”) ships at four sizes — 12px (navbar), 14px, 16px, 18px — and both font-weight 500 and 600. The homepage hero’s primary action is a plain underlined text link while every other page leads with a filled pill.

**Fix:** single source of truth for buttons (one `btn-primary` Tailwind component with variants); align `--outline`/`--outline-variant` to neutral+brand; reconcile themeColor and radius tokens with DESIGN.md (or update the docs — see F14).

---

## F9 (P2, latent) — Light theme: unreachable, and broken if forced

Grep over `src/` finds **zero references to `next-themes`** (no provider, no `useTheme`, no toggle)) — AGENTS.md’s “light mode remains as secondary toggle” is false. `dark` is hardcoded in `src/app/layout.tsx`; there is **no user path to light mode**.

Forcing light (`.dark` removed, transitions killed) shows the palette is complete but **not theme-safe**: every `accent.*` and `text-background`-on-accent button uses raw hex, so light mode produces **9–31 WCAG contrast failures per page** (`/` 31, `/services` 29, `/careers` 29, `/security` 10, insight post 11, `/contact` 9, `/privacy` 7) — accent labels/links at 1.18–1.39:1, cream-on-teal buttons at 1.39:1.

Screenshot: `04-home-light-section-accent-contrast.jpg`, `05-home-desktop-light-full.jpg`.

**Fix (choose one):** ship a real toggle with theme-aware accents (`--accent-bright`/`--accent-cyan` as tokens with light variants), **or** delete the light `:root` block and hardcode dark — leaving a broken-but-dead palette is a trap for the next contributor.

---

## F10 (P2) — Vertical rhythm: 4+ spacing conventions

Measured section paddings across all routes:

| Convention | Where |
|---|---|
| `192px/192px` desktop, `128px` mobile (`py-32 md:py-48`) | majority of marketing sections |
| `160px/160px` | 2 homepage sections, /about, /faq |
| `96px/96px`; `112px/112px`; `144px/128px`; `64px/64px` | /careers, /contact, insight posts, transform list |
| `0/0` + `32px/32px` | legal pages, playbooks |

DESIGN.md’s top spacing is 80–120px — 192px exceeds it by 60–140%, and mobile is a flat 128px everywhere. **Fix:** one `--spacing-section` scale (e.g. 64/96/128/160) applied via a `py-section` utility; migrate call sites mechanically.

---

## F11 (P2) — Line length: up to ~100 characters

Measured widest line-box / font-size (avg char ≈ 0.5em for Inter):

- `/security` prose: **799px @ 16px ≈ 100ch** (ideal 45–75)
- `/services` tier intro: 732px @ 18px ≈ 81ch
- `/careers`: up to 85ch
- Homepage: max 72ch ✅

Legal/policy prose columns have no max-width; text containers are `max-w-[1440px]` so they never clamp. **Fix:** `max-w-prose` (65ch) or 72ch on prose columns in the legal/two-column layouts.

---

## F12 (P3) — Focus treatment: UA default everywhere, weak on form fields

Tab-tested (24 stops × `/`, `/contact`, diffs of outline/shadow/border/bg/colour while focused):

- Only the **logo link** uses the designed `focus-visible:ring-2 ring-primary` (teal 2px).
- The other 23 stops rely on the browser default `1px auto` outline (visible but not the design system; near-invisible on light surfaces).
- Contact form fields use Tailwind’s `focus:outline-none` (2px transparent outline) with no ring/shadow — the only cue is a 1px border going `rgba(68,221,193,.2)` → solid teal (a change, but a weak one; below WCAG 2.4.11 / 1.4.11 guidance).

**Fix:** global `:focus-visible` ring utility (`ring-2 ring-primary ring-offset-2`), remove `focus:outline-none` on inputs, keep a visible border-on-focus.

---

## F13 (P3) — H1 spacing defect + CTA typography consistency

- Homepage H1 `textContent` is **“We build the systemsyour business runs on.”** — the source has `We build the systems<br>your business…` with no space around the `<br>`, so the accessible/SEO/copy-paste text glues “systemsyour”. Visual layout is unaffected. (Hero.html: `We build the systems<br>your business<!-- --> <span class="italic text-accent-cyan">runs on.</span>`)
- Same CTA label at 12/14/16/18px (see F8). Standardise.

---

## F14 (P3) — Documentation drift

- `AGENTS.md`: claims Hanken Grotesk + “Plus Jakarta Sans & Space Grotesk loaded in layout.tsx” + next-themes toggle — none exist (fonts actually: Inter / IBM Plex Serif / JetBrains Mono; no Hanken Grotesk @font-face, zero 700-weight runs, `font-display` aliases to Inter).
- `ARCHITECTURE.md:68` lists `teal-gradient-btn`/`btn-primary` as real utilities — they caused F1.
- `tailwind.config.js:4` `content` glob includes `./index.html` (doesn’t exist).
- DESIGN.md light values (cool `#f7f9fb`, primary `#001c38`) don’t match the shipped light `:root`.

---

## Verified-clean checklist (so the “everything!” brief is covered)

- **Colour balance (dark):** 24/29 pages zero WCAG violations; hover/social states analysed per-component; the only page with stray violations is `/`’s off-screen honeypot (excluded, correctly invisible).
- **Image alt audit:** every `alt=""` is inside `aria-hidden` decorative context (FoundingClient photo, OgPostImage) or a card link whose title text supplies the name — no defects.
- **Typography rendering:** only Inter / IBM Plex Serif / JetBrains Mono / Material Symbols load; display scale 102.8 / 84.4 / 66.1 / 49.8px + 24/16/14/12px + 10px (legal); fluid clamps tested at 3 widths (no desktop/mobile heading overflow).
- **Layout:** no horizontal overflow except F2 (mobile /contact) and F3 (tablet /services); containers/gutters correct (px-6 mobile, px-12 desktop); one H1 per page except F7.
- **Responsive:** 3 viewports × 29 routes; mobile docH grows only via stacked sections; tablet clean except F3; max font sizes: 48px mobile marketing, 40px posts, 28px legal (all inside clamp bounds).
- **Interactions:** hover states exist on all interactive elements; carousel dots + arrow keys functional; mobile menu opens, closes, locks scroll; 404 renders a real page.
- **Motion:** `prefers-reduced-motion` honoured for GSAP reveals, Lenis smooth scroll, Tilt3D, and the WebGL orbit scene (code-verified); CSS hover transitions are not `motion-reduce:`-gated (minor, not a WCAG failure).
- **Performance (prior work, not re-audited here):** fonts subset via Material Symbols `text=`, favicon 261 B, hero images capped — Lighthouse baseline recommended against production.

---

## Prioritised fix list

1. **P0** Define or replace `teal-gradient-btn` + `btn-primary` everywhere (F1) — regain visible CTAs on /security, 3 insight posts, 404, mobile menu, and the booking stepper.
2. **P0** `min-w-0` on the /contact mobile grid column; re-verify 0px overflow at 375/320 (F2).
3. **P1** `/services` switcher wrap/cue at <1024px (F3).
4. **P1** Associate all ApplicationForm labels (`htmlFor`+ids) and add `required` (F4).
5. **P1** `<header>` wrapper + skip link + nav labels (F5).
6. **P2** Target-size floor 24px (ideally 44px) on footer/breadcrumb/dots/menu (F6).
7. **P2** Choose light-theme fate: real toggle + theme-aware accents, or remove the palette (F9).
8. **P2** One button component: single fill/radius, standardised text sizes (F8).
9. **P2** Section-spacing scale (F10) + prose max-width 72ch on legal/security pages (F11).
10. **P2** H1 for /maintenance, H2 for /contact steps, 12px floor for legal copy (F7).
11. **P3** Global `:focus-visible` ring; restore visible input focus (F12).
12. **P3** Space in the hero H1 text content (F13) + docs sync (F14).

---

## Evidence screenshots (`C:\Users\rodne\.playwright-mcp\ui-audit\`)

| File | Shows |
|---|---|
| `01-home-desktop-dark-full.jpg`, `02-home-hero-desktop-dark.jpg` | Homepage (dark) — layout, colour balance, hero CTA |
| `03-home-hero-desktop-light.jpg`, `04-home-light-section-accent-contrast.jpg`, `05-home-desktop-light-full.jpg` | Light mode — accent contrast failures (F9) |
| `06-security-cta-invisible.jpg` | F1: “Compare packages” rendered as invisible text-on-bg (1.1:1) |
| `07-insights-post-cta-invisible.jpg` | F1: insight-article CTA block |
| `08-contact-stepper-next-invisible.jpg` | F1: “Next: Pick a Time” — no fill, no radius |
| `09-contact-desktop-dark-full.jpg` | /contact full page |
| `10-careers-form-unassociated-labels.jpg` | F4: form fields whose labels aren’t linked |
| `11-careers-desktop-dark-full.jpg` | /careers full page |
| `12-services-desktop-dark-full.jpg`, `13-insights-desktop-dark-full.jpg` | Full-page desktop |
| `14-404-invisible-cta.jpg` | 404 page (“Back to Home” transparent) |
| `15a/15b-home-mobile-dark-*.jpg` | Homepage mobile, top & bottom halves |
| `16-mobile-menu-transparent-cta.jpg` | F1: mobile menu “Book Free Consultation” transparent |
| `17-contact-mobile-top.jpg`, `18-contact-mobile-overflow-column.jpg`, `19-contact-mobile-full.jpg` | F2: mobile overflow column (352px in 319px box) |
| `20-home-tablet-full.jpg`, `21-home-tablet-navbar.jpg` | Tablet |
| `22-services-tablet-switcher-overflow.jpg` | F3: 1289px switcher strip in a 680px box |