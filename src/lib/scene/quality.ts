/**
 * Decides how much 3D the homepage gets on this device. Pure (no DOM),
 * so the rule is unit-tested in tests/lib/scene/quality.test.ts and the
 * hook that feeds it real browser signals (src/hooks/useSceneQuality.ts)
 * stays thin.
 *
 *  - "off":  no WebGL at all. The page renders exactly as it does
 *            without the scene: opaque section backgrounds, no canvas,
 *            no Three.js chunk downloaded. Chosen for reduced motion,
 *            Save-Data, no WebGL support, or clearly weak hardware.
 *  - "low":  phones, tablets, narrow windows, mid-range memory. Same
 *            scene with cheaper materials (no glass transmission pass),
 *            fewer particles, capped pixel ratio, no antialiasing.
 *  - "high": desktop/laptop with a fine pointer. Real glass
 *            (transmission + refraction), denser particles, pointer
 *            parallax.
 */

export type SceneQuality = "high" | "low" | "off";

export interface SceneQualityInputs {
  reducedMotion: boolean;
  /** `navigator.connection.saveData` -- the visitor asked for less data. */
  saveData: boolean;
  /** A WebGL context could be created at all. */
  webgl: boolean;
  /** `(pointer: coarse)` -- touch is the primary input. */
  coarsePointer: boolean;
  /** Viewport narrower than the md breakpoint (768px). */
  narrowViewport: boolean;
  /** `navigator.deviceMemory` in GB, when the browser exposes it. */
  deviceMemoryGb?: number;
  /** `navigator.hardwareConcurrency`, when the browser exposes it. */
  hardwareConcurrency?: number;
}

export function decideSceneQuality(input: SceneQualityInputs): SceneQuality {
  if (input.reducedMotion || input.saveData || !input.webgl) return "off";
  if (input.deviceMemoryGb !== undefined && input.deviceMemoryGb < 2) return "off";
  if (input.hardwareConcurrency !== undefined && input.hardwareConcurrency <= 2) return "off";
  if (input.coarsePointer || input.narrowViewport) return "low";
  if (input.deviceMemoryGb !== undefined && input.deviceMemoryGb < 4) return "low";
  return "high";
}
