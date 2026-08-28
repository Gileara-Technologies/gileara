# Imagery — sources, licensing, slots

The site uses **real photography from Unsplash** on the homepage hero
sections, plus the founders' own portrait photos on `/about`. All Unsplash
photos are licensed under the [Unsplash License](https://unsplash.com/license)
— free for commercial use, no attribution required (we attribute anyway for
provenance).

The site renders **gradient placeholders** wherever photography is optional
in scenarios/posts. Every slot is wired: drop a file at the documented path,
add the path to one content module, and the photo appears — no component
changes.

## The rule (D15)

Photography must show **real Ghanaian or African business contexts** — actual
markets, shops, schools, pharmacies, founders' own work. Never Western stock,
never AI-generated imagery. A missing photo (gradient) is always better than
a fake one; this is the same honesty standard as the rest of the site.

## Active homepage imagery (Phase 5)

| Slot | File | Source | License | Description |
|---|---|---|---|---|
| Hero portrait | `public/assets/imagery/hero-leader.jpg` | [Unsplash — man in black suit holding black smartphone](https://unsplash.com/photos/man-in-black-suit-holding-black-smartphone) | Unsplash License | Confident African business leader with smartphone — sets the "professional tech" tone for the hero |
| The Reality | `public/assets/imagery/reality-msme.jpg` | [Unsplash — Woman selling a pyramid of eggs on a stool](https://unsplash.com/s/photos/ghana-business) | Unsplash License | Ghanaian micro/small business owner working at her station — grounds the "manual work" pain in a real MSME scene |
| How We Work | `public/assets/imagery/howwework-team.jpg` | [Unsplash+ — Diverse African businesspeople in a meeting](https://unsplash.com/s/photos/african-team-office) | Unsplash+ License | Diverse African business team meeting over coffee — represents the "Diagnose / Design / Deploy / Manage" collaboration |
| Why Gileara | `public/assets/imagery/whyghana-data.jpg` | [Unsplash+ — Young economist typing on laptop](https://unsplash.com/s/photos/african-team-office) | Unsplash+ License | African professional analyzing data on a laptop — represents the tech/outcome-led promise |
| Founding Clients | `public/assets/imagery/founding-accra.jpg` | [Unsplash — Ghana's independence square with flags](https://unsplash.com/s/photos/ghana-business) | Unsplash License | Ghana's independence square in Accra — grounds the "we work in Ghana" promise in a real place |
| Contact CTA | `public/assets/imagery/cta-craft.jpg` | [Unsplash — A man sews at his work station](https://unsplash.com/s/photos/ghana-business) | Unsplash License | Ghanaian craftsperson at his work station — represents the local MSMEs we build for |

All photos are downloaded to `public/assets/imagery/` and rendered with
`next/image` using `fill` + `sizes`. Files are 200-700 KB each (exported at
quality ≈80 from Unsplash's API).

## Founders' portraits (pre-existing)

| File | Source | Notes |
|---|---|---|
| `public/assets/images/amos.jpg` | Founders' own | Used in `/about` and homepage |
| `public/assets/images/julian_hagan.jpg` | Founders' own | Used in `/about` and homepage |
| `public/assets/images/rodney_hagan.jpg` | Founders' own | Used in `/about` and homepage |

## Optional content-module slots (gradient fallback by default)

| Slot | Content module field | Drop files under | Suggested size |
|---|---|---|---|
| Playbook card banner (`/how-we-transform`) | `scenarios.ts` → `image` on each scenario | `public/assets/gileara/photos/<scenario-id>.jpg` | 1200×800 (3:2) |
| Insight card + featured hero (`/insights`) | `posts.ts` → `image` on each post | `public/assets/gileara/photos/<post-slug>.jpg` | 1600×1000 (16:10) |

## How to wire a new content-module slot

1. Source a real Ghanaian/African business photo (Unsplash, commissioned
   photographer, founder-supplied). Verify the licence permits commercial
   use.
2. Optimize and drop the JPG/WebP in `public/assets/gileara/photos/`.
3. Set the field in the content module:

```ts
// scenarios.ts
{ id: "pharmacy", ..., image: "/assets/gileara/photos/pharmacy.jpg" }
```

4. Update this file's "Active homepage imagery" table or "Optional slots"
   table — whichever applies.
5. Cards without an `image` value keep their gradient automatically.

## Notes

- All images render through `next/image` with `fill` + `sizes`, so the browser
  gets responsive srcsets automatically. Local files only — no remote hosts
  (downloaded once and committed).
- Keep files under ~300 KB for content slots, ~700 KB for hero-sized photos
  (export at quality ≈80). Photos of people must have documented consent
  before publishing.
- Alt text: homepage hero photos get descriptive alt text (they communicate
  mood); scenario/post slot photos stay decorative (alt="") because the
  heading carries meaning. If a future photo is informational, describe it
  in the module and pass real alt text.
- Homepage photos use a subtle dark gradient overlay at the bottom so they
  integrate with the dark Velocity Dark theme without overpowering the
  bright text.
