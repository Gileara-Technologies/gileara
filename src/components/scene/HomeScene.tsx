"use client";

/**
 * Gate for the homepage's immersive 3D scene.
 *
 *  - useSceneQuality() decides "high" | "low" | "off" from real device
 *    signals (src/lib/scene/quality.ts has the rule and its tests).
 *  - On "off" this renders nothing and the Three.js chunk is never
 *    requested: the page looks exactly as it did before the scene existed.
 *  - Otherwise SceneCanvas is loaded with next/dynamic (ssr: false), so
 *    the WebGL bundle is never part of the server HTML and never blocks
 *    first paint.
 *  - Once the canvas reports ready, `scene-active` is added to <html>.
 *    globals.css uses that class to make the homepage sections
 *    translucent so the scene shows through. Until then (and if WebGL
 *    fails or the context is lost) sections keep their opaque
 *    backgrounds, so there is never a moment of unreadable text over an
 *    empty canvas.
 */

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { useSceneQuality } from "@/hooks/useSceneQuality";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

const ACTIVE_CLASS = "scene-active";

class SceneErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HomeScene() {
  const quality = useSceneQuality();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  const markReady = useCallback(() => setReady(true), []);
  const markFailed = useCallback(() => setFailed(true), []);

  const active = quality !== "off" && !failed && ready;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle(ACTIVE_CLASS, active);
    return () => root.classList.remove(ACTIVE_CLASS);
  }, [active]);

  if (quality === "off" || failed) return null;

  return (
    <div className={`scene-stage${ready ? " scene-stage--ready" : ""}`} aria-hidden="true">
      <SceneErrorBoundary onError={markFailed}>
        <SceneCanvas key={quality} quality={quality} onReady={markReady} onContextLost={markFailed} />
      </SceneErrorBoundary>
    </div>
  );
}
