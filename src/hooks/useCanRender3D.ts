"use client";

import { useSyncExternalStore } from "react";

/**
 * Gate for mounting any WebGL/Three.js visual on the site: true only
 * when the visitor has a fine pointer (desktop/laptop, not touch) AND
 * hasn't asked for reduced motion. Touch devices (phones, tablets, and
 * most "coarse pointer" hybrids) and reduced-motion users get the
 * existing flat CSS background instead.
 *
 * This is the entire mobile-optimization strategy for 3D on this site:
 * mobile visitors never fetch the Three.js bundle at all (every 3D
 * component using this hook is also behind a `next/dynamic(..., { ssr:
 * false })` import, so the gate decides whether the chunk is even
 * requested, not just whether it's shown) -- cheap, not a degraded
 * version of the same thing.
 *
 * Implemented with `useSyncExternalStore` rather than a `useState` +
 * `useEffect` pair: this project's lint config flags a synchronous
 * `setState` call inside an effect, and subscribing to the two
 * `matchMedia` queries this way is also strictly better behavior --
 * the gate updates live if a visitor changes their OS motion setting
 * or switches input device while the page is open, not just once on
 * mount. `getServerSnapshot` returns `false`, the safe default for SSR
 * and for the brief pre-hydration window on the client.
 */
function subscribe(onChange: () => void): () => void {
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
  reducedMotionQuery.addEventListener("change", onChange);
  coarsePointerQuery.addEventListener("change", onChange);
  return () => {
    reducedMotionQuery.removeEventListener("change", onChange);
    coarsePointerQuery.removeEventListener("change", onChange);
  };
}

function getSnapshot(): boolean {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  return !reducedMotion && !coarsePointer;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useCanRender3D(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
