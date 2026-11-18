"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const POINT_COUNT = 160;
const ACCENT_COLOR = "#5EEAD4"; // accent-bright, tailwind.config.js — the one teal

/**
 * A sparse field of points scattered in a flattened disc, pushed back
 * in Z so it reads as depth behind the headline rather than sitting on
 * top of it. Computed once at module evaluation time (not inside a
 * component/useMemo): this codebase's lint config enforces React
 * Compiler purity rules, which treat `Math.random()` as an impure call
 * even inside `useMemo` -- module-scope, computed-once data has no such
 * restriction, and the geometry never needs to change after the module
 * loads anyway.
 */
const POINT_POSITIONS = (() => {
  const arr = new Float32Array(POINT_COUNT * 3);
  for (let i = 0; i < POINT_COUNT; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * 8.5;
    arr[i * 3] = Math.cos(theta) * radius;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
    arr[i * 3 + 2] = Math.sin(theta) * radius - 3;
  }
  return arr;
})();

function PointField({ pointer }: { pointer: { x: number; y: number } }) {
  const ref = useRef<THREE.Points>(null);

  useFrame((_state, delta) => {
    const points = ref.current;
    if (!points) return;
    // Slow constant drift plus a gentle lerp toward the pointer position
    // (read from a mutated plain object, not React state, so pointer
    // movement never triggers a re-render -- only this per-frame read).
    points.rotation.y += delta * 0.025;
    points.rotation.x += (pointer.y * 0.12 - points.rotation.x) * 0.03;
    points.rotation.z += (pointer.x * -0.05 - points.rotation.z) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[POINT_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial color={ACCENT_COLOR} size={0.05} sizeAttenuation transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

/**
 * HeroPointField — a sparse, slowly drifting field of teal points behind
 * the Hero's headline, giving the existing flat `.grid-bg` CSS layer
 * real depth. Transparent canvas (`gl.alpha`): the brand gradient and
 * grid stay visible underneath; this only adds atmosphere on top.
 *
 * Only ever mounted by HeroBackdrop.tsx, which gates it behind
 * useCanRender3D() (fine pointer, motion OK) and a dynamic import --
 * this component assumes it's safe to spend a WebGL context the moment
 * it renders.
 */
export default function HeroPointField() {
  // A stable mutable object (useMemo, not useRef): mutated directly by
  // the event handler below and read every frame inside PointField's
  // useFrame, with no React re-render on either end. Deliberately not a
  // ref -- this project's lint config flags reading `ref.current`
  // during render (passing it as a prop below counts), and this value
  // genuinely isn't a DOM/fiber ref, just a plain shared object.
  const pointer = useMemo(() => ({ x: 0, y: 0 }), []);

  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [pointer]);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ background: "transparent" }}
    >
      <PointField pointer={pointer} />
    </Canvas>
  );
}
