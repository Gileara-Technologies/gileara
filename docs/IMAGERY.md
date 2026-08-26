# Imagery slots — how to add real photography

The site renders **gradient placeholders** wherever photography is optional. Every
slot is wired: drop a file at the documented path, add the path to one content
module, and the photo appears — no component changes.

## The rule (D15)

Photography must show **real Ghanaian business contexts** — actual markets,
shops, schools, pharmacies, founders' own work. Never Western stock, never
AI-generated imagery. A missing photo (gradient) is always better than a fake
one; this is the same honesty standard as the rest of the site.

## Slots

| Slot | Content module field | Drop files under | Suggested size |
|---|---|---|---|
| Playbook card banner (`/how-we-transform`) | `scenarios.ts` → `image` on each scenario | `public/assets/gileara/photos/<scenario-id>.jpg` | 1200×800 (3:2) |
| Insight card + featured hero (`/insights`) | `posts.ts` → `image` on each post | `public/assets/gileara/photos/<post-slug>.jpg` | 1600×1000 (16:10) |

## How to wire one

1. Put the optimized JPG/WebP in `public/assets/gileara/photos/`.
2. Set the field in the content module:

```ts
// scenarios.ts
{ id: "pharmacy", ..., image: "/assets/gileara/photos/pharmacy.jpg" }
```

3. Done. Cards without an `image` value keep their gradient automatically.

## Notes

- All images render through `next/image` with `fill` + `sizes`, so the browser
  gets responsive srcsets automatically. Local files only — no remote hosts.
- Keep files under ~300 KB (export at quality ≈80). Photos of people should
  have consent documented before publishing.
- Alt text stays empty on these slots because they are decorative context
  banners; headings carry meaning. If a future photo is informational,
  describe it in the module and pass real alt text.
