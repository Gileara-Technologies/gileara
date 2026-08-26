"use client";

/**
 * Gileara signature effect (the ONE showpiece mechanic — fable-signature-effects):
 * the logo's "growth orbit" made physical. A luminous core with halo shells,
 * three tilted teal orbit rings precessing at their own rates, drifting
 * particles, and the group easing toward the pointer (LERP 0.1).
 *
 * Degradation contract:
 * - prefers-reduced-motion → SAME scene rendered as a single static frame
 *   (never skipped — 3D-first means present everywhere, motion optional)
 * - no WebGL / load failure → parent keeps the gradient + watermark fallback
 * - canvas never gates content: pointer-events-none, z-indexed under text
 */

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdditiveBlending, Group, Mesh, Points, Vector3 } from "three";

const TEAL = "#44ddc1";
const TEAL_DEEP = "#00bfa5";
const MIST = "#afc9ea";

/** Pointer target shared by all parallax consumers; mutated outside React render. */
const pointerTarget = { x: 0, y: 0 };

function OrbitRings({ intensity }: { intensity: "hero" | "band" }) {
  const group = useRef<Group>(null);
  const rings = useRef<Array<Mesh | null>>([]);
  const scale = intensity === "hero" ? 1 : 0.72;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    g.rotation.y += (pointerTarget.x * 0.35 - g.rotation.y) * 0.1;
    g.rotation.x += (-pointerTarget.y * 0.22 - g.rotation.x) * 0.1;
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.z = t * (0.16 + i * 0.09) * (i % 2 === 0 ? 1 : -1);
      ring.rotation.y = Math.sin(t * 0.12 + i) * 0.22 + i * 0.9;
    });
  });

  const defs = [
    { r: 2.0, tube: 0.045, color: TEAL, opacity: 0.95, tilt: [Math.PI / 2.15, 0.3, 0] },
    { r: 2.7, tube: 0.03, color: TEAL_DEEP, opacity: 0.8, tilt: [Math.PI / 1.85, -0.5, 0.4] },
    { r: 3.4, tube: 0.02, color: MIST, opacity: 0.55, tilt: [Math.PI / 2.5, 0.8, -0.3] },
  ];

  return (
    <group ref={group} scale={scale}>
      {/* core + halo shells (glow without postprocessing) */}
      <mesh>
        <sphereGeometry args={[0.5, 48, 48]} />
        <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.22} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.35, 32, 32]} />
        <meshBasicMaterial color={TEAL_DEEP} transparent opacity={0.1} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={10} distance={12} color={TEAL} />
      {defs.map((d, i) => (
        <mesh key={i} ref={(m) => { rings.current[i] = m; }} rotation={d.tilt as [number, number, number]}>
          <torusGeometry args={[d.r, d.tube, 20, 240]} />
          <meshBasicMaterial color={d.color} transparent opacity={d.opacity} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField({ count }: { count: number }) {
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    // Deterministic PRNG keeps render pure (no Math.random during render)
    let seed = 0x9e3779b9;
    const rand = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 3.8 + rand() * 4.4;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const p = points.current;
    if (!p) return;
    p.rotation.y = state.clock.elapsedTime * 0.03;
    p.position.lerp(new Vector3(pointerTarget.x * 0.4, -pointerTarget.y * 0.3, 0), 0.03);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color={TEAL} transparent opacity={0.7} sizeAttenuation blending={AdditiveBlending} depthWrite={false} />
    </points>
  );
}

export default function OrbitScene({
  reducedMotion = false,
  intensity = "hero",
}: {
  reducedMotion?: boolean;
  intensity?: "hero" | "band";
}) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      onPointerMove={(e) => {
        if (reducedMotion || intensity === "band") return;
        pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointerTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
      }}
    >
      <Canvas
        camera={{ position: [0, 0.6, 7.2], fov: 42 }}
        dpr={[1, 1.75]}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <OrbitRings intensity={intensity} />
        {!reducedMotion && <ParticleField count={intensity === "hero" ? 550 : 220} />}
      </Canvas>
    </div>
  );
}
