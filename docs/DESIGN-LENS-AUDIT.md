# Design-lens audit: production homepage

**Date:** 11 October 2026 · **Viewport:** 1920×893 desktop · **Theme:** dark as served · **Host:** https://gileara.org

## What this document is, and what it is not

The brief was to run the site through four design review tools: the "Taste" anti-slop rule set (variance, motion and density dials), an "Impeccable" style pass with deterministic anti-pattern detection over typography, colour, layout and motion, a "UI-UX-Pro-Max" style pass that selects the visual system first so everything downstream matches, and the frontend-design rule set, which works from role-based typographic guidance and names no typeface at all.

**Status: the four tools have since been installed and run.** The paragraph below describes the position when this document was written, and it is kept because it explains the method. Eight of its conclusions did not survive the real rule files; they are listed in §10, with the full run report in `docs/DESIGN-TOOLS-RUN.md`. Where §1 to §9 and §10 disagree, §10 is correct.

None of the four was installed in this environment. `C:\Users\rodne\.agents\skills` held 85 skills and none of them was named Taste, Impeccable, UI-UX-Pro-Max, or frontend-design/frontend-skill, and a web search for all four names returned no results, so they could not be fetched either. Rather than imitate a tool's output, this document applied their rule sets by hand and measured every claim against the running site. Where one of those tools would print a score, this document prints the numbers the score would have been computed from. No application source file has been modified.

This pass extends `docs/UI-AUDIT.md` instead of repeating it. F1 (undefined CTA utilities) turns out to be the same failure mechanism as A1 below at a smaller scale, F8 (token and brand drift) is quantified here as A2 and A5, F10 (vertical rhythm) is reconciled in 2.1, and F14 (documentation drift) grows into section 4.

## 1. Measurement set

| Measurement | Value |
|---|---|
| Visible styled elements | 468 |
| Page height | 16,234 px (18.2 viewports) |
| Words in the page | 1,037, or 57 per viewport |
| Sections | 9, at 780 / 898 / 1,158 / 1,250 / 1,301 / 1,403 / 2,246 / 2,824 / 3,528 px |
| Section padding | 192/192 px on 7 of 9, 160/160 on 1, 0 on the hero |
| Distinct section layout signatures | 4 |
| Font sizes in use | 12: 12, 14, 16, 18, 20, 24, 30, 56, 72, 96, 120, 448 px |
| Ratio between consecutive sizes | 1.17, 1.14, 1.13, 1.11, 1.20, 1.25, 1.87, 1.29, 1.33, 1.25, 3.73 |
| Font families by element count | Inter 338, IBM Plex Serif 75, JetBrains Mono 41, Material Symbols 14 |
| Declared non-framework tokens | 37 |
| Token formats | 4 as space-separated channels (`68 221 193`), 33 as hex (`#081420`) |
| Distinct spacing values | 22 |
| Distinct radii | 5: 9999 ×25, 16 ×6, 12 ×5, 24 ×1, 4 ×1 |
| Distinct shadows | 2: one brand, one Tailwind `shadow-lg` |
| Text colours | 7 values, 5 of them declared tokens |
| Background colours | 6 values, 5 of them declared tokens |
| Borders with a visible width | 22, of which 21 are the framework default and 1 is `--primary` at 30% |
| Three-up equal-column grids | 0 |
| Bordered or shadowed card containers | 0 |
| Gradient and blurred elements | 6 and 5 |
| Transitioned and transformed elements | 76 and 44 |
| Transition durations | 6: 0.15, 0.2, 0.3, 0.5, 0.7 s |
| Timing functions | 3, with Tailwind's stock curve on 66 elements and the brand curve on 9 |
| Running CSS animations | 0 (one `spin` keyframe defined, unused) |
| `prefers-reduced-motion` rules | 1 |
| Console errors | 0 |

## 2. Lens 1: variance, density and motion dials

### 2.1 Variance is low on purpose, and it reads as sameness

Eight of nine sections open with the same mono uppercase eyebrow followed by an h2 (measured on sections 1 through 8; the hero is the exception). Seven of nine use exactly 192 px of padding top and bottom. Across nine sections there are only four distinct layout signatures. The page is not chaotic, it is undifferentiated: a visitor scrolling from Packages through Approach to Founders sees one template repeated.

This reconciles with F10, which counted four or more section-padding conventions across the whole site and flagged 192 px as exceeding the documented 80 to 120 px scale. On this homepage the convention is not varied, it is uniform at the value F10 flagged. The audit's fix register proposes introducing two or three deliberate rhythm variants rather than removing all variation.

### 2.2 Density is thin for the job the page does

1,037 words over 16,234 px works out to 57 words per viewport, with an average of two screens per section. The Pricing section is the largest single block at 2,246 px and carries five packages inside one grid. If the intent is a cinematic scroll, this is the consequence and it is a legitimate choice. If the intent is to sell five packages, the page spends 18 viewports on roughly 1,000 words while the commercial detail lives on `/services`.

### 2.3 Motion is framework-flavoured rather than brand-owned

Six durations and three timing functions are in play. The curve on 66 of the 76 transitions is Tailwind's stock `cubic-bezier(0.4, 0, 0.2, 1)`; the brand curve already present in the codebase, `cubic-bezier(0.22, 1, 0.36, 1)`, runs on 9. Nothing animates from CSS keyframes, and reduced motion is respected by one media rule that matches the clean finding in F12. The dial is not broken, it is undecided: the codebase contains both a considered easing and the default, and the default is winning by seven to one.

### 2.4 The type scale has one hole and one outlier

Ratios inside the small range move between 1.11 and 1.25, so no single modular ratio governs the scale. There is no size between 30 px and 56 px even though both are used repeatedly, which is the largest jump in the working range. The 448 px entry is the decorative section numeral `.hidden lg:block absolute -right-20 top-2` marking the "04" section, 3.73 times the next size down, and it is deliberately hidden below the large breakpoint. An anti-slop check would flag the missing step, not the numeral.

## 3. Lens 2: deterministic anti-pattern register

| ID | Anti-pattern | Measured evidence | Severity |
|---|---|---|---|
| A1 | Alpha modifier on a hex token generates no CSS | `border-on-background/10` on 25 elements, 0 matching rules, 21 elements fall back to the preflight default | P0 |
| A2 | Three accents where the system declares one | Declared `--primary: 68 221 193`; rendered teal-300 on 24 text and 12 button fills, cyan-400 on 11 text | P0 |
| A3 | Borders bypass the token layer | 21 of 22 borders render `rgb(229, 231, 235)`; only 1 uses a token | P1 |
| A4 | Two token formats in one block | 4 channel-based tokens, 33 hex, and each format fails where the other works | P1 |
| A5 | Role tokens hold the wrong colours | `--outline` and `--outline-variant` both resolve to the primary teal; the spec says `#85948f` and `#3c4a46` | P1 |
| A6 | Channel tokens used raw in CSS | `background: var(--primary)` at 3 sites is an invalid colour and is dropped | P1 |
| A7 | Framework default shadow | Tailwind `shadow-lg` sits beside the brand shadow in a set of two | P2 |
| A8 | Off-scale spacing values | 22 distinct values including 6 px (22 uses), 10 px, 14 px, -1 px | P2 |
| A9 | Radius one-offs | 24 px and 4 px appear once each against a dominant 9999/16/12 | P2 |
| A10 | Zero-width grid tracks | Two grids compute a trailing 0 px track (`88px ×12` plus `0px`) | P3 |

### 3.1 A1 is F1's mechanism, applied to every hex token

Tailwind's preflight sets a universal default:

```
*, ::before, ::after { box-sizing: border-box; border: 0px solid rgb(229, 231, 235); }
```

The class `border-on-background/10` appears on 25 elements. No rule for it exists in the compiled CSS, because `tailwind.config.js:24` declares it as `'on-background': 'var(--on-background)'` with no `<alpha-value>` placeholder, so the opacity modifier cannot be resolved. The only rules that touch border colour on one of those elements are that preflight rule and `.border-t { border-top-width: 1px }`, which is how 21 hairlines render as opaque `#E5E7EB` where the markup asked for 10 percent of `#d8e3f5`.

Impact was measured by walking ancestors for collapsed opacity or hidden display. Nineteen of the 21 have no transparent ancestor. Measured positions of those: the fixed navbar (1152×104 px at y=24), a section rail inside Pricing (1440×1106 px at y=3,465), dividers at y=4,651, 7,799, 8,458, 12,252, 15,783 and 16,133, a 704×242 px bordered card at y=13,901, a 1912×780 px band at y=14,606, and the footer newsletter input. Two sit inside scroll-reveal containers at opacity 0 and will show the same opaque grey once revealed. Screenshot for the record: `C:\Users\rodne\.playwright-mcp\ui-audit\lens-01-footer-gray-hairlines.jpg`.

The same configuration causes the placeholder utility `placeholder:text-on-surface-variant/60` and `border-on-surface/15` (the newsletter input) to fail silently. The contract is exact: `tailwind.config.js:11` and `:29` and `:30` use `rgb(var(--x) / <alpha-value>)` and their alpha utilities exist in the compiled CSS (`.border-primary/25`, `.dark:border-outline-variant/10`), while `:24`, `:26` and `:28` use a bare `var(--x)` and their alpha utilities do not.

### 3.2 A2 counts, rather than claims, the accent problem

F8 observed that two brand teals coexist. Measured on the homepage:

| Accent | Value | Origin | Uses |
|---|---|---|---|
| `--primary` | `rgb(68, 221, 193)` = `#44DDC1` | declared token | 2 text, 1 border at 30% |
| `accent-bright` | `rgb(94, 234, 212)` = `#5EEAD4` | Tailwind teal-300 | 24 text, 12 button fills |
| `accent-cyan` | `rgb(34, 211, 238)` = `#22D3EE` | Tailwind cyan-400 | 11 text |

The declared primary is close to unused. The colour doing the work is Tailwind's teal-300, and it is the same value F1's fix note recommends ("what every other working CTA uses"), so F1's remediation and this decision have to land together or the drift becomes permanent.

### 3.3 A6 is the mirror image of A1

The token block mixes two formats, and each one fails precisely where the other succeeds. Hex tokens work in raw CSS but cannot take a Tailwind alpha modifier. Channel tokens take alpha modifiers but are invalid as complete colour values, so `globals.css:155` and `:160` (the scrollbar thumb and its hover state) and `:165` (`::selection` background) are dropped by the browser. The `::selection` rule sets `color: var(--on-primary)` (`#00382f`) in the same block, so selected text renders dark green against whatever highlight the browser supplies. `globals.css:151` uses `var(--surface-container)`, a hex token, and works.

## 4. Lens 3: the visual system is declared three times

The instruction behind this lens is to choose the system first so that everything downstream matches. The finding is that three documents claim that role and the live site implements one of them.

### 4.1 What production implements

The live token set is a faithful implementation of `stitch_gileara_technologies_website/gileara_velocity_dark/DESIGN.md`, the file `AGENTS.md` calls authoritative for the default theme. Every colour token in the live set matches that document's token block, including the surface ramp `#040f1b` through `#2f3a47`, `--primary #44DDC1`, `--secondary #bbc6e2`, `--tertiary #afc9ea`, and the hero mesh gradient built from `#44ddc1`, `#afc9ea` and `#00bfa5`, with the two exceptions listed below. That is a coherent dark system with four surface tiers and paired on-colours, and it is a real asset.

Two deviations from that same document:

| Token | Spec | Live | Source |
|---|---|---|---|
| `--outline` | `#85948f` | `68 221 193` (`#44DDC1`) | `globals.css:72` |
| `--outline-variant` | `#3c4a46` | `68 221 193` (`#44DDC1`) | `globals.css:73` |

Both role tokens point at the primary teal, so the outline role is not a neutral as the spec intends. The light block repeats the mistake at `globals.css:27` and `:28` with `0 77 89`, where `DESIGN.md` specifies `#73777f` and `#c3c6cf`. The spec also contradicts itself: its prose section names Primary `#00BFA5`, background `#0A1622`, surfaces `#0D1B2A` and `#1B263B`, while its own token block says `#44ddc1`, `#081420`, `#15202d` and `#2a3643`. Production follows the token block.

### 4.2 What the other two documents declare

`DESIGN.md` (light) declares an M3 light scheme on a warm off-white `#f7f9fb` with `--primary: #001c38`, and reserves pills for status: "Pill: Reserved exclusively for status indicators (Chips) and search bars to differentiate them from actionable buttons." Production uses the 9999 px radius on 25 elements, including the CTAs that F1's fix relies on, so the pill rule is inverted in practice.

`docs/DESIGN_SYSTEM_V2.md` (dated 27 August 2026, status "Active Redesign") declares a different system again: navy `#103A5E` with cyan `#0275D8`, Inter for every role, sections of 800 to 1200 px, 80 px padding, alternating navy and ice-blue `#EBF8FE` backgrounds, three-column card grids with 24 px gaps, and an explicit removal list. Its deploy checklist includes "No teal or gold visible anywhere", "All sections 800-1200px", "Backgrounds alternate Navy to Ice Blue", "Typography: Inter only", "Spacing: 24/32/48px grid only".

Every one of those five items is currently false: teal is the dominant accent, section heights run 780 to 3,528 px, there is no ice-blue alternation, IBM Plex Serif carries 75 elements, and 6 px and 14 px values are in use. The document also plans removals that never happened (orbit scene, tilt cards, keyword marquee, numbered pricing) and new components that were never built (`RoleBasedCTA`, `CaseStudyCard`, `TrustMarkers`), while `/case-studies` was deleted and redirected to `/how-we-transform`, the opposite of its "case studies elevated to prominent position".

### 4.3 The consequence

The cohesion failure is not an absent system. It is that the repository carries three systems, one of them a plan written for a direction the site did not take, and the codebase implements the third. Two items in the fix register follow from this: restore the two outline tokens to their specified values, and decide which document is authoritative so the other two can be marked superseded. Note also that the anti-slop lenses would push back on `DESIGN_SYSTEM_V2.md` on their own terms: its prescription of Inter everywhere plus a three-column card grid plus uniform 800 px sections is the generic pattern those rule sets exist to prevent, and the site currently ships a less generic layout than that document asks for.

## 5. Lens 4: generic fonts and default card grids

### 5.1 The font rule is the one that fails outright

Inter carries 338 of 468 styled elements, 72 percent of the page, and it is installed as the token `--font-inter` rather than used in passing. The rule this lens encodes exists to stop a site from looking like any other SaaS product by default, and here the default is the token layer itself. The repository's stated typography is more distinctive than the shipped result: `AGENTS.md` and `DESIGN_SYSTEM_V2.md` between them name Hanken Grotesk, Plus Jakarta Sans and Space Grotesk, none of which load (F14). The pairing that does ship, Inter with IBM Plex Serif and JetBrains Mono, is a competent technical-editorial stack and also one of the most common on the web today.

### 5.2 The card-grid rule passes, and it was never at risk

Measured on the homepage: 0 three-up equal-column grids with three children, 0 two-up equal grids, and 0 elements matching a bordered or shadowed card container (radius at least 8 px, padding at least 12 px, a border or shadow, width between 180 and 700 px, height above 80 px). The layout uses a 12-column grid, a four-up founders row at 336 px per column, and a five-card pricing rail. There is no wall of identical bordered cards. Under this lens the site fails the font rule and passes the layout rule, which is the opposite of the usual failure pattern.

### 5.3 Also clean under this lens

Six gradient elements and five blurred elements across 468, so no gradient-text proliferation and no glassmorphism layer. Iconography runs through one system (14 Material Symbols elements). The shadow set has two members, not twelve. Radii collapse to three values plus two one-offs. There is one WebGL scene by policy, and the earlier audit pass measured no canvas activity on a settled production load.

## 6. Fix register

### P0

| # | Action | Target | Payoff |
|---|---|---|---|
| 1 | Give the hex tokens an alpha path: register `on-background`, `on-surface` and `on-surface-variant` as `rgb(var(--x) / <alpha-value>)` and convert those three values to space-separated channels | `tailwind.config.js:24,26,28` and `src/app/globals.css:67,69,71` | 21 visible near-white hairlines become the intended 10 percent dividers, the newsletter input border and the placeholder colour start working, and F1's bug class closes permanently. Check for raw `var(--on-background)` usages before converting, since a channel triple is not a complete colour |
| 2 | Choose one accent and delete the other two from the theme, or promote the working one into `--primary` and update the call sites | `tailwind.config.js` (`accent-bright`, `accent-cyan`), roughly 35 usages | Ends the three-accent drift F8 recorded. Coordinate with F1, whose fix recommends the teal-300 class |

### P1

| # | Action | Target |
|---|---|---|
| 3 | Restore the outline roles to their specified neutrals | `globals.css:72,73` to `133 148 143` and `60 74 70`; `:27,28` to `#73777f` and `#c3c6cf` |
| 4 | Repair the raw CSS that uses channel tokens as complete colours | `globals.css:155,160,165`, and check the `::selection` pair at `:164` to `:167` for contrast |
| 5 | Name one authoritative design document and mark the others superseded or draft, then reconcile the prose against the token block inside the dark spec | `docs/DESIGN_SYSTEM_V2.md`, `DESIGN.md`, `stitch_gileara_technologies_website/gileara_velocity_dark/DESIGN.md` |
| 6 | Make motion a decision: promote `cubic-bezier(0.22, 1, 0.36, 1)` to the theme default and cut six durations to three | `tailwind.config.js` `transitionTimingFunction`, plus component call sites |
| 7 | Rename the font tokens to roles (`--font-sans`, `--font-display`, `--font-mono`) so a face change is one edit, and settle the face question alongside item 5 | `globals.css`, `layout.tsx` |

### P2

| # | Action | Target |
|---|---|---|
| 8 | Introduce two or three deliberate section rhythms instead of the single eyebrow-plus-h2 template at 192 px on 7 of 9 sections (F10) | section components |
| 9 | Snap 6, 10, 14 and -1 px onto the 4 px scale, taking 22 values to roughly 14 | component classes |
| 10 | Fold the 24 px and 4 px radii into the set, replace Tailwind `shadow-lg` with the brand shadow, and drop the zero-width grid tracks | component classes |

## 7. What is already ahead

Worth stating plainly, because the register above is long. The token layer exists and is mostly honoured: five of seven text colours and five of six background colours are declared values, the surface ramp is coherent across six steps, and the deviation sits in the accent and the borders. Reduced motion is respected, there are no console errors, no card wall, no gradient-text fashion, one icon system, two shadows, and one WebGL effect behind a documented policy. 72 percent of the page's typography being Inter is a taste decision that has to be made once, not a defect per element.

## 8. Method and limits

Measurements were taken on production at 1920×893 in the dark theme as served, after a full scroll pass to mount lazy sections. Styling was read with `getComputedStyle` across all 468 visible elements; rule existence was read from the CSSOM (728 rules in one same-origin bundle, so nothing was unreadable); ancestor opacity and display were walked to separate visible defects from latent ones.

Not measured: mobile and tablet viewports, the light theme (unreachable per F9), routes other than the homepage, contrast ratios, and largest contentful paint, which the site registers no `PerformanceObserver` for. Competitor comparison is out of scope here and lives in `docs/COMPETITIVE-ANALYSIS.md`. The newsletter honeypot input (`#newsletter-company-footer`, inside `absolute opacity-0 pointer-events-none -left-[9999px]`, `tabIndex -1`) renders the browser's default dark field colour by design and is not a defect. The four named tools were unavailable when this paragraph was written; they have since been installed, pinned and run, and the counts they produce are recorded in `docs/DESIGN-TOOLS-RUN.md`.

## 9. Next step

Nothing in `src/` has been changed. The P0 pair is small enough to be one pull request touching `tailwind.config.js` and `globals.css`, and it also removes the class of bug that produced F1's invisible CTAs. Item 5 is a decision only you can make, since it determines whether the next year of UI work aims at the teal system that ships or the cyan system one of the documents describes.

## 10. Corrections after running the real tools

The four tools were installed at pinned commits and run against the same production page. The full report is `docs/DESIGN-TOOLS-RUN.md`. Eight claims in §1 to §9 did not survive:

| Where | Claim here | Measured truth |
|---|---|---|
| A1 | 25 borders, one root cause with a bounded blast radius | 17 utilities and 75 class instances, and 0 of 669 selectors in the compiled CSS carry an alpha modifier on any of the six affected tokens. The navbar ground, five of the six carousel dots, the Back to top fill, three image controls and the newsletter placeholder are all affected |
| §2 type note | The section numerals are a low-opacity watermark and the 448 px numeral is hidden | They render fully opaque: `opacity` is 1 on the numeral and three of its ancestors, and on the 448 px numeral and four of its ancestors |
| P2-10 | Radii are one-off drift | All five measured radii are declared steps: pill 9999, 2xl 24, xl 16, lg 12, sm 4. Five of nine declared steps are used and two are singletons |
| §2.3 | Reduced motion rests on one CSS rule | It is handled in JavaScript across five components, and three specific holes remain: the hero interval, the magnetic transform and the Positioning counter |
| §5.1 and §5.3 | frontend-design bans generic fonts and default SaaS card grids | It names no typeface and has no card-grid rule. The hard Inter, Roboto and Open Sans ban belongs to a taste sibling that was not installed; taste itself discourages Inter and grants a neutral B2B override |
| §5.2 | The layout passes | Impeccable's craft floor bans the eyebrow that forms the page's structural template, the hero-metric stat block in Positioning, and the accent stripe in Founders |
| §1 | Zero running animations, one unused `spin` keyframe | The unused keyframes are `marquee` at `tailwind.config.js:99-107`, with no call site anywhere in `src/`; Tailwind's `spin` is never emitted |
| P1 | F1 is a payoff of the token fix | The undefined `teal-gradient-btn` and `btn-primary` utilities are live at seven call sites across six files and are the true P0 on Impeccable's own severity ladder, which reserves P0 for failures that stop a task |

Impeccable's ladder also demotes A1: 21 opaque hairlines do not prevent task completion. The P0 label in §6 belongs to the undefined button utilities.

Two further document drifts, found while checking the above: `AGENTS.md` names a `TrustStrip` component that does not exist and a `ContactCTA` that is actually `ContactBand`, and it omits `FoundingClient` and `AuditSection`; `docs/IMAGERY.md` lists `public/assets/imagery/hero-business.jpg`, which is not in the tree, while the six carousel images that replaced it are unlisted.

The fix register in §6 is superseded by `docs/DESIGN-TOOLS-RUN.md` §9. Its P1-3 needs one correction on its own terms: the light outline values must be written as channel triplets (`115 119 127` and `195 198 207`), not as hex, or every outline utility is dropped instead of repaired.
