"use client";

/**
 * Gileara signature effect (the ONE showpiece mechanic — fable-signature-effects):
 * the logo's "growth orbit" made physical. A luminous core with three tilted
 * teal orbit rings rotating at different rates, drifting particles, and the
 * whole group easing toward the pointer (LERP 0.1 per fable's physics rule).
 *
 * Degradation contract:
 * - prefers-reduced-motion → parent renders a single static frame (frameloop demand)
 * - no WebGL / load failure → parent keeps the gradient + watermark fallback
 * - canvas never gates content: pointer-events-none, z-indexed under hero text
 */

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { AdditiveBlending, Group, Mesh, Points, Vector3 } from "three";

const TEAL = "#44ddc1";
const TEAL_DEEP = "#00bfa5";
const MIST = "#afc9ea";

/** Pointer target shared by all parallax consumers; mutated outside React render. */
const pointerTarget = { x: 0, y: 0 };

function OrbitRings() {
  const group = useRef<Group>(null);
  const rings = useRef<Array<Mesh | null>>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    // LERP toward pointer (factor 0.1 — fable LERP rule)
    g.rotation.y += (pointerTarget.x * 0.35 - g.rotation.y) * 0.1;
    g.rotation.x += (-pointerTarget.y * 0.22 - g.rotation.x) * 0.1;
    // each ring precesses on its own axis at its own rate
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.z = t * (0.12 + i * 0.07) * (i % 2 === 0 ? 1 : -1);
      ring.rotation.y = Math.sin(t * 0.1 + i) * 0.18 + i * 0.9;
    });
  });

  const ringDefs: Array<{ r: number; tube: number; color: string; tilt: ThreeElements["mesh"]["rotation"] }> = [
    { r: 2.05, tube: 0.012, color: TEAL, tilt: [Math.PI / 2.15, 0.3, 0] },
    { r: 2.75, tube: 0.008, color: TEAL_DEEP, tilt: [Math.PI / 1.85, -0.5, 0.4] },
    { r: 3.45, tube: 0.006, color: MIST, tilt: [Math.PI / 2.5, 0.8, -0.3] },
  ];

  return (
    <group ref={group}>
      {/* core */}
      <mesh>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshStandardMaterial
          color={TEAL}
          emissive={TEAL}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={6} distance={9} color={TEAL} />
      {ringDefs.map((def, i) => (
        <mesh key={i} ref={(m) => { rings.current[i] = m; }} rotation={def.tilt}>
          <torusGeometry args={[def.r, def.tube, 16, 220]} />
          <meshBasicMaterial color={def.color} transparent opacity={0.65 - i * 0.12} blending={AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField({ count = 550 }: { count?: number }) {
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    // Deterministic PRNG (mulberry32) keeps render pure and the field
    // identical across reloads — Math.random() is banned during render.
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
      // shell between the outermost ring and the frame edge
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
    p.rotation.y = state.clock.elapsedTime * 0.02;
    p.position.lerp(new Vector3(pointerTarget.x * 0.4, -pointerTarget.y * 0.3, 0), 0.03);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color={TEAL} transparent opacity={0.5} sizeAttenuation blending={AdditiveBlending} />
    </points>
  );
}

export default function OrbitScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      onPointerMove={(e) => {
        if (reducedMotion) return;
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
        <ambientLight intensity={0.25} />
        <OrbitRings />
        {!reducedMotion && <ParticleField />}
      </Canvas>
    </div>
  );
}
