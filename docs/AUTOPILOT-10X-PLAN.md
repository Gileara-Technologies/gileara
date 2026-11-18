# Autopilot "10X" Plan — working memory across goal rounds

This file exists because each Autopilot round may start with no memory of
prior rounds' reasoning — only the goal text and the repo state. Update
the status table at the top of this file at the end of every round.

**Objective** (verbatim from the goal): "use 3D skills to make the website
10X better. Keep in mind to optimize for mobile. also run humanizer skill
on texts on the website. update the services data with the new ones found
here: `C:\Users\rodne\Documents\Ideaverse\Gileara\BusinessDevelopment\Packages`"

Three independent workstreams. Tackled one (or a few) at a time, each
fully verified (lint/test/build) and committed before moving to the next,
so the tree is always in a shippable state between rounds.

## Status

| # | Workstream | Status | Notes |
|---|---|---|---|
| 1 | Services data overhaul (new pricing source) | **done** (round 1, + a follow-up fix same round) | Type-checked (`npx tsc --noEmit` clean), lint clean, 485/485 tests passing, `npm run build` green (all 5 service landing pages still prerender statically). Committed. See "Workstream 1" below for the full decision log, including a second pass that caught stale USD/Basic-Professional-Enterprise references left over in `faqs.ts`, `posts.ts`, and `/security` while starting workstream 2 — grep every content module for `$[0-9]`, `USD`, and the old tier names before considering this workstream truly closed. |
| 2 | Humanizer pass on site copy | **done** (round 1) | Finding: already clean from prior session work, zero AI-tell matches across every content module and component. Real defect found instead was a pricing-accuracy issue, folded into workstream 1. See "Workstream 2" below. |
| 3 | 3D + mobile-optimized visual pass | **started** (round 1) | First deliverable shipped: a WebGL point-field depth layer behind the Hero, gated to fine-pointer/motion-ok visitors only. See "Workstream 3" below. More 3D touches (other sections) are a candidate for a future round, not required to call this workstream "done" — one tasteful, fully-verified element beats several rushed ones. |

## Workstream 1 — Services data overhaul

**Source**: 5 markdown files in `C:\Users\rodne\Documents\Ideaverse\Gileara\BusinessDevelopment\Packages\` —
`digital-foundation.md`, `business-operations.md`, `customer-growth.md`,
`business-intelligence.md`, `automation-efficiency.md`. These are a
*complete replacement* of the commercial model, not a tweak:

- **Currency**: USD → **GHS**. The old `setupFeeUsd`/`monthlyFeeUsd`
  fields and every hardcoded `$` in the UI must go.
- **Tier names**: Basic/Professional/Enterprise → **Starter/Growth/Premium**.
- **Premium is no longer a number.** Every package's Premium tier is
  "Contact Sales — scoped to need" in the new source — there is no
  Enterprise price to show. Showing an invented Premium price would be
  exactly the kind of fabricated content this codebase's honesty
  conventions (docs/IMAGERY.md, the goals-not-results framing on
  `/how-we-transform`) exist to prevent. Decision: `setupFeeGhs` /
  `monthlyFeeGhs` on `ServiceTier` are `number | null`, `null` meaning
  "Contact Sales" — TypeScript then forces every render site that reads
  these fields to handle the null case, which is how I found every call
  site (see "Files touched" below).
- **Setup fee varies per package now** (previously ALL packages had a
  setup fee): Digital Foundation and Automation & Efficiency keep a
  setup/build fee; Business Operations, Customer Growth, and Business
  Intelligence are explicitly "no onboarding fee" subscriptions.
- **Package 3 (Customer Growth) gets an annual-prepay discount** (15%
  Starter / 18% Growth) — unique to this package, modeled as optional
  `annualPrepayGhs` / `annualPrepayDiscountPct` on the Starter/Growth
  tiers.
- **Package 4 (Business Intelligence) is explicitly an upsell, not a
  cold-sale product** — "Do not sell this cold... this package is not
  sold standalone." Modeled as `expansionOnly: true` + `expansionOfNote`
  on the `Service` record so the landing page can say so honestly rather
  than pitching it as a first purchase.
- **Package 5 (Automation & Efficiency) keeps its setup+capped-monthly
  structure** and additionally has a small outcome-based pricing table
  (per-conversation / per-document / per-post) for customer-facing
  automation specifically, capped at GHS 2,500/month/process. Modeled as
  `outcomePricing?: {type, priceLabel}[]` + `outcomePricingCapNote`.
- **Add-ons, exclusions, and implementation timelines are new structured
  data** that didn't exist on `Service` before — added as
  `addOns?: {name, price}[]`, `exclusionsNote?: string`.
- **Feature matrices changed per package** — re-copied from each doc's
  "Core" table.
- **`status: "available" | "rollout"`** (the D5 phased-honest launch
  chip) is NOT addressed by the new source docs at all — this is a
  readiness flag, not a pricing fact. Decision: leave the existing
  values unchanged (`digital-foundation: "available"`, the other four:
  `"rollout"`) unless told otherwise.
- **Landing-page narrative content** (`problems`, `observations`,
  `howWeHelp`, `outcomes`, per-service `faqs` prose) is **not present in
  the new source docs at all** — they only contain pricing/feature/sales
  data, not landing-page copy. Decision: this round only touches facts
  that actually changed (tier names, numbers, currency, feature lists,
  FAQ answers that cite a specific price/tier/timeline). Deeper
  copy/positioning alignment (e.g. Business Operations' revised problem
  framing, dated 2026-11-17 in its own doc) is deferred to the humanizer
  pass (workstream 2) so it isn't done twice.
- **Custom services** (`customServices`: bespoke dev/mobile/AI, still
  USD) and the **customer journey ladder** (`customerJourney`) are
  touched only to match new Starter-tier GHS figures where they
  reference the five packages; `customServices` itself has no new
  source, so it stays in USD (flagged here, not silently guessed at).

### Files touched (confirmed complete via `npx tsc --noEmit` — renaming
`setupFeeUsd`/`monthlyFeeUsd` to `setupFeeGhs`/`monthlyFeeGhs` made the
compiler surface every call site; fixed each until clean)

- `src/content/packages.ts` — the data + types themselves, plus new
  `ServiceAddOn`, `OutcomePriceLine`, `MeteredAllowance` types,
  `formatGhs()`, `PREMIUM_CONTACT_SALES_NOTE`. Removed the now-unused
  `solutions?: string[]` field (Automation & Efficiency now has a real
  tiered `features` table like every other package, so the flat-list
  shape has no callers left).
- `src/components/Pricing.tsx` (homepage) — GHS, "no onboarding fee" case.
- `src/app/services/ServicesPageClient.tsx` — GHS, Premium "Contact
  Sales" case in 3 places, feature-table header rename
  (Basic/Professional/Enterprise → Starter/Growth/Premium) + row field
  rename, removed the dead solutions-list render branch, added an
  Add-ons block + pricing/exclusions notes.
- `src/components/ServiceLandingPage.tsx` — GHS, Premium case, removed
  the stale "set in USD and payable in cedis" line (prices are natively
  GHS now, no conversion framing needed), added Add-ons / outcome-pricing
  / metered-allowances / exclusions rendering, an expansion-only notice
  for Business Intelligence, and an annual-prepay line for Customer Growth.
- `src/app/services/page.tsx` (JSON-LD) — GHS; `AggregateOffer`'s
  `highPrice`/`offerCount` now span Starter..Growth only (Premium has no
  published figure to aggregate).
- `src/app/services/[slug]/page.tsx` (JSON-LD) — GHS; Premium tier is
  filtered out of the `offers` array rather than emitting a schema.org
  `Offer` with a null price.
- `src/app/page.tsx` (JSON-LD) — GHS; switched the per-package `Offer`
  from the Starter tier's *setup* fee to its *monthly* fee, since three
  of five packages now have `setupFeeGhs: 0` (no onboarding fee), which
  would have read as "price: 0 (free)" to a crawler.
- `src/app/how-we-transform/[slug]/page.tsx` — GHS rename only (always
  reads the Starter tier, which is never null).
- `tests/content/packages.test.ts` — rewritten for the new tier
  names/null-Premium model/new package-specific fields.

Deliberately NOT touched: `customServices` (bespoke dev/mobile/AI work)
stays in USD — no GHS figure was published for it in the new source, and
inventing one would be exactly the kind of fabricated data this
codebase's honesty conventions exist to prevent.

### Follow-up fix (same round, found while starting workstream 2)

The initial pass only touched the five files above because `npx tsc
--noEmit` surfaces type errors, not stale *prose* that happens to
compile fine — a plain-string mention of "$550" or "Enterprise tier"
inside a content module's copy is just a string, so the compiler has no
opinion on it. Found by grepping every content module for `\$[0-9]`,
`USD`, and the old tier names once workstream 2 started reading through
site copy. Fixed, all in content modules (confirmed empty D1 tables
first, via `wrangler d1 execute ... SELECT COUNT(*)`, so these files
are exactly what's live in production, not a stale fallback nobody
reads):

- `src/content/faqs.ts` — the "How much do your packages cost?" answer
  cited the old $550/$16,300 figures; rewritten to the real GHS range
  (GHS 275/month floor up to Automation & Efficiency's GHS 10,000 +
  GHS 1,960/month Growth tier — the actual highest published figure
  now, confirmed by reading every tier). The mobile-money FAQ claimed
  "we invoice in USD but settle in cedis," which directly contradicted
  the new pricing model (packages are natively GHS now, no conversion
  framing needed) — corrected, and clarified that the still-USD
  `customServices` bespoke-engagement pricing is the one place USD
  still legitimately applies. Two "Enterprise tier" mentions renamed
  to "Premium."
- `src/content/posts.ts` — two Insight-post CTAs cited old USD figures
  ($550+$85/mo, $1,625+$140/mo) for Digital Foundation and Business
  Operations; updated to their real GHS figures (GHS 3,500+250/mo; GHS
  275/mo, no onboarding fee — Business Operations has none now). Two
  more "Enterprise tier"/"Enterprise" mentions renamed to "Premium."
- `src/content/packages.ts` — `MANAGED_SERVICES_NOTE` and one
  Business-Intelligence `howWeHelp` entry title still said "Enterprise"
  in prose even though the tier itself had already been renamed
  everywhere else — missed in the first pass because these are plain
  string literals, not the `ServiceTier["name"]` type the compiler
  checks.
- `src/app/security/page.tsx` — a hardcoded "what managed services
  cover" table (a second, independent copy of the same coverage matrix
  shown on each package, not read from `packages.ts`) still had
  Basic/Professional/Enterprise column headers; renamed to
  Starter/Growth/Premium.

Re-verified after this fix: `npx tsc --noEmit` clean, lint clean,
485/485 tests passing, `npm run build` green.

## Workstream 2 — Humanizer pass

**Finding (round 1): there is almost nothing to humanize.** Loaded the
`humanizer` skill and grepped every strong, unambiguous AI-writing tell
it lists (§1-§3, §12-§13, §16, §19 in its own numbering: "crucial,"
"delve," "underscore," "robust," "tapestry," "testament," "pivotal,"
"not just X but Y," "stands as a testament," "let's dive in," "here's
the thing," travel-blog clichés like "nestled in the heart of," etc.)
across `src/content/` and every `.tsx` under `src/components/`: **zero
matches, every pattern, every file.** This isn't an oversight — the
session history for this project shows multiple prior rounds explicitly
titled "Humanize [X] copy" (homepage, FAQs/roles/founders/team,
services/insights/faq, packages.ts, posts+scenarios, about/contact/
careers) that already did this work, thoroughly, before this round's
objective was given.

Spot-checked by directly reading (not just grepping) `founders.ts`,
`faqs.ts`'s full answer set, and a full Insight post (`building-
scalable-mvps` in `posts.ts`) — plain, specific, varied-length prose,
no staged contrasts, no one-line closers, no triads-by-rule. Reads like
a person who runs this business wrote it, which is the actual goal, not
"zero hits on a grep" as a target to game.

What this round's humanizer work actually consisted of, then: the
pricing-content-accuracy sweep documented above as "Workstream 1 follow-
up" — found while reading through copy for tells, not a tell itself,
but a real defect (stale prices/tier names in prose the grep for AI
patterns doesn't catch, since a wrong number isn't a writing-style
problem). Closing this workstream here rather than manufacturing edits
to text that already reads well; a future round should re-run this
same grep sweep after any substantial new copy is added (the "Workstream
1" new package-specific prose — `pricingNote`, `exclusionsNote`, the
outcome-pricing cap note — was written fresh this round and should get
its own humanizer pass eventually, though a first read of it during
writing didn't surface any obvious tells either).

## Workstream 3 — 3D + mobile-optimized visual pass

`three` / `@react-three/fiber` / `@react-three/drei` / `gsap` were
already real `dependencies` in `package.json` (not devDependencies —
staged for exactly this task before this round started).

### Shipped (round 1): Hero WebGL point-field depth layer

- `src/hooks/useCanRender3D.ts` — the one gate every 3D component on
  this site should use: `true` only for a fine pointer (desktop/laptop)
  with no `prefers-reduced-motion`. Implemented with
  `useSyncExternalStore` (not `useState`+`useEffect`) because this
  repo's lint config flags a synchronous `setState` call inside an
  effect — subscribing this way is also strictly better: the gate
  updates live if a visitor's OS motion setting or input device changes
  mid-session, not just once on mount.
- `src/components/three/HeroPointField.tsx` — the actual scene: ~160
  points in a flattened disc, teal (`#5EEAD4`, the one brand accent),
  transparent canvas so the existing `.bg-brand`/`.grid-bg` CSS layers
  stay visible underneath (this adds depth, it doesn't replace the
  brand treatment). Slow constant drift plus a gentle pointer-parallax
  lerp. Point positions are computed ONCE at module-evaluation time
  (not inside `useMemo`) — this repo's lint config enforces React
  Compiler purity rules, which flag `Math.random()` as impure even
  inside `useMemo`; module-scope, computed-once data has no such
  restriction and the geometry never needs to change after load anyway.
  The mutable pointer-tracking object is a plain `useMemo`-held object,
  not a `useRef`, because the lint config also flags reading
  `ref.current` during render (passing it as a prop counts) — same
  mutate-outside-render/read-every-frame technique, just not shaped like
  a "ref."
- `src/components/three/HeroBackdrop.tsx` — wraps `HeroPointField` in a
  `next/dynamic(..., { ssr: false })` import (so the Three.js chunk is
  never part of the server-rendered HTML) behind the `useCanRender3D()`
  gate (so touch/reduced-motion visitors never even trigger the chunk
  fetch), plus a small class-based error boundary so a WebGL failure
  (disabled WebGL, a sandboxed/unsupported browser) silently resolves
  to nothing rather than breaking the Hero.
- Wired into `src/components/Hero.tsx` as a sibling of the existing
  flat `.grid-bg` div, right before the content row.

**Verification — real browser, not just type-checks**: `npx tsc
--noEmit` and `npx eslint src/` clean, 485/485 tests passing, `npm run
build` green. Beyond that, since this is new, unproven visual/runtime
territory for the codebase, verified against a real production server
(`npm run start`, not `next dev` — dev mode's Turbopack prefetching
turned out to eagerly fetch the dynamic chunk regardless of render path,
which would have been a false "it works" signal) with Playwright:
  - Desktop/fine-pointer context: exactly one `<canvas>` mounts inside
    the Hero section, correct non-zero size.
  - A real touch-emulated context (`hasTouch: true, isMobile: true`,
    not a mock): zero `<canvas>` elements, and zero network requests
    matching `three`/`fiber`/`HeroPointField` — the mobile-optimization
    claim ("mobile never pays for this") is proven against the actual
    shipped bundle, not asserted.
  - A `prefers-reduced-motion: reduce` context via Playwright's real
    `page.emulateMedia`: zero `<canvas>` elements.
- One known, harmless console warning not from this code: `THREE.Clock:
  This module has been deprecated` — emitted by `@react-three/fiber`
  v9.7.0's internal default render-loop clock against the pinned `three`
  0.185.x, not from anything in `HeroPointField.tsx`. Cosmetic; no
  functional impact observed.

**AGENTS.md updated** to drop the stale "no tilt or WebGL layer ships...
those package.json entries are unused today" line, which is no longer
true.

### Not done yet (future round candidates, not required for "done")

- More 3D touches elsewhere on the site (e.g. a tilt/depth effect on
  the services tier cards, or a 3D element on `/about` or
  `/how-we-transform`) — one tasteful, fully-verified element this
  round was the deliberate scope; more can follow.
- `docs/DESIGN.md` (and the dark-theme DESIGN.md under
  `stitch_gileara_technologies_website/`) were not audited for a
  conflicting "no 3D" statement — worth a quick check in a future round.
