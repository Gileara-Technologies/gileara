# Imagery — sources, licensing, slots

The site uses **real photography from Pexels** on the homepage hero
sections, plus the founders' own portrait photos on `/about`. All Pexels
photos are licensed under the [Pexels License](https://www.pexels.com/license/)
— free for commercial use, no attribution required (we attribute anyway
for provenance).

The site renders **gradient placeholders** wherever photography is optional
in scenarios/posts. Every slot is wired: drop a file at the documented path,
add the path to one content module, and the photo appears — no component
changes.

## The rule (D15)

Photography must show **real Ghanaian or African business / startup
contexts** — actual MSME owners, founders at work, teams building
together. Subject demographics should match the audience: Black or
light-skinned African founders and operators. Never Western stock,
never AI-generated imagery. A missing photo (gradient) is always
better than a fake one; this is the same honesty standard as the rest
of the site.

## Active homepage imagery (Phase 5b)

| Slot | File | Source | License | Description |
|---|---|---|---|---|
| Hero portrait | `public/assets/imagery/hero-business.jpg` | [Pexels 13801809](https://www.pexels.com/photo/man-in-business-attire-leaning-on-a-wall-and-holding-a-smart-phone-13801809/) — Anna Shvets | Pexels License | Confident Black business person holding a smartphone — the MSME owner who would benefit from our systems |
| The Reality | `public/assets/imagery/reality-msme.jpg` | [Pexels 8475171](https://www.pexels.com/photo/a-man-in-white-sweater-and-brown-apron-holding-a-signage-8475171/) — fauxels | Pexels License | Small Ghanaian business owner with his shop signage — grounds the "manual work" pain in a real MSME context |
| How We Work | `public/assets/imagery/howwework-team.jpg` | [Pexels 8463151](https://www.pexels.com/photo/colleagues-in-an-office-8463151/) — fauxels | Pexels License | Diverse colleagues collaborating in an office — represents the Gileara team partnership |
| Why Gileara | `public/assets/imagery/whyghana-collaboration.jpg` | [Pexels 36765665](https://www.pexels.com/photo/young-women-collaborating-in-stylish-office-36765665/) — Mikhail Volkov | Pexels License | Young women collaborating in a stylish office — represents the outcomes of well-built systems |
| Founding Clients | `public/assets/imagery/founding-founders.jpg` | [Pexels 36729740](https://www.pexels.com/photo/young-cafe-owners-smiling-in-apron-attire-36729740/) — Ketut Subiyanto | Pexels License | Young cafe founders smiling in aprons — the perfect "founding clients" archetype |
| Contact CTA | `public/assets/imagery/cta-business.jpg` | [Pexels 8052215](https://www.pexels.com/photo/woman-in-black-blazer-holding-a-phone-and-tumbler-8052215/) — Christina Morillo | Pexels License | Professional Black business woman with phone — the "you" we're inviting to book a call |

All photos are downloaded to `public/assets/imagery/` and rendered with
`next/image` using `fill` + `sizes`. Files are 170-430 KB each (exported at
`?auto=compress&cs=tinysrgb&w=1600` from Pexels's API).

## Service-page imagery (Phase 6)

Each `/services/[slug]` landing page uses one hero photo + 3 solution
photos (downloaded under `public/assets/services/`).

| Service | Hero | Solution 1 | Solution 2 | Solution 3 |
|---|---|---|---|---|
| Digital Foundation | [13801809](https://www.pexels.com/photo/13801809/) | [4884110](https://www.pexels.com/photo/4884110/) | [256502](https://www.pexels.com/photo/256502/) | [16129877](https://www.pexels.com/photo/16129877/) |
| Business Operations | [806835](https://www.pexels.com/photo/806835/) | [326514](https://www.pexels.com/photo/326514/) | [6893890](https://www.pexels.com/photo/6893890/) | [13540544](https://www.pexels.com/photo/13540544/) |
| Customer Growth | [36765665](https://www.pexels.com/photo/36765665/) | [36729740](https://www.pexels.com/photo/36729740/) | [8052215](https://www.pexels.com/photo/8052215/) | [34735506](https://www.pexels.com/photo/34735506/) |
| Business Intelligence | [5922401](https://www.pexels.com/photo/5922401/) | [6248959](https://www.pexels.com/photo/6248959/) | [7567595](https://www.pexels.com/photo/7567595/) | [37685036](https://www.pexels.com/photo/37685036/) |
| Automation & Efficiency | [13801809](https://www.pexels.com/photo/13801809/) | [6282022](https://www.pexels.com/photo/6282022/) | [4884110](https://www.pexels.com/photo/4884110/) | [256502](https://www.pexels.com/photo/256502/) |

Files: 50-500 KB each, 1600px wide, exported via Pexels's
`?auto=compress&cs=tinysrgb&w=1600` API. Same demographically-accurate
standard: Black or light-skinned African founders, operators, and teams
in real business contexts.

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

1. Source a real Ghanaian/African business photo (Pexels, commissioned
   photographer, founder-supplied). Verify the licence permits commercial
   use. The Pexels License is the safest for free stock.
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
- Keep files under ~300 KB for content slots, ~500 KB for hero-sized photos
  (export at `?auto=compress&cs=tinysrgb&w=1600`). Photos of people must
  have documented consent before publishing.
- Alt text: homepage hero photos get descriptive alt text (they communicate
  mood); scenario/post slot photos stay decorative (alt="") because the
  heading carries meaning. If a future photo is informational, describe it
  in the module and pass real alt text.
- Homepage photos use a subtle dark gradient overlay at the bottom so they
  integrate with the dark Velocity Dark theme without overpowering the
  bright text.
- The "04" giant background numeral in the Why Gileara section is hidden
  on mobile (`hidden lg:block`) because `text-[28rem]` (448px) overflows
  the viewport on phones. It re-appears on desktop where there's space.
