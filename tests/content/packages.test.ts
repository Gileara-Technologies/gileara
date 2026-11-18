import { describe, expect, it } from "vitest";
import {
  servicePackages,
  customServices,
  customerJourney,
  MANAGED_SERVICES_NOTE,
  formatGhs,
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

  it("gives every package three tiers named Starter/Growth/Premium, Premium always Contact Sales", () => {
    for (const pkg of servicePackages) {
      expect(pkg.tiers.map((t) => t.name)).toEqual(["Starter", "Growth", "Premium"]);

      const [starter, growth, premium] = pkg.tiers;
      // Published figures (Starter, Growth) ascend and are real numbers.
      expect(typeof starter.monthlyFeeGhs).toBe("number");
      expect(typeof growth.monthlyFeeGhs).toBe("number");
      expect(starter.monthlyFeeGhs!).toBeLessThanOrEqual(growth.monthlyFeeGhs!);

      // Premium never carries an invented figure -- every package quotes
      // it as "Contact Sales" in the source catalogue.
      expect(premium.monthlyFeeGhs).toBeNull();
      expect(premium.setupFeeGhs).toBeNull();
    }
  });

  it("matches the v9.0 catalogue anchor prices (GHS)", () => {
    const df = servicePackages.find((p) => p.id === "digital-foundation")!;
    expect(df.tiers[0]).toMatchObject({ setupFeeGhs: 3500, monthlyFeeGhs: 250 });
    const bo = servicePackages.find((p) => p.id === "business-operations")!;
    // No onboarding fee is a real, published fact (0), distinct from
    // Premium's null "Contact Sales".
    expect(bo.tiers[0]).toMatchObject({ setupFeeGhs: 0, monthlyFeeGhs: 275 });
    const af = servicePackages.find((p) => p.id === "automation-efficiency")!;
    expect(af.tiers[1]).toMatchObject({ setupFeeGhs: 10000, monthlyFeeGhs: 1960 });
  });

  it("provides a feature matrix for every package", () => {
    for (const pkg of servicePackages) {
      expect(pkg.features?.length).toBeGreaterThan(0);
    }
  });

  it("marks Business Intelligence as an expansion-only offer, never sold cold", () => {
    const bi = servicePackages.find((p) => p.id === "business-intelligence")!;
    expect(bi.expansionOnly).toBe(true);
    const others = servicePackages.filter((p) => p.id !== "business-intelligence");
    for (const pkg of others) {
      expect(pkg.expansionOnly).toBeFalsy();
    }
  });

  it("gives Customer Growth an annual-prepay discount, unique to that package", () => {
    const cg = servicePackages.find((p) => p.id === "customer-growth")!;
    expect(cg.tiers[0].annualPrepayDiscountPct).toBe(15);
    expect(cg.tiers[1].annualPrepayDiscountPct).toBe(18);
    const others = servicePackages.filter((p) => p.id !== "customer-growth");
    for (const pkg of others) {
      expect(pkg.tiers.every((t) => t.annualPrepayDiscountPct === undefined)).toBe(true);
    }
  });

  it("gives Automation & Efficiency outcome-based pricing, unique to that package", () => {
    const ae = servicePackages.find((p) => p.id === "automation-efficiency")!;
    expect(ae.outcomePricing?.length).toBeGreaterThan(0);
    const others = servicePackages.filter((p) => p.id !== "automation-efficiency");
    for (const pkg of others) {
      expect(pkg.outcomePricing).toBeUndefined();
    }
  });

  it("marks only Digital Foundation as available (D5 phased launch)", () => {
    const available = servicePackages.filter((p) => p.status === "available");
    expect(available.map((p) => p.id)).toEqual(["digital-foundation"]);
  });
});

describe("customerJourney", () => {
  it("mirrors each package's Starter tier pricing", () => {
    for (const stage of customerJourney) {
      const pkg = servicePackages.find((p) => p.id === stage.packageId)!;
      const starter = pkg.tiers[0];
      expect(stage.setupFeeGhs).toBe(starter.setupFeeGhs);
      expect(stage.monthlyFeeGhs).toBe(starter.monthlyFeeGhs);
      expect(stage.packageName).toBe(pkg.name);
    }
  });
});

describe("customServices", () => {
  it("matches catalogue v3.0 starting prices (no GHS source published for these yet)", () => {
    expect(Object.fromEntries(customServices.map((s) => [s.name, s.startingPriceUsd]))).toEqual({
      "Custom Software Development": 2625,
      "Mobile Applications": 2185,
      "AI Solutions": 3500,
    });
  });
});

describe("formatGhs", () => {
  it("renders a thousands-separated GHS amount", () => {
    expect(formatGhs(1960)).toBe("GHS 1,960");
    expect(formatGhs(0)).toBe("GHS 0");
  });
});

describe("MANAGED_SERVICES_NOTE", () => {
  it("states the all-inclusive commitment", () => {
    expect(MANAGED_SERVICES_NOTE).toMatch(/day one/i);
    expect(MANAGED_SERVICES_NOTE).toMatch(/no hidden costs/i);
  });
});
