/**
 * Single source of truth for open roles.
 * Consumers: /careers page (OpenRoles section) + JobPosting JSON-LD —
 * previously duplicated in both places with diverging copy.
 *
 * Stage-1 hiring plan (strategy): Full-Stack Engineer ×2, UI/UX Designer,
 * DevOps Engineer, Project Manager. QA Engineer is parked for this stage
 * and intentionally absent from the public board.
 */

export interface OpenRole {
  id: string;
  title: string;
  /** Number of seats funded for this stage */
  openings: number;
  /** Material Symbols glyph */
  icon: string;
  location: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  niceToHave: string[];
}

export const openRoles: OpenRole[] = [
  {
    id: "full-stack-engineer",
    title: "Full-Stack Engineer",
    openings: 2,
    icon: "code_blocks",
    location: "Accra · Hybrid",
    description:
      "Ship the systems small businesses run on — from Next.js interfaces to Postgres schemas and service-account integrations. We currently pilot in Ghana and design for global scale.",
    responsibilities: [
      "Build end-to-end features across our Next.js/TypeScript stack, from data model to UI.",
      "Implement package capabilities clients rely on daily: inventory, sales recording, customer pipelines, dashboards.",
      "Integrate third-party rails — Google Calendar APIs, messaging platforms, payment reconciliation flows.",
      "Write and maintain unit tests (Vitest) so delivery stays repeatable as the package catalogue grows.",
    ],
    requiredSkills: [
      "TypeScript",
      "React / Next.js (App Router)",
      "Node.js",
      "SQL databases",
      "REST API design",
    ],
    niceToHave: [
      "Cloudflare Workers / OpenNext",
      "Tailwind CSS design tokens",
      "Google Calendar & service-account auth",
      "Vitest testing",
    ],
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    openings: 1,
    icon: "palette",
    location: "Accra · Hybrid",
    description:
      "Design interfaces first-time MSME owners can use confidently — on mid-range phones, over patchy connections.",
    responsibilities: [
      "Design package experiences across web and mobile-web, grounded in Material-style token systems.",
      "Prototype flows for low-bandwidth and offline-tolerant behaviour rather than assuming ideal networks.",
      "Run lightweight research with real MSME operators and turn findings into shipped decisions.",
      "Keep accessibility (a11y) standards inside the design system, not bolted on after review.",
    ],
    requiredSkills: [
      "User-centered design",
      "Figma prototyping",
      "Design-system thinking",
      "Accessibility fundamentals",
    ],
    niceToHave: ["Basic HTML/CSS", "Experience with emerging-market small business contexts"],
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    openings: 1,
    icon: "deployed_code",
    location: "Remote (GMT overlap)",
    description:
      "Own the path from git push to Cloudflare Workers — deploys that are boring, observable, and reversible.",
    responsibilities: [
      "Maintain CI (lint, typecheck, tests, build) on GitHub Actions for every PR.",
      "Manage Cloudflare Workers deployments via the OpenNext adapter, including its runtime constraints.",
      "Harden edge configuration: security headers, redirect rules, environment secrets.",
      "Monitor worker health and define what 'healthy' means before incidents define it for us.",
    ],
    requiredSkills: [
      "GitHub Actions CI/CD",
      "Cloudflare Workers or similar edge runtimes",
      "Linux administration",
      "Infrastructure as Code basics",
    ],
    niceToHave: ["OpenNext experience", "AWS fundamentals", "Wrangler scripting"],
  },
  {
    id: "project-manager",
    title: "Project Manager",
    openings: 1,
    icon: "assignment_turned_in",
    location: "Accra · Hybrid",
    description:
      "Run package implementations from Diagnose to Grow — so clients always know what happens next.",
    responsibilities: [
      "Own delivery of client implementations across the Diagnose → Implement → Run → Grow lifecycle.",
      "Keep scope, timelines, and tier-based SLA expectations honest with clients in plain language.",
      "Coordinate engineers and designers against the published package feature matrices.",
      "Turn every completed engagement into documentation the next client benefits from.",
    ],
    requiredSkills: [
      "Agile delivery management",
      "Client communication & expectation setting",
      "Scope and timeline planning",
      "Clear written English",
    ],
    niceToHave: ["Emerging-market small business context", "Agile certifications"],
  },
];
