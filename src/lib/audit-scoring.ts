/**
 * Pure scoring for the homepage Operations Audit (src/content/audit.ts).
 * Consumer: the homepage AuditSection's report card. It feeds the answer
 * map (questionId → optionId) in and gets the ranked packages out, then
 * renders name/tagline/why from packages.ts and audit.ts. No DOM, no I/O;
 * safe to unit-test in the node environment (tests/lib/audit-scoring.test.ts).
 *
 * Honesty rule: a score is a starting-point suggestion, never a promised
 * result: callers must frame the outcome the same way packages.ts and
 * scenarios.ts do (goals, not results).
 *
 * Unknown question ids, unknown option ids, and unanswered questions all
 * contribute 0; empty answers still return a valid five-key result.
 */

import { auditQuestions, type ServiceId } from "@/content/audit";

export interface AuditResult {
  primary: ServiceId;
  /** second-highest score; null if none has points > 0 */
  secondary: ServiceId | null;
  /** all five keys, numeric totals */
  scores: Record<ServiceId, number>;
}

/**
 * Tie-break order, mirroring the `order` field in src/content/packages.ts
 * (1 → 5): digital-foundation, business-operations, customer-growth,
 * business-intelligence, automation-efficiency. When totals are equal the
 * earlier package wins, so scoring stays deterministic. Keep this array in
 * sync with packages.ts (tests/lib/audit-scoring.test.ts fails if the two
 * drift apart).
 */
const PACKAGE_ORDER: ServiceId[] = [
  "digital-foundation",
  "business-operations",
  "customer-growth",
  "business-intelligence",
  "automation-efficiency",
];

const zeroScores = (): Record<ServiceId, number> => ({
  "digital-foundation": 0,
  "business-operations": 0,
  "customer-growth": 0,
  "business-intelligence": 0,
  "automation-efficiency": 0,
});

/**
 * Sum option weights per package and rank them.
 *
 * `answers` maps questionId → optionId. Entries for questions that don't
 * exist, option ids the question doesn't offer, and questions the map
 * leaves out are ignored (0 points). Ties in rank are broken by
 * PACKAGE_ORDER (see above): earliest package wins, for both primary and
 * secondary.
 */
export function scoreAudit(answers: Record<string, string>): AuditResult {
  const scores = zeroScores();

  for (const question of auditQuestions) {
    const optionId = answers[question.id];
    if (!optionId) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;
    for (const id of PACKAGE_ORDER) {
      const points = option.weights[id];
      if (points) scores[id] += points;
    }
  }

  const ranked = [...PACKAGE_ORDER].sort(
    (a, b) => scores[b] - scores[a] || PACKAGE_ORDER.indexOf(a) - PACKAGE_ORDER.indexOf(b),
  );

  const primary = ranked[0];
  const runnerUp = ranked[1];
  // Null unless a second package actually scored: no runner-up worth
  // showing when only one package (or none, for empty answers) has
  // points > 0.
  const secondary = runnerUp !== undefined && scores[runnerUp] > 0 ? runnerUp : null;

  return { primary, secondary, scores };
}
