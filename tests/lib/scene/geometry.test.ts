import { describe, expect, it } from "vitest";
import { clamp, fibonacciSphere, latLonToVector, scatterInBox, seededRandom, smoothstep } from "@/lib/scene/geometry";

describe("seededRandom", () => {
  it("is deterministic per seed and stays in [0, 1)", () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    const values = Array.from({ length: 200 }, () => a());
    expect(values).toEqual(Array.from({ length: 200 }, () => b()));
    expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
  });

  it("differs between seeds", () => {
    expect(seededRandom(1)()).not.toBe(seededRandom(2)());
  });
});

describe("fibonacciSphere", () => {
  it("returns count xyz triples, all on the sphere", () => {
    const pts = fibonacciSphere(50, 3);
    expect(pts).toHaveLength(150);
    for (let i = 0; i < 50; i += 1) {
      const r = Math.hypot(pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2]);
      expect(r).toBeCloseTo(3, 5);
    }
  });

  it("handles a single point", () => {
    expect(Array.from(fibonacciSphere(1, 2))).toEqual([2, 0, 0]);
  });
});

describe("latLonToVector", () => {
  it("puts the poles on the Y axis and (0,0) on +Z", () => {
    const north = latLonToVector(90, 0, 1);
    expect(north[1]).toBeCloseTo(1);
    const origin = latLonToVector(0, 0, 2);
    expect(origin[0]).toBeCloseTo(0);
    expect(origin[1]).toBeCloseTo(0);
    expect(origin[2]).toBeCloseTo(2);
  });
});

describe("scatterInBox", () => {
  it("keeps every point inside the box", () => {
    const pts = scatterInBox(300, { x: 2, y: 1, z: 5 }, { x: 0, y: 0, z: -10 }, seededRandom(3));
    for (let i = 0; i < 300; i += 1) {
      expect(Math.abs(pts[i * 3])).toBeLessThanOrEqual(2);
      expect(Math.abs(pts[i * 3 + 1])).toBeLessThanOrEqual(1);
      expect(Math.abs(pts[i * 3 + 2] + 10)).toBeLessThanOrEqual(5);
    }
  });
});

describe("clamp / smoothstep", () => {
  it("clamps and eases", () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(smoothstep(0, 1, -1)).toBe(0);
    expect(smoothstep(0, 1, 2)).toBe(1);
    expect(smoothstep(0, 1, 0.5)).toBe(0.5);
  });
});
