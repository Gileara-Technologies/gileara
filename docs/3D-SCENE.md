# Homepage 3D scene

The homepage runs on one persistent WebGL scene, in the style of
[igloo.inc](https://www.igloo.inc/): a fixed full-viewport canvas behind
the page, a camera that travels through 3D set pieces as you scroll, and
the real HTML content on top. Built with `three`, `@react-three/fiber`,
and a little of `@react-three/drei`. No models, textures, or HDR files
are downloaded; everything is generated from primitives in code.

## Files

| File | Role |
|---|---|
| `src/components/scene/HomeScene.tsx` | Gate. Picks the quality tier, lazy-loads the canvas, toggles `html.scene-active` once the first frame is ready, falls back to the plain page on any WebGL error or lost context. |
| `src/components/scene/SceneCanvas.tsx` | The canvas: camera rig, fog, lights, particles, station culling, adaptive resolution. |
| `src/components/scene/pieces.tsx` | One procedural set piece per homepage section (`SET_PIECES`, in section order). |
| `src/components/scene/materials.tsx` | Glass and glow materials, per tier. |
| `src/components/scene/ProceduralEnvironment.tsx` | Reflections baked once from glowing panels (replaces drei `<Environment>`, which bundles HDR/EXR loaders). |
| `src/hooks/useSceneQuality.ts` | Feeds real browser signals into the tier rule; updates live. |
| `src/lib/scene/quality.ts` | Pure tier rule. Tested. |
| `src/lib/scene/stations.ts` | Pure scroll-to-camera mapping. Tested. |
| `src/lib/scene/geometry.ts` | Seeded random and point layouts. Tested. |
| `src/app/globals.css` | `.scene-stage`, `html.scene-active` scrims, `[data-scene-hide]`, film grain. |

## How scroll drives the camera

Each direct child of `<main data-scene-root>` is a **station**. The
canvas measures every section's document position (and re-measures on
resize or layout change), works out which section the reader is in and
how far through it (`computeStationProgress`), and eases the camera
toward that point down the corridor. Real section boundaries, not a flat
scroll percentage, so a long section like Pricing gets a long, slow
stretch of travel and each set piece is on screen while its section is.

**Keep `SET_PIECES` aligned with the sections in `src/app/page.tsx`.**
Adding, removing, or reordering a homepage section shifts every station
after it.

| # | Section | Piece |
|---|---|---|
| 0 | Hero | Core: glass crystal with a glowing heart (replaces the dashboard mock while the scene runs) |
| 1 | IndustryStrip | Orbit: six shards on a ring |
| 2 | InstagramFeed | Tiles: 3x3 floating glass panes |
| 3 | CinematicStory | Scatter: tumbling, disordered shards |
| 4 | Pricing | Monoliths: five glass pillars |
| 5 | Approach | Gates: rings the camera flies through |
| 6 | AuditSection | Scan: cube on a grid with a sweeping scan plane |
| 7 | Positioning | Globe: wireframe globe with Accra lit |
| 8 | FoundingClient | Assemble: section 3's shards pulled into order |
| 9 | ContactBand | Beacon: the crystal again, with a light beam |

## Mobile and accessibility

`decideSceneQuality` (src/lib/scene/quality.ts):

- **off**: reduced motion, Save-Data, no WebGL, under 2 GB memory, or 2
  or fewer CPU cores. No canvas, no Three.js download. The page renders
  exactly as it did before the scene existed.
- **low**: touch devices, viewports under 768px, or under 4 GB memory.
  Cheaper glass (no transmission pass), 450 particles instead of 1,400,
  pixel ratio capped at 1.25, no antialiasing, no pointer parallax. Phones
  get a heavier, even scrim since text spans the full width.
- **high**: everything else. Real refracting glass, pixel ratio up to
  1.75, pointer parallax.

On every tier `PerformanceMonitor` drops the pixel ratio to 1 if frame
rate falls. Only the set pieces within about two stations of the camera
are drawn. Section text stays real HTML, so screen readers, search, and
text selection are unaffected; the canvas is `aria-hidden`.

## Cost and verification (2026-11-18)

- Scene chunk: about 240 KB gzipped (899 KB raw), loaded lazily, only on
  `low`/`high`. Visitors on `off` download about 125 KB of JS for the
  page; with the scene about 1 MB raw.
- Checked against `next start` (production build) with Playwright:
  desktop 1440x900 and touch-emulated 390x844 both mount one canvas,
  set `scene-active`, show zero console errors through a full-page
  scroll, and held 61 fps on an Intel Iris Xe (hardware ANGLE). A
  reduced-motion context mounts no canvas. Pixel sampling at each of
  the 10 sections confirmed lit geometry on the right half of the
  viewport at every station.
- Not yet measured: frame rate on real phones. The touch run used the
  laptop's GPU, so it proves the low tier renders correctly, not how
  fast it runs on a mid-range Android. Worth a check on a real device.
