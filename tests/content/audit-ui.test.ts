import { describe, expect, it } from "vitest";
import { auditQuestions, auditReportWhy, auditSection, type ServiceId } from "@/content/audit";
import { servicePackages } from "@/content/packages";

/**
 * Data contract the interactive AuditTool (src/components/audit/AuditTool.tsx)
 * renders against: every scoring outcome must resolve to a real package card
 * (name + tagline + /services/[slug] link), the wizard chrome it reads from
 * auditSection must exist, and the answers Record needs unique question ids.
 */
const SERVICE_IDS: ServiceId[] = [
  "digital-foundation",
  "business-operations",
  "customer-growth",
  "business-intelligence",
  "automation-efficiency",
];

describe("audit report rendering contract", () => {
  it("resolves every ServiceId to a package with name, tagline, and slug", () => {
    for (const id of SERVICE_IDS) {
      const pkg = servicePackages.find((p) => p.id === id);
      expect(pkg, `no servicePackages entry for ServiceId "${id}"`).toBeDefined();
      if (!pkg) continue;
      expect(pkg.name.length).toBeGreaterThan(0);
      expect(pkg.tagline.length).toBeGreaterThan(0);
      expect(pkg.slug.length).toBeGreaterThan(0);
      // the report's "why" line for this id must exist too
      expect(auditReportWhy[id].length).toBeGreaterThan(20);
    }
  });

  it("uses unique question ids so the answers map never collides", () => {
    const ids = auditQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of auditQuestions) {
      const optionIds = q.options.map((o) => o.id);
      expect(new Set(optionIds).size).toBe(optionIds.length);
    }
  });

  it("exposes every wizard label AuditTool reads from auditSection", () => {
    expect(auditSection.label.trim().length).toBeGreaterThan(0);
    expect(auditSection.heading.trim().length).toBeGreaterThan(0);
    expect(auditSection.headingAccent.trim().length).toBeGreaterThan(0);
    expect(auditSection.intro.trim().length).toBeGreaterThan(0);
    expect(auditSection.startLabel.trim().length).toBeGreaterThan(0);
    expect(auditSection.backLabel.trim().length).toBeGreaterThan(0);
    expect(auditSection.nextLabel.trim().length).toBeGreaterThan(0);
    expect(auditSection.restartLabel.trim().length).toBeGreaterThan(0);
    expect(auditSection.reportEyebrow.trim().length).toBeGreaterThan(0);
  });
});
