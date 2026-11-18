"use client";

/**
 * The homepage scene's "set pieces": one procedural sculpture per
 * homepage section, in section order. No downloaded models or textures,
 * everything is generated from primitives so the scene costs a few KB of
 * code rather than megabytes of assets. Each piece echoes its section:
 *
 *   0 Hero            Core       a glass crystal with a glowing heart: the system
 *   1 IndustryStrip   Orbit      six shards circling one ring: the industries
 *   2 InstagramFeed   Tiles      a floating 3x3 grid of glass panes: the feed
 *   3 CinematicStory  Scatter    tumbling, disordered shards: the manual-work problem
 *   4 Pricing         Monoliths  five glass pillars: the five systems
 *   5 Approach        Gates      four rings the camera flies through: the steps
 *   6 AuditSection    Scan       a cube on a grid with a sweeping scan line
 *   7 Positioning     Globe      a wireframe globe with Accra lit
 *   8 FoundingClient  Assemble   the scattered shards from 3, pulled into order
 *   9 ContactBand     Beacon     the crystal again, with a beam: come in
 *
 * React Compiler lint rules in this repo: no Math.random (seededRandom is
 * used instead) and no ref.current reads during render (refs are only
 * touched inside useFrame).
 */

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, Float } from "@react-three/drei";
import * as THREE from "three";
import type { SceneQuality } from "@/lib/scene/quality";
import { fibonacciSphere, latLonToVector, seededRandom, smoothstep } from "@/lib/scene/geometry";
import { GlassMaterial, GlowMaterial, ICE, TEAL } from "./materials";

export type RenderQuality = Exclude<SceneQuality, "off">;

/** Mutable, per-canvas scene state, held in a ref. Written by the camera
 *  rig every frame, read by pieces inside useFrame, never during render. */
export interface SceneState {
  /** Smoothed fractional station index (see src/lib/scene/stations.ts). */
  progress: number;
  /** Pointer position, -1..1 on each axis. Stays 0 on the low tier. */
  pointer: { x: number; y: number };
}

export interface PieceProps {
  quality: RenderQuality;
  state: RefObject<SceneState>;
  index: number;
}

/* ── 0. Core ─────────────────────────────────────────────────────────── */
function Core({ quality }: PieceProps) {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (outer.current) {
      outer.current.rotation.y += dt * 0.12;
      outer.current.rotation.x += dt * 0.04;
    }
    if (inner.current) inner.current.rotation.y -= dt * 0.5;
  });
  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.7}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[2.1, 0]} />
        <GlassMaterial quality={quality} thickness={2.4} />
        <Edges color={TEAL} threshold={12} />
      </mesh>
      <mesh ref={inner} scale={0.55}>
        <octahedronGeometry args={[1, 0]} />
        <GlowMaterial intensity={2.6} />
      </mesh>
      <pointLight color={TEAL} intensity={18} distance={9} decay={2} />
    </Float>
  );
}

/* ── 1. Orbit ────────────────────────────────────────────────────────── */
function Orbit({ quality }: PieceProps) {
  const group = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return { position: [Math.cos(a) * 1.9, Math.sin(a * 2) * 0.25, Math.sin(a) * 1.9] as [number, number, number], scale: 0.32 + (i % 3) * 0.06 };
      }),
    [],
  );
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.35;
  });
  return (
    <group rotation={[0.35, 0, 0.12]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.9, 0.012, 8, 96]} />
        <GlowMaterial intensity={1.2} />
      </mesh>
      <group ref={group}>
        {shards.map((s, i) => (
          <mesh key={i} position={s.position} scale={s.scale}>
            <octahedronGeometry args={[1, 0]} />
            <GlassMaterial quality={quality} />
            <Edges color={TEAL} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ── 2. Tiles ────────────────────────────────────────────────────────── */
function Tiles({ quality }: PieceProps) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const tiles = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        x: ((i % 3) - 1) * 1.25,
        y: (Math.floor(i / 3) - 1) * 1.25,
        phase: i * 0.7,
      })),
    [],
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.position.z = Math.sin(t * 0.8 + tiles[i].phase) * 0.25;
      m.rotation.y = Math.sin(t * 0.5 + tiles[i].phase) * 0.15;
    });
  });
  return (
    <group rotation={[0.15, -0.5, 0.05]}>
      {tiles.map((tile, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          position={[tile.x, tile.y, 0]}
        >
          <boxGeometry args={[1.08, 1.08, 0.06]} />
          <GlassMaterial quality={quality} thickness={0.4} />
          <Edges color={TEAL} />
        </mesh>
      ))}
    </group>
  );
}

/* ── 3. Scatter (and the shard layout shared with 8. Assemble) ──────── */
const SHARD_COUNT = 30;
const SCATTER = (() => {
  const random = seededRandom(20261118);
  return Array.from({ length: SHARD_COUNT }, () => ({
    position: [(random() * 2 - 1) * 4.6, (random() * 2 - 1) * 2.6, (random() * 2 - 1) * 3.4] as [number, number, number],
    rotation: [random() * Math.PI, random() * Math.PI, random() * Math.PI] as [number, number, number],
    spin: 0.2 + random() * 0.6,
    scale: 0.18 + random() * 0.32,
  }));
})();

const shardMaterial = (
  <meshStandardMaterial color="#0E2E2C" metalness={0.85} roughness={0.22} flatShading envMapIntensity={1.4} />
);

function Scatter() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((_, dt) => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.x += dt * SCATTER[i].spin;
      m.rotation.z += dt * SCATTER[i].spin * 0.6;
    });
  });
  return (
    <group>
      {SCATTER.map((s, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          position={s.position}
          rotation={s.rotation}
          scale={s.scale}
        >
          <tetrahedronGeometry args={[1, 0]} />
          {shardMaterial}
          <Edges color={TEAL} />
        </mesh>
      ))}
    </group>
  );
}

/* ── 4. Monoliths ────────────────────────────────────────────────────── */
const MONOLITH_HEIGHTS = [1.6, 2.3, 3.0, 2.3, 1.6];
function Monoliths({ quality }: PieceProps) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = -0.35 + Math.sin(clock.elapsedTime * 0.25) * 0.12;
  });
  return (
    <group ref={group}>
      {MONOLITH_HEIGHTS.map((h, i) => {
        const a = ((i - 2) / 2) * 0.75;
        const x = Math.sin(a) * 3;
        const z = -Math.cos(a) * 3 + 3;
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -a, 0]}>
            <mesh position={[0, h / 2 - 1.2, 0]}>
              <boxGeometry args={[0.62, h, 0.62]} />
              <GlassMaterial quality={quality} thickness={0.9} />
              <Edges color={TEAL} />
            </mesh>
            <mesh position={[0, -1.24, 0]}>
              <boxGeometry args={[0.8, 0.03, 0.8]} />
              <GlowMaterial intensity={1.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ── 5. Gates ────────────────────────────────────────────────────────── */
function Gates() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    refs.current.forEach((m, i) => {
      if (m) m.rotation.z = clock.elapsedTime * (i % 2 ? -0.15 : 0.15);
    });
  });
  return (
    <group>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          position={[0, 0.2, 4 - i * 3.5]}
        >
          <torusGeometry args={[2.7, 0.025, 6, 6]} />
          <GlowMaterial intensity={1.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ── 6. Scan ─────────────────────────────────────────────────────────── */
function Scan({ quality }: PieceProps) {
  const cube = useRef<THREE.Mesh>(null);
  const beam = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, dt) => {
    if (cube.current) {
      cube.current.rotation.y += dt * 0.3;
      cube.current.rotation.x += dt * 0.12;
    }
    if (beam.current) beam.current.position.y = -0.9 + (Math.sin(clock.elapsedTime * 0.9) * 0.5 + 0.5) * 2.2;
  });
  return (
    <group>
      <gridHelper args={[9, 18, TEAL, "#123d39"]} position={[0, -1.4, 0]} />
      <mesh ref={cube}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <GlassMaterial quality={quality} thickness={1.4} />
        <Edges color={TEAL} />
      </mesh>
      <mesh ref={beam} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ── 7. Globe ────────────────────────────────────────────────────────── */
const GLOBE_DOTS = fibonacciSphere(420, 2.02);
const ACCRA = latLonToVector(5.6, -0.19, 2.06);
function Globe() {
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) group.current.rotation.y = Math.sin(t * 0.18) * 0.7;
    if (pulse.current) {
      const s = 1 + (t % 2) * 1.6;
      pulse.current.scale.setScalar(s);
      (pulse.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 - (t % 2) * 0.35);
    }
  });
  return (
    <group ref={group} rotation={[0.25, 0, 0]}>
      <mesh>
        <icosahedronGeometry args={[2, 3]} />
        <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.14} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[GLOBE_DOTS, 3]} />
        </bufferGeometry>
        <pointsMaterial color={ICE} size={0.035} sizeAttenuation transparent opacity={0.75} depthWrite={false} />
      </points>
      <group position={ACCRA}>
        <mesh>
          <sphereGeometry args={[0.07, 16, 16]} />
          <GlowMaterial intensity={3} />
        </mesh>
        <mesh ref={pulse}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color={TEAL} transparent opacity={0.6} depthWrite={false} toneMapped={false} />
        </mesh>
        <pointLight color={TEAL} intensity={6} distance={3} />
      </group>
    </group>
  );
}

/* ── 8. Assemble ─────────────────────────────────────────────────────── */
const ASSEMBLED = fibonacciSphere(SHARD_COUNT, 1.25);
function Assemble({ state, index }: PieceProps) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const glow = useRef<THREE.Mesh>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    // 0 while the camera approaches, 1 by the time the section is in view.
    const t = smoothstep(index - 1.1, index - 0.15, state.current.progress);
    refs.current.forEach((m, i) => {
      if (!m) return;
      const s = SCATTER[i];
      target.set(
        THREE.MathUtils.lerp(s.position[0], ASSEMBLED[i * 3], t),
        THREE.MathUtils.lerp(s.position[1], ASSEMBLED[i * 3 + 1], t),
        THREE.MathUtils.lerp(s.position[2], ASSEMBLED[i * 3 + 2], t),
      );
      m.position.lerp(target, 1 - Math.exp(-dt * 6));
      m.rotation.x += dt * s.spin * (1 - t);
      m.scale.setScalar(THREE.MathUtils.lerp(s.scale, 0.3, t));
    });
    if (glow.current) glow.current.scale.setScalar(0.05 + t * 0.6);
  });
  return (
    <group>
      {SCATTER.map((s, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          position={s.position}
          rotation={s.rotation}
          scale={s.scale}
        >
          <tetrahedronGeometry args={[1, 0]} />
          {shardMaterial}
          <Edges color={TEAL} />
        </mesh>
      ))}
      <mesh ref={glow}>
        <icosahedronGeometry args={[1, 1]} />
        <GlowMaterial intensity={2.4} />
      </mesh>
    </group>
  );
}

/* ── 9. Beacon ───────────────────────────────────────────────────────── */
function Beacon(props: PieceProps) {
  return (
    <group>
      <Core {...props} />
      <mesh position={[0, 9, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 18, 12, 1, true]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.35} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.6, 2.66, 64]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

export interface SetPiece {
  name: string;
  Component: (props: PieceProps) => React.JSX.Element;
  /** -1 left, 1 right, 0 centred on the camera path (the camera flies through it). */
  side: -1 | 0 | 1;
  /** Extra Z offset from the station position. */
  z: number;
}

/** In homepage section order. Sections beyond this list get no piece. */
export const SET_PIECES: readonly SetPiece[] = [
  { name: "core", Component: Core, side: 1, z: -2 },
  { name: "orbit", Component: Orbit, side: 1, z: -2 },
  { name: "tiles", Component: Tiles, side: 1, z: -2 },
  { name: "scatter", Component: Scatter, side: 1, z: -4 },
  { name: "monoliths", Component: Monoliths, side: 1, z: -3 },
  { name: "gates", Component: Gates, side: 0, z: 0 },
  { name: "scan", Component: Scan, side: 1, z: -2 },
  { name: "globe", Component: Globe, side: 1, z: -2 },
  { name: "assemble", Component: Assemble, side: 1, z: -2 },
  { name: "beacon", Component: Beacon, side: 1, z: -3 },
];
