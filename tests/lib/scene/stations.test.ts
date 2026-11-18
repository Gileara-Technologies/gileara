import { describe, expect, it } from "vitest";
import { computeStationProgress, readingLine, stationZ, STATION_SPACING } from "@/lib/scene/stations";

describe("stationZ", () => {
  it("places stations one spacing apart down -Z", () => {
    expect(stationZ(0) === 0).toBe(true);
    expect(stationZ(2)).toBe(-2 * STATION_SPACING);
    expect(stationZ(1.5)).toBe(-1.5 * STATION_SPACING);
  });
});

describe("readingLine", () => {
  it("is the top of the viewport at the very top of the page", () => {
    expect(readingLine(0, 800)).toBe(0);
  });

  it("eases down to 40% of the viewport after one screen of scrolling", () => {
    expect(readingLine(400, 800)).toBe(400 + 800 * 0.4 * 0.5);
    expect(readingLine(800, 800)).toBe(800 + 320);
    expect(readingLine(5000, 800)).toBe(5000 + 320);
  });

  it("never goes negative (iOS overscroll) and survives a zero-height viewport", () => {
    expect(readingLine(-50, 800)).toBe(0);
    expect(readingLine(300, 0)).toBe(300);
  });
});

describe("computeStationProgress", () => {
  // Three sections: [0,1000), [1000,1500), [1500,3500)
  const tops = [0, 1000, 1500];
  const end = 3500;

  it("is 0 at or before the first section", () => {
    expect(computeStationProgress(tops, end, 0)).toBe(0);
    expect(computeStationProgress(tops, end, -10)).toBe(0);
  });

  it("interpolates within a section by its own length", () => {
    expect(computeStationProgress(tops, end, 500)).toBe(0.5);
    expect(computeStationProgress(tops, end, 1250)).toBe(1.5);
    expect(computeStationProgress(tops, end, 2500)).toBe(2);
  });

  it("is exactly the index at a section boundary", () => {
    expect(computeStationProgress(tops, end, 1000)).toBe(1);
    expect(computeStationProgress(tops, end, 1500)).toBe(2);
  });

  it("clamps to the last station past the end of the page", () => {
    expect(computeStationProgress(tops, end, 9999)).toBe(2);
  });

  it("handles no sections and zero-height sections without NaN", () => {
    expect(computeStationProgress([], 0, 100)).toBe(0);
    expect(computeStationProgress([0, 100, 100], 200, 100)).toBe(2);
  });
});
