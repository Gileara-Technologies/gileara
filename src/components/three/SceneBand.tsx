"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/** Same signature mechanic as the hero, at band intensity — reused, not duplicated (one-effect rule). */
const OrbitScene = dynamic(() => import("@/components/three/OrbitScene"), {
  ssr: false,
  loading: () => null,
});

function useWebGLAvailable() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const canvas = document.createElement("canvas");
        setOk(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
      } catch {
        setOk(false);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return ok;
}

/**
 * Decorative 3-D band for inner-page headers. Purely atmospheric:
 * pointer-events-none, fades into the page canvas top and bottom,
 * renders nothing without WebGL (kill-switch safe).
 */
export default function SceneBand() {
  const webgl = useWebGLAvailable();
  if (!webgl) return null;
  return (
    <div className="relative h-[240px] md:h-[280px] overflow-hidden" aria-hidden="true">
      <OrbitScene intensity="band" />
      {/* fade masks so the band melts into surrounding sections */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-background" />
      <div className="pointer-events-none absolute inset-x-0 -top-px h-16 bg-gradient-to-b from-background/80 to-transparent" />
    </div>
  );
}
