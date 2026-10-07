import { describe, expect, it } from "vitest";
import { scoreAudit } from "@/lib/audit-scoring";
import { auditQuestions, auditReportWhy, auditSection, type ServiceId } from "@/content/audit";
import { servicePackages } from "@/content/packages";

const SERVICE_IDS: ServiceId[] = [
  "digital-foundation",
  "business-operations",
  "customer-growth",
  "business-intelligence",
  "automation-efficiency",
];

/** Expect the full five-key scorecard, nothing missing, nothing extra. */
const NO_POINTS = {
  "digital-foundation": 0,
  "business-operations": 0,
  "customer-growth": 0,
  "business-intelligence": 0,
  "automation-efficiency": 0,
};

describe("scoreAudit", () => {
  it("returns a valid five-key result for empty answers", () => {
    const res = scoreAudit({});
    expect(res.scores).toEqual(NO_POINTS);
    // every package ties at zero, so the packages.ts order decides
    const byOrder = [...servicePackages].sort((a, b) => a.order - b.order);
    expect(res.primary).toBe(byOrder[0].id);
    expect(res.secondary).toBeNull();
  });

  it("sums option weights per package", () => {
    // notebook: business-operations 4 + business-intelligence 1
    // reconciling: business-operations 2 + automation-efficiency 2
    const res = scoreAudit({ stock: "notebook", repetition: "reconciling" });
    expect(res.scores).toEqual({
      "digital-foundation": 0,
      "business-operations": 6,
      "customer-growth": 0,
      "business-intelligence": 1,
      "automation-efficiency": 2,
    });
    expect(res.primary).toBe("business-operations");
    expect(res.secondary).toBe("automation-efficiency");
  });

  it("ignores unknown question ids, foreign option ids, and unanswered questions", () => {
    const res = scoreAudit({
      stock: "memory", // the only entry that counts
      ghost: "notebook", // question id does not exist
      discovery: "not-a-real-option", // option id does not exist
      numbers: "notebook", // real option id, wrong question
      // follow-up and repetition deliberately unanswered
    });
    expect(res.scores).toEqual({
      "digital-foundation": 0,
      "business-operations": 5,
      "customer-growth": 0,
      "business-intelligence": 0,
      "automation-efficiency": 0,
    });
    expect(res.primary).toBe("business-operations");
    // only one package scored, so there is no runner-up to show
    expect(res.secondary).toBeNull();
  });

  it("keeps a null secondary when nothing else scored", () => {
    const res = scoreAudit({ discovery: "word-of-mouth" });
    expect(res.scores["digital-foundation"]).toBe(5);
    expect(res.secondary).toBeNull();
  });

  it("returns a non-null secondary once a second package scores", () => {
    const res = scoreAudit({ stock: "notebook", repetition: "copying" });
    expect(res.scores["automation-efficiency"]).toBe(5);
    expect(res.scores["business-operations"]).toBe(4);
    expect(res.primary).toBe("automation-efficiency");
    expect(res.secondary).toBe("business-operations");
  });

  describe("reachability: every package can win from a realistic answer set", () => {
    it("lands on digital-foundation", () => {
      const res = scoreAudit({
        stock: "system",
        discovery: "word-of-mouth",
        "follow-up": "follow-up-list",
        numbers: "weekly-summary",
        repetition: "reconciling",
      });
      expect(res.primary).toBe("digital-foundation");
      expect(res.scores["digital-foundation"]).toBe(5);
      expect(res.secondary).toBe("automation-efficiency");
    });

    it("lands on business-operations", () => {
      const res = scoreAudit({
        stock: "memory",
        discovery: "listed-online",
        "follow-up": "follow-up-list",
        numbers: "weekly-summary",
        repetition: "counting",
      });
      expect(res.primary).toBe("business-operations");
      expect(res.scores["business-operations"]).toBe(9);
      expect(res.secondary).toBe("customer-growth");
    });

    it("lands on customer-growth", () => {
      const res = scoreAudit({
        stock: "system",
        discovery: "chat-orders",
        "follow-up": "when-i-can",
        numbers: "weekly-summary",
        repetition: "chasing",
      });
      expect(res.primary).toBe("customer-growth");
      expect(res.scores["customer-growth"]).toBe(11);
      expect(res.secondary).toBe("business-intelligence");
    });

    it("lands on business-intelligence", () => {
      const res = scoreAudit({
        stock: "system",
        discovery: "listed-online",
        "follow-up": "follow-up-list",
        numbers: "gut",
        repetition: "reconciling",
      });
      expect(res.primary).toBe("business-intelligence");
      expect(res.scores["business-intelligence"]).toBe(7);
      // customer-growth and automation-efficiency tie at 4;
      // packages.ts order puts customer-growth first
      expect(res.secondary).toBe("customer-growth");
    });

    it("lands on automation-efficiency", () => {
      const res = scoreAudit({
        stock: "spreadsheet",
        discovery: "social-messages",
        "follow-up": "in-my-head",
        numbers: "weekly-summary",
        repetition: "copying",
      });
      expect(res.primary).toBe("automation-efficiency");
      expect(res.scores["automation-efficiency"]).toBe(6);
      expect(res.secondary).toBe("customer-growth");
    });
  });

  describe("tie-breaking follows packages.ts order", () => {
    // two-question answer maps where the top two packages land level
    const tieCases: [ServiceId, ServiceId, Record<string, string>][] = [
      [
        "digital-foundation",
        "business-operations",
        { discovery: "word-of-mouth", stock: "memory" },
      ],
      ["business-operations", "customer-growth", { stock: "memory", "follow-up": "when-i-can" }],
      ["customer-growth", "business-intelligence", { "follow-up": "when-i-can", numbers: "gut" }],
      ["business-intelligence", "automation-efficiency", { numbers: "gut", repetition: "copying" }],
    ];

    it.each(tieCases)("prefers %s over %s when scores are level", (winner, loser, answers) => {
      const res = scoreAudit(answers);
      expect(res.scores[winner]).toBe(res.scores[loser]);
      expect(res.primary).toBe(winner);
      expect(res.secondary).toBe(loser);
      const w = servicePackages.find((p) => p.id === winner)!;
      const l = servicePackages.find((p) => p.id === loser)!;
      expect(w.order).toBeLessThan(l.order);
    });

    it("resolves a full five-way tie in catalogue order", () => {
      const res = scoreAudit({
        stock: "memory",
        discovery: "word-of-mouth",
        "follow-up": "when-i-can",
        numbers: "gut",
        repetition: "copying",
      });
      expect(res.scores).toEqual({
        "digital-foundation": 5,
        "business-operations": 5,
        "customer-growth": 5,
        "business-intelligence": 5,
        "automation-efficiency": 5,
      });
      const byOrder = [...servicePackages].sort((a, b) => a.order - b.order);
      expect(res.primary).toBe(byOrder[0].id);
      expect(res.secondary).toBe(byOrder[1].id);
    });

    it("resolves a two-way top tie over a full answer set", () => {
      const res = scoreAudit({
        stock: "memory", // business-operations 5
        discovery: "listed-online", // digital-foundation 1, customer-growth 2
        "follow-up": "when-i-can", // customer-growth 5
        numbers: "weekly-summary", // business-intelligence 1
        repetition: "reconciling", // business-operations 2, automation-efficiency 2
      });
      expect(res.scores["business-operations"]).toBe(7);
      expect(res.scores["customer-growth"]).toBe(7);
      expect(res.primary).toBe("business-operations");
      expect(res.secondary).toBe("customer-growth");
    });
  });
});

describe("audit content contract", () => {
  it("ships exactly five questions numbered 01 through 05", () => {
    expect(auditQuestions).toHaveLength(5);
    expect(auditQuestions.map((q) => q.number)).toEqual(["01", "02", "03", "04", "05"]);
    expect(new Set(auditQuestions.map((q) => q.id)).size).toBe(5);
  });

  it("offers three to four options per question with unique ids", () => {
    for (const question of auditQuestions) {
      expect(question.options.length).toBeGreaterThanOrEqual(3);
      expect(question.options.length).toBeLessThanOrEqual(4);
      expect(new Set(question.options.map((o) => o.id)).size).toBe(question.options.length);
    }
  });

  it("keeps every weight an integer between 1 and 5", () => {
    for (const question of auditQuestions) {
      for (const option of question.options) {
        for (const value of Object.values(option.weights)) {
          expect(Number.isInteger(value)).toBe(true);
          expect(value).toBeGreaterThanOrEqual(1);
          expect(value).toBeLessThanOrEqual(5);
        }
      }
    }
  });

  it("gives every package at least one option worth three or more points", () => {
    for (const id of SERVICE_IDS) {
      const best = Math.max(
        0,
        ...auditQuestions.flatMap((q) => q.options.map((o) => o.weights[id] ?? 0)),
      );
      expect(best).toBeGreaterThanOrEqual(3);
    }
  });

  it("covers every package in the report 'why' copy and section chrome", () => {
    expect(Object.keys(auditReportWhy).sort()).toEqual([...SERVICE_IDS].sort());
    for (const id of SERVICE_IDS) {
      expect(auditReportWhy[id].length).toBeGreaterThan(20);
    }
    expect(auditSection.number).toBe("07");
    expect(auditSection.reportEyebrow.length).toBeGreaterThan(0);
  });
});
