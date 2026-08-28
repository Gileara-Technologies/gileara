# Gileara Technologies — Design System v2
## Andela UI Language Applied

**Effective:** 2026-08-27  
**Status:** Active Redesign  
**Reference:** [Andela](https://andela.com), [Interswitch](https://interswitch.com)

---

## Philosophy

**Simplicity. Authority. Clarity.**

- **No gimmicks**: Remove 3D orbit, tilt animations, marquees. Replace with refined white space and typography.
- **Copy leads**: Hero headline tells the story before any visual flourish.
- **Vertical taxonomy**: Structure mirrors user journey (What we do → How we do it → Who benefits → Proof → Join us).
- **Minimal color**: Navy base + one cyan accent + grays. No teal, no gold, no secondary colors.

---

## Typography

| Role | Font | Weight | Size (Desktop) | Notes |
|---|---|---|---|---|
| **Display H1** | Inter | 700 | 56–64px | Hero headlines only; max 2 lines |
| **Heading H2** | Inter | 700 | 40–48px | Section titles |
| **Heading H3** | Inter | 600 | 28–32px | Card titles, subsections |
| **Body** | Inter | 400 | 16px | Paragraphs, UI text |
| **Body Small** | Inter | 400 | 14px | Labels, metadata |
| **Mono** | JetBrains Mono | 500 | 14px | Code, technical snippets |

**Why Inter everywhere?** Andela uses Inter + serif for warmth. We use Inter for clarity and trust (professional, not decorative). Tighten letter-spacing to -0.5px on headlines for confidence.

---

## Color Palette

| Name | Hex | Usage |
|---|---|---|
| **Navy (Primary)** | `#103A5E` | Background, text (dark mode default) |
| **Cyan (Accent)** | `#0275D8` | CTAs, links, highlights |
| **Ice Blue (Alt BG)** | `#EBF8FE` | Section alternation (light bg) |
| **White** | `#FFFFFF` | Text on navy, card backgrounds |
| **Gray 100** | `#F5F7FA` | Subtle backgrounds |
| **Gray 200** | `#E8EBEF` | Borders, dividers |
| **Gray 600** | `#64748B` | Secondary text |
| **Gray 900** | `#0F172A` | Primary text on light |

**Removal:**
- ❌ Teal (`#44DDC1`, `#00BFA5`) — replace all with cyan
- ❌ Gold (`#E8C547`) — gone
- ❌ Multi-dark containers — use Navy only

---

## Layout & Spacing

### Section Heights
All major sections: **800–1200px** (including padding).

```
Header:        120px (sticky)
Hero:          900px (headline + CTA + breathing room)
Sections:      900px each
Footer:        400px
```

### Vertical Rhythm
- **Section padding:** 80px top/bottom (desktop), 40px (mobile)
- **Between elements:** 24px, 32px, 48px (never random)
- **Card grid:** 3 cols (desktop), 2 cols (tablet), 1 col (mobile); 24px gap

### Background Alternation
```
Hero:           Navy (#103A5E)
What We Do:     Ice Blue (#EBF8FE)
How We Do It:   Navy
Case Studies:   Ice Blue
Proof:          Navy
CTA:            Ice Blue
Footer:         Navy
```

**Pattern:** Strictly alternating. Predictable = trustworthy.

---

## Components

### Hero Section
```
┌─────────────────────────────────────────┐
│                                         │
│  [Headline]                             │
│  "Transform Your MSME With Systems      │
│   Built for African Scale"              │
│                                         │
│  [Subheading, 18px gray]                │
│  One platform. Three years of ops.      │
│  No more scattered tools.               │
│                                         │
│  [CTA Buttons]                          │
│  [Primary: Cyan] [Secondary: Outline]   │
│                                         │
└─────────────────────────────────────────┘
```

**Design notes:**
- Headline only; no hero image, no 3D scene, no video autoplay
- Optional: subtle gradient or single-color block behind headline (not distracting)
- Ample white space (60% of section is negative space)

### Card System (What We Do / Case Studies)
```
┌────────────────────┐
│ [Icon or #]        │
├────────────────────┤
│ Title (20px bold)  │
│ Description (14px) │
│ [Learn More →]     │
└────────────────────┘
```

**Styling:**
- Border: 1px Gray 200
- Hover: border becomes cyan, shadow lifts (subtle, 4px)
- No tilt, no 3D, no background color change
- Grid: 3 cols

### CTA Button Variants

| Type | Style |
|---|---|
| **Primary** | Bg: Cyan, Text: White, Padding: 12px 32px |
| **Secondary** | Bg: transparent, Border: 2px cyan, Text: Cyan, Padding: 12px 32px |
| **Text** | Text: Cyan, Underline: on hover |

**State:**
- Hover: opacity 0.8, subtle shadow
- Active: opacity 0.9
- Disabled: Gray 300

### Section Title
```
[Overline in Cyan, 12px]
WHAT WE DO

[Headline in Navy, 48px, bold]
Scenarios, Not Services

[Subheading in Gray, 18px]
We map your business model to the systems
that unlock growth. No templates.
```

---

## Navigation

**Navbar (Sticky, 120px height)**
- Logo (left)
- Nav links (center): Home, Services, Insights, Careers, Company
- CTA button (right): "Book a Consultation" (cyan)
- Mobile: hamburger menu

**Sticky behavior:** Keep nav visible; on scroll, compress height to 80px (logo smaller, less padding).

---

## Content Structure (Homepage)

| Section | Height | BG | Content |
|---|---|---|---|
| Hero | 900px | Navy | Headline + CTA |
| What We Do | 1000px | Ice Blue | 3-card grid: Scenario types |
| How We Do It | 950px | Navy | 4-step process cards |
| For Your Role | 1050px | Ice Blue | Founder / CTO / Ops Manager tabs |
| Case Studies | 1100px | Navy | 3 case study cards with metrics |
| Why Gileara | 800px | Ice Blue | Trust markers (customers, uptime, reviews) |
| Proof | 900px | Navy | Testimonials or metrics grid |
| CTA Band | 400px | Cyan | "Ready to scale?" + signup form |
| Footer | 400px | Navy | Links, legal, socials |

**Key changes from v1:**
- ❌ Orbit hero → ✅ Clean headline-only hero
- ❌ TrustStrip (early) → ✅ "Why Gileara" section (mid-page)
- ❌ Pricing cards (front-loaded) → ✅ Services page (separate)
- ✅ "For Your Role" (new) — Andela-style role-based messaging
- ✅ Case studies elevated to prominent position

---

## Interactions & Motion

**Principle:** No motion for motion's sake. Only purposeful easing.

| Element | Animation | Duration |
|---|---|---|
| Scroll reveal (cards) | Fade-in + 16px slide up | 0.6s on-view |
| CTA hover | Background fade + shadow lift | 0.2s ease-out |
| Link hover | Underline expand (cyan) | 0.15s |
| Page transition | Fade (no slide) | 0.3s |

**Reduced-motion:** All animations disabled; elements appear immediately.

---

## Responsive Breakpoints

| Device | Width | Adjustments |
|---|---|---|
| Mobile | 320–640px | 1 col grid, 40px padding, 32px headline |
| Tablet | 641–1024px | 2 cols, 60px padding, 40px headline |
| Desktop | 1025px+ | 3 cols, 80px padding, 56px headline |

---

## What We're Removing

| Item | Reason |
|---|---|
| **Orbit 3D scene** | Distracting; doesn't serve copy |
| **Tilt cards** | Feels gimmicky; clashes with authority |
| **Keyword marquee** | Nice but unnecessary |
| **Numbered pricing** | Confusing (is 01 better than 05?) |
| **Hanken Grotesk** | Swap to Inter for consistency |
| **Secondary accents** | Teal, gold → gone; cyan only |
| **Multiple backgrounds** | Navy + ice blue only |

---

## What We're Keeping

| Item | Why |
|---|---|
| **Dark-first theme** | Part of brand identity |
| **Framer Motion (simplified)** | Scroll reveals only |
| **Material Symbols** | Icon system unchanged |
| **Modular content** | packages.ts, scenarios.ts, posts.ts |
| **JSON-LD schema** | SEO intact |

---

## Accessibility (WCAG 2.1 AA)

- [ ] Cyan on navy: 4.5:1 contrast (verified)
- [ ] White on navy: 11:1 contrast (verified)
- [ ] All CTAs keyboard-navigable
- [ ] Focus rings: 3px cyan
- [ ] Form labels always visible
- [ ] Reduced-motion: animations disabled, no flashing

---

## Next Steps

1. **Delete/deprecate components:**
   - `src/components/three/OrbitScene.tsx` → remove
   - `src/components/three/SceneBand.tsx` → remove
   - `src/components/Tilt3D.tsx` → remove (but keep code as reference for future)
   - `src/components/KeywordMarquee.tsx` → remove

2. **Redesign components:**
   - `Hero.tsx` → clean headline hero, remove canvas
   - `Pricing.tsx` → move to services page, simplify cards
   - All section headers → unified styling

3. **New components:**
   - `RoleBasedCTA.tsx` → founder/CTO/ops tabs
   - `CaseStudyCard.tsx` → emphasis on metrics
   - `TrustMarkers.tsx` → customers + uptime + reviews

4. **Update tailwind.config.js:**
   - Replace color tokens (teal → cyan)
   - Update font stack (Inter only for display)
   - New spacing scale

5. **Rebuild homepage sections** in order (Hero → What We Do → How → For Your Role → Case Studies → Why → Proof → CTA → Footer)

---

## Design Checklist (Before Deploy)

- [ ] No teal or gold visible anywhere
- [ ] All sections 800–1200px
- [ ] Backgrounds alternate Navy ↔ Ice Blue
- [ ] Typography: Inter only, -0.5px tracking on headlines
- [ ] All CTAs cyan buttons or outline variants
- [ ] Spacing: 24/32/48px grid only (no random 17px, 23px, etc.)
- [ ] Navbar sticky and compressing
- [ ] Reduced-motion works (no animations)
- [ ] Mobile responsive (tested at 375px, 768px, 1920px)
- [ ] Lighthouse performance >80

