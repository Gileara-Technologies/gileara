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
| 1 | Services data overhaul (new pricing source) | **done** (round 1) | Type-checked (`npx tsc --noEmit` clean), lint clean, 485/485 tests passing, `npm run build` green (all 5 service landing pages still prerender statically). Committed. See "Workstream 1" below for the full decision log. |
| 2 | Humanizer pass on site copy | not started | |
| 3 | 3D + mobile-optimized visual pass | not started | `three`, `@react-three/fiber`, `@react-three/drei`, `gsap` are already real `dependencies` in `package.json` (not devDependencies) — this was clearly staged for this exact task. AGENTS.md's note that these are "unused today" will be stale the moment workstream 3 ships; update it then. |

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

## Workstream 2 — Humanizer pass (not started)

Plan: run the `humanizer` skill's checklist against the highest-traffic
copy first (homepage, /about, /services, /faq) rather than trying every
page in one round. Re-check Business Operations' problem/observation copy
against its revised sales framing while in there (flagged above).

## Workstream 3 — 3D + mobile-optimized visual pass (not started)

`three` / `@react-three/fiber` / `@react-three/drei` / `gsap` are real
`dependencies` already (not devDependencies — someone staged this on
purpose). Plan: one tasteful, brand-consistent 3D element (likely the
Hero, given the "Terminal/Operator" aesthetic — an abstract low-poly
network/grid reacting subtly to pointer movement), built with:
- Dynamic import (`next/dynamic`, `ssr: false`) so the WebGL canvas never
  blocks LCP.
- A hard `prefers-reduced-motion` and `(pointer: coarse)` fallback to a
  static/CSS version — mobile and reduced-motion users get a cheap
  fallback, not a stripped-down WebGL scene.
- Capped `dpr` and a low polygon/particle budget.
- Must update AGENTS.md's "No tilt or WebGL layer ships" line once this
  exists, and reconcile `docs/DESIGN.md` if it says otherwise.
