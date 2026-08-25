import { describe, expect, it } from "vitest";
import maintenanceRoutes from "@/maintenance-routes";

describe("maintenance-routes", () => {
  it("contains only absolute root paths without trailing slashes", () => {
    for (const route of maintenanceRoutes) {
      expect(route).toMatch(/^\//);
      expect(route.endsWith("/")).toBe(false);
      expect(route).not.toContain("?");

      expect(route).not.toContain("#");
    }
  });

  it("has no duplicate entries", () => {
    expect(new Set(maintenanceRoutes).size).toBe(maintenanceRoutes.length);
  });
});
