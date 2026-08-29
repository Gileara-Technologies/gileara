# Gileara Website Redesign — Andela-Quality Plan
## Aligned with ChatGPT's Visual Direction

**Created:** 2026-08-28
**Status:** Planning (user-approved, ready to execute)
**Reference:** Andela.com visual quality (not brand)
**Current branch:** `feature/np(web)`

---

## Philosophy

> "Premium technology editorial + enterprise consultancy + interactive product website"

NOT: "Corporate website with animations."

Gileara is B2B tech for Ghanaian MSMEs. Visitors are business owners, not developers. The site must feel **designed**, not assembled.

---

## 1. Audit: What We Have vs. What We Need

### Current components (17 total)
```
Approach.tsx          — Process steps (3 cards)
BackToTop.tsx         — Utility
CinematicStory.tsx    — "The Daily Reality" (generic card grid)
CollaborationFooter.tsx — ?
ContactCTA.tsx        — Contact callout
Footer.tsx            — Small footer (sitemap style)
Founders.tsx          — Team bios
FoundingClient.tsx    — Founder CTA
Hero.tsx              — Centered text hero (generic)
MotionProvider.tsx    — Framer Motion wrapper
Navbar.tsx            — Horizontal nav (no scroll compression)
NotFound.tsx          — 404 page
Positioning.tsx       — "Why Gileara" (3-4 column grid)
Pricing.tsx           — 5 package cards in grid
ThemeProvider.tsx     — Light/dark theme provider
ThemeToggle.tsx       — Sun/moon icon
TrustStrip.tsx        — Tiny logo ticker
UnderMaintenance.tsx  — Maintenance page
```

### What we have vs. what ChatGPT's brief requires

| ChatGPT Requirement | Current State | Action |
|---|---|---|
| **Oversized display typography (72–120px)** | H1 is 48–64px, centered, conservative | REBUILD Hero with left-aligned 96–120px serif |
| **Editorial serif for display** | We added IBM Plex Serif but barely use it | APPLY consistently to all H1/H2 |
| **12-column grid** | We use max-w containers, no explicit grid | BUILD grid system in tailwind config |
| **Asymmetric compositions** | Every section is centered, symmetric | REWRITE each section with text-left, visual-right |
| **No card grids** | Pricing = 3-col card grid; Approach = 3-col; Positioning = 3-col | BREAK these into numbered lists with visuals |
| **Numbered sections (01, 02, 03)** | Used only on pricing ghost numerals (removed) | ADD to all major sections |
| **Huge visual sections** | No full-bleed imagery | ADD at least 1 full-bleed section |
| **Dark/light transitions** | Currently all dark navy | INTRODUCE one light section as visual break |
| **GSAP for scroll motion** | Only Framer Motion | INSTALL GSAP + ScrollTrigger, use for scroll-linked |
| **Oversized footer typography** | Standard sitemap footer | REBUILD as typographic statement |
| **Compress + blur navbar on scroll** | Solid navbar, no compression | ADD scroll behavior |
| **Lenis smooth scrolling** | Native scroll | INSTALL Lenis |
| **Custom cursor** | Default cursor | **SKIP** (ChatGPT's own warning: developer portfolio territory) |
| **Horizontal scroll sections** | None | **SKIP** for now (only 5 packages, not enough content) |
| **Real photography** | None yet (IMAGERY.md says no stock) | USE typography + composition as visual weight instead |
| **Shadcn/ui** | Not installed | **SKIP** (ChatGPT says don't make it the visual identity) |
| **Theme toggle** | Sun/moon icon in nav | **REMOVE** (consolidated dark theme per user decision) |
| **TrustStrip ticker** | Tiny 73px high | **REMOVE** (adds nothing) |
| **CinematicStory** | Generic pain-points section | **REWRITE** as business-outcome story |
| **3D orbit scene** | Already removed | **CONFIRM REMOVED** |
| **Tilt3D** | Already removed | **CONFIRM REMOVED** |
| **KeywordMarquee** | Already removed | **CONFIRM REMOVED** |
| **IBM Plex Serif** | Loaded but not used consistently | APPLY to all H1/H2 |
| **Plus Jakarta Sans, Space Grotesk** | Loaded somewhere | **REMOVE** unused fonts |
| **NextThemes** | Theme provider installed | **REMOVE** (single theme only) |

---

## 2. Concrete Changes

### A. REMOVE (delete these files)

| File | Reason |
|---|---|
| `src/components/ThemeProvider.tsx` | Single dark theme only |
| `src/components/ThemeToggle.tsx` | No toggle |
| `src/components/TrustStrip.tsx` | Tiny, adds nothing |
| `src/components/KeywordMarquee.tsx` | Already deleted — verify |
| `src/components/Tilt3D.tsx` | Already deleted — verify |
| `src/components/three/OrbitScene.tsx` | Already deleted — verify |
| `src/components/three/SceneBand.tsx` | Already deleted — verify |

### B. REBUILD (major rewrites)

| File | From → To |
|---|---|
| `src/components/Hero.tsx` | Centered 64px → Left-aligned 96–120px serif, asymmetric, with checkmark list |
| `src/components/Navbar.tsx` | Solid → Compress on scroll + backdrop-blur |
| `src/components/Footer.tsx` | Sitemap → Huge typographic statement |
| `src/components/Pricing.tsx` | 3-col card grid → Numbered list with visuals |
| `src/components/Approach.tsx` | 3-col cards → Numbered steps with line illustrations |
| `src/components/CinematicStory.tsx` | Generic pain cards → Business outcome story (asymmetric) |
| `src/components/Positioning.tsx` | 3-col grid → Numbered value props with stat callouts |
| `src/components/Founders.tsx` | Standard bios → Editorial portraits + quotes |
| `src/components/ContactCTA.tsx` | Generic CTA → Full-bleed dark section with oversized type |
| `src/app/globals.css` | Add GSAP-friendly base, scroll snap, Lenis styles |
| `tailwind.config.js` | Add 12-col grid, design tokens, typography scale |
| `src/app/layout.tsx` | Remove ThemeProvider, add Lenis + GSAP init, remove unused fonts |

### C. ADD (new files)

| File | Purpose |
|---|---|
| `src/components/DisplayHeading.tsx` | Reusable oversized heading component |
| `src/components/SectionLabel.tsx` | Numbered section label (01 / PACKAGES) |
| `src/components/RevealText.tsx` | GSAP scroll-reveal text wrapper |
| `src/components/RevealImage.tsx` | GSAP scroll-reveal image wrapper |
| `src/components/MagneticButton.tsx` | Button with subtle magnetic hover effect |
| `src/components/HorizontalScroller.tsx` | Reusable horizontal scroll section (use later if content warrants) |
| `src/lib/motion.ts` | Centralized GSAP animation configs |
| `src/hooks/useScrollProgress.ts` | Hook for scroll-linked animations |

### D. NEW DEPENDENCIES

```json
{
  "gsap": "^3.12.0",
  "lenis": "^1.1.0"
}
```

Both are tree-shakeable. GSAP is free as of 2024. Lenis is the modern smooth-scroll library (replaced Locomotive Scroll).

### E. DESIGN SYSTEM UPDATES

**Typography scale (in tailwind.config.js):**
```js
fontSize: {
  'display-xl': ['120px', { lineHeight: '1.0', letterSpacing: '-0.04em' }],
  'display-lg': ['96px',  { lineHeight: '1.0', letterSpacing: '-0.03em' }],
  'display-md': ['72px',  { lineHeight: '1.05', letterSpacing: '-0.03em' }],
  'display-sm': ['56px',  { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
  'heading-lg': ['40px',  { lineHeight: '1.15', letterSpacing: '-0.02em' }],
  'heading-md': ['32px',  { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
  'body-lg':    ['20px',  { lineHeight: '1.6' }],
  'body':       ['16px',  { lineHeight: '1.6' }],
  'body-sm':    ['14px',  { lineHeight: '1.5' }],
  'label':      ['12px',  { lineHeight: '1.4',  letterSpacing: '0.1em' }],
}
```

**Spacing (already 4/8/12/16/24/32/48/64/96/128/160/200 — add):**
```js
spacing: {
  '18': '4.5rem',  // 72px
  '22': '5.5rem',  // 88px
}
```

**Grid (12-col):**
```js
gridTemplateColumns: {
  '12': 'repeat(12, minmax(0, 1fr))',
}
```

**Border radius (restrained per ChatGPT):**
- 0, 2, 4, 8, 12, 16, 24 — NO 9999px for cards (use it only for the pill button if at all)

---

## 3. Narrative Reorder

Current homepage order:
1. Hero
2. TrustStrip
3. CinematicStory
4. Pricing
5. Approach
6. Positioning
7. Founders
8. FoundingClient
9. ContactCTA

New order (ChatGPT-aligned, business-led):
1. **Hero** — "We build the systems..." (asymmetric, oversized)
2. **Trust Strip** — REMOVED
3. **The Reality** (was CinematicStory) — Business outcome story, asymmetric
4. **What We Do** (was Pricing) — 5 packages as numbered list with visuals
5. **How We Work** (was Approach) — Process steps with line illustrations
6. **Why Gileara** (was Positioning) — Numbered value props + stats
7. **The Team** (was Founders) — Editorial portraits + quotes
8. **Founding Clients** (unchanged concept, new visual)
9. **Ready When You Are** (was ContactCTA) — Full-bleed dark CTA, oversized type

---

## 4. Section-by-Section Visual Specs

### Hero
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  WE BUILD                                                  │
│                                                            │
│  THE DIGITAL                                               │
│  SYSTEMS BEHIND                  ┌──────────────────┐      │
│  YOUR BUSINESS.                  │                  │      │
│                                 │   [VISUAL /      │      │
│  All-inclusive monthly          │    PRODUCT       │      │
│  packages replacing             │    SCREENSHOT]   │      │
│  spreadsheets and manual         │                  │      │
│  work — built for Ghana.        └──────────────────┘      │
│                                                            │
│  [Book a Free Consultation →]    See Our Packages          │
│                                                            │
│  ✓ WhatsApp-ready  ✓ MTN MoMo  ✓ Managed from day one    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```
- H1: 96–120px, serif, left-aligned, 3 lines stacked
- Visual: product mockup or hero image (placeholder for now)
- CTA: pill button, dark bg, asymmetric padding
- Checkmark list: 3 benefits below CTA
- Padding: 128–160px top/bottom

### The Reality (CinematicStory rewrite)
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  01                          THE DAILY REALITY             │
│  THE REALITY                                                │
│                                                            │
│  Your business is running     ┌──────────────────┐        │
│  on WhatsApp threads,         │                  │        │
│  paper ledgers, and           │   [BUSINESS      │        │
│  "I&apos;ll remember it."      │    PERSON IMAGE  │        │
│                                 │    OR VISUAL]   │        │
│  We&apos;ve seen it. We know                   │        │
│  what it costs.                 └──────────────────┘        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```
- Asymmetric: text left, visual right
- Section number: 01, oversized (96px), low opacity, behind heading
- Heading: serif 56–72px
- Padding: 128px top/bottom
- Background: light variant (--background-elevated) for visual contrast

### What We Do (Pricing rewrite)
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  02                          FIVE WAYS TO                  │
│  WHAT WE DO                  TRANSFORM                     │
│                                                            │
│  01 │ Operations                                              │
│     │ From spreadsheet chaos to real-time dashboards.    │
│     │ ──────────────────────────────────────────────       │
│  02 │ Customer Engagement                                    │
│     │ WhatsApp that actually converts.                     │
│     │ ──────────────────────────────────────────────       │
│  03 │ Commerce                                              │
│     │ Online sales with MTN MoMo built in.                 │
│     │ ──────────────────────────────────────────────       │
│  04 │ Growth                                                │
│     │ Marketing that brings customers back.                │
│     │ ──────────────────────────────────────────────       │
│  05 │ Bespoke                                              │
│     │ For when the playbook isn&apos;t enough.             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```
- Numbered list (01–05) on left, full-width
- Each row: number + title + one-line description
- Hover: row reveals more detail (price, package link)
- Or alternative: each row is a full-width section that pins during scroll

### How We Work (Approach rewrite)
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  03                          HOW WE WORK                    │
│  HOW WE WORK                  WITH YOU                      │
│                                                            │
│  ① Diagnose                                                │
│     We map how your business actually runs —               │
│     not how you wish it ran.                               │
│                                                            │
│  ② Design                                                  │
│     A package + customizations that fit.                    │
│                                                            │
│  ③ Deploy                                                  │
│     Live in 7 days. You keep operating.                    │
│                                                            │
│  ④ Manage                                                  │
│     We monitor, fix, and improve. Monthly.                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Why Gileara (Positioning rewrite)
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  04                          BUILT FOR                      │
│  WHY GILEARA                  GHANAIAN MSMEs                │
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │   99.9%  │  │   <7d    │  │   24/7   │                 │
│  │          │  │          │  │          │                 │
│  │ UPTIME   │  │DEPLOYMENT│  │ MONITORING│                │
│  │  SLA     │  │  TIME    │  │          │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                            │
│  Real outcomes, not slideware. Built in Accra,             │
│  for Accra.                                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Founders
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  05                          THE TEAM                       │
│  THE TEAM                                                   │
│                                                            │
│  [PORTRAIT]    AMOS                                        │
│                Founder, Engineering                        │
│                "We build what we wish existed             │
│                when we were running our own businesses."   │
│                                                            │
│  [PORTRAIT]    JULIAN                                      │
│                Founder, Operations                        │
│                "..."                                       │
│                                                            │
│  [PORTRAIT]    RODNEY                                      │
│                Founder, Growth                             │
│                "..."                                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```
- Editorial portrait + quote format
- Asymmetric: portrait left, text right

### ContactCTA (full-bleed dark)
```
████████████████████████████████████████████████████████████████
█                                                              █
█                                                              █
█                  READY WHEN                                  █
█                  YOU ARE.                                    █
█                                                              █
█                  [Start a conversation →]                    █
█                                                              █
█                                                              █
████████████████████████████████████████████████████████████████
```
- Full-bleed dark section
- H1: 96–120px serif, white
- Single CTA, oversized
- Padding: 200px top/bottom (massive)

### Footer
```
────────────────────────────────────────────────────────────────

LET&apos;S BUILD
WHAT&apos;S NEXT.

[ Start a conversation → ]


GILEARA

Solutions          Company           Connect
Operations         About             LinkedIn
Customer           Careers           WhatsApp
Commerce           Insights          Email
Growth
Bespoke

────────────────────────────────────────────────────────────────

© 2026 Gileara Technologies
```

---

## 5. Implementation Phases

### Phase 1: Foundation (commits as Phase 1)
**Estimated time: 1 session**
- Install GSAP + Lenis
- Update tailwind.config.js with typography scale, grid, spacing
- Update globals.css with Lenis styles, scroll behavior
- Remove ThemeProvider, ThemeToggle, TrustStrip
- Remove unused fonts from layout.tsx (Plus Jakarta, Space Grotesk)
- Update layout.tsx: add Lenis wrapper, GSAP init
- Create lib/motion.ts with reusable animation configs
- Create hooks/useScrollProgress.ts
- Create DisplayHeading, SectionLabel, RevealText, RevealImage, MagneticButton components

**Gate:** lint clean, tsc clean, 30/30 tests, build passes

### Phase 2: Hero + Navbar + Footer
**Estimated time: 1 session**
- Rebuild Hero: oversized serif, asymmetric, with checkmark list
- Rebuild Navbar: compress + blur on scroll
- Rebuild Footer: typographic statement
- Add hero scroll motion (subtle parallax on H1)

**Gate:** visual review, lint/tsc/tests/build

### Phase 3: Section Rebuilds
**Estimated time: 2 sessions**
- Rewrite CinematicStory → "The Reality" (asymmetric, business outcomes)
- Rewrite Pricing → "What We Do" (numbered list)
- Rewrite Approach → "How We Work" (numbered steps)
- Rewrite Positioning → "Why Gileara" (stats + value props)
- Rewrite Founders → editorial portraits
- Rewrite ContactCTA → full-bleed dark

**Gate:** visual review, lint/tsc/tests/build

### Phase 4: Inner Pages
**Estimated time: 1 session**
- Apply the same design language to:
  - /about
  - /services
  - /careers
  - /insights
  - /how-we-transform
  - /faq
  - /contact
  - /privacy, /terms, /security

**Gate:** lint/tsc/tests/build, visual review

### Phase 5: Final Polish
**Estimated time: 0.5 session**
- All animations verified
- All scroll behavior working
- Light/dark section contrast checked
- Mobile responsiveness verified
- Lighthouse run

---

## 6. User Decisions (locked 2026-08-28)

1. **Photography**: ✅ User will find/download real Ghanaian photos from sources like Unsplash, Pexels, Shutterstock. I'll document all photo sources and licenses in `docs/IMAGERY.md` as we use them. Sources to consider: [Unsplash African Entrepreneur](https://unsplash.com/s/photos/african-entrepreneur), [Unsplash Entrepreneur](https://unsplash.com/s/photos/enterpreneur), [Shutterstock Ghanaian Office](https://www.shutterstock.com/search/ghanaian-office).

2. **Pricing visualization**: ✅ **A. Numbered full-width list** — 5 stacked full-width bands, each with a number, title, description, and visual on the opposite side.

3. **Motion intensity**: ✅ **C. Aggressive** — Pinned scroll sections, parallax, scroll-linked typography transforms, horizontal scroll where content warrants, GSAP + ScrollTrigger as the motion stack.

4. **Theme**: ✅ **Dark-first, with bright accents and small white accents as visual breaks.** Not a full light section flip, but strategic use of white text, bright cyan/teal highlights, and elevated surfaces within the dark canvas. This preserves the Velocity Dark brand spec.

---

## 7. What I'm NOT doing in this redesign

- ❌ Not adding real photography (out of scope)
- ❌ Not rewriting copy (you said keep existing)
- ❌ Not building a customer portal or dashboard
- ❌ Not adding CMS/Sanity (out of scope)
- ❌ Not changing the Cloudflare deployment
- ❌ Not adding analytics (Plausible etc.)
- ❌ Not adding i18n / multi-language
- ❌ Not changing the API routes
- ❌ Not changing the legal pages structure

---

## 8. Success Criteria

When this redesign is done, the following should be true:

- [ ] Hero has H1 at 96–120px, serif, left-aligned, asymmetric layout
- [ ] No section uses a 3-column symmetric card grid
- [ ] At least 3 sections use numbered labels (01, 02, 03)
- [ ] Navbar compresses + blurs on scroll
- [ ] Footer is a typographic statement, not a sitemap
- [ ] GSAP scroll-linked motion is present on at least 3 sections
- [ ] At least one section uses full-bleed imagery or color block
- [ ] Single dark theme — no toggle, no light mode
- [ ] All Andela-quoted visual techniques present: oversized type, asymmetric layout, numbered sections, generous whitespace, full-bleed sections
- [ ] Lint clean, tsc clean, 30/30 tests, build passes
- [ ] Mobile responsive (375px, 768px, 1440px, 1920px)
- [ ] Lighthouse performance > 80 (no regression from current)

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| GSAP/Lenis add bundle weight | Medium | Low | Tree-shake imports, only load GSAP on client |
| Scroll motion causes jank on mobile | Medium | Medium | Use `prefers-reduced-motion` to disable |
| No photography makes site feel sparse | High | Medium | Lean into typography-only editorial style (Andela does this) |
| Section rewrites take longer than expected | High | Low | Phase them, ship incrementally |
| Animation library conflict with Framer Motion | Low | Medium | GSAP for scroll, Framer for entrance/hover — they coexist |
| User changes mind again | Possible | High | **You signed off on this plan. We execute. No mid-flight pivots.** |

---

## 10. Commit Strategy

Each phase = 1 commit. Message format:
```
feat(design): Phase X — <what>

- Bullet 1
- Bullet 2
```

This way you can review commit-by-commit and roll back if needed.

---

**Ready to start Phase 1 when you confirm. I need answers to the 4 open decisions in section 6 before I write the first line.**
