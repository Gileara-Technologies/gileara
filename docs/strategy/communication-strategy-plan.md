# Implementation Plan — Communication Strategy for Gileara Technologies

## Status
Plan mode. Awaiting user approval before execution.

## Source: Relevant Vault Content (NonCompany excluded)
- `Company/gileara-company-profile.md` — canonical company identity (mission, ICP, packages, brand, guardrails)
- `BusinessDevelopment/service-catalogue.md` — 5 packages (Digital Foundation, Business Operations [anchor], Customer Growth, BI, Automation), pricing, delivery timelines
- `CTO/Architecture/tech-wing-positioning.md` — consultancy positioning (not software vendor), three-pillar operating model, emerging-market ready default
- `CTO/Architecture/tech-wing-consolidated-strategy.md` — full strategic context, economic engine (recurring revenue $85→$1,360/mo)
- `CTO/Architecture/web-ui-upgrade-plan.md` — site repositioning from "software agency" to "digital transformation consultancy for MSMEs in emerging markets, piloting in Ghana", content model, design tokens (Gileara Velocity: deep navy + luminous teal/cyan, IBM Plex Sans / Hanken Grotesk / Inter / JetBrains Mono)
- `CTO/Architecture/gileara-visual-system.md` — premium editorial consultancy aesthetic (Andela reference), typography IS design, numbered pillars, motion choreography, component library mapped to vault knowledge
- `CTO/Architecture/technology-readiness-roadmap.md` — readiness gates, GBP architecture
- `Company/README.md` — brand & positioning reference hub

Excluded: `NonCompany/` folder entirely.

## Destination State
A new `Strategy/communication-strategy.md` (kebab-case per vault naming convention) that synthesizes all of the above into a coherent communication framework covering:

1. **Core Narrative & Positioning** — restating "digital transformation consultancy" (not software agency), the anchor message: "We build the systems your business runs on — designed for emerging markets, starting in Ghana", and "The technology partner helping MSMEs in emerging markets become efficient, digital, and scalable businesses — headquartered in Ghana."
2. **Messaging Framework** — pillar-level messaging aligned to the 3 operating pillars (Digital Operations Platform / Automation & Integration / Managed Services & DevOps) and the 5 package storylines, with outcome-focused language (not feature/code-focused).
3. **Brand Voice & Tone** — derived from visual system (premium editorial consultancy, Andela aesthetic, clean/systematic/high-trust/data-driven), typography-as-voice rules, and Ghana-market fluency (WhatsApp, MTN MoMo, offline-tolerant, low-bandwidth).
4. **Audience Messaging** — by MSME vertical (retail, pharmacy, restaurant, salon/barber, school, distributor, mechanics/electrical) and customer-journey stage ($550 starter → $16k+ enterprise client, recurring at every stage).
5. **Channel & Content Strategy** — site structure (`gileara.org`), package pages (/services), insights/blog (`gileara.org/insights`), booking flow (`/contact`), case studies reframed as "How We Transform" labeled scenarios (honest, not fabricated), footer, social-proof strip.
6. **Message Integrity & Guardrails** — honesty rules tied to readiness gates (D5: phased-honest launch; no fabricated metrics; managed services embedded; no hidden costs; pricing transparent in USD), exclusion of non-company content, alignment with "What Gileara Is NOT" guardrails.
7. **Visual & Verbal Alignment** — linking message to design tokens (`surface`/#F7F7F3, `surface-dark`/#101010, `ink`/#111, `accent`/`#00BFA5` Gileara teal), component-level mapping (CapabilityPanel → packages, CaseStudyCard → transformation pathway, MetricBlock → MRR, MagneticButton → "Book a Free Consultation").

No file edits will modify existing company or strategy docs unless specifically requested. Only new file creation: `Strategy/communication-strategy.md`.

## Risk Assessment
- **Missing skill?** None — this is strategic synthesis, not code. `docs-architect` and `clean-code` skills not required for a markdown strategy doc.
- **Unknown procedure?** Naming convention (`.agents/skills/vault-naming-convention/SKILL.md`) requires kebab-case filenames — will enforce.
- **Scope creep risk?** The user asked specifically for a communication strategy from relevant company/brand content. Will stay within Strategy/ folder and cite sources; will not expand into product specs or engineering architecture.

## Validation
After creation: read back file, verify it links to canonical sources (`gileara-company-profile.md`, `service-catalogue.md`, `tech-wing-positioning.md`, `gileara-visual-system.md`, `web-ui-upgrade-plan.md`), verify no NonCompany content referenced, verify naming convention compliance.

## Connections
- [[communication-strategy|Communication Strategy]] — the resulting deliverable
- [[Company/gileara-company-profile|Gileara Profile]] — canonical source
- [[service-catalogue|Service Catalogue]] — offering source
- [[BusinessDevelopment/README|Business Development Hub]] — parent area
