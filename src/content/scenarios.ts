/**
 * Single source of truth for "How We Transform" — vertical playbooks that
 * replace the fabricated case-study stories (D4/D9).
 *
 * HONESTY CONTRACT (exit criterion for Phase 3):
 *  - Every entry ships with status "scenario" until a real engagement earns
 *    "pilot", then "case-study". The UI renders this label everywhere.
 *  - targetOutcomes are GOALS we aim for with the client — never claimed
 *    results. Wording must stay aspirational ("aim to", "the goal is").
 *  - implementation steps may only reference capabilities that exist in
 *    packages.ts feature lists or bespoke custom services.
 */

import { servicePackages, type ServicePackage } from "./packages";

export type ScenarioStatus = "scenario" | "pilot" | "case-study";

export interface ImplementationStep {
  phase: string;
  detail: string;
}

export interface TransformationScenario {
  id: string;
  vertical: string;
  icon: string;
  headline: string;
  painPoints: string[];
  /** ids referencing servicePackages entries */
  packageIds: string[];
  implementation: ImplementationStep[];
  /** Aspirational targets — rendered under a persistent "Goals, not results" banner */
  targetOutcomes: string[];
  ghanaContext: string;
  status: ScenarioStatus;
}

export const scenarios: TransformationScenario[] = [
  {
    id: "pharmacy",
    vertical: "Pharmacy",
    icon: "medication",
    headline: "The pharmacy that always knows its stock",
    painPoints: [
      "Stock counts live in notebooks, so reorders happen after shelves are already empty",
      "Expiry dates hide in boxes — write-offs are discovered at count time, not before",
      "MoMo sales mix with cash, and closing the day means reconciling by hand",
    ],
    packageIds: ["business-operations", "business-intelligence"],
    implementation: [
      { phase: "Diagnose", detail: "Map how stock, sales, and supplier orders actually flow today — counter, storeroom, and the notebook." },
      { phase: "Implement", detail: "Business Operations: inventory with categories and low-stock alerts, sales and expense recording, and structured MoMo/cash payment capture." },
      { phase: "Implement", detail: "Batch and expiry tracking on medicines, with alerts surfaced before dates pass." },
      { phase: "Run", detail: "Managed services from day one — backups, updates, and support while staff adjust." },
      { phase: "Grow", detail: "Business Intelligence: weekly dashboards for margins, fastest-moving items, and dead stock." },
    ],
    targetOutcomes: [
      "Reorder alerts arrive before stockouts, not after",
      "Expiry write-offs shrink toward zero because dates surface early",
      "End-of-day close takes minutes instead of an evening of hand-reconciliation",
    ],
    ghanaContext:
      "Sales land as MoMo, cash, or both — the system tracks them separately so reconciliation stops being a nightly puzzle.",
    status: "scenario",
  },
  {
    id: "school",
    vertical: "Private School",
    icon: "school",
    headline: "The school where no parent is left guessing",
    painPoints: [
      "Fee ledgers live in exercise books, so term-end means disputes and hunting receipts",
      "Admission enquiries arrive in WhatsApp DMs and disappear between personal chats",
      "Nobody can say quickly which families owe what, or who was contacted about what",
    ],
    packageIds: ["business-operations", "customer-growth"],
    implementation: [
      { phase: "Diagnose", detail: "Walk the term cycle: enrolment, fee payment, reminders, and how records move between office and classrooms." },
      { phase: "Implement", detail: "Business Operations: student records with a fee ledger, balances per family, and printable statements." },
      { phase: "Implement", detail: "Customer Growth: an admissions pipeline that catches every enquiry and tracks follow-ups to yes or no." },
      { phase: "Grow", detail: "A public website (Digital Foundation tier) so admissions enquiries start arriving with context instead of cold." },
    ],
    targetOutcomes: [
      "Every family can see a clear statement of what they owe — before term ends",
      "No admission enquiry goes unanswered past the same day",
      "Fee collection status for the whole school fits on one screen",
    ],
    ghanaContext:
      "Parents already pay fees by MoMo and expect updates on WhatsApp — the workflows follow behaviour that exists, not the other way round.",
    status: "scenario",
  },
  {
    id: "restaurant",
    vertical: "Restaurant",
    icon: "restaurant",
    headline: "The restaurant that fills tables on slow days",
    painPoints: [
      "Orders arrive by call, WhatsApp, and walk-in — nothing connects to anything",
      "Regulars are known by face, not by history, so promotions go to everyone equally",
      "There's no answer to 'what actually sells?' beyond memory",
    ],
    packageIds: ["customer-growth", "business-operations"],
    implementation: [
      { phase: "Diagnose", detail: "Trace one week of orders and promotions to see where revenue leaks between channel and kitchen." },
      { phase: "Implement", detail: "Customer Growth: a real customer list with order history, segmented so messages reach regulars, new faces, or lapsed ones." },
      { phase: "Implement", detail: "Business Operations: a daily sales summary that replaces the till-note pile." },
      { phase: "Run", detail: "Managed support while menu changes and price updates flow through without a developer." },
    ],
    targetOutcomes: [
      "Slow-day promotions reach the customers most likely to come, not everybody",
      "Top customers by spend are known by name — and treated like it",
      "One screen answers 'what sold, what didn't' each night",
    ],
    ghanaContext:
      "WhatsApp is where orders and complaints already happen — campaigns ride the channel your customers opened first.",
    status: "scenario",
  },
  {
    id: "retail",
    vertical: "Retail Shop",
    icon: "storefront",
    headline: "The shop that climbs the ladder in stages",
    painPoints: [
      "Invisible online — neighbours searching Google never find the shop",
      "Stock counting means closing for a weekend with a clipboard",
      "Best-sellers and dead items are a feeling, not a fact",
    ],
    packageIds: ["digital-foundation", "business-operations", "customer-growth"],
    implementation: [
      { phase: "Stage 1", detail: "Digital Foundation: website, Google Business Profile, and analytics — so searches turn into foot traffic you can measure." },
      { phase: "Stage 2", detail: "Business Operations: inventory and sales recording, so counting stock becomes an afternoon, not a closure." },
      { phase: "Stage 3", detail: "Customer Growth: repeat-customer tracking and promotions built on real purchase history." },
      { phase: "Grow", detail: "Each stage keeps the last — nothing bought earlier gets thrown away when you climb." },
    ],
    targetOutcomes: [
      "The shop appears when nearby customers search for what it sells",
      "Stock takes count in an afternoon with numbers you trust",
      "Ordering decisions follow sell-through data, not shelf memory",
    ],
    ghanaContext:
      "Google Business Profile drives directions and calls for local shops; MoMo at the counter stays part of recorded sales, not a side ledger.",
    status: "scenario",
  },
  {
    id: "salon",
    vertical: "Salon & Spa",
    icon: "content_cut",
    headline: "The salon where chairs stay booked",
    painPoints: [
      "Bookings live in DMs and missed calls — double-bookings and gaps both happen",
      "No-shows cost money and there's no gentle way to remind clients",
      "Client preferences live in stylists' heads and leave when they do",
    ],
    packageIds: ["customer-growth"],
    implementation: [
      { phase: "Diagnose", detail: "Follow a booking from first DM to chair to return visit — and find where it falls through." },
      { phase: "Implement", detail: "Customer Growth: a booking pipeline with appointment records, automated WhatsApp reminders, and rebooking prompts after visits." },
      { phase: "Implement", detail: "Client profiles carry service history and preferences, so any stylist picks up any client seamlessly." },
      { phase: "Run", detail: "Managed support keeps reminders flowing while the team learns the rhythm." },
    ],
    targetOutcomes: [
      "Reminders cut no-shows because they arrive without anyone remembering to send them",
      "Quiet hours get filled by rebooking prompts to clients who're due",
      "Any stylist can serve any returning client without starting from zero",
    ],
    ghanaContext:
      "Reminders go out on WhatsApp — the channel clients actually read — written to feel like the salon, not a robot.",
    status: "scenario",
  },
];

/** Resolve referenced packages for a scenario (order preserved). */
export function scenarioPackages(scenario: TransformationScenario): ServicePackage[] {
  return scenario.packageIds
    .map((id) => servicePackageById.get(id))
    .filter((p): p is ServicePackage => Boolean(p));
}

const servicePackageById = new Map(servicePackages.map((p) => [p.id, p]));

export const SCENARIO_STATUS_LEGEND: Record<ScenarioStatus, string> = {
  scenario: "A playbook we're ready to implement — no client yet",
  pilot: "Running with a real business right now",
  "case-study": "Completed with measurable results the client approved publishing",
};
