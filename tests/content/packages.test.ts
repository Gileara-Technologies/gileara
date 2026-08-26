import { describe, expect, it } from "vitest";
import {
  servicePackages,
  customServices,
  customerJourney,
  MANAGED_SERVICES_NOTE,
} from "@/content/packages";

describe("servicePackages", () => {
  it("contains the five catalogue packages in order", () => {
    expect(servicePackages.map((p) => p.name)).toEqual([
      "Digital Foundation",
      "Business Operations",
      "Customer Growth",
      "Business Intelligence",
      "Automation & Efficiency",
    ]);
    expect(servicePackages.map((p) => p.order)).toEqual([1, 2, 3, 4, 5]);
  });

  it("gives every package three tiers with ascending monthly fees", () => {
    for (const pkg of servicePackages) {
      expect(pkg.tiers.map((t) => t.name)).toEqual([
        "Basic",
        "Professional",
        "Enterprise",
      ]);
      const monthly = pkg.tiers.map((t) => t.monthlyFeeUsd);
      expect([...monthly].sort((a, b) => a - b)).toEqual(monthly);
      const setup = pkg.tiers.map((t) => t.setupFeeUsd);
      expect([...setup].sort((a, b) => a - b)).toEqual(setup);
    }
  });

  it("matches catalogue v3.0 anchor prices", () => {
    const df = servicePackages.find((p) => p.id === "digital-foundation")!;
    expect(df.tiers[0]).toMatchObject({ setupFeeUsd: 550, monthlyFeeUsd: 85 });
    const bi = servicePackages.find((p) => p.id === "business-intelligence")!;
    expect(bi.tiers[2]).toMatchObject({ setupFeeUsd: 16300, monthlyFeeUsd: 1360 });
    const bo = servicePackages.find((p) => p.id === "business-operations")!;
    expect(bo.primaryGoal).toBe("Digitise daily operations");
  });

  it("provides a feature matrix or a solutions list for every package", () => {
    for (const pkg of servicePackages) {
      if (pkg.id === "automation-efficiency") {
        expect(pkg.solutions?.length).toBeGreaterThan(0);
      } else {
        expect(pkg.features?.length).toBeGreaterThan(0);
      }
    }
  });

  it("marks only Digital Foundation as available (D5 phased launch)", () => {
    const available = servicePackages.filter((p) => p.status === "available");
    expect(available.map((p) => p.id)).toEqual(["digital-foundation"]);
  });
});

describe("customerJourney", () => {
  it("mirrors each package's Basic tier pricing", () => {
    for (const stage of customerJourney) {
      const pkg = servicePackages.find((p) => p.id === stage.packageId)!;
      const basic = pkg.tiers[0];
      expect(stage.setupFeeUsd).toBe(basic.setupFeeUsd);
      expect(stage.monthlyFeeUsd).toBe(basic.monthlyFeeUsd);
      expect(stage.packageName).toBe(pkg.name);
    }
  });
});

describe("customServices", () => {
  it("matches catalogue v3.0 starting prices", () => {
    expect(Object.fromEntries(customServices.map((s) => [s.name, s.startingPriceUsd]))).toEqual({
      "Custom Software Development": 2625,
      "Mobile Applications": 2185,
      "AI Solutions": 3500,
    });
  });
});

describe("MANAGED_SERVICES_NOTE", () => {
  it("states the all-inclusive commitment", () => {
    expect(MANAGED_SERVICES_NOTE).toMatch(/day one/i);
    expect(MANAGED_SERVICES_NOTE).toMatch(/no hidden costs/i);
  });
});
