"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { useCanRender3D } from "@/hooks/useCanRender3D";

// ssr:false keeps the Three.js/@react-three/fiber bundle out of the
// server-rendered HTML entirely; combined with the useCanRender3D()
// gate below, a visitor who fails that gate (touch device or
// reduced-motion) never causes this chunk to be fetched at all.
const HeroPointField = dynamic(() => import("./HeroPointField"), { ssr: false });

interface ErrorBoundaryState {
  failed: boolean;
}

/** Swallows a WebGL/Three.js failure (disabled WebGL, an unsupported
 *  sandboxed browser, etc.) so the Hero never breaks because of a
 *  decorative background layer -- the existing flat `.grid-bg` CSS is
 *  still there underneath either way, with or without this. */
class Silent3DErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

/**
 * HeroBackdrop — mounts the 3D point field only when useCanRender3D()
 * says it's safe to (fine pointer, motion OK). Everyone else (touch
 * devices, reduced-motion) gets nothing extra here -- the existing
 * `.grid-bg` layer already rendered in Hero.tsx is the entire
 * background for them, byte-for-byte unchanged.
 */
export default function HeroBackdrop() {
  const canRender = useCanRender3D();
  if (!canRender) return null;
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Silent3DErrorBoundary>
        <HeroPointField />
      </Silent3DErrorBoundary>
    </div>
  );
}
