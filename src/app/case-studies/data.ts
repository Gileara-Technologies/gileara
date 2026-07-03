export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  industry: string;
  service: string;
  icon: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "e-commerce-platform",
    title: "E-Commerce Platform for a Retail Startup",
    subtitle: "Scalable storefront with custom inventory management",
    summary: "Built a full-featured e-commerce platform with custom inventory tracking, payment integration, and an admin dashboard — enabling the client to scale from 50 to 5,000+ monthly orders.",
    industry: "Retail",
    service: "E-Commerce Development",
    icon: "shopping_cart",
  },
  {
    slug: "workflow-automation-sme",
    title: "Workflow Automation for a Growing SME",
    subtitle: "Replaced manual processes with smart automation",
    summary: "Audited a client's operations and built a custom automation system that eliminated 20+ hours of manual data entry per week, reduced errors by 90%, and integrated with their existing tools.",
    industry: "Professional Services",
    service: "Workflow Automation",
    icon: "rebase_edit",
  },
  {
    slug: "mvp-for-startup",
    title: "MVP Launch for a Fintech Startup",
    subtitle: "From idea to production in 12 weeks",
    summary: "Served as external CTO and engineering team to design, build, and launch a fintech MVP. The platform processed its first 1,000 transactions within the first month of launch.",
    industry: "Fintech",
    service: "Custom Software Development",
    icon: "account_balance",
  },
  {
    slug: "internal-tool-legacy-upgrade",
    title: "Legacy System Upgrade for a Logistics Company",
    subtitle: "Modernized outdated infrastructure",
    summary: "Replaced a 15-year-old legacy system with a modern web application, improving load times by 400% and enabling real-time tracking that reduced customer support calls by 60%.",
    industry: "Logistics",
    service: "Custom Software Development",
    icon: "local_shipping",
  },
];
