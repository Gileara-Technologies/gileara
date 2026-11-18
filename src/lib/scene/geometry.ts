/**
 * Small, pure helpers for generating scene data. No Three.js import, so
 * they run (and are tested) in plain Node -- tests/lib/scene/geometry.test.ts.
 */

/**
 * Seeded pseudo-random generator (mulberry32). The scene uses this
 * instead of Math.random so particle and shard layouts are identical on
 * every load (and between server and client, should that ever matter),
 * and because this repo's React Compiler lint rules treat Math.random as
 * impure.
 */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * `count` points spread evenly over a sphere (Fibonacci lattice), as a
 * flat [x, y, z, x, y, z, ...] array ready for a BufferAttribute.
 */
export function fibonacciSphere(count: number, radius: number): Float32Array {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return out;
}

/**
 * Latitude/longitude (degrees) to a point on a sphere of `radius`,
 * matching three.js's default orientation (+Y up, longitude 0 facing +Z).
 */
export function latLonToVector(latDeg: number, lonDeg: number, radius: number): [number, number, number] {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [
    radius * Math.cos(lat) * Math.sin(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.cos(lon),
  ];
}

/** Uniformly scattered points inside an axis-aligned box, flat xyz array. */
export function scatterInBox(
  count: number,
  half: { x: number; y: number; z: number },
  center: { x: number; y: number; z: number },
  random: () => number,
): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    out[i * 3] = center.x + (random() * 2 - 1) * half.x;
    out[i * 3 + 1] = center.y + (random() * 2 - 1) * half.y;
    out[i * 3 + 2] = center.z + (random() * 2 - 1) * half.z;
  }
  return out;
}

/** Clamp `value` to [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Smoothstep from 0 at `edge0` to 1 at `edge1`. */
export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
