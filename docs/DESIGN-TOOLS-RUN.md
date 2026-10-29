# Four design tools, installed and run against production

**Date:** 11 October 2026 · **Host:** https://gileara.org · **Viewport:** 1920×893 desktop · **Theme:** dark as served · **Scope:** homepage

## 1. What this run is

`docs/DESIGN-LENS-AUDIT.md` was written while none of the four tools were installed in this environment. Its rule citations were applied by hand from each tool's published rule set, and it said so.

This document records what happened when the four tools were installed from source, pinned to a commit, and run against the same production homepage. It also lists the claims from the earlier pass that did not survive contact with the real rule files, and it replaces the fix register with one that is correct.

Where the two documents disagree, this one is right: every number below was measured on the live page or read out of the tool's own files. `docs/DESIGN-LENS-AUDIT.md` §10 carries the same corrections against its own section numbers.

No application source file was changed. The installed copies live outside the repository at `C:\Users\rodne\.agents\skills\`.

## 2. What was installed

| Skill directory | Upstream | Pin | Size | What it actually is |
|---|---|---|---|---|
| `taste-skill` | `leonxlnx/taste-skill` | `717446e` | 0.08 MB | The v2 "design-taste-frontend" rule set, `SKILL.md` 1,206 lines, plus 10 sibling skills that were not installed |
| `taste-skill-v1` | same repo | `717446e` | 0.02 MB | The preserved v1, 226 lines, same three dials |
| `redesign-skill` | same repo | `717446e` | 0.01 MB | The redesign mode rules, 178 lines |
| `impeccable` | `pbakaus/impeccable` | `d631a88` | 2.1 MB | Skill version 4.5.2, launcher bundle 0.1.14, 24 commands, 41 reference files and 4 degraded variants |
| `ui-ux-pro-max` | `nextlevelbuilder/ui-ux-pro-max-skill` | `67803ea` | 3.48 MB | Local searchable data: 79 styles (50 active), 192 product palettes with reasoning profiles, 74 font pairings, 119 UX guidelines, 105 icons, 17 GSAP presets, 25 chart types, 22 stacks |
| `frontend-design` | `anthropics/skills`, `skills/frontend-design` | `dbd4588` | 0.02 MB | 71 lines of role-based design guidance |

Installed to `C:\Users\rodne\.agents\skills\<dir>\SKILL.md`. The harness takes the catalog name from the front-matter `name:` field rather than the directory name, so all six registered: the catalog went from 81 to 87 directories. Provenance is recorded in `C:\Users\rodne\.agents\_design-tools\INSTALLED.md`.

Every tool here is an instruction surface rather than a compiled program, and each repo ships executable scaffolding (`.claude-plugin/`, `cli/`, `crates/`, Node and Rust detectors). None of it was run except where noted below, and no third-party file was patched: the harness reports a `Base directory for this skill:` per skill, which is what third-party `${CLAUDE_PLUGIN_ROOT}` style paths resolve against.

**Engine caveat.** Impeccable's `context`, `detect` and `critique-storage` verbs resolve to a platform binary that the repository does not ship, so the first run downloads and executes it. That was not done. Detector rule ids quoted below are predictions from the rule files, which the engine has not confirmed. The `ui-ux-pro-max` CLI is plain Python 3.14.2 and did run locally; its two saved outputs are `C:\Users\rodne\.agents\_design-tools\run-gileara-v6m5d4.md` and `run-gileara-v7m4d3.md`.

## 3. The dials

| Tool | Baseline | For this brief | What moves |
|---|---|---|---|
| Taste | `DESIGN_VARIANCE 8` / `MOTION_INTENSITY 6` / `VISUAL_DENSITY 4` | 7 / 4 / 5 | At variance 7 the seven identical `py-32 md:py-48` sections become three rhythm variants. At motion 4, magnetic cursor physics and the 5-second carousel fall outside the tool's `MOTION_INTENSITY > 5` gate, while scroll reveals stay required. At density 5 the tool's own band is `py-16` to `py-24`, which is 64 to 96 px, against the 192 px measured on 7 of 9 sections. |
| UI-UX-Pro-Max | none declared | 6 / 5 / 4 on the first run, 7 / 4 / 3 on the second | Both runs resolve to the same pattern, style and palette; only spacing and motion labels move. |

Both tools agree on the direction: less motion than the site ships, and a declared density rather than an inherited one. No dial value is recorded anywhere in the repository, which is itself a pre-flight failure in Taste's checklist.

## 4. What the tools confirmed

- The eyebrow above every section is the single largest finding in both rule sets. Taste caps eyebrows at one per three sections, so a nine-section page may use three; the page uses nine. Impeccable's craft floor goes further and bans the kicker outright: "a ban, not a default: no brief earns it back."
- The three accents, the undefined button utilities, the low-variance section template, the missing type step between 30 px and 56 px, and the placeholder at 60 percent opacity are all real and all named by at least two of the four tools.
- Real photography with no fake screenshots, one icon system, no three-up card grids, no card containers, no marquee, motion isolated in client leaves, and cleanup functions on every effect: six strengths confirmed against the source.
- The 192 px padding is drift against the repository's own documents, which declare an 8 px rhythm with a 4 px sub-unit and 80 to 120 px sections.

## 5. What did not survive

| Claim in `DESIGN-LENS-AUDIT.md` | Measured truth | Evidence |
|---|---|---|
| The alpha failure is 25 borders, and the rest of the token system is healthy | It is 17 utilities across 75 class instances, and 0 of 669 selectors in the compiled CSS carry an alpha modifier on any of the six affected tokens | Stylesheet walk of the live page, §6 below |
| The section numerals are a low-opacity watermark, and the 448 px numeral is hidden | They render fully opaque. `opacity` is 1 on the numeral, its three ancestors, the 448 px numeral and its four ancestors; every opacity class involved is one of the inert ones | `getComputedStyle` chain, §6 |
| Radii are one-off drift (P2-10, second half) | All five measured radii are declared theme steps: pill 9999, 2xl 24, xl 16, lg 12, sm 4. Five of nine declared steps are used and two are singletons | `tailwind.config.js:84-94` against the measured set |
| `prefers-reduced-motion` is handled by one CSS rule, which is thin | It is handled extensively in JavaScript: `MotionConfig reducedMotion="user"` plus `matchMedia` in `MotionProvider`, `RevealImage`, `RevealText`, `SmoothScroll` and `AuditTool`. Three holes remain and they are specific: the hero interval, the magnetic transform, and the Positioning counter | Five component files, §7 |
| "the frontend-design rule set that bans generic fonts and default SaaS card grids" | frontend-design names no typeface and has no card-grid rule. The hard Inter/Roboto/Open Sans ban is `minimalist-skill/SKILL.md:14`; `taste-skill/SKILL.md:169` only discourages Inter and `:170` grants a neutral B2B override, while its own banned families are Fraunces and Instrument Serif at `:180` | Read of all four rule files |
| The layout passes (former §5.2) | Impeccable's craft floor fails it on the eyebrow that forms the page's structural template, on the hero-metric stat block and on a `side-tab` accent stripe. Taste fails it on layout repetition, the split-header ban and the eyebrow count | §7 |
| "Also clean under this lens" for icons, shadows and radii (former §5.3) | Those were never frontend-design rules, they belong to Taste and Impeccable, and the radius half is wrong as stated above | Attribution error |
| One unused `spin` keyframe | The unused keyframes are `marquee`, defined at `tailwind.config.js:99-107` with zero call sites anywhere in `src/`. Tailwind's stock `spin` is never emitted. 0 of 560 elements carry a running CSS animation | `grep` over `src/` plus live measurement |
| F1 is a payoff of the token fix | The undefined `teal-gradient-btn` and `btn-primary` utilities are still live in the tree, and Impeccable's ladder rates them P0 while rating the hairlines P1 | §9 |

Two further document drifts, found while checking the above: `AGENTS.md` names a `TrustStrip` component that does not exist and a `ContactCTA` that is actually `ContactBand`, and it omits `FoundingClient` and `AuditSection`, which are on the homepage; it also claims a keyword marquee (there is none) and Hanken Grotesk as the display face while `tailwind.config.js:53-58` maps both `sans` and `display` to Inter. `docs/IMAGERY.md` lists `public/assets/imagery/hero-business.jpg`, which does not exist; the six carousel images that replaced it are not listed. `Hero.tsx:14` gives slide one an Abuja, Nigeria alt text on a site that frames its pilot as Ghana.

## 6. The P0, sized properly

Six tokens are declared as bare `var()` values, so Tailwind cannot inject an alpha channel into them and drops the utility entirely:

`background` (`tailwind.config.js:23`), `on-background` (`:24`), `surface` (`:25`), `on-surface` (`:26`), `on-surface-variant` (`:28`), `surface-container` (`:33`).

The class never reaches the stylesheet, so the element keeps whatever it would have had without the class: the preflight border colour `rgb(229, 231, 235)`, an inherited text colour at full strength, or no background at all. Measured on production:

| Where | Utility | Renders as | Intended |
|---|---|---|---|
| Floating navbar | `bg-background/60`, `border-on-background/15` | background transparent, border `#e5e7eb`, backdrop blur 24 px carrying the whole surface | 60 percent ground, 15 percent hairline |
| Hero carousel dots | `bg-on-background/30`, hover `bg-on-background/60` | transparent, so 5 of the 6 dots are invisible and hover does not reveal them | 30 percent pill, 60 percent on hover |
| Back to top | `bg-surface/85`, `dark:bg-surface-container/85` | transparent with a 24 px backdrop blur | 85 percent raised surface |
| 3 image controls | `bg-background/80` | transparent | 80 percent ground behind the glyph |
| Newsletter input | `border-on-surface/15`, `placeholder:text-on-surface-variant/60` | `#e5e7eb` border, default placeholder | 15 percent hairline, 60 percent placeholder |
| Section numerals, 9 at 82×72 px | `text-on-background/[0.08]` | opaque `rgb(216, 227, 245)` | 8 percent ghost |
| Stat labels, 12 | `text-on-background/[0.15]` | opaque | 15 percent |
| Positioning watermark, 538×448 px | `text-on-background/[0.04]` | opaque | 4 percent |
| Hero subtext, 3 | `text-on-background/85` | opaque | 85 percent |
| Hairlines, 26 | `border-on-background/10` | `#e5e7eb` | 10 percent |
| Outline buttons, 3 | `border-on-background/20` | `#e5e7eb` | 20 percent |
| 1 caption | `text-on-surface-variant/70` | inherits full-strength text | 70 percent of the variant colour |

17 utilities, 75 class instances. The five inactive dots carry two each, which is why the instance count exceeds the element count.

The fix restores the intended appearance rather than silently cleaning anything, so it needs a visual review: the numerals will become faint, the dots will appear, and the navbar will gain a ground. Concretely it means converting twelve values, six per theme, to channel triplets, then pointing the six config entries at `rgb(var(--token) / <alpha-value>)`:

- light: `globals.css:21, 22, 23, 24, 26, 35`
- dark: `globals.css:66, 67, 68, 69, 71, 76`

Converting only the dark half, or only the three `on-` tokens as the earlier register said, leaves the navbar, the dots, the Back to top button, the image controls and the newsletter input still broken in one theme or the other.

## 7. New findings the tools produced

**Impeccable, craft floor (absolute bans, not defaults)**

- The kicker or eyebrow above a heading: `SectionLabel.tsx:23` is that component, over the heading in eight sections.
- Section numbers that carry no sequence: `00` to `07`, plus the 448 px `04` watermark in Positioning.
- Monospace as a costume for technical work: JetBrains Mono on 41 measured elements, all of them eyebrows and metadata rather than machine output.
- The hero-metric template: `Positioning.tsx:153-163`, three `text-display-md` counters in accent over `font-mono` uppercase labels.
- Gradient text: `NotFound.tsx:86` uses `bg-clip-text` with a gradient. Scoped to the homepage it does not appear, which is why the earlier pass called it clean.
- An accent side stripe: `Founders.tsx:90` carries `border-l-2 border-accent-bright`, a detector hit on a homepage section.

**Impeccable, browser surfaces and states**

- `::selection`, the scrollbar thumb and its hover are all dropped by the channel-format tokens at `globals.css:155, 160, 164-167`. This was the earlier pass's A6, confirmed.
- `MagneticButton.tsx:66` has no focus style at all, so the primary hero call to action falls back to the user-agent ring.
- `tabular-nums` appears nowhere in `src/` while `Positioning.tsx:157` animates counters, so the digits reflow as they count.
- `will-change: transform` is left on at rest at `globals.css:135, 141`.
- Display type is capped at 6 rem by the craft floor; `tailwind.config.js:61` sets `display-xl` to 7.5 rem, and the watermark is 28 rem.
- No disabled, loading or empty state exists on any control.
- Touch targets: the craft floor asks for 44 px. The carousel dots are `p-1.5` around a 1.5 px pill, roughly 18 px, which makes UI-AUDIT F6 an under-report at its 24 px bar.

**Taste**

- Hero stack discipline caps the hero at four text elements; it ships seven (eyebrow, heading, mono tagline, subtext, two calls to action, three benefit bullets).
- The hero must fit the first viewport; the subtext runs about 45 words and `pt-32 md:pt-40` pushes the button below the 893 px fold.
- The hero top padding cap is `pt-24`; the page uses 160 px.
- Duplicate call to action intent: `Navbar.tsx:195` and `:271` say "Book Free Consultation" while `Hero.tsx:149` and `ContactBand.tsx:104` say "Book a Free Consultation", four and five words against a three-word cap.
- `MagneticButton.tsx:48-62` tracks pointer position in `useState` and writes a transform string, re-rendering on every mouse move where the rule asks for `useMotionValue`. `BackToTop.tsx:15` uses a `window.addEventListener("scroll")` listener, which the rule bans outright; `Navbar.tsx:43-47` does the same job correctly with `useScroll`.
- `Hero.tsx:164-177` hand-rolls a checkmark SVG beside a single icon system.
- Pre-flight returns 34 pass, 12 fail, 9 partial out of 55 items.

**UI-UX-Pro-Max**

- Its carousel rule is explicit: provide pause and stop, stop on focus, hover and reduced motion, provide previous and next controls, and render a static set under reduced motion. The page pauses on hover and focus (`Hero.tsx:74-80`) and its dots are real buttons with `aria-label` and `aria-current`, but the 5-second interval ignores `prefers-reduced-motion` and there is no pause control, so a touch user cannot stop the rotation at all. Manual selection does not reset the timer either.
- Its UX table adds a severity to two existing findings: infinite animation belongs on loading indicators, and reduced motion must be checked.
- It returned "Exaggerated Minimalism" as the strongest style match for a dark editorial page: `clamp(3rem, 10vw, 12rem)` display type at weight 900 with tight tracking, one accent only, and 8 rem or more of section padding.

**frontend-design**

- It names no typeface. Its type rules are role-based: one family or two, avoid the families you would reach for on any other project, keep lines under 80 characters, and let a serif take longer lines.
- Its treatment bans are the interesting part, and the site trips all three: accenting a single word or phrase in italic, bold or another colour (the house style, about 25 call sites, mechanised through the `accent` and `italic` props at `DisplayHeading.tsx:35-43`, where `accent` colours an entire heading); all-caps labels; and typographic labels above content.
- Numbering is permitted only where the content really is a sequence.
- Fade-and-slide entrances on every section read as generated, and the page has 76 transitioned elements on top of `RevealText` per headline.
- Monospace for small data labels and middle-dot meta strings are named tells.
- It asks for three families at most and for boldness spent in one place; the page ships three, plus three tiers of 3-D, six gradients, five blurs and a six-slide carousel.
- It finds the design not grounded in its subject. Type, palette and structure are portable to any fintech; the only subject-specific assets are the six hero photographs, and a 55 to 95 percent scrim sits over them.

## 8. Where the tools disagree

**Inter.** UI-UX-Pro-Max returns "Minimal Swiss: Inter + Inter" for a typography query and its palette builder emits a navy and blue corporate scheme; both are keyword matches rather than advice for this brief, since the same query returned EB Garamond and Lato with a law-firm mood. Taste discourages Inter as a default and then grants an override for neutral B2B systems, which this is. The hard ban belongs to a taste sibling that was not installed. frontend-design says nothing about families. The measurable fact is that Inter is the token for both `sans` and `display` at `tailwind.config.js:53-58` and covers 338 of 468 styled elements, and that the repository's own two design documents name Hanken Grotesk for display while nothing loads it. Re-facing is a real option, not a rule violation.

**Padding and density.** Taste reads 192 px as a declared density choice and asks for the dial to be written down rather than the number reduced. Impeccable reads it as drift against `DESIGN.md`'s own 8 px rhythm and 80 to 120 px range. Both can be satisfied at once by declaring the density and then letting section weight follow content.

**Eyebrows.** Taste allows three per page. Impeccable allows none. Even the permissive reading costs six of the nine.

**Accents.** UI-UX-Pro-Max says the accent is for the call to action only. Taste says one accent for the whole page. Impeccable says emphasis belongs to weight and size. The site ships three plus white.

## 9. Fix register, rewritten

Nothing has been changed. Line numbers are for a patch against the current tree.

| # | Fix | Targets | Why it is first |
|---|---|---|---|
| P0-1 | Make the six tokens alpha-capable | `tailwind.config.js:23, 24, 25, 26, 28, 33`; `globals.css:21, 22, 23, 24, 26, 35` and `:66, 67, 68, 69, 71, 76` | One change restores 17 utilities and 75 instances: the navbar ground, the carousel dots, the Back to top fill, three image controls, a placeholder, 26 hairlines and every ghost numeral |
| P0-2 | Define or delete the undefined button utilities | `teal-gradient-btn` at `Navbar.tsx:268, 288`, `NotFound.tsx:116`, `security/page.tsx:220`, `InsightsPostClient.tsx:82`; `btn-primary` at `ContactStepper.tsx:177`, `CalendarStep.tsx:144` | Seven live call sites across six files render unstyled buttons today. This is UI-AUDIT F1, and Impeccable's ladder rates it P0 because a control that does not read as a control stops the task |
| P1-3 | Pick one accent | `tailwind.config.js:47-51`, then the `text-accent-cyan` and `text-accent-bright` call sites, roughly 25 | Land it with P0-2, because the button fix has to choose the same accent |
| P1-4 | Repair the dropped channel tokens and finish the browser surfaces | `globals.css:155, 160, 164-167`; add `caret-color` and `tabular-nums` | Selection, scrollbar and the counters are visibly wrong to anyone who selects text or watches the stats |
| P1-5 | Put the outline roles back on spec | `globals.css:72-73` dark to `133 148 143` and `60 74 70`; `:27-28` light to `115 119 127` and `195 198 207`. Channel triplets, not hex, because these tokens are consumed as `rgb(var(--x) / <alpha-value>)` | The earlier register wrote the light values as hex, which would have dropped every outline utility instead of fixing it |
| P1-6 | Focus and touch on the primary calls to action | `MagneticButton.tsx:66`, `Hero.tsx:210-215` | Raising the dot targets to 44 px and giving the main button a ring closes UI-AUDIT F6 and F12 |
| P1-7 | Reduce the hero to four elements and let it fit the fold | `Hero.tsx:120, 135-138, 141-143, 160-180` | Removes the tagline and the benefit list, cuts the subtext under 20 words, drops `pt-40` to `pt-24`, and takes `min-h-[88vh]` off |
| P1-8 | Give the carousel a stop and a reduced-motion branch | `Hero.tsx:44, 55-80` | UI-UX-Pro-Max's own conversion rule, and the only motion defect a touch user cannot work around |
| P2-9 | Cut the eyebrow budget from nine to three and keep the numerals only where they are a sequence | `SectionLabel.tsx:23` call sites in eight sections; `Positioning.tsx:82, 119` | The two taste and impeccable findings that agree most strongly |
| P2-10 | Delete the dead and the banned decorations | `tailwind.config.js:99-107`; `Founders.tsx:90`; `NotFound.tsx:86`; `globals.css:135, 141` | Dead config, an accent stripe, gradient text and `will-change` at rest |
| P2-11 | Replace the two mechanism violations and gate the counter | `MagneticButton.tsx:48-62`, `BackToTop.tsx:9-20`, `Positioning.tsx:18-44` | Pointer state and scroll listeners are the framework-flavoured ones the rules name by hand |
| P2-12 | Name one authoritative design document and record the dials | `DESIGN.md`, `docs/DESIGN_SYSTEM_V2.md`, the dark spec under `stitch_gileara_technologies_website/`, `AGENTS.md` | Four documents disagree today, and two of them describe a system that is not the one shipping |

## 10. Method and limits

Measured on the live production build: 560 elements, 728 CSS rules of which 669 carry selectors, 38 selectors touching background or surface tokens. Nothing was measured on a second viewport, in light theme, on a mobile device, on a non-homepage route, or with contrast ratios computed. Both Impeccable and its own rules ask for a desktop and a mobile pass, so its layout verdicts here are single-viewport. The detector engine was not executed, so its rule ids are predictions from source. The two dial runs against UI-UX-Pro-Max are keyword searches over local data, and their typography answers are noise rather than advice.

## 11. Next step

Pick from §9. P0-1 and P0-2 are independent, small, and each closes a class of bug rather than an instance. P0-1 will visibly change the page and should be reviewed in the browser rather than merged on trust.
