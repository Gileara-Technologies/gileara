import { describe, expect, it } from "vitest";
import { decideSceneQuality, type SceneQualityInputs } from "@/lib/scene/quality";

const desktop: SceneQualityInputs = {
  reducedMotion: false,
  saveData: false,
  webgl: true,
  coarsePointer: false,
  narrowViewport: false,
  deviceMemoryGb: 8,
  hardwareConcurrency: 8,
};

describe("decideSceneQuality", () => {
  it("gives a capable desktop the high tier", () => {
    expect(decideSceneQuality(desktop)).toBe("high");
  });

  it("treats unknown memory/cores (Safari, Firefox) as capable", () => {
    expect(decideSceneQuality({ ...desktop, deviceMemoryGb: undefined, hardwareConcurrency: undefined })).toBe("high");
  });

  it("turns the scene off for reduced motion, Save-Data, or no WebGL, whatever the device", () => {
    expect(decideSceneQuality({ ...desktop, reducedMotion: true })).toBe("off");
    expect(decideSceneQuality({ ...desktop, saveData: true })).toBe("off");
    expect(decideSceneQuality({ ...desktop, webgl: false })).toBe("off");
  });

  it("turns the scene off on clearly weak hardware", () => {
    expect(decideSceneQuality({ ...desktop, deviceMemoryGb: 1 })).toBe("off");
    expect(decideSceneQuality({ ...desktop, hardwareConcurrency: 2 })).toBe("off");
  });

  it("gives touch devices and narrow windows the low tier", () => {
    expect(decideSceneQuality({ ...desktop, coarsePointer: true })).toBe("low");
    expect(decideSceneQuality({ ...desktop, narrowViewport: true })).toBe("low");
  });

  it("gives mid-range memory the low tier", () => {
    expect(decideSceneQuality({ ...desktop, deviceMemoryGb: 3 })).toBe("low");
  });

  it("lets off-conditions win over low-conditions", () => {
    expect(decideSceneQuality({ ...desktop, coarsePointer: true, reducedMotion: true })).toBe("off");
  });
});
