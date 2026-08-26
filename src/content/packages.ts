/**
 * Single source of truth for Gileara's five recurring service packages,
 * seeded from Ideaverse Strategy §3 (tech-wing-consolidated-strategy.md,
 * service-catalogue v3.0, USD all-inclusive pricing).
 *
 * Consumers: /services, homepage Packages section, booking-flow goals,
 * FAQ answers, JSON-LD generation. Do not duplicate package copy elsewhere.
 *
 * `status` drives D5 phased-honest launch chips:
 *  - "available": package has passed CTO readiness sign-off
 *  - "rollout":   presented with "rolling out Q4 2026" chip; detail page gated
 */

export type PackageStatus = "available" | "rollout";

export interface PackageTier {
  name: "Basic" | "Professional" | "Enterprise";
  setupFeeUsd: number;
  monthlyFeeUsd: number;
  /** Delivery duration, e.g. "4–6 weeks" */
  deliveryTime: string;
}

export interface PackageFeatureRow {
  feature: string;
  /** undefined = not included at this tier; otherwise "Yes" or a specific value */
  basic?: string;
  professional?: string;
  enterprise?: string;
}

export interface ServicePackage {
  id: string;
  order: number;
  name: string;
  /** Outcome-led one-liner used on cards */
  tagline: string;
  primaryGoal: string;
  targetCustomers: string[];
  status: PackageStatus;
  tiers: PackageTier[];
  /** Tier comparison matrix; absent for Automation (solutions list instead) */
  features?: PackageFeatureRow[];
  /** Automation-only solution list */
  solutions?: string[];
}

export const MANAGED_SERVICES_NOTE =
  "Every package includes managed services from day one — IT support, software updates, backups, security monitoring (tier-based), SLA support, and dedicated engineering (Enterprise). No hidden costs.";

export const servicePackages: ServicePackage[] = [
  {
    id: "digital-foundation",
    order: 1,
    name: "Digital Foundation",
    tagline: "Build the digital foundation your business needs to compete.",
    primaryGoal: "Establish digital presence",
    targetCustomers: [
      "Startups",
      "Small retailers",
      "Consultants",
      "Service providers",
      "New businesses entering the digital market",
    ],
    status: "available",
    tiers: [
      { name: "Basic", setupFeeUsd: 550, monthlyFeeUsd: 85, deliveryTime: "2–3 weeks" },
      { name: "Professional", setupFeeUsd: 1300, monthlyFeeUsd: 240, deliveryTime: "4–6 weeks" },
      { name: "Enterprise", setupFeeUsd: 2700, monthlyFeeUsd: 705, deliveryTime: "6–10 weeks" },
    ],
    features: [
      { feature: "Business Website", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Mobile Responsive Design", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Domain Setup", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Business Email Setup", basic: "3 accounts", professional: "10 accounts", enterprise: "Unlimited" },
      { feature: "Google Business Profile", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Analytics Setup", basic: "Basic", professional: "Advanced", enterprise: "Custom Dashboard" },
      { feature: "SEO Setup", basic: "Basic", professional: "Standard", enterprise: "Advanced" },
      { feature: "Content Management System", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Blog/News Section", basic: "Optional", professional: "Yes", enterprise: "Yes" },
      { feature: "Online Booking", professional: "Yes", enterprise: "Yes" },
      { feature: "Customer Portal", enterprise: "Yes" },
      { feature: "Managed Services Level", basic: "Basic", professional: "Professional", enterprise: "Enterprise" },
    ],
  },
  {
    id: "business-operations",
    order: 2,
    name: "Business Operations",
    tagline: "Replace spreadsheets and paperwork with intelligent business management.",
    primaryGoal: "Digitise daily operations",
    targetCustomers: [
      "Retail businesses",
      "Pharmacies",
      "Schools",
      "Restaurants",
      "Distributors",
      "Service companies",
    ],
    status: "rollout",
    tiers: [
      { name: "Basic", setupFeeUsd: 1625, monthlyFeeUsd: 140, deliveryTime: "4–6 weeks" },
      { name: "Professional", setupFeeUsd: 3800, monthlyFeeUsd: 325, deliveryTime: "8–12 weeks" },
      { name: "Enterprise", setupFeeUsd: 8150, monthlyFeeUsd: 870, deliveryTime: "3–6 months" },
    ],
    features: [
      { feature: "Sales Management", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Expense Tracking", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Customer Records", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Inventory Management", professional: "Yes", enterprise: "Yes" },
      { feature: "Invoice Generation", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Reports Dashboard", basic: "Basic", professional: "Advanced", enterprise: "Custom" },
      { feature: "Employee Accounts", basic: "5", professional: "25", enterprise: "Unlimited" },
      { feature: "Multi-Branch Support", professional: "Yes", enterprise: "Yes" },
      { feature: "Mobile Application", professional: "Optional", enterprise: "Yes" },
      { feature: "API Integration", enterprise: "Yes" },
      { feature: "Managed Services Level", basic: "Basic", professional: "Professional", enterprise: "Enterprise" },
    ],
  },
  {
    id: "customer-growth",
    order: 3,
    name: "Customer Growth",
    tagline: "Turn customer interactions into measurable sales growth.",
    primaryGoal: "Acquire and retain customers",
    targetCustomers: ["Sales-driven businesses"],
    status: "rollout",
    tiers: [
      { name: "Basic", setupFeeUsd: 2175, monthlyFeeUsd: 165, deliveryTime: "4 weeks" },
      { name: "Professional", setupFeeUsd: 4900, monthlyFeeUsd: 380, deliveryTime: "8 weeks" },
      { name: "Enterprise", setupFeeUsd: 10850, monthlyFeeUsd: 1085, deliveryTime: "3–5 months" },
    ],
    features: [
      { feature: "CRM System", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Customer Database", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Sales Pipeline", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Email Marketing", professional: "Yes", enterprise: "Yes" },
      { feature: "WhatsApp Integration", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Loyalty Programme", professional: "Yes", enterprise: "Yes" },
      { feature: "Customer Portal", professional: "Optional", enterprise: "Yes" },
      { feature: "AI Recommendations", enterprise: "Yes" },
      { feature: "Managed Services Level", basic: "Basic", professional: "Professional", enterprise: "Enterprise" },
    ],
  },
  {
    id: "business-intelligence",
    order: 4,
    name: "Business Intelligence",
    tagline: "Know your business. Predict your future.",
    primaryGoal: "Make data-driven decisions",
    targetCustomers: ["Established SMEs"],
    status: "rollout",
    tiers: [
      { name: "Basic", setupFeeUsd: 2725, monthlyFeeUsd: 215, deliveryTime: "4 weeks" },
      { name: "Professional", setupFeeUsd: 6500, monthlyFeeUsd: 490, deliveryTime: "8 weeks" },
      { name: "Enterprise", setupFeeUsd: 16300, monthlyFeeUsd: 1360, deliveryTime: "3–6 months" },
    ],
    features: [
      { feature: "Dashboard", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Sales Analytics", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Financial Analytics", basic: "Yes", professional: "Yes", enterprise: "Yes" },
      { feature: "Automated Reports", professional: "Yes", enterprise: "Yes" },
      { feature: "Predictive Analytics", enterprise: "Yes" },
      { feature: "AI Insights", enterprise: "Yes" },
      { feature: "Data Integration", basic: "Basic", professional: "Advanced", enterprise: "Enterprise" },
      { feature: "Managed Services Level", basic: "Basic", professional: "Professional", enterprise: "Enterprise" },
    ],
  },
  {
    id: "automation-efficiency",
    order: 5,
    name: "Automation & Efficiency",
    tagline: "Make your business work smarter.",
    primaryGoal: "Reduce manual work",
    targetCustomers: ["Process-heavy businesses"],
    status: "rollout",
    tiers: [
      { name: "Basic", setupFeeUsd: 1100, monthlyFeeUsd: 110, deliveryTime: "3–4 weeks" },
      { name: "Professional", setupFeeUsd: 3800, monthlyFeeUsd: 325, deliveryTime: "8 weeks" },
      { name: "Enterprise", setupFeeUsd: 10850, monthlyFeeUsd: 1085, deliveryTime: "3–6 months" },
    ],
    solutions: [
      "Workflow automation",
      "Document processing",
      "Approval systems",
      "Notifications",
      "AI assistants",
      "System integrations",
    ],
  },
];

export interface CustomService {
  name: string;
  startingPriceUsd: number;
}

/** Bespoke offerings outside the recurring packages */
export const customServices: CustomService[] = [
  { name: "Custom Software Development", startingPriceUsd: 2625 },
  { name: "Mobile Applications", startingPriceUsd: 2185 },
  { name: "AI Solutions", startingPriceUsd: 3500 },
];

export interface JourneyStage {
  stage: number;
  packageName: string;
  packageId: string;
  setupFeeUsd: number;
  monthlyFeeUsd: number;
}

/** Recommended MSME growth ladder (§3.8) */
export const customerJourney: JourneyStage[] = [
  { stage: 1, packageName: "Digital Foundation", packageId: "digital-foundation", setupFeeUsd: 550, monthlyFeeUsd: 85 },
  { stage: 2, packageName: "Business Operations", packageId: "business-operations", setupFeeUsd: 1625, monthlyFeeUsd: 140 },
  { stage: 3, packageName: "Customer Growth", packageId: "customer-growth", setupFeeUsd: 2175, monthlyFeeUsd: 165 },
  { stage: 4, packageName: "Business Intelligence", packageId: "business-intelligence", setupFeeUsd: 2725, monthlyFeeUsd: 215 },
  { stage: 5, packageName: "Automation & Efficiency", packageId: "automation-efficiency", setupFeeUsd: 1100, monthlyFeeUsd: 110 },
];
