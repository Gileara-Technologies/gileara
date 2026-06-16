# Pull Request — UI Improvements & Legal Pages

**Branch:** `feature/ui-improvements` → `dev`

---

## Summary

This PR delivers full legal documentation pages (Privacy, Terms, Security), reorganizes public assets, introduces new global UI components (loading, 404, back-to-top, legal navigation), and polishes the careers portal application form.

---

## Commits

### `31792fa` — Provided detailed legal documentation and improved UI

- **Legal pages:** Expanded `Privacy Policy` (`src/app/privacy/page.tsx`, +376 lines) and `Terms of Service` (`src/app/terms/page.tsx`, +314 lines) with thorough legal content; added dedicated `Security` page
- **New components:** `LegalNavbar`, `BackToTop`, `GlobalLoading`, `NotFound`
- **Global layout:** Added `loading.tsx`, `not-found.tsx`; updated `layout.tsx` and `globals.css` (+151 lines)
- **UI polish:** Refined `Hero`, `Footer`, `Founders`, `BentoGrid`, `Navbar`, `CollaborationFooter`
- **Asset reorganization:** Moved brand images to `public/assets/gileara/`, founder photos to `public/assets/workforce/`; removed stale `dist/` directory and old root-level public assets
- **Housekeeping:** Updated `favicon.svg`, `site.webmanifest`, `.gitignore`, `CHANGELOG.md`

### `4cf2d60` — Small tweaks to career page

- Refactored `ApplicationForm.tsx` — improved layout logic, better form field styling (+68 / −26)

---

## Files Changed

| Files | Change |
|---|---|
| `src/app/privacy/page.tsx` | +376 lines — full privacy policy |
| `src/app/terms/page.tsx` | +314 lines — full terms of service |
| `src/app/security/page.tsx` | +4 lines — security page |
| `src/components/legal/LegalNavbar.tsx` | +182 lines — new shared legal nav |
| `src/components/NotFound.tsx` | +147 lines — new 404 component |
| `src/components/GlobalLoading.tsx` | +85 lines — new loading component |
| `src/components/BackToTop.tsx` | +40 lines — new scroll-to-top |
| `src/app/globals.css` | +151 lines — global design tokens |
| `src/app/layout.tsx` | updated — integrated new components |
| `src/app/loading.tsx`, `not-found.tsx` | new global states |
| `src/app/careers/page.tsx` | updated — career layout |
| `src/components/careers/ApplicationForm.tsx` | refactored (+68 / −26) |
| `public/` | assets reorganized under `gileara/` & `workforce/` |
| `dist/` | removed — stale build output |
| `.gitignore`, `CHANGELOG.md`, `favicon.svg`, `site.webmanifest` | housekeeping |

---

## Checklist

- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] Legal copy reviewed
- [ ] Responsive layouts verified
