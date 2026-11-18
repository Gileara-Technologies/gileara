"use client";

import { useSyncExternalStore } from "react";
import { decideSceneQuality, type SceneQuality } from "@/lib/scene/quality";

/**
 * Live 3D quality tier for this visitor ("high" | "low" | "off"), from
 * real browser signals fed into the pure, tested rule in
 * src/lib/scene/quality.ts.
 *
 * useSyncExternalStore rather than useState + useEffect: the tier updates
 * live when the visitor changes their OS motion setting, switches input
 * device, or resizes across the md breakpoint, and this repo's lint rules
 * flag setState inside an effect. The server snapshot is "off", so SSR
 * and the pre-hydration frame always render the plain page.
 */

const QUERIES = ["(prefers-reduced-motion: reduce)", "(pointer: coarse)", "(max-width: 767px)"] as const;

let webglSupport: boolean | null = null;

/** Probe once per page load. Creating a throwaway context is the only
 *  reliable test; the result can't change without a reload. */
function hasWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webglSupport = gl !== null;
    // Free the probe context right away; browsers cap live contexts.
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

interface NavigatorSignals {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

function subscribe(onChange: () => void): () => void {
  const lists = QUERIES.map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

function getSnapshot(): SceneQuality {
  const nav = navigator as Navigator & NavigatorSignals;
  return decideSceneQuality({
    reducedMotion: window.matchMedia(QUERIES[0]).matches,
    coarsePointer: window.matchMedia(QUERIES[1]).matches,
    narrowViewport: window.matchMedia(QUERIES[2]).matches,
    saveData: nav.connection?.saveData === true,
    deviceMemoryGb: typeof nav.deviceMemory === "number" ? nav.deviceMemory : undefined,
    hardwareConcurrency: typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency : undefined,
    webgl: hasWebGL(),
  });
}

function getServerSnapshot(): SceneQuality {
  return "off";
}

export function useSceneQuality(): SceneQuality {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
