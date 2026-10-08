-- Migration number: 0002 	 2026-10-08T05:23:16.708Z
-- Seed the Stage-1 hiring plan into D1 (design decision Q1: seed from
-- roles.ts, approved in docs/PORTAL-PLAN.md).
--
-- Content is verbatim from src/content/roles.ts at the time of writing.
-- The public /careers page reads D1 first and falls back to roles.ts when
-- the table is empty (decision Q5: hybrid), so this is the one-time
-- hand-off from content module to operational store; after this, HR owns
-- the rows.

INSERT OR IGNORE INTO roles
  (id, title, openings, icon, location, description,
   responsibilities, required_skills, nice_to_have,
   status, display_order)
VALUES
  (
    'full-stack-engineer',
    'Full-Stack Engineer',
    2,
    'code_blocks',
    'Accra · Hybrid',
    'Ship the systems small businesses run on, from Next.js interfaces to Postgres schemas and service-account integrations. We currently pilot in Ghana and design for global scale.',
    '["Build end-to-end features across our Next.js/TypeScript stack, from data model to UI.", "Implement package capabilities clients rely on daily: inventory, sales recording, customer pipelines, dashboards.", "Integrate third-party rails: Google Calendar APIs, messaging platforms, payment reconciliation flows.", "Write and maintain unit tests (Vitest) so delivery stays repeatable as the package catalogue grows."]',
    '["TypeScript", "React / Next.js (App Router)", "Node.js", "SQL databases", "REST API design"]',
    '["Cloudflare Workers / OpenNext", "Tailwind CSS design tokens", "Google Calendar & service-account auth", "Vitest testing"]',
    'open',
    1
  ),
  (
    'ui-ux-designer',
    'UI/UX Designer',
    1,
    'palette',
    'Accra · Hybrid',
    'Design interfaces first-time MSME owners can use confidently, on mid-range phones and over patchy connections.',
    '["Design package experiences across web and mobile-web, grounded in Material-style token systems.", "Prototype flows for low-bandwidth and offline-tolerant behaviour rather than assuming ideal networks.", "Run lightweight research with real MSME operators and turn findings into shipped decisions.", "Keep accessibility (a11y) standards inside the design system from the first draft."]',
    '["User-centered design", "Figma prototyping", "Design-system thinking", "Accessibility fundamentals"]',
    '["Basic HTML/CSS", "Experience with emerging-market small business contexts"]',
    'open',
    2
  ),
  (
    'devops-engineer',
    'DevOps Engineer',
    1,
    'deployed_code',
    'Remote (GMT overlap)',
    'Own the path from git push to Cloudflare Workers — deploys that are boring, observable, and reversible.',
    '["Maintain CI (lint, typecheck, tests, build) on GitHub Actions for every PR.", "Manage Cloudflare Workers deployments via the OpenNext adapter, including its runtime constraints.", "Harden edge configuration: security headers, redirect rules, environment secrets.", "Monitor worker health and define what ''healthy'' means before incidents define it for us."]',
    '["GitHub Actions CI/CD", "Cloudflare Workers or similar edge runtimes", "Linux administration", "Infrastructure as Code basics"]',
    '["OpenNext experience", "AWS fundamentals", "Wrangler scripting"]',
    'open',
    3
  ),
  (
    'project-manager',
    'Project Manager',
    1,
    'assignment_turned_in',
    'Accra · Hybrid',
    'Run package implementations from Diagnose to Grow, so clients always know what happens next.',
    '["Own delivery of client implementations across the Diagnose → Implement → Run → Grow lifecycle.", "Keep scope, timelines, and tier-based SLA expectations honest with clients in plain language.", "Coordinate engineers and designers against the published package feature matrices.", "Turn every completed engagement into documentation the next client benefits from."]',
    '["Agile delivery management", "Client communication & expectation setting", "Scope and timeline planning", "Clear written English"]',
    '["Emerging-market small business context", "Agile certifications"]',
    'open',
    4
  );
