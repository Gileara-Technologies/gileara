# Fix plan: every open item in one list

**Compiled:** 11 October 2026 · **Sources:** `docs/UI-AUDIT.md` (F1 to F14, measured on 29 routes at 3 viewports against `localhost:3000`), `docs/DESIGN-TOOLS-RUN.md` (P0-1 to P2-12, measured on production), `docs/COMPETITIVE-ANALYSIS.md` (context only)

This is the consolidated list. Everything in both audits appears exactly once, with the files it touches and the test that proves it is done.

## Locked decisions

| Decision | Choice | Consequence |
|---|---|---|
| Single accent (P1-3) | Keep `#5EEAD4` (`accent-bright`) | ~11 `accent-cyan` call sites retarget to `accent-bright`; `accent.cyan` is deleted from the theme once grep proves zero usages; the page looks the same afterwards |
| Display face (AGENTS.md drift, F14) | Inter everywhere, no second family | No Hanken Grotesk is loaded, and none should be. Both `sans` and `display` keep pointing at `var(--font-inter)`, so every `font-display` call site stays valid and `globals.css:117`'s `@apply font-display` keeps working. Both `DESIGN.md` files stop claiming Hanken Grotesk |

## Deferred, needs your call

**F9, light theme.** The palette is defined but unreachable, and it fails 9 to 31 contrast checks per page if forced. Both resolutions are invasive: deleting the light `:root` block would strand every `dark:` variant in the codebase, since those exist to override light defaults, and shipping a toggle needs theme-aware accent pairs (a dark-teal accent with dark text fails). Nothing in this plan touches it beyond converting its values to channel triplets, which changes no rendered colour. Decide separately.

## Wave 0: token foundation

One owner, because `tailwind.config.js` and `src/app/globals.css` are touched by almost every item below. Everything here is a precision fix or an addition. Nothing is deleted that any call site still uses.

| # | Fix | Files | Acceptance |
|---|---|---|---|
| W0-1 | Make every colour token alpha-capable (P0-1, A1, F8). Six entries are bare `var()` today, so Tailwind silently drops 17 utilities across 75 element instances | `tailwind.config.js:23, 24, 25, 26, 28, 33`; `globals.css:21, 22, 23, 24, 26, 35` (light) and `:66, 67, 68, 69, 71, 76` (dark) | Every token value becomes a channel triplet, `rgb(var(--x) / <alpha-value>)` in the config. The navbar gains its ground, the five inactive carousel dots appear, the Back to top button and three image controls gain their fill, and the ghost numerals go faint. Verify with the live measurement in the verification section, not by eye alone |
| W0-2 | Fix the colour tokens that are consumed as complete values and therefore dropped (P0-A6): scrollbar thumb, scrollbar hover, `::selection` background | `globals.css:155, 160, 164-167` | Each becomes `rgb(var(--token))`. The selection pair must compute to at least 4.5:1 in both themes, and the scrollbar must render a colour instead of nothing |
| W0-3 | Restore the two outline roles (P1-5, F8). Today `--outline` equals `--outline-variant`, so there is no neutral tier | `globals.css:72, 73` to `133 148 143` and `60 74 70`; `:27, 28` to `115 119 127` and `195 198 207` | Written as channel triplets, never hex, because both are consumed as `rgb(var(--x) / <alpha-value>)` |
| W0-4 | Convert the remaining bare colour tokens to channel format so the class of bug cannot return (`on-primary`, `primary-container`, `on-primary-container`, `on-secondary`, `secondary-container`, `on-secondary-container`, `on-tertiary*`, `surface-variant`, `surface-container-low`, `surface-container-lowest`) | `tailwind.config.js:12-22, 27, 31-33` and the matching `globals.css` lines | No rendered colour changes; grep proves no bare `var(--colour)` remains in the config, and no complete-value `var(--colour)` remains in CSS |
| W0-5 | Add a three-step section rhythm (F10, P2-8): `section-tight` 64/80, `section` 80/96, `section-loose` 96/128, replacing the current `py-32 md:py-48` (128/192) | `tailwind.config.js` (additive), `globals.css` if a `@layer components` entry is used | Desktop maximum drops from 192 px to 128 px and into the documented 80 to 120 px band for the base step |
| W0-6 | Delete the dead `marquee` keyframes and animation, zero call sites in `src/` | `tailwind.config.js:99-107` | Grep for `animate-marquee` and `marquee` returns nothing |
| W0-7 | Remove `will-change: transform` from the two resting text-reveal classes (P2-10) | `globals.css:135, 141` | No `will-change` survives at rest |
| W0-8 | Add a global `caret-color` and stop the counters reflowing (P1-4) | `globals.css`; `tabular-nums` applied in Wave 1 | Caret matches the accent; the Positioning counters carry `tabular-nums` |
| W0-9 | Remove the `./index.html` content glob that matches no file (F14) | `tailwind.config.js:4` | Content globs list only paths that exist |

## Wave 1: parallel owners

Seven agents, each owning a disjoint set of files, each applying all the cross-cutting items (accent swap, section rhythm, eyebrow budget) inside its own files only.

**H, hero and story.** `Hero.tsx`, `CinematicStory.tsx`

| # | Fix | Acceptance |
|---|---|---|
| H-1 | Hero down to four text elements (P1-7, Taste): remove the eyebrow, keep heading, one-line subtext, one call to action | No `SectionLabel` in the hero; the subsection list is gone |
| H-2 | The three benefit bullets move into `CinematicStory` as a real list (content preserved) | Copy still appears on the page, once |
| H-3 | Subtext cut to 20 words or fewer; `pt-40` to `pt-24`; `min-h-[88vh]` removed so the CTA sits above the fold at 893 px | CTA visible without scrolling at 1920×893 |
| H-4 | Hero H1 text content gains the missing space (F13) | `textContent` reads "systems your business runs on." |
| H-5 | Carousel: add a pause control, stop the rotation on manual selection, and gate the 5-second interval on `prefers-reduced-motion` (P1-8) | With reduced motion the carousel is static; a keyboard and touch user can stop it |
| H-6 | Hero primary action becomes the site pill instead of an underlined text link (F8) | Matches every other page's primary CTA |
| H-7 | Carousel dots meet 44 px (F6, P1-6) | Each dot's hit area is at least 44×44 |
| H-8 | Alt text naming Abuja (Nigeria) corrected to the Ghanaian pilot framing (`IMAGERY.md` D15) | No alt text names a country the pilot is not in |

**S, homepage sections.** `SectionLabel.tsx`, `Pricing.tsx`, `Approach.tsx`, `FoundingClient.tsx`, `AuditSection.tsx`, `ContactBand.tsx`

| # | Fix | Acceptance |
|---|---|---|
| S-1 | Eyebrow budget to three per page (P2-9): keep `SectionLabel` on Pricing, Approach and Founders only, remove it from CinematicStory, Positioning, FoundingClient, AuditSection and ContactBand | Exactly three eyebrow labels remain on the homepage |
| S-2 | Section numbers only where the sequence is real (P2-9) | No `01` to `07` numbering that does not encode order |
| S-3 | Duplicate CTA labels standardised to one string and one size (F13, F8, X20) | "Book a Free Consultation" appears once as a label, in one size and weight |
| S-4 | Section rhythm variants applied (W0-5) | Adjacent sections differ; no 192 px padding remains |
| S-5 | `accent-cyan` retargeted to `accent-bright` | Zero `accent-cyan` in these files |

**F, positioning and founders.** `Positioning.tsx`, `Founders.tsx`

| # | Fix | Acceptance |
|---|---|---|
| F-1 | Delete the 538×448 px watermark (P2-9, Impeccable): it renders fully opaque because its opacity class never compiled | Element gone |
| F-2 | The three accent counters become a plain definition list, keeping the numbers and labels (Impeccable's hero-metric ban) | Data present, no oversized accent numerals |
| F-3 | `tabular-nums` on the counters and a `prefers-reduced-motion` branch that renders the final value instead of counting (P1-4, P2-11) | Reduced motion shows the end state immediately |
| F-4 | Remove `border-l-2 border-accent-bright` (P2-10, `side-tab` detector) | No accent side stripe |
| F-5 | Eyebrow removed from Positioning, kept on Founders (S-1) | See S-1 |
| F-6 | Section rhythm and accent swap applied in both files | See S-4, S-5 |

**C, chrome and primitives.** `Navbar.tsx`, `Footer.tsx`, `MagneticButton.tsx`, `BackToTop.tsx`, `DisplayHeading.tsx`, `layout.tsx`, `page.tsx`

| # | Fix | Acceptance |
|---|---|---|
| C-1 | Replace the four `teal-gradient-btn` usages with the real pill system (X1, F1) | Buttons render filled; grep for `teal-gradient-btn` in this group returns nothing |
| C-2 | `<header>` landmark, skip-to-content link as the first focusable element, `aria-label` on the primary nav (F5) | `header` count 1, skip link works against the existing `#main` |
| C-3 | Global `:focus-visible` ring, and `MagneticButton` gets one explicitly (F12, P1-6) | Every tab stop shows the design ring, not the UA outline |
| C-4 | `BackToTop` scroll listener replaced with an `IntersectionObserver` (P2-11) | No `window.addEventListener("scroll")` |
| C-5 | `MagneticButton` pointer tracking moves from `useState` to a motion value, and the transform is gated on reduced motion (P2-11) | No re-render per mouse move; static under reduced motion |
| C-6 | 44 px floor on footer links and breadcrumb (F6) | No target under 44 px in these files |
| C-7 | Cancelled. `font-display` call sites stay. The token remains an alias for the same Inter stack, so there is nothing to clear | No change, and no reason to revisit these lines |
| C-8 | `DisplayHeading`'s `accent` prop, which colours an entire heading, retargeted or removed (frontend-design L25) | Heading emphasis is by weight and size, not by colouring a whole line |

**P, conversion surfaces.** `NotFound.tsx`, `security/page.tsx`, `insights/[slug]/InsightsPostClient.tsx`, `scheduling/ContactStepper.tsx`, `scheduling/CalendarStep.tsx`

| # | Fix | Acceptance |
|---|---|---|
| P-1 | Replace the five remaining `teal-gradient-btn` and `btn-primary` usages (X1, F1): three insight CTAs, the security CTA, the 404 CTA, and the booking stepper's "Next: Pick a Time" | Zero occurrences of either class repo-wide; each button computes to a filled background |
| P-2 | 404 gradient text removed (P2-10) | No `bg-clip-text` with a gradient |
| P-3 | Contact stepper step headings become H2 (F7) | No H1 to H3 skip |
| P-4 | Prose column on `/security` clamped to 72ch (F11) | Widest line under 75ch |
| P-5 | Accent swap and spacing rhythm applied | See S-4, S-5 |

**L1, careers.** `careers/ApplicationForm.tsx` and the careers page if needed

| # | Fix | Acceptance |
|---|---|---|
| L1-1 | Every control gets an `id` and a `<label htmlFor>`, including the file input (F4) | All 13 controls have a programmatic name |
| L1-2 | `required` added to the 12 marked fields, `aria-describedby` on the inline hints (F4) | Screen readers announce required-ness |
| L1-3 | Careers prose clamped to 72ch (F11) | Under 75ch |

**L2, contact and services.** the contact page client, the services page and its package switcher

| # | Fix | Acceptance |
|---|---|---|
| L2-1 | `min-w-0` on the overflowing contact column, plus any sibling `lg:col-span-*` child with the same risk (F2, P0) | `scrollWidth === clientWidth` at 375 px and 320 px |
| L2-2 | Package switcher wraps or gains a visible scroll cue below `lg` (F3) | All five tabs reachable at 768 px without hidden horizontal scrolling |
| L2-3 | Form focus states keep a visible ring and drop `focus:outline-none` alone (F12) | Focus is visible on every field |
| L2-4 | Prose columns clamped (F11) | Under 75ch |

**L3, maintenance and legal.** maintenance, privacy, terms

| # | Fix | Acceptance |
|---|---|---|
| L3-1 | `/maintenance` gets an H1 (F7) | One H1 present |
| L3-2 | Legal body copy floored at 12 px (F7) | No 10 px text |
| L3-3 | Unlabeled `<nav>`s on privacy and terms get labels (F5); prose clamped (F11) | Landmarks labelled, lines under 75ch |

## Shared rules for every Wave 1 agent

- Own only your group's files. Never edit `tailwind.config.js` or `src/app/globals.css` (Wave 0 holds those) and never edit another group's files.
- No commits, no pushes, no dev server, and no `npm run build` (one central build runs after every group finishes). Verify with `npx eslint <your files>`.
- Accent: replace every `accent-cyan` utility with the `accent-bright` equivalent, and `accent-white` with Tailwind's plain `white`. Leave `primary` alone; it is the focus and border token.
- Rhythm: `py-32 md:py-48` becomes the padding utility for your assigned step from the table below: `py-section-tight`, `py-section`, or `py-section-loose`. On any other page it is `py-section`. Each step is responsive on its own (64/80, 80/96, 96/128), so no `md:` pairing is needed. Leave compact component paddings alone. Wave 0 verified generation of all three with a Tailwind CLI probe.
- Eyebrow budget: exactly three homepage sections keep `SectionLabel`. Keep the component's current API, including the optional `number` prop.
- CTA label: the exact string "Book a Free Consultation" at the standard size, which is `text-base` (`MagneticButton size="md"`). The navbar's own button is bar chrome and keeps its smaller size; only its label string changes.
- Section numbers: drop them. No home section number encodes a real sequence once the eyebrow cull lands, so a surviving `05` would index a nine-band list the page no longer shows. Leave `SectionLabel`'s numeral branch in place regardless, since other pages may still pass `number`.
- Report format: file:line, what changed, raw eslint output, what you could not do, and any place where the brief would have made the site worse.

### Homepage rhythm and eyebrow assignment

| Section (file) | Rhythm | Eyebrow |
|---|---|---|
| Hero | own padding, `pt-24` and `pb-24` | removed |
| CinematicStory | `section-tight` | removed |
| Pricing | `section-loose` | kept |
| Approach | `section` | kept |
| Positioning | `section-tight` | removed |
| Founders | `section` | kept |
| FoundingClient | `section-tight` | removed |
| AuditSection | `section` | removed |
| ContactBand | unchanged, it is already a slim band | removed |

## Wave 2: cleanup and documentation

Serial, after Wave 1, because it edits the config the others depend on and the documents that describe them.

| # | Fix | Files | Acceptance |
|---|---|---|---|
| W2-1 | Delete `accent.cyan` and `accent.white` once no call site uses them. The `display` token stays, because it is an intentional alias for the same Inter stack and `globals.css:117` applies it | `tailwind.config.js:47-51` | Grep for `accent-cyan` and `accent-white` returns nothing, and `font-display` still resolves |
| W2-2 | `ARCHITECTURE.md` stops listing `teal-gradient-btn` and `btn-primary` as real utilities (F14) | `docs/ARCHITECTURE.md:68` | No undefined utility named as real |
| W2-3 | `AGENTS.md` corrections: components that exist, no marquee, Inter only, the new spacing scale, no `next-themes`, the real font list (F14, P2-12) | `AGENTS.md` | Every component name resolves to a file |
| W2-4 | `IMAGERY.md`: remove `hero-business.jpg`, list the six carousel images | `docs/IMAGERY.md` | Every documented file exists |
| W2-5 | Name one authoritative design document; mark `DESIGN_SYSTEM_V2.md` superseded; record the dials (variance 7 / motion 4 / density 5) and the locked accent decision | `docs/DESIGN_SYSTEM_V2.md`, `DESIGN.md`, this file | A new contributor finds one system, not four |
| W2-6 | `DESIGN.md` light values reconciled with the shipped `:root` (F14) | `DESIGN.md` | Documented and shipped values agree |
| W2-7 | One hover convention for accent fills. Retargeting `accent-cyan` to `accent-bright` made every pill's `hover:bg-accent-cyan` identical to its base fill, so the site lost hover feedback on its primary controls | `Navbar.tsx`, `MagneticButton.tsx`, `ContactBand.tsx`, `Footer.tsx`, `AuditTool.tsx`, `NewsletterForm.tsx`, `ApplicationForm.tsx`, `InsightsListClient.tsx`, `HowWeTransformClient.tsx`, and the five conversion surfaces | Canonical hover is `hover:bg-accent-bright/90`, which compiles because the accent is a hex value. Every filled control shows a state change on hover |
| W2-8 | Cancelled, superseded by the decision above. A `font-display` sweep is pointless once the token stays. Groups C, P and L2 swapped a few of their own lines to `font-sans` before the decision was clear; that is visually inert and harmless, and nobody should chase the rest | none | `globals.css:117` keeps working, and no build step depends on a sweep |
| W2-9 | Reconcile the rhythm class names between Wave 0's config and Wave 1's call sites. Wave 0 implemented the rhythm as spacing tokens, so the real utilities are `py-section`, `py-section-tight` and `py-section-loose`. A bare `section-tight` compiles to no CSS at all, which is a silent no-op rather than a visible error. Group F proved the miss at `CinematicStory.tsx:39`, which had zero vertical padding as a result, and group H fixed it | `tailwind.config.js`, `globals.css`, plus any call site that needs renaming | Grep for bare `section`, `section-tight` and `section-loose` classes returns nothing, and a computed-style check on three sections shows three distinct desktop paddings, none of them 192px |
| W2-10 | Literal pill rounding on the two booking buttons, which are full-width bright fills with square corners under rounded inputs after the P0 fix | `scheduling/ContactStepper.tsx:177`, `scheduling/CalendarStep.tsx:144` | Both carry the same radius language as the rest of the site's CTAs |

## Verification

Per agent: `npx eslint` over the files it changed, plus its own acceptance tests.

Once, centrally, after every wave: `npm run lint`, `npm test`, `npm run build`. Then a live re-measure against `localhost:3000`:

1. Alpha audit: the 17 inert utilities and their 75 instances must go to **0**, and 0 of the CSS selectors may carry an unfulfilled alpha modifier.
2. Navbar `background-color` must be non-transparent; the five inactive dots must compute to a visible alpha; `BackToTop` must have a fill.
3. The section numerals must compute to their intended opacity rather than opaque.
4. `scrollWidth === clientWidth` at 375 px on `/contact`; five tabs reachable at 768 px on `/services`.
5. Zero console errors on the homepage and on `/contact`.

## Out of scope

Competitor work, paid/organic positioning, and anything in `docs/COMPETITIVE-ANALYSIS.md`. No commits and no pushes until the whole plan is verified; changes stay in the working tree.
