/**
 * Maps page scroll to a position in the 3D scene. Pure, unit-tested in
 * tests/lib/scene/stations.test.ts.
 *
 * Each homepage <section> is a "station". The scene camera travels down
 * the -Z axis, one station every `STATION_SPACING` units, and the
 * fractional station index tells it where it is between two of them.
 * Using real section boundaries (not a flat scroll percentage) means a
 * long section like Pricing gets a long, slow stretch of travel and a
 * short strip gets a short one, so the 3D always lines up with the
 * content on screen.
 */

/** Distance in scene units between two consecutive stations. */
export const STATION_SPACING = 14;

/** Z position of station `index`. */
export function stationZ(index: number): number {
  return -index * STATION_SPACING;
}

/**
 * The document Y position used as the "reading line": where on the page
 * a section must be for its station to be considered reached. Starts at
 * the very top of the viewport (so the first frame shows station 0
 * exactly) and eases down to 40% of the viewport over the first screen
 * of scrolling, so later sections become active as they reach the
 * upper part of the screen rather than only when they hit the top edge.
 * That matters at the end of the page, where the last section may never
 * reach the top edge before scrolling runs out.
 */
export function readingLine(scrollY: number, viewportHeight: number): number {
  if (viewportHeight <= 0) return Math.max(0, scrollY);
  const ease = Math.min(1, Math.max(0, scrollY / viewportHeight));
  return Math.max(0, scrollY) + viewportHeight * 0.4 * ease;
}

/**
 * Fractional station index for a reading-line position.
 *
 * @param tops  document-Y top of each section, ascending
 * @param end   document-Y bottom of the last section
 * @param y     the reading line (see `readingLine`)
 * @returns     0 at the first section's top, `i + t` partway through
 *              section `i`, clamped to [0, tops.length - 1]
 */
export function computeStationProgress(tops: readonly number[], end: number, y: number): number {
  const count = tops.length;
  if (count === 0) return 0;
  if (y <= tops[0]) return 0;
  for (let i = 0; i < count; i += 1) {
    const start = tops[i];
    const stop = i + 1 < count ? tops[i + 1] : end;
    if (y < stop) {
      const span = stop - start;
      const t = span > 0 ? (y - start) / span : 0;
      return Math.min(count - 1, i + t);
    }
  }
  return count - 1;
}
