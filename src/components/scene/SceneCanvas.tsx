"use client";

/**
 * The homepage's persistent 3D scene: one full-viewport WebGL canvas
 * fixed behind the page, with a camera that travels down a corridor of
 * procedural set pieces (src/components/scene/pieces.tsx) as the visitor
 * scrolls. The page content stays real HTML on top; this is the stage
 * behind it, igloo.inc-style.
 *
 * Camera position comes from real section boundaries, not a flat scroll
 * percentage (src/lib/scene/stations.ts), so each set piece is in view
 * while its section is on screen regardless of section length.
 *
 * Only mounted by HomeScene.tsx, after useSceneQuality() has decided the
 * device can afford it ("high" or "low"), and behind a dynamic import so
 * the Three.js bundle is never downloaded on "off".
 */

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { computeStationProgress, readingLine, stationZ, STATION_SPACING } from "@/lib/scene/stations";
import { clamp, scatterInBox, seededRandom } from "@/lib/scene/geometry";
import { BACKGROUND, ICE, TEAL } from "./materials";
import { SET_PIECES, type RenderQuality, type SceneState } from "./pieces";
import ProceduralEnvironment from "./ProceduralEnvironment";

/** Selector for the element whose direct children are the stations. */
export const SCENE_ROOT_SELECTOR = "[data-scene-root]";

interface StationLayout {
  tops: number[];
  end: number;
}

/** Keeps the document-Y position of every station current: on mount,
 *  on resize, and whenever the page's own layout changes (images,
 *  fonts, accordions opening). */
function useStationLayout(): RefObject<StationLayout> {
  const layout = useRef<StationLayout>({ tops: [], end: 0 });
  useEffect(() => {
    const root = document.querySelector(SCENE_ROOT_SELECTOR);
    if (!root) return;
    const measure = () => {
      const children = Array.from(root.children) as HTMLElement[];
      const scrollY = window.scrollY;
      layout.current.tops = children.map((el) => el.getBoundingClientRect().top + scrollY);
      const last = children.at(-1);
      layout.current.end = last ? last.getBoundingClientRect().bottom + scrollY : 0;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [layout]);
  return layout;
}

/** How far to the side set pieces sit: wide screens put them beside the
 *  text column, narrow screens pull them in and the HTML overlay keeps
 *  text readable on top. */
function sideOffset(aspect: number): number {
  return clamp(aspect * 2.1, 1.0, 3.6);
}

function CameraRig({ stateRef, layoutRef, quality }: { stateRef: RefObject<SceneState>; layoutRef: RefObject<StationLayout>; quality: RenderQuality }) {
  const camera = useThree((s) => s.camera);
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const y = readingLine(window.scrollY, window.innerHeight);
    const s = stateRef.current;
    const target = computeStationProgress(layoutRef.current.tops, layoutRef.current.end, y);
    // Frame-rate independent damping: the camera eases into place
    // rather than snapping, which is what makes scrolling feel like travel.
    s.progress += (target - s.progress) * (1 - Math.exp(-Math.min(dt, 0.1) * 3.5));
    const p = s.progress;
    const px = quality === "high" ? s.pointer.x : 0;
    const py = quality === "high" ? s.pointer.y : 0;
    const x = Math.sin(p * 0.9) * 0.5 + px * 0.45;
    const camY = 0.35 + Math.cos(p * 0.7) * 0.3 - py * 0.3;
    const z = stationZ(p) + 7;
    camera.position.set(x, camY, z);
    lookAt.set(x * 0.3, 0, z - 9);
    camera.lookAt(lookAt);
  });
  return null;
}

/** Snow-like particles filling the whole corridor, drifting slowly down. */
function Particles({ count, length }: { count: number; length: number }) {
  const geometry = useRef<THREE.BufferGeometry>(null);
  const positions = useMemo(
    () => scatterInBox(count, { x: 10, y: 6, z: length / 2 }, { x: 0, y: 0, z: 6 - length / 2 }, seededRandom(7)),
    [count, length],
  );
  useFrame((_, dt) => {
    const attr = geometry.current?.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!attr) return;
    const arr = attr.array as Float32Array;
    const fall = Math.min(dt, 0.1) * 0.12;
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] -= fall;
      if (arr[i] < -6) arr[i] += 12;
    }
    attr.needsUpdate = true;
  });
  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geometry}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={ICE} size={0.04} sizeAttenuation transparent opacity={0.65} depthWrite={false} />
    </points>
  );
}

/** One set piece, positioned at its station and hidden when the camera
 *  is far away, so only the two or three nearby pieces are ever drawn. */
function Station({
  index,
  quality,
  state,
  side,
}: {
  index: number;
  quality: RenderQuality;
  state: RefObject<SceneState>;
  side: number;
}) {
  const piece = SET_PIECES[index];
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.visible = Math.abs(state.current.progress - index) < 2.2;
  });
  const { Component } = piece;
  return (
    <group ref={group} position={[piece.side * side, 0, stationZ(index) + piece.z]}>
      <Component quality={quality} state={state} index={index} />
    </group>
  );
}

function Scene({ quality }: { quality: RenderQuality }) {
  const layout = useStationLayout();
  const state = useRef<SceneState>({ progress: 0, pointer: { x: 0, y: 0 } });
  const aspect = useThree((s) => s.viewport.aspect);
  const side = sideOffset(aspect);
  // One piece per homepage section; the camera's progress is clamped to
  // the real section count, so any surplus piece simply never comes into view.
  const count = SET_PIECES.length;
  const length = Math.max(1, count) * STATION_SPACING + 24;

  useEffect(() => {
    if (quality !== "high") return;
    const onMove = (e: PointerEvent) => {
      state.current.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      state.current.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [quality, state]);

  return (
    <>
      <color attach="background" args={[BACKGROUND]} />
      <fog attach="fog" args={[BACKGROUND, 7, 26]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 6]} intensity={1.1} />
      <directionalLight position={[-6, -2, -4]} intensity={0.6} color={TEAL} />

      <ProceduralEnvironment resolution={quality === "high" ? 256 : 64} />

      <CameraRig stateRef={state} layoutRef={layout} quality={quality} />
      <Particles count={quality === "high" ? 1400 : 450} length={length} />
      {Array.from({ length: count }, (_, i) => (
        <Station key={SET_PIECES[i].name} index={i} quality={quality} state={state} side={side} />
      ))}
    </>
  );
}

export default function SceneCanvas({
  quality,
  onReady,
  onContextLost,
}: {
  quality: RenderQuality;
  onReady: () => void;
  onContextLost: () => void;
}) {
  const maxDpr = quality === "high" ? 1.75 : 1.25;
  const [dpr, setDpr] = useState(maxDpr);
  return (
    <Canvas
      dpr={[1, dpr]}
      gl={{ antialias: quality === "high", powerPreference: quality === "high" ? "high-performance" : "default", alpha: false }}
      camera={{ fov: 45, near: 0.1, far: 60, position: [0, 0.35, 7] }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onContextLost, { once: true });
        onReady();
      }}
    >
      {/* Drop resolution on a struggling GPU instead of dropping frames. */}
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(maxDpr)} />
      <Scene quality={quality} />
    </Canvas>
  );
}
