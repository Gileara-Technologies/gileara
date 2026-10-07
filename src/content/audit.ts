/**
 * Single source of truth for the interactive "Operations Audit" section on
 * the homepage (/): five plain-language questions about how a small business
 * runs, scored by src/lib/audit-scoring.ts, ending in a report card that
 * recommends one of the five packages from packages.ts (the report card
 * itself renders name/tagline from that module, never duplicated here).
 *
 * Consumers: homepage AuditSection (questions, labels, report copy) and
 * audit-scoring (option weights). Email capture after the report is UI
 * behaviour, not content, so nothing about it lives here.
 *
 * Honesty rules: no promised outcomes, no stats, no invented clients.
 * `auditReportWhy` sentences say why the audit might land on a package,
 * goals-not-results framing, and they must not restate the package
 * taglines from packages.ts.
 *
 * Voice: Ghanaian-MSME plain talk: notebooks, memory, cash books,
 * chat-based ordering. Every option reads the way a shop owner would say
 * it out loud. First option in each question is the least digitised state.
 */

export type ServiceId =
  | "digital-foundation"
  | "business-operations"
  | "customer-growth"
  | "business-intelligence"
  | "automation-efficiency";

export interface AuditOption {
  /** stable snake/kebab id, e.g. "notebook" */
  id: string;
  /** the answer as a real person would say it */
  label: string;
  /** integer points 1–5; omitted package = 0 */
  weights: Partial<Record<ServiceId, number>>;
}

export interface AuditQuestion {
  /** stable id, e.g. "stock" */
  id: string;
  /** "01".."05" */
  number: string;
  /** the question, plain language */
  text: string;
  /** 3–4 options, first = least digitised state */
  options: AuditOption[];
}

/** Section chrome for the homepage Operations Audit block. */
export const auditSection: {
  /** homepage section numbers run 00–06, so this is the eighth band */
  number: string;
  label: string;
  heading: string;
  headingAccent: string;
  intro: string;
  startLabel: string;
  restartLabel: string;
  nextLabel: string;
  backLabel: string;
  reportEyebrow: string;
} = {
  number: "07",
  label: "FIND YOUR STARTING POINT",
  heading: "Where is your week",
  headingAccent: "leaking?",
  intro:
    "Five questions about how your business runs day to day. Your answers point to one of our five packages as a place to start.",
  startLabel: "Start the audit",
  restartLabel: "Start again",
  nextLabel: "Next",
  backLabel: "Back",
  reportEyebrow: "YOUR STARTING POINT",
};

/**
 * The five questions. Options run from the least digitised state to the
 * most, and each question owns one package's territory: stock → operations,
 * discovery → digital foundation, follow-up → customer growth, numbers →
 * intelligence, repetition → automation (weights bleed across on purpose
 * so realistic answer mixes can land on any of the five).
 */
export const auditQuestions: AuditQuestion[] = [
  {
    id: "stock",
    number: "01",
    text: "How do you know what's in stock right now?",
    options: [
      {
        id: "memory",
        label: "Mostly memory. I know when something is finishing",
        weights: { "business-operations": 5 },
      },
      {
        id: "notebook",
        label: "A notebook. I write down what comes in and what goes",
        weights: { "business-operations": 4, "business-intelligence": 1 },
      },
      {
        id: "spreadsheet",
        label: "A spreadsheet, updated whenever someone gets round to it",
        weights: { "business-operations": 3, "business-intelligence": 2 },
      },
      {
        id: "system",
        label: "A system that tells me what's left and when to reorder",
        weights: { "business-operations": 1, "business-intelligence": 2 },
      },
    ],
  },
  {
    id: "discovery",
    number: "02",
    text: "How do new customers find you and place an order?",
    options: [
      {
        id: "word-of-mouth",
        label: "They pass by the shop, or a friend sends them",
        weights: { "digital-foundation": 5 },
      },
      {
        id: "social-messages",
        label: "They see me on social media and send a message",
        weights: { "digital-foundation": 4, "customer-growth": 1 },
      },
      {
        id: "chat-orders",
        label: "Most orders arrive as chats on my business number",
        weights: { "digital-foundation": 2, "customer-growth": 3 },
      },
      {
        id: "listed-online",
        label: "They find my listing or website and order from there",
        weights: { "digital-foundation": 1, "customer-growth": 2 },
      },
    ],
  },
  {
    id: "follow-up",
    number: "03",
    text: "A customer sends you a question. What happens next?",
    options: [
      {
        id: "when-i-can",
        label: "I reply when I can, and some messages get missed",
        weights: { "customer-growth": 5 },
      },
      {
        id: "in-my-head",
        label: "I reply fast, but follow-up stays in my head",
        weights: { "customer-growth": 4, "automation-efficiency": 1 },
      },
      {
        id: "staff-inbox",
        label: "A staff member watches the inbox and tells me what matters",
        weights: { "customer-growth": 3, "automation-efficiency": 1 },
      },
      {
        id: "follow-up-list",
        label: "We keep a list of people to contact and work through it",
        weights: { "customer-growth": 2, "automation-efficiency": 2 },
      },
    ],
  },
  {
    id: "numbers",
    number: "04",
    text: "How do you know whether last month was good?",
    options: [
      {
        id: "gut",
        label: "I feel it. If cash is fine, the month was fine",
        weights: { "business-intelligence": 5 },
      },
      {
        id: "cash-book",
        label: "My cash book. I add up what came in when I get time",
        weights: { "business-intelligence": 4, "business-operations": 1 },
      },
      {
        id: "brother-books",
        label: "My brother does the books and tells me at month-end",
        weights: { "business-intelligence": 3 },
      },
      {
        id: "weekly-summary",
        label: "I check a summary of sales and expenses every week",
        weights: { "business-intelligence": 1 },
      },
    ],
  },
  {
    id: "repetition",
    number: "05",
    text: "Which of these takes the biggest bite out of your week?",
    options: [
      {
        id: "copying",
        label: "Copying the same details into two or three books",
        weights: { "automation-efficiency": 5 },
      },
      {
        id: "counting",
        label: "Counting stock and working out what went missing",
        weights: { "business-operations": 4, "automation-efficiency": 1 },
      },
      {
        id: "reconciling",
        label: "Matching payment alerts against the cash book",
        weights: { "business-operations": 2, "automation-efficiency": 2 },
      },
      {
        id: "chasing",
        label: "Chasing customers and suppliers for replies, one at a time",
        weights: { "customer-growth": 3, "automation-efficiency": 2 },
      },
    ],
  },
];

/**
 * One sentence per package explaining why the audit might land there.
 * The report card already shows the package name and tagline from
 * packages.ts, so these stay fresh: what the answers observed, and where
 * that points. No promised results.
 */
export const auditReportWhy: Record<ServiceId, string> = {
  "digital-foundation":
    "New customers finding you by chance shows up all over your answers, and this package starts by giving them a proper place to find you.",
  "business-operations":
    "Your answers describe stock and sales living in notebooks and memory, and this package is built to take that record-keeping over.",
  "customer-growth":
    "Every answer about customers pointed the same way: follow-up depends on you having time, and this package is meant to change that.",
  "business-intelligence":
    "You know how the month went by feel, and this package is about putting real numbers in front of you every week.",
  "automation-efficiency":
    "The same tasks show up by hand week after week in your answers, and this package goes after the most repetitive of them first.",
};
