# Gileara vs. eight global digital-transformation consultancies

**Scope:** comparison test against well-known digital transformation / digital consultancy brands worldwide, covering communication, branding, design & UI implementation, development & performance, content engineering, and trust/compliance plumbing.
**Measured:** 2026-10-11, single test host, cold cache (CDP `Network.setCacheDisabled`), Chromium via Playwright at 1440×900, one load per site.
**Companion document:** `docs/UI-AUDIT.md` (internal UI/UX audit, findings F1–F14 — referenced throughout as F-numbers).
**Status:** analysis only. No code has been changed. Nothing here is actioned until you review it.

---

## 0. How to read this document

- **Measured** = number captured from the live site by instrumentation (CDP byte counts, `getComputedStyle`, DOM census, `performance.getEntriesByType`). **Claimed** = copy the vendor wrote about itself. Both are labelled.
- **Weight, requests, DOMContentLoaded (DCL)** are from my instrumentation on every site, so they are comparable to each other. DCL is *not* LCP and not a Core Web Vital — treat it as "how long until the document was parsed and the main resources were in" on one machine.
- **Per-asset breakdown** (fonts, images, scripts) is only reliable for Gileara, because `PerformanceResourceTiming` is same-origin-only: competitor font/JS byte sizes are invisible from here. Competitor *totals* come from CDP, which does see cross-origin bytes.
- **Competitor HTML document sizes** (Accenture 232 KB, Deloitte Digital 444 KB) come from the research passes, not from my CDP run — flagged where used.
- **LCP is unavailable** for all nine sites: `largest-contentful-paint` entries are only exposed to a page-registered `PerformanceObserver`, so `getEntriesByType` returns empty. No field data (CrUX) was available from this host either.
- Sites behind bot walls: **Globant** returned 403 to plain fetches (WAF/Imperva — research used Wayback for copy; my browser run rendered fine), **EPAM** 403 to plain fetches (Cloudflare — research used a rendered browser).
- **Thoughtworks never reached `DOMContentLoaded` within a 35 s timeout**; its numbers below are a lower bound captured during that window, and its DOM profile was measured afterwards once the page had settled.

**The field:** Accenture, Deloitte Digital, Publicis Sapient, Thoughtworks, Globant, EPAM, Slalom, IDEO. Eight sites, eight different markets (US/EU/India/global enterprise) — and **not one of them is African**. That fact shapes the last third of this document.

---

## 1. The field at a glance (measured)

### 1.1 Performance & delivery

| Site | Cold-load weight | Requests | DCL (ms) | HTML doc | Images (lazy) | Console errors |
|---|---|---|---|---|---|---|
| **Gileara** (gileara.org) | **1,849 KB** | **17** | **1,835** | **18 KB** (104 KB decoded) | 9 (7 lazy) | **0** |
| IDEO | 1,082 KB | 44 | 7,643 | — | 55 (52 lazy) | 0 |
| Accenture | 1,695 KB | 50 | n/a¹ | 232 KBᵣ | 13 (7 lazy) | 0 |
| Deloitte Digital | 2,987 KB | 146 | 8,442 | 444 KBᵣ | 83 (19 lazy) | **3** |
| Slalom | 3,314 KB | 82 | 10,849 | — | 97 (90 lazy) | 0 |
| Globant | 3,458 KB | 42 | 3,002 | — | 103 (92 lazy) | **1** |
| Publicis Sapient | 3,799 KB | 89 | 13,917 | — | **162** (73 lazy) | 0 |
| EPAM | 4,320 KB | 75 | 23,508 | — | 86 (51 lazy) | 0 |
| Thoughtworks | **4,921 KB**² | 54² | **36,324**³ | — | 89 (**0 lazy**) | **1** |

¹ Accenture's SPA redirected (`/us-en` → `/en`) mid-measurement on the first pass; bytes are from the clean cold run, DCL was not captured. ² Bytes/requests accumulated during the 35 s window that ended in a navigation timeout — a lower bound; same-origin transfer alone was 4,568 KB across 66 resources. ³ DCL measured after the timeout, i.e. the browser recorded 36.3 s. ᵣ = competitor HTML size from the research pass, not my run.

**Read:** Gileara is the fastest and lightest site in the field on every comparable axis except IDEO's total, and the gap is not marketing spin — it is 18 KB of HTML against 232–444 KB, 17 requests against 42–146, and 1.8 s to DOM-ready against a 3.0–36.3 s spread (median ≈ 10.8 s).

### 1.2 Content, structure & trust machinery

| Site | JSON-LD blocks | hreflang | Search affordances | Visible `<h1>` | Consent platform |
|---|---|---|---|---|---|
| **Gileara** | 1 block → 16 typed entities⁴ | 0 | **0** | **1** (103 px, fw 400) | none |
| Accenture | 1 (defective) | 17 | 5 | 0 detected⁵ | OneTrust |
| Deloitte Digital | **0** | 0 | 2 | 2 (one is "Client impact") | OneTrust |
| Publicis Sapient | 2 | **0** | 4 | 1 (72 px) | CookiePro/OneTrust |
| Thoughtworks | 4 | 20 | 1 | 1 (48 px, fw 700) | OneTrust |
| Globant | 1 | 6 | 2 | 1 = the contact-form heading | Usercentrics |
| EPAM | **0** | 0 | 1 | 1 (**18 px**, fw 300) | OneTrust/CookiePro |
| Slalom | **13** | 17 | 4 | **5** | OneTrust |
| IDEO | 1 | 0 | 1 | 1 (80 px, fw 300) | privacy-choices link |

⁴ `Organization, Organization, WebPage, WebSite, BreadcrumbList, Person ×3, Service ×8` — note the **duplicate `Organization`**, worth deduping (see §5, P0 #4). ⁵ Accenture's hero copy renders at 100 px in markup my visibility-filtered `<h1>` census did not classify as a heading; treat "0" as "no visible heading-tagged H1 detected", not as proof the tag is absent.

**Read:** three things stand out. Every one of the eight has a search affordance and a consent surface; Gileara has neither. Every one ships vendor-hosted analytics/martech (GTM, Adobe Launch, Adobe Helix RUM, Elastic APM, LinkedIn Insight, reCAPTCHA); Gileara ships none — which is why it has no cookie wall, and also why it has **no data on its own visitors**. And Gileara's structured data is already richer than six of the eight.

---

## 2. What they have that we do not

Ordered by how much it costs us commercially, not by how easy it is.

| # | They have | Who, evidenced | Gileara today | Cost of the gap |
|---|---|---|---|---|
| **G1** | **Named clients with a number attached** | EPAM: *"16x Greater Website Deployment Capacity for Bacardi"*, *"350M Players for Epic Games"*; Accenture: CBA 17M customers; Publicis Sapient: Nissan IT-cost cut; Deloitte Digital: Adobe, Salesforce, WNBA, Macy's logos; Slalom/Thoughtworks/IDEO: named case studies throughout | playbooks labelled `scenario` / `pilot`, goals-not-results framing, no named client anywhere | **Highest.** Every competitor answers "who else trusted you, and what happened?" in the first scroll. We ask the buyer to be first. |
| **G2** | **A named, repeatable method or product** | Thoughtworks *AI/works™* + the 3/3/3 way; EPAM *Strategy→Design→Engineer→Operate→Optimize* + *AI/Run.Transform™*; Globant *AI Pods* + Studios; Publicis Sapient *Slingshot / Bodhi / Sustain*; IDEO's design-thinking arc; Deloitte Digital's "47 studios" | five packages with published fees plus three custom services (**USD**: `$550`–`$2,725` setup, `$85`–`$215`/month, custom from `$2,185`–`$3,500`) but **no named method** the visitor can repeat to a colleague | High. Naming the journey makes a service feel engineered; it also gives us a word to own. |
| **G3** | **Vertical pages** | All eight: Deloitte Digital "every corner of the market", EPAM "11 industries", Slalom sector stories, Thoughtworks industry hubs, Accenture industry index | playbooks are cross-sector; no per-vertical page naming a real constraint (retail stock, agro-processing, health records, SACCO ledger) | High, and cheap to close — one tailored page per vertical. |
| **G4** | **Site search** | Accenture 5 affordances, Publicis 4, Slalom 4, Deloitte Digital 2, Globant 2, IDEO/Thoughtworks/EPAM 1 each | 0 | Medium. Relevant the moment insights + playbooks pass ~20 pages. |
| **G5** | **A proof hub people can browse** | Deloitte Digital *Our Work* grid, Thoughtworks case studies, Publicis "Demo Library", Slalom stories, EPAM Featured Stories | `/case-studies/*` now redirects to playbooks (correct call — fabricated stories removed) but nothing replaced it as a browsable proof surface | Medium-high. We removed the risk and the asset at the same time. |
| **G6** | **A recurring, dated, opinionated artefact** | Thoughtworks **Technology Radar Vol 34** (with a deliberate "Caution" ring); IDEO's annual design survey; EPAM's dated reports ("Data as of Q2 2026") | 7 insight posts, tag-filtered, undated as a series | Medium. This is the cheapest link-earning, authority-building asset in the list. |
| **G7** | **A quantified + dated trust strip** | EPAM "345+ Forbes Global 2000 clients, 62,850+ EPAMers (Q2 2026)"; Deloitte Digital "47 studios"; Accenture "360° value" | TrustStrip exists (F-numbered in the audit) but carries no verifiable counts | Medium. Numbers we can stand behind: sectors served, delivery windows, support hours, pilot count. |
| **G8** | **Consent + stated accessibility posture** | OneTrust on 6 of 8, Usercentrics on Globant; EPAM publishes a WCAG 2.1 AA **accessibility statement** with a contact address; Publicis and IDEO ship "your privacy choices" links | no analytics (so no consent needed) and **no `/accessibility` page** | Low effort, disproportionate signal. Procurement-minded buyers look for exactly this. |
| **G9** | **Branded typefaces** | IDEO *Fhoscar*, Slalom *Slalom Sans*, Accenture *Graphik* + *GT Sectra Fine*, EPAM *Museo Sans/Slab*, Thoughtworks *Bitter* + *Inter*, Globant *Heebo* | *Inter* + *IBM Plex Serif* + *JetBrains Mono* — the default stack of the internet, owned by nobody | Medium. Identity, not conversion. Fixable after G10 without adding weight. |
| **G10** | **Image discipline** | Slalom 90/97 lazy (measured) + 41 `srcset` refs (research); IDEO 52/55 lazy; Globant 92/103 lazy; Thoughtworks the counter-example (0/89 lazy, 0 `srcset`) | 7/9 lazy but **0 `srcset`**: one 203 KB JPEG and one 172 KB JPEG served identically to a phone on 3G and a desktop; the logo is a 131 KB PNG | Medium; bundle with G11 (same fix session). |
| **G11** | **Clean semantic plumbing** | Not actually — see §4. This row is ours to win. | 1 `<h1>` + 8 `<h2>` + 15 `<h3>`, 0 console errors | — |

### Our own two defects that none of them have

| # | Defect | Evidence | Impact |
|---|---|---|---|
| **D1** | **60% of the homepage is one icon-font file.** `src/app/globals.css:177` loads the **Material Symbols variable** WOFF2 for 17 glyphs — and it measures **1,112 KB of the 1,849 KB homepage**, the single heaviest asset on the site | Cold-load `PerformanceResourceTiming`, initiator `css`, 1,112 KB transfer / 1,111 KB decoded | Highest-value performance fix available: pinning the variable axes to static instances (or switching to the CSS-API subset) should cut ~1.05 MB, taking Gileara to roughly **800 KB — lighter than every one of the eight**, including IDEO. No competitor ships a 1 MB font. |
| **D2** | **The `<h1>` text stream reads "We build the systemsyour business runs on."** Two JSX lines separated by `<br />` with no whitespace separator (`src/components/Hero.tsx:127–132`), so the concatenated text node merges the words | Live production DOM `textContent` on gileara.org; visually correct because the `<br />` supplies the line break | Screen readers announce one non-word, and copied/extracted text (search snippets, social previews, LLM answers) inherits it. This is the single most important sentence on the site. |

D1 and D2 are both small, surgical changes — but they are also the only two places where we are clearly *worse* than the field, so they should not wait for the strategic work.

---

## 3. Dimension-by-dimension: what they do differently

### 3.1 Communication — one promise, repeated everywhere

The eight split into two register patterns:

| Site | Promise (verbatim) | Register |
|---|---|---|
| Accenture | *"Together We Reinvent"* (title: "Reinvented with Accenture"); desc: *"embraces the power of change to create 360° value"* | verb + abstract noun |
| Globant | title *"AI Powerhouse — Meet AI Pods by Globant Enterprise AI"*; desc *"drive AI business transformation"* | noun-phrase positioning |
| EPAM | `<h1>` *"Engineering the Future™"*; desc *"digital transformation through world-class engineering, design and consulting"* | trademarked noun phrase |
| IDEO | `<h1>` *"Human-centered"*; title *"IDEO : Human-centered design"* | two-word doctrine |
| Slalom | `<h1>` *"AI in motion"*, *"Meet your customers in the moments that matter."* | brand idea + outcome sentence |
| Publicis Sapient | `<h1>` *"We Build AI Solutions for the Enterprise"* | outcome sentence, buyer named |
| Thoughtworks | `<h1>` *"We don't just do AI. We do AI that works."* | contrarian claim |
| Deloitte Digital | *"DRIVEN TO MAKE IT REAL"* / *"We help our clients turn what could be, into what is"* | promise in non-heading markup |
| **Gileara** | `<h1>` *"We build the systems your business runs on."*; desc *"Gileara builds the operations, sales, customer, and reporting systems small businesses run on. Piloting in Ghana, built to scale worldwide."* | outcome sentence, buyer named |

**The honest finding: our core line is competitive.** It is an outcome sentence with the buyer category named and the object of the work specified ("systems", not "solutions" or "transformation") — the same register as Publicis Sapient's and Slalom's best lines, and *more concrete* than Accenture's, EPAM's, IDEO's or Globant's abstract nouns. What we do not do is **repeat it**. The leaders' promise appears in the `<h1>`, the title, the meta description, the JSON-LD, the section headers and the footer; ours drifts between "systems your business runs on", "outcomes over code", "how business actually runs" and the package language. Fix = pick the sentence and make every surface say it.

**What they communicate that we cannot yet:** numbers with names attached (§2 G1). EPAM's most persuasive block on the entire homepage is a stat wall where each figure carries a client name; Publicis, Slalom and Thoughtworks lead case studies with a measurable delta. Our `scenarios.ts` deliberately refuses fabricated results — that rule is right, and it leaves exactly one honest move: publish **labelled, dated, verifiable pilots** ("Pilot 01 — Accra retail, stock accuracy, started Q4 2026") rather than unverifiable percentages. That is the goal-not-result framing with a spine.

**Jargon check:** EPAM's register (*"AI/Run.Transform™"*, *"Project to Product"*, *"enterprise endurance"*) is a liability for Ghanaian SME buyers — a useful negative example. Slalom's *"Global scale, local soul"* is the enterprise-safe version of what we actually are; ours can be blunter because we are genuinely local.

### 3.2 Branding — one colour, one face, one repeated sentence

- **Colour:** every leader runs a light neutral canvas plus exactly one saturated signature colour, and their primary buttons are high-contrast blocks of it or of near-black: Accenture purple `rgb(166,0,255)`, Publicis red `rgb(233,1,48)`, Slalom navy `rgb(15,28,65)` (52 buttons) + blue `rgb(12,98,251)`, EPAM `rgb(35,31,32)` + cyan `rgb(118,205,216)`, Thoughtworks deep teal `rgb(22,60,77)`, IDEO acid lime `rgb(217,255,0)`, Globant lime `rgb(191,215,50)`. **Gileara: pale teal `rgb(94,234,212)` on Velocity Navy `rgb(8,20,32)`** — structurally identical to the leaders' pattern (one accent, dark canvas) and the only dark-default identity in the field (EPAM has a toggle; all others are light-only). That is a genuine differentiator to press, not a gap.
- **Type:** they own a face (§2 G9). We use a stack anyone can copy. Note the audit's finding that AGENTS.md advertises *Hanken Grotesk* and two Jakarta/Space Grotesk families while production renders **Inter, IBM Plex Serif, JetBrains Mono and Material Symbols** — a fourth family (IBM Plex Serif) that was never documented, i.e. existing docs drift (F14) with a branding consequence: the serif is doing editorial work in the hero ("runs on.") and nobody wrote down why.
- **Motion:** only Thoughtworks bets on canvas (5 `<canvas>` + 2 videos); Deloitte Digital runs 4 videos, EPAM 4, Globant 2, Publicis 1, Accenture 1. Gileara's signature WebGL scene measured **`canvas: 0` during a 4 s settled homepage load** — worth deciding deliberately: either the effect reliably appears for a normal visitor (in which case say so and prove it), or its lazy client-only cost is being paid for something most visitors never see.
- **Scale vs. locality:** their trust is scale (*62,850 EPAMers*, *47 studios*, *"Tens of thousands of professionals"*). We cannot and should not imitate that. Our equivalent asset is specificity: Ghanaian contexts, GMT/Africa hours, published prices buyers can self-qualify against, mobile-money realities — and Slalom already validated that "local soul" sells even at enterprise scale.

### 3.3 Design & UI implementation

Measured, same method on all nine:

- **Hero scale:** EPAM's 150 px stat numeral is the largest type in the field, then **Gileara 103 px**, Accenture ~100 px, Slalom 86 px, IDEO 80 px, Publicis 72 px, Deloitte Digital 56 px, Thoughtworks 48 px, Globant 48 px. Our hero is the **second-largest headline in the comparison set** — the audit's typographic scale work is holding up competitively.
- **Container discipline:** Gileara resolves to `max-width: 1440px` across 11 containers plus `672px` across 3 text containers. Compare: Thoughtworks 1624 + 1320 (two competing grids), EPAM 1152 + 1920 (both), Publicis 1536, IDEO 1600, Deloitte Digital 1400, Globant 1396, Slalom 1280. **Gileara has the cleanest single-container system of the nine.**
- **Heading semantics:** Gileara 1/8/15 (`h1`/`h2`/`h3`). Slalom ships **five** `<h1>`s on its homepage (a carousel), Deloitte Digital ships two — including a section label, "Client impact" — with the actual manifesto *outside* any heading tag, Globant's only visible `<h1>` is the contact form's heading, EPAM's `<h1>` is 18 px/weight 300, and Accenture's hero copy is not heading-tagged at all. **This is our clearest design-engineering win, and it exists only because D2 is a text-stream bug, not a structure bug** — fix D2 and we beat the entire field on semantics.
- **Section rhythm:** Slalom pads its first section 132 px; Deloitte Digital, Publicis, EPAM, Globant, Thoughtworks and Gileara all report `0px` because they pad with utility classes/children instead — so section padding is not comparable across stacks and should not be quoted as a difference.
- **Navigation weight:** EPAM's header alone holds **249 links**, Accenture's nav 131, Thoughtworks 109, Publicis 86, Slalom 69, Deloitte Digital 56. Gileara's is a fraction of that. Theirs buys discoverability at the cost of a mega-menu; ours buys speed and clarity. The missing piece is not a mega-menu — it is search (G4) and vertical landing pages (G3).
- **Forms:** our three-step ContactStepper with live calendar availability is *more* capable than what most of the eight expose on-site (they route to "Contact us" lead forms). Nothing to copy here; possibly something to advertise.

### 3.4 Development & performance

Beyond §1.1:

- **Stack fingerprints:** Adobe Experience Manager on Deloitte Digital, EPAM (and Accenture's AEM/Adobe Target/Demandbase stack), Drupal behind Globant, custom/Next-style on Thoughtworks, Next.js 16 App Router + React Server Components on Gileara, deployed to Cloudflare Workers via OpenNext. Our 18 KB HTML/104 KB decoded is the RSC advantage showing; their 232–444 KB documents are the AEM tax.
- **Console errors during a normal load:** Gileara **0**. Deloitte Digital **3** (`ReferenceError: $ is not defined`, `TypeError: dataLayer.push is not a function`, `Cannot read properties of undefined (reading 'options')`) — while running GTM *and* Adobe Launch. Globant 1 (`gtag is not defined`). Thoughtworks 1. This is the counterpart to their polish: the pages that look most "enterprise" are also the ones throwing runtime errors at visitors.
- **Structured data quality:** Gileara emits a single connected graph — `Organization`, `WebPage`, `WebSite`, `BreadcrumbList`, `Person ×3`, `Service ×8` — richer than EPAM (**0 blocks**), Deloitte Digital (**0**), Globant, Accenture and IDEO (1 each). Only Slalom (13) and Thoughtworks (4) ship more, and Accenture's single block has an **empty `logo`, `"telephone": "unavailable"` and a page title as the organization name** — machine-readable garbage. Our defect is milder: a duplicated `Organization` node. Dedupe it and we lead the field on schema *and* semantics.
- **Weight per image:** Gileara's homepage imagery is heavy for its count: 9 `<img>` tags, and the three biggest assets are 203 KB (`carousel-fashion-boutique.jpg`), 172 KB (`reality-msme.jpg`) and a 131 KB PNG logo — roughly 600 KB of the ~2 MB page is imagery, none of it `srcset`-aware or in a modern format. Their best-in-class lazy ratios (IDEO 95%, Slalom 93%, Globant 89%) don't fix their *totals* either — Publicis ships 162 images for 3.8 MB. Nobody in this field is a model on images; the win is available to whoever ships AVIF/WebP plus `sizes`/`srcset` first, and we're closest to it because our total is small.
- **Bot posture:** Globant and EPAM WAF-block non-browser clients. It costs them measurement, archival and AI-crawler visibility. We should stay readable by browsers *and* machines — our JSON-LD already assumes it.

### 3.5 Content engineering & SEO surface

- **hreflang/localisation:** Thoughtworks 20, Accenture 17, Slalom 17, Globant 6; Publicis Sapient 0, IDEO 0, Deloitte Digital 0, EPAM 0 — and Gileara 0. Deliberately monolingual for a single market is defensible and matches what several leaders do; **not** a gap to close now.
- **Insights shape:** the leaders' hub pattern is exactly what our `/insights` already is — named pillars, tag filters ("Apply"/"Clear Filters" on Deloitte Digital), card grid to detail page. Our *shape* is competitive; our *cadence* is not (7 posts vs Thoughtworks Radar Vol 34). The cheapest high-authority move in this whole document is a dated, repeatable artefact (G6) built from material only we can collect: what Ghanaian SMEs actually run on today.
- **Symptom-level pages:** the enterprise vocabulary ("digital product", "customer strategy") assumes a buyer who already has a transformation budget. Our buyers search for symptoms — *"stop losing stock records"*, *"invoice without Excel"*, *"customer follow-up WhatsApp"*. Eight sites, zero of them writing for that search. This is the same whitespace as §6, expressed as SEO.
- **Careers:** EPAM publishes dated workforce numbers, Deloitte Digital "47 studios"; our `/careers` publishes four honest Stage-1 roles with JobPosting JSON-LD. Do **not** imitate scale claims. Do publish the plan (it is unusual transparency and it reads as confidence).

### 3.6 Pricing transparency — the one place we are structurally ahead

None of the eight publishes service pricing on its homepage or in its navigation (as observed in this pass); every one routes to "Contact us" and qualifies you first. **Gileara publishes five packages with a setup fee and a monthly fee, plus three custom services with starting prices** — `Digital Foundation $550 setup + $85/month` through to `Business Intelligence $2,725 setup + $215/month`, rendered from `src/content/packages.ts` and formatted `en-US`. For an SME buyer that is the difference between a page they can act on and a page they close, and the recurring structure matches how the work is actually bought. Combined with "Piloting in Ghana" and published delivery windows, our positioning is *more* legible to our actual buyer than anything in this comparison set.

Two caveats worth fixing while we're ahead of the field. **First, the currency is not the buyer's:** every figure shows a `$` and is formatted with `toLocaleString("en-US")`, so a Ghanaian buyer has to do exchange-rate arithmetic to answer "can I afford this?" — and a USD list price ages badly against the cedi. A GHS reference line (with the rate and the date it was checked) removes that friction without abandoning a stable unit of account. **Second, protect the asset:** keep tiers comparable, keep the tier table honest, never let a redesign bury pricing behind a lead form, and never let the numbers drift out of date silently.

---

## 4. What we should not copy

1. **Enterprise jargon and trademark theatre** — `AI/Run.Transform™`, `EliteA™`, `CX+`, "enterprise endurance", "Project to Product". It prices us out of our own market.
2. **Multi-megabyte pages** — 4.9 MB (Thoughtworks), 4.3 MB (EPAM), 3.8 MB with 162 images (Publicis). Their brand absorbs the cost; ours cannot.
3. **Broken heading structure** — five `<h1>`s (Slalom), a section label as `<h1>` (Deloitte Digital), a form heading as the only `<h1>` (Globant), an 18 px `<h1>` (EPAM), an untagged hero (Accenture, Deloitte Digital).
4. **249-link mega-menus** (EPAM). Complexity is not credibility.
5. **Martech stacks and consent walls** — GTM + Adobe Launch + LinkedIn Insight + Helix RUM + reCAPTCHA on one page, with a cookie wall in front and three console errors behind it.
6. **Scale claims we cannot verify** (62,850 employees, 47 studios, "world-class", "profitable growth"). Unverifiable superlatives are the opposite of our goals-not-results rule.
7. **Analyst name-dropping as primary proof** — EPAM quoting Forrester works on enterprise procurement; for a Ghanaian SME, a named peer in the same sector works better.
8. **Hiding price.** They all do it. It is their weakness, not a convention we should adopt.

---

## 5. Prioritised gap register

Effort: **S** ≤ half a day, **M** ≤ 2 days, **L** multi-day. Nothing here starts without your approval.

### P0 — correctness and cost (do first, independent of strategy)

| # | Action | Why (evidence) | Effort |
|---|---|---|---|
| **1** | Pin the Material Symbols font to a static-axis subset (or move to the CSS-API subset) at `src/app/globals.css:177` | One file = **1,112 KB of 1,849 KB** (60%) of the homepage. Expected result ≈ 800 KB total — lightest of all nine. | S |
| **2** | Insert the missing whitespace in the hero `<h1>` (`src/components/Hero.tsx:127–132`) so the text stream reads "systems your business runs on" | Live on production; screen readers and search/AI extraction currently read "systemsyour". Zero visual change. | S |
| **3** | Add `srcset`/`sizes` + AVIF/WebP for the hero and story images; replace the 131 KB PNG logo with an SVG or an optimised WebP | 0 `srcset` on 9 images; a 203 KB carousel JPEG and a 172 KB story JPEG served identically to phone and desktop, plus a 131 KB PNG logo (F-series image findings). | M |
| **4** | Dedupe the duplicate `Organization` node in the homepage JSON-LD graph | Two `Organization` entities in one graph; every other entity is clean. | S |

### P1 — the strategic gaps that cost us deals

| # | Action | Why | Effort |
|---|---|---|---|
| **5** | Publish a **named method** ("Discover → Design → Deliver → Run", or your own) and repeat it verbatim in the hero subline, `/services`, `/how-we-transform` and the footer | Every leader has named IP (G2); we have packages but no repeatable word. | M |
| **6** | Replace the removed case-study surface with a **dated pilot ledger**: labelled `pilot` entries with sector, start date, scope, and status — numbers only where verifiable | G1/G5: nobody in the field asks the buyer to be first; the goals-not-results rule can coexist with dated proof. | M |
| **7** | Add **vertical pages** (retail, agro-processing, health, SACCO/finance, services) each naming one real constraint and linking one package | G3: all eight do verticals; ours are cross-sector today, and these pages are cheap and locally relevant. | M |
| **8** | Add **site search** over insights + playbooks + packages | G4: 8/8 competitors have one; we have zero affordances. | M |
| **9** | Add a numeric, dated **trust strip** (sectors, delivery window, support hours, pilots run, months operating) | G7: replaces borrowed-logo credibility with checkable specifics. | S |
| **10** | Add `/accessibility` (WCAG 2.1 AA commitment + contact) next to `/security`, and a short consent note ready for the day analytics arrive | G8: EPAM-style posture; procurement-grade signal at near-zero cost. | S |
| **11** | Fix the docs drift: AGENTS.md claims Hanken Grotesk + next-themes; production renders Inter/IBM Plex Serif/JetBrains Mono/Material Symbols | F14: our own docs describe a different website; it also hides why the serif exists. | S |
| **12** | Add a **GHS reference line to every price** (rate + date checked) beside the USD figures, and replace the hardcoded `toLocaleString("en-US")` with locale-aware currency formatting | §3.6: we are the only one of the nine that publishes prices at all, but the figures are in the buyer's non-native currency; completing the advantage means removing the exchange-rate friction. | S |

### P2 — compounding assets (after P0/P1)

| # | Action | Why | Effort |
|---|---|---|---|
| **13** | Ship a dated, repeatable artefact — e.g. an annual **"What Ghanaian SMEs run on"** survey/field report | G6: Thoughtworks Radar / IDEO survey pattern, built from data only we can collect locally. | L |
| **14** | Consider one distinctive display face (subset, variable) for the hero only | G9: Inter is unowned; a single carved-out face differentiates without re-weighting the page. Do this *after* #1, not before. | M |
| **15** | Decide the WebGL question with evidence: confirm the OrbitScene appears for a normal visitor, or remove the deferred cost | Measured `canvas: 0` on a settled 4 s production load; only Thoughtworks spends canvas in this field. | S |
| **16** | Rewrite insight titles as buyer symptoms and add internal links to packages | §3.5: the enterprise sites don't write for symptom search; this is uncontested. | M |

---

## 6. The angle none of them can take: Africa

Eight sites, eight global enterprise machines, **zero African**. Concretely, none of them offers, on its marketing site: pricing in the buyer's currency, Ghanaian imagery and context, GMT/Africa working hours, mobile-money-aware integration, Ghana Data Protection Act posture, or locally-based support.

Gileara already occupies that space with *"Piloting in Ghana, built to scale worldwide"* — the same shape as Slalom's "Global scale, local soul", but true in a way Slalom's cannot be. The competitive lesson from this comparison is not "become more like them". It is: **keep the local specificity, and bolt on the four mechanics that make their claims believable** — a named method, dated proof, vertical relevance, and a recurring artefact. Those four are transferable. Their scale, their jargon and their 4 MB pages are not.

**Blind spot to close next:** this comparison covers global consultancies only. The competitors a Ghanaian SME actually weighs us against are Accra-based software shops and freelancers — not yet measured, and worth a follow-up pass with the same method.

---

## 7. Evidence index

**Measurements (this pass, 2026-10-11):** `C:\Users\rodne\.playwright-mcp\ui-audit\` — scripts `comp-p1.js` (Deloitte Digital, Thoughtworks), `comp-p2.js` (Globant, EPAM), `comp-p3.js` (Slalom, IDEO, Gileara), plus the Accenture and Publicis Sapient runs, the in-place Thoughtworks DOM capture, and the Gileara per-asset breakdown.

**Hero screenshots (1440×900, viewport):** `comp-01-gileara-prod.jpg`, `comp-02-accenture.jpg`, `comp-03-publicis-sapient.jpg`, `comp-05-slalom.jpg`, `comp-06-ideo.jpg`, `comp-08-deloitte-digital.jpg` — same directory.

**Internal cross-references:** `docs/UI-AUDIT.md` (F1–F14; F1/F8 palette drift and dead utilities, F9 light theme, F13 hero text, F14 docs drift), `AGENTS.md`, `docs/IMAGERY.md`, `DESIGN.md`, `src/content/packages.ts`, `src/app/globals.css:177`, `src/components/Hero.tsx:127–132`.

**Competitor sources (copy quoted, structure observed, all fetched 2026-10-11):**

- Accenture — [accenture.com/us-en](https://www.accenture.com/us-en)
- Deloitte Digital — [home](https://www.deloittedigital.com/us/en.html), [work](https://www.deloittedigital.com/us/en/work.html), [insights](https://www.deloittedigital.com/us/en/insights.html), [alliances](https://www.deloittedigital.com/us/en/alliances.html), [about](https://www.deloittedigital.com/us/en/about.html), [industries](https://www.deloittedigital.com/us/en/industries.html), [digital product](https://www.deloittedigital.com/us/en/what-we-do/digital-product.html); parent [consulting](https://www.deloitte.com/us/en/services/consulting.html)
- Publicis Sapient — [publicissapient.com](https://www.publicissapient.com/)
- Thoughtworks — [thoughtworks.com](https://www.thoughtworks.com/), Technology Radar
- Globant — [globant.com](https://www.globant.com/) (WAF-blocked to plain fetches; copy via Wayback)
- EPAM — [home](https://www.epam.com/), [services](https://www.epam.com/services), [about](https://www.epam.com/about), [insights](https://www.epam.com/insights), [industries](https://www.epam.com/industries), [EPAM Continuum](https://www.epam.com/services/epam-continuum), [web accessibility statement](https://www.epam.com/web-accessibility-statement)
- Slalom — [slalom.com/us/en](https://www.slalom.com/us/en)
- IDEO — [ideo.com](https://www.ideo.com/)

**Claims vs. observations:** all byte counts, request counts, DCL timings, font/image/DOM censuses, JSON-LD types, hreflang counts, console errors, `srcset`/lazy counts and canvas counts are **observed**. Phrases quoted from competitor pages ("world-class", "47 studios", "AI in motion", "345+ Forbes Global 2000 clients", "16x … for Bacardi") are **vendor claims**, reproduced as data.

---

## 8. Recommended next step

I'd take **P0 #1–#4** in one short branch (one font URL, one JSX whitespace, image variants, one schema dedupe) because they are correctness/cost items with no strategic dependency, then bring you a proposal for **P1 #5–#7** (named method, pilot ledger, vertical pages) as the real competitive work. Nothing is touched until you say go.

---

## 9. Communication: what the eight teach us

Added after a follow-up question on messaging. This section expands §3.1 and reuses the same measured evidence.

### 9.1 One sentence, repeated everywhere

The leaders repeat a single promise across every surface a visitor meets: page title, meta description, `<h1>`, opening section, footer. IDEO shows the pattern most cleanly. Its title is "IDEO : Human-centered design", its `<h1>` is "Human-centered", and its description expands that phrase into one plain sentence about designing experiences and capabilities. The short form carries the identity and the long form does the explaining.

Few of them hold the line. Thoughtworks runs three messages: the title positions it as a leading technology consultancy, the description promises impact "today, tomorrow and beyond", and the `<h1>` says "We don't just do AI. We do AI that works." Deloitte Digital's title calls it a digital creative and marketing consultancy while the hero says "DRIVEN TO MAKE IT REAL" and the description reaches for "world-class customer experiences" and "profitable growth". Slalom spreads five `<h1>`s across a carousel, so the promise a visitor reads first depends on when they arrive. Globant's only visible `<h1>` is the contact form asking "Tell us how we can help you".

The bar is therefore low enough to clear with discipline alone. Our own sentence already appears in the title, the description and the `<h1>`, which puts us ahead of half the field on this measure. The work is to stop a second vocabulary creeping in. The site currently carries at least three phrasings of one idea ("the systems your business runs on", "outcomes over code", "how business actually runs"), and that is one more than a buyer will hold.

### 9.2 Promise shapes that survive a first read

Four shapes appear across the eight and all four work without enterprise vocabulary.

| Shape | Example from the field | Fit for our buyer |
|---|---|---|
| Buyer plus outcome | Publicis Sapient: "We Build AI Solutions for the Enterprise" | Already ours |
| Contrast pair | Thoughtworks: "We don't just do AI. We do AI that works." | Strong. Our market is full of half-finished systems |
| Transformation verb | Deloitte Digital: "turn what could be, into what is". Slalom: "Meet your customers in the moments that matter." | Fits a before-and-after promise |
| One doctrine word | IDEO: "Human-centered" | Needs a word we can own (operations, systems, run) |

The contrast pair deserves study because Thoughtworks uses it twice: in the `<h1>`, and in the Technology Radar's "Caution" ring, where the firm publishes what it advises against. That habit transfers to plain language. A short list of what we refuse to sell (templates, offshore hand-offs, year-long roadmaps, dashboards nobody opens) does the same work their trademark does, and it needs no ™.

### 9.3 Proof is part of the message

Every one of the eight spends its most persuasive block on evidence, and the shape follows the brand. EPAM runs a stat wall where each figure carries a client name. Accenture leads with outcomes rather than capabilities. Deloitte Digital borrows credibility from alliance logos. Thoughtworks publishes a point of view and lets the Radar stand as the proof of expertise.

Our homepage already follows the same arc the leaders use, which AGENTS.md records as Promise → Proof → Objection → Ask. Proof is the empty position in it. Closing that is a writing task before it is a design task: named pilots with dates, testimonials that carry a name and a role, and figures we can stand behind such as delivery window, support hours, sectors served and months operating. Items 6 and 9 in §5 are the same gap.

### 9.4 Write like a firm, not an institution

Thoughtworks, IDEO and Slalom read as firms with a point of view. Accenture's "embraces the power of change to create 360° value" and EPAM's "Engineering the Future™" read as institutions: the subject disappears, and with it the claim. SME buyers buy from firms they can picture. Our copy is already first person and concrete, and the FAQ and playbooks are where it should carry opinions, including the awkward one ("at your size you do not need this yet").

### 9.5 Their writing failures are our openings

Four habits recur across the eight, and each hands us a contrast.

- Nominalisation: "customer-led digital innovation", "end-to-end business transformations". Nothing happens in those phrases.
- Unverifiable superlatives: "world-class", "drives profitable growth".
- Impersonal constructions where a person should be: EPAM's "we bend the mold" and "Born in product and raised in digital" describe nobody in particular.
- Scale as the only proof: 62,850 employees, 47 studios, "tens of thousands of professionals". None of it answers whether the work succeeds in a shop in Kumasi.

### 9.6 What we can say that none of them can

Four claims, all of them already true of the site:

- "We publish our prices." None of the eight does; every one routes to a contact form.
- "We are piloting in Ghana now." None of the eight is African.
- "Built for a business with a handful of staff, not a procurement committee." Their copy assumes an enterprise buyer throughout.
- "We will tell you when you do not need us yet." The playbooks already carry `scenario` and `pilot` labels with goals-not-results framing; the FAQ is the natural home for the refusals.

### 9.7 Communication surfaces we are missing

- Site search. All eight have one, between one and five affordances each; we have none. Retrieval matters as soon as the library passes twenty pages.
- A proof hub. Playbooks replaced `/case-studies`, and nothing browsable replaced the playbooks' proof role.
- A recurring, dated artefact. The Radar and IDEO's annual survey are how a firm keeps talking between visits.
- A plain privacy line. We ship no trackers, which is worth one sentence: no analytics, no tracking, no cookie wall. It is also the honest version of the consent notice the others are legally obliged to display.
