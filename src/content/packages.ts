/**
 * Single source of truth for Gileara's five recurring services.
 *
 * Commercial data (tiers, pricing, features, add-ons, exclusions) was
 * replaced wholesale from the Ideaverse service-catalogue v9.0 packages
 * (C:\Users\rodne\Documents\Ideaverse\Gileara\BusinessDevelopment\Packages\*.md,
 * revised 2026-10-31 / 2026-11-17) — see docs/AUTOPILOT-10X-PLAN.md
 * "Workstream 1" for the full decision log on what changed and why.
 * Landing-page narrative content (problems/observations/howWeHelp/
 * outcomes) was NOT in that source and is untouched here.
 *
 * Consumers: /services (pricing sheet), /services/[slug] (landing pages),
 * homepage Services section, booking-flow goals, FAQ answers, JSON-LD
 * generation. Do not duplicate service copy elsewhere.
 *
 * `status` drives D5 phased-honest launch chips:
 *  - "available": service has passed CTO readiness sign-off
 *  - "rollout":   presented with "rolling out Q4 2026" chip; landing page gated
 */

export type ServiceStatus = "available" | "rollout";

export type ServiceTierName = "Starter" | "Growth" | "Premium";

export interface ServiceTier {
  name: ServiceTierName;
  /**
   * One-time setup/onboarding fee in GHS. `0` means "no onboarding fee"
   * — a real, published fact for that tier (Business Operations,
   * Customer Growth, and Business Intelligence are subscription-only).
   * `null` means "Contact Sales": every package's Premium tier has no
   * published figure, so there is nothing honest to show here — see
   * PREMIUM_CONTACT_SALES_NOTE.
   */
  setupFeeGhs: number | null;
  /** Monthly fee in GHS. `null` means "Contact Sales" (Premium only). */
  monthlyFeeGhs: number | null;
  /** Delivery duration, e.g. "14 days", or "Scoped at the discovery call" for Premium. */
  deliveryTime: string;
  /** Customer Growth only: this tier's annual-prepay price and discount. */
  annualPrepayGhs?: number;
  annualPrepayDiscountPct?: number;
}

export interface ServiceFeatureRow {
  feature: string;
  /** undefined = not included at this tier; otherwise "Yes" or a specific value */
  starter?: string;
  growth?: string;
  premium?: string;
}

/** A single identified problem the service addresses. Shown on the landing page. */
export interface ServiceProblem {
  title: string;
  description: string;
}

/** A specific thing Gileara observes when a business has this problem. */
export interface ServiceObservation {
  title: string;
  description: string;
}

/** A specific way Gileara helps fix the problem. */
export interface ServiceSolution {
  title: string;
  description: string;
  /**
   * Optional image to illustrate the solution. Falls back to gradient.
   * Use `images` instead if you want a small auto-changing carousel
   * (rotates every 4 seconds, paused on hover).
   */
  image?: string;
  imageAlt?: string;
  /**
   * Optional carousel of images for an auto-changing effect. When
   * present, takes precedence over `image`.
   */
  images?: { src: string; alt: string }[];
}

/** A one-time or recurring add-on that bolts onto Starter or Growth.
 *  `price` is a prose string, not a typed number: add-ons mix one-time,
 *  recurring, and "Quote on request" shapes too irregularly for one
 *  numeric field to earn its keep. */
export interface ServiceAddOn {
  name: string;
  price: string;
}

/** Automation & Efficiency only: outcome-based pricing for
 *  customer-facing automation (chatbot/WhatsApp conversational work). */
export interface OutcomePriceLine {
  type: string;
  priceLabel: string;
}

/** A usage allowance metered beyond a package's base subscription. */
export interface MeteredAllowance {
  usage: string;
  includedAllowance: string;
  overageRate: string;
}

export interface Service {
  id: string;
  slug: string;
  order: number;
  name: string;
  /** Outcome-led one-liner used on cards and the landing-page eyebrow */
  tagline: string;
  /** Short headline for the landing-page hero (after the section number) */
  heroHeadline: string;
  /** Italic accent phrase inside the hero headline */
  heroAccent: string;
  primaryGoal: string;
  targetCustomers: string[];
  status: ServiceStatus;
  tiers: ServiceTier[];
  /** Tier comparison matrix — every package has one now (replaces the old solutions-list shape). */
  features?: ServiceFeatureRow[];
  /** Add-ons that bolt onto Starter or Growth. */
  addOns?: ServiceAddOn[];
  /** Prose line(s) on what this package does not include. */
  exclusionsNote?: string;
  /** A package-specific pricing callout shown near the tier cards (annual prepay, "no onboarding fee", an upsell-only notice, etc). */
  pricingNote?: string;
  /** True only for Business Intelligence: an expansion offer for existing Business Operations clients, never sold cold or standalone. */
  expansionOnly?: boolean;
  /** Automation & Efficiency only: outcome-based pricing lines for customer-facing automation. */
  outcomePricing?: OutcomePriceLine[];
  outcomePricingCapNote?: string;
  /** Usage allowances metered beyond the base subscription (Customer Growth, Business Intelligence, Automation & Efficiency). */
  meteredAllowances?: MeteredAllowance[];

  // ── Landing-page content (per-service) ───────────────────────────
  /** Hero image (large, right-side portrait) */
  heroImage: string;
  /** Hero image alt text — should describe the scene, not the brand */
  heroImageAlt: string;
  /** 2-4 problems the business has before this service. */
  problems: ServiceProblem[];
  /** 2-3 things we observe when we walk into a business like this. */
  observations: ServiceObservation[];
  /** 3-4 things we build or change. Each can have an image. */
  howWeHelp: ServiceSolution[];
  /** 3 measurable outcomes the business should expect (no fabricated stats). */
  outcomes: { label: string; description: string }[];
  /** 3-4 short FAQs specific to this service. */
  faqs: { question: string; answer: string }[];
}

export const MANAGED_SERVICES_NOTE =
  "Every service includes managed services from day one: IT support, software updates, backups, security monitoring (tier-based), SLA support, and dedicated engineering (Enterprise). All of it is included, with no hidden costs.";

/** Shown wherever a Premium tier has no published figure. */
export const PREMIUM_CONTACT_SALES_NOTE =
  "Premium is a scoping conversation — tell us what you need and we'll quote it after a free discovery call.";

/** `GHS 1,234` — the one formatter every price in this file renders through. */
export function formatGhs(amountGhs: number): string {
  return `GHS ${amountGhs.toLocaleString("en-US")}`;
}

export const servicePackages: Service[] = [
  {
    id: "digital-foundation",
    slug: "digital-foundation",
    order: 1,
    name: "Digital Foundation",
    tagline: "Build the digital foundation your business needs to compete.",
    heroHeadline: "Get your business online and findable",
    heroAccent: "from day one.",
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
      { name: "Starter", setupFeeGhs: 3500, monthlyFeeGhs: 250, deliveryTime: "7 days" },
      { name: "Growth", setupFeeGhs: 5500, monthlyFeeGhs: 400, deliveryTime: "30 days" },
      { name: "Premium", setupFeeGhs: null, monthlyFeeGhs: null, deliveryTime: "Scoped at the discovery call" },
    ],
    features: [
      { feature: "Website", starter: "5 pages", growth: "10 pages + blog", premium: "Contact Sales" },
      { feature: "Mobile-responsive design", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Domain setup", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Google Business Profile", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Content management system", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "SEO setup", starter: "Basic", growth: "Standard", premium: "Yes" },
      { feature: "Analytics", starter: "Basic", growth: "Advanced", premium: "Yes" },
      { feature: "Online booking system", growth: "Yes", premium: "Yes" },
      { feature: "FAQ / chat widget", growth: "Yes", premium: "Yes" },
      { feature: "Customer portal, custom integrations, dedicated engineer", premium: "Yes" },
    ],
    addOns: [
      { name: "Google Workspace setup", price: "GHS 500" },
      { name: "Online Booking System (if not in your tier)", price: "GHS 650" },
      { name: "Customer Portal", price: "GHS 650" },
      { name: "Advanced / Custom Analytics Dashboard", price: "GHS 500" },
      { name: "Advanced SEO Upgrade", price: "GHS 700" },
      { name: "Content Studio commerce (Growth only)", price: "GHS 4,500" },
      { name: "Custom Integrations", price: "Quote on request" },
    ],
    exclusionsNote:
      "Domain purchase, hosting charges beyond the retainer, professional photography, content writing, paid advertising budget, and social media management are not included.",
    pricingNote: "The monthly retainer covers hosting, backups, and IT support — nothing extra to buy to keep the site running.",

    // Landing-page content
    heroImage: "/assets/services/digital-foundation-hero.jpg",
    heroImageAlt: "A man using a smartphone",
    problems: [
      {
        title: "No online presence",
        description: "You run a real business but customers can't find you on Google. Your competitors show up first and win the orders.",
      },
      {
        title: "Renting tools, not owning anything",
        description: "A friend's cousin built a website on his laptop. The login is lost. The hosting expired. Nothing belongs to you.",
      },
      {
        title: "Inbox is your CRM",
        description: "Customer enquiries land in personal Gmail and you reply from your phone. Nothing is recorded and nothing gets followed up, so there is no way to scale.",
      },
      {
        title: "No way to be reached professionally",
        description: "You don't have a business email. You use a Yahoo address from 2010. Customers notice, and it costs you trust.",
      },
    ],
    observations: [
      {
        title: "The best businesses in your space already have a site",
        description: "When we search for your category in your market, whether in Accra today or wherever you operate next, the businesses ranking on page one all have professional sites, real domains, and active Google Business profiles. If you're not there, you're invisible to the next customer who's looking.",
      },
      {
        title: "Your brand is being decided without you",
        description: "Without a website, your customers form their first impression from a Facebook page, a Google Maps listing, or word of mouth. You can't control any of it. A simple, fast site puts you back in charge of how you're seen.",
      },
    ],
    howWeHelp: [
      {
        title: "A business website you actually own",
        description: "Custom-built for your industry, hosted on your domain, and designed mobile-first. You get the login and own the content; we host it for you.",
        image: "/assets/services/digital-foundation-website.jpg",
        imageAlt: "Online shopping on a computer screen",
      },
      {
        title: "A real business email and Google presence",
        description: "you@yourbusiness.com, a verified Google Business Profile, and SEO that puts you on the map locally. Customers find you through local search and contact you directly, trusting what they see when they get there.",
        // Auto-change carousel: chat-on-laptop → google-browser-on-laptop
        images: [
          { src: "/assets/services/digital-foundation-google.jpg", alt: "A woman using chat while typing on a laptop at home" },
          { src: "/assets/services/digital-foundation-google-alt.jpg", alt: "Google browser open on a laptop" },
        ],
      },
      {
        title: "Booking, payments, and contact in one place",
        description: "Customers can book a service, pay a deposit, or send a message without endless back-and-forth. The site works while you sleep.",
        image: "/assets/services/digital-foundation-booking.jpg",
        imageAlt: "A person holding a card while using a laptop",
      },
    ],
    outcomes: [
      { label: "Found on Google", description: "Your business shows up when customers search your category in your city." },
      { label: "Trust on first contact", description: "A professional email and website make customers take you seriously from the first message." },
      { label: "Inbound enquiries", description: "Customers can book, pay, or contact you without you lifting a finger after setup." },
    ],
    faqs: [
      {
        question: "Do I need to know anything about websites?",
        answer: "No. We handle everything: domain registration, hosting, design, content uploads, and email setup. You approve the look, we do the rest.",
      },
      {
        question: "Who owns the website and domain?",
        answer: "You do. The domain is registered in your name. The website files and content belong to you. If you ever leave us, you can take everything with you.",
      },
      {
        question: "How long until my site is live?",
        answer: "Starter: 7 days. Growth: 30 days. Premium: scoped at the discovery call. We share progress every week so you know exactly where things stand.",
      },
    ],
  },
  {
    id: "business-operations",
    slug: "business-operations",
    order: 2,
    name: "Business Operations",
    tagline: "Make sales, money, and stock add up every day — so you can trust the business without standing over it.",
    heroHeadline: "Run your operations from one place",
    heroAccent: "— not twenty.",
    primaryGoal: "Make sales, money, and stock add up into one trustworthy picture",
    targetCustomers: [
      "Retail shops & provision stores",
      "Pharmacies & chemical shops",
      "Distributors & wholesalers",
    ],
    status: "rollout",
    tiers: [
      { name: "Starter", setupFeeGhs: 0, monthlyFeeGhs: 275, deliveryTime: "14 days" },
      { name: "Growth", setupFeeGhs: 0, monthlyFeeGhs: 385, deliveryTime: "30 days" },
      { name: "Premium", setupFeeGhs: null, monthlyFeeGhs: null, deliveryTime: "Scoped at the discovery call" },
    ],
    features: [
      { feature: "Checkout sales entry (phone, tablet, or computer)", starter: "Yes", growth: "Yes", premium: "Contact Sales — scoped to need" },
      { feature: "Payment methods (cash, MoMo, transfer, card, credit)", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Mobile money reconciliation", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Daily match report (sales vs money vs stock/credit)", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Staff roles & permissions", starter: "Owner + cashier (5 seats)", growth: "Advanced roles (25 seats)", premium: "Yes" },
      { feature: "Receipts & invoice generation", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Customer records & credit balances", starter: "Basic", growth: "Full + collections view", premium: "Yes" },
      { feature: "Expense tracking", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Basic low-stock alert", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Inventory management (stock tied to sales & movements)", growth: "Yes", premium: "Yes" },
      { feature: "Works on existing devices (no POS machine required)", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Multi-branch, mobile app, API integration, dedicated engineer", premium: "Yes" },
    ],
    addOns: [
      { name: "Inventory Management (if not in your tier)", price: "GHS 180/month" },
      { name: "Data Migration (spreadsheets/notebooks)", price: "GHS 500 one-time (first basic import free)" },
      { name: "Multi-Branch Support, per additional branch", price: "GHS 1,000 one-time setup + GHS 80/branch/month" },
      { name: "Extra employee/user account (beyond tier allowance)", price: "GHS 25/user/month" },
      { name: "API / Third-Party Integration", price: "Quote on request" },
      { name: "Advanced Reports Dashboard", price: "GHS 400 one-time" },
      { name: "Custom Reports Dashboard", price: "GHS 800 one-time" },
      { name: "POS hardware setup support (client-owned devices)", price: "Quote on request" },
    ],
    exclusionsNote:
      "Hardware procurement and POS devices (printers, scanners, cash drawers, terminals), full accounting/GRA filing or certification, and data migration beyond the Data Migration add-on's agreed scope are not included. Payment confirmation on Starter/Growth is staff-verified against cash, MoMo, bank, or card proof unless an integration is separately scoped.",
    pricingNote: "No onboarding fee and no minimum term on Starter or Growth.",

    // Landing-page content
    heroImage: "/assets/services/business-operations-hero.jpg",
    heroImageAlt: "Pharmacy staff using a digital system to manage inventory",
    problems: [
      {
        title: "Stock in notebooks",
        description: "You know what you sold last week, but not what's in the back room right now. Reconciling inventory is a manual sweep that takes a full day.",
      },
      {
        title: "Sales, expenses, and cash in different places",
        description: "Sales live in one notebook, expenses in another, payment alerts on a phone, cash in a drawer. The real numbers live in your head, and your head is full.",
      },
      {
        title: "Customer records that walk out the door",
        description: "When the only person who knows a customer's history leaves, the relationship leaves with them. You have no system of record.",
      },
      {
        title: "Reconciling by hand, line by line",
        description: "Every night, you match payment alerts against receipts against a sales book. It's slow and error-prone, the kind of work that drains a founder.",
      },
    ],
    observations: [
      {
        title: "Most of your week is admin, not selling",
        description: "When we audit a business like yours, the owner spends 15–25 hours a week on tasks a system should be doing: counting stock, typing receipts, chasing payments, building reports, hours you'll never get back.",
      },
      {
        title: "Your margins are leaking in places you can't see",
        description: "Nothing sits in one system, so expenses get miscategorised, stock gets misplaced, and small losses compound. We see it in every business we walk into.",
      },
    ],
    howWeHelp: [
      {
        title: "A single system for sales, stock, and customers",
        description: "One login, one place: every sale, expense, and customer recorded in real time. The system tells you what sold, what's left, and who owes you without you asking.",
        image: "/assets/services/business-operations-dashboard.jpg",
      },
      {
        title: "Mobile money, cash, and bank in one view",
        description: "We connect the payment channels you already use (mobile money, bank, cash) so reconciliation happens automatically. No more matching alerts to receipts at midnight.",
        image: "/assets/services/business-operations-payments.jpg",
      },
      {
        title: "Reports you actually read",
        description: "Daily sales, weekly expenses, monthly profit, and branch-by-branch comparison, all built for your business rather than pulled from a generic dashboard you'll never open.",
        image: "/assets/services/business-operations-reports.jpg",
      },
    ],
    outcomes: [
      { label: "Hours back every week", description: "The admin work that consumed your evenings gets done in minutes." },
      { label: "Stock you can trust", description: "Real-time inventory means no more 'we thought we had it' conversations. You know what's on the shelf right now." },
      { label: "Decisions on real numbers", description: "When you know your margins, you can price, hire, and invest with confidence instead of gut feel." },
    ],
    faqs: [
      {
        question: "Will my staff need training?",
        answer: "Yes, but we provide it. We train your team in person and provide written guides. Most teams are fully comfortable within a week.",
      },
      {
        question: "Can you migrate my existing data?",
        answer: "Yes. We import your current customer list, inventory, and historical sales, so you start with a complete picture, not an empty system. A first basic import is free; a larger migration is a one-time GHS 500 add-on.",
      },
      {
        question: "Does it work without internet?",
        answer: "The mobile app works offline. Sales and stock updates sync automatically when the connection returns. You never lose data.",
      },
    ],
  },
  {
    id: "customer-growth",
    slug: "customer-growth",
    order: 3,
    name: "Customer Growth",
    tagline: "Turn customer interactions into measurable sales growth.",
    heroHeadline: "Turn conversations into customers",
    heroAccent: "— and keep them.",
    primaryGoal: "Acquire and retain customers",
    targetCustomers: ["Sales-driven businesses"],
    status: "rollout",
    tiers: [
      { name: "Starter", setupFeeGhs: 0, monthlyFeeGhs: 275, deliveryTime: "14 days", annualPrepayGhs: 2805, annualPrepayDiscountPct: 15 },
      { name: "Growth", setupFeeGhs: 0, monthlyFeeGhs: 400, deliveryTime: "30 days", annualPrepayGhs: 3936, annualPrepayDiscountPct: 18 },
      { name: "Premium", setupFeeGhs: null, monthlyFeeGhs: null, deliveryTime: "Scoped at the discovery call" },
    ],
    features: [
      { feature: "CRM system", starter: "Yes", growth: "Yes", premium: "Contact Sales — scoped to need" },
      { feature: "Customer database", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Sales pipeline", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "WhatsApp Business-native messaging (fair-use allowance)", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Mobile Money-billed invoicing (MTN MoMo / Vodafone Cash)", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Basic feedback / review-request automation", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Email marketing", growth: "Yes", premium: "Yes" },
      { feature: "Loyalty programme", growth: "Yes", premium: "Yes" },
      { feature: "Customer portal, AI recommendations, dedicated engineer", premium: "Yes" },
      { feature: "User seats included", starter: "Up to 3", growth: "Up to 5", premium: "Unlimited" },
    ],
    addOns: [
      { name: "Email Marketing (if not in your tier)", price: "GHS 1,800" },
      { name: "Loyalty Programme (if not in your tier)", price: "GHS 2,000" },
      { name: "Customer Segmentation", price: "GHS 1,250" },
      { name: "Customer Portal", price: "GHS 1,000" },
      { name: "AI Recommendations", price: "GHS 4,000 (+ metered AI usage)" },
    ],
    exclusionsNote: "Advertising spend, customer acquisition campaigns, and social media content creation are not included.",
    pricingNote: "Prepay annually for 15% off Starter or 18% off Growth — the only package with this option. No onboarding fee, month-to-month otherwise.",
    meteredAllowances: [
      { usage: "WhatsApp/SMS conversations", includedAllowance: "1,000/month", overageRate: "GHS 1.65/conversation thereafter" },
      { usage: "AI/LLM calls (AI-enabled features only)", includedAllowance: "2,000,000 tokens/month", overageRate: "GHS 55/100,000 tokens thereafter" },
      { usage: "Storage", includedAllowance: "25 GB", overageRate: "GHS 110/GB/month thereafter" },
    ],

    // Landing-page content
    heroImage: "/assets/services/customer-growth-hero.jpg",
    heroImageAlt: "Sales team using a CRM dashboard on a laptop",
    problems: [
      {
        title: "Enquiries lost in chat threads",
        description: "Customers message your business number. The chats mix with personal messages. Someone on the team says they'll follow up, then forgets.",
      },
      {
        title: "No view of your sales pipeline",
        description: "You know you closed 12 deals last month, but you don't know how many you lost, where they dropped off, or which source actually converts.",
      },
      {
        title: "Customers buy once, then disappear",
        description: "You have no way to stay in touch: no loyalty programme, no email list. Every new sale is a stranger again, and trust-building starts from zero.",
      },
    ],
    observations: [
      {
        title: "You're leaving revenue on the table every week",
        description: "When we audit your enquiries, typically 30–50% of warm leads never get a follow-up. That's money you already earned and didn't collect.",
      },
      {
        title: "Your competitors are building the relationship you aren't",
        description: "The businesses winning your customers are running email follow-ups, chat broadcasts, and loyalty programmes. Customers stay because they feel remembered, and you can do the same without a marketing team.",
      },
    ],
    howWeHelp: [
      {
        title: "A CRM built for the way small businesses actually sell",
        description: "Capture every chat, call, and form enquiry in one place. Assign it to a salesperson with a follow-up reminder, so a forgotten conversation never costs you a lead.",
        image: "/assets/services/customer-growth-crm.jpg",
      },
      {
        title: "Chat and email, automated",
        description: "Send order updates, appointment reminders, and re-engagement messages through chat and email, personalised to each customer rather than a blast.",
        image: "/assets/services/customer-growth-whatsapp.jpg",
      },
      {
        title: "A loyalty programme that actually retains",
        description: "Points, rewards, and member-only offers that keep customers coming back. We build the programme and integrate it with your sales system.",
        image: "/assets/services/customer-growth-loyalty.jpg",
      },
    ],
    outcomes: [
      { label: "No enquiry falls through", description: "Every chat, call, and form lands in the CRM with a follow-up assigned, so nothing slips." },
      { label: "Repeat customers, not strangers", description: "Email and chat re-engagement turn one-time buyers into recurring revenue." },
      { label: "A pipeline you can forecast", description: "See exactly what's closing this month, what's stalled, and what to push, instead of guessing." },
    ],
    faqs: [
      {
        question: "Does it work with our existing chat and business number?",
        answer: "Yes. Messaging runs through WhatsApp Business-native integration on the chat apps and business number you already use. No need to change your number or start a new account.",
      },
      {
        question: "Do my salespeople need to be tech-savvy?",
        answer: "No. The CRM is built for sales, not IT. Most teams are productive within three days of training.",
      },
      {
        question: "Can I send bulk messages to customers?",
        answer: "Yes, through chat broadcasts and email. We help you set up compliant, opt-in lists so you reach customers who actually want to hear from you.",
      },
    ],
  },
  {
    id: "business-intelligence",
    slug: "business-intelligence",
    order: 4,
    name: "Business Intelligence",
    tagline: "Know your business. Predict your future.",
    heroHeadline: "See your business",
    heroAccent: "as clearly as we do.",
    primaryGoal: "Turn existing Business Operations data into decisions",
    targetCustomers: ["Existing Business Operations clients"],
    expansionOnly: true,
    status: "rollout",
    tiers: [
      { name: "Starter", setupFeeGhs: 0, monthlyFeeGhs: 275, deliveryTime: "7 days" },
      { name: "Growth", setupFeeGhs: 0, monthlyFeeGhs: 550, deliveryTime: "21 days" },
      { name: "Premium", setupFeeGhs: null, monthlyFeeGhs: null, deliveryTime: "Scoped at the discovery call" },
    ],
    features: [
      { feature: "Pre-built dashboard pack (sales, inventory, cash flow)", starter: "Yes", growth: "Yes", premium: "Contact Sales — scoped to need" },
      { feature: "Sales analytics", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Financial analytics", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Weekly KPI email digest", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Automated reports", growth: "Yes", premium: "Yes" },
      { feature: "Predictive analytics, AI insights, dedicated engineer", premium: "Yes" },
    ],
    addOns: [
      { name: "Automated + Scheduled Reports (if not in your tier)", price: "GHS 1,500" },
      { name: "KPI Tuning Workshop", price: "GHS 800" },
      { name: "Predictive Analytics", price: "GHS 3,500" },
      { name: "AI Insights Layer", price: "GHS 4,000 (+ metered AI usage)" },
      { name: "Additional Source-System Connector", price: "Quote on request" },
    ],
    exclusionsNote: "Source-system access must be provided by the client; third-party data-source licensing fees are pass-through.",
    pricingNote:
      "This is an expansion offer for existing Business Operations clients, not sold standalone or cold — the natural trigger is about six months of real Business Operations data to build the dashboards from.",
    meteredAllowances: [
      { usage: "AI/LLM calls (AI-enabled features only)", includedAllowance: "2,000,000 tokens/month", overageRate: "GHS 55/100,000 tokens thereafter" },
    ],

    // Landing-page content
    heroImage: "/assets/services/business-intelligence-hero.jpg",
    heroImageAlt: "Founder reviewing business analytics on a dashboard",
    problems: [
      {
        title: "Decisions on gut feel",
        description: "You price, hire, and invest based on what feels right. Sometimes it works and sometimes it doesn't, and you can't tell which was which.",
      },
      {
        title: "Reports that take a week to build",
        description: "Your accountant sends a PDF three weeks after month-end. By the time you see the numbers, the data is stale and the opportunity is gone.",
      },
      {
        title: "Flying blind on cash",
        description: "You can't predict next quarter's revenue, can't see which customers are about to churn, and don't know which products are dragging you down.",
      },
    ],
    observations: [
      {
        title: "You have the data, it's just scattered",
        description: "Your sales system, your bank, your payment alerts, and your spreadsheets are all telling parts of the story. Nobody's put them together; we do.",
      },
      {
        title: "The businesses growing fastest have a weekly review rhythm",
        description: "The owners we work with who scale consistently sit down once a week with one dashboard and make three decisions, which is the pattern we build for you.",
      },
    ],
    howWeHelp: [
      {
        title: "One dashboard, every source, real time",
        description: "Sales, expenses, inventory, and customer data in one view. The dashboard updates as your business does, so what you see is what's happening right now.",
        image: "/assets/services/business-intelligence-dashboard.jpg",
      },
      {
        title: "Automated weekly and monthly reports",
        description: "Your key numbers arrive in your inbox every Monday morning: no chasing the accountant, no stale PDFs.",
        image: "/assets/services/business-intelligence-reports.jpg",
      },
      {
        title: "Forecasting and AI insights (Enterprise)",
        description: "Predict next quarter's revenue, identify customers at risk of churning, and surface the products that are quietly losing you money, so you know what to do next.",
        image: "/assets/services/business-intelligence-ai.jpg",
      },
    ],
    outcomes: [
      { label: "Decisions on real numbers", description: "Pricing, hiring, and inventory choices backed by data instead of instinct." },
      { label: "Stale reports, eliminated", description: "Weekly automated reports mean you always know where you stand, not where you stood a month ago." },
      { label: "Predictable growth", description: "When you can see what's coming, you can prepare for it instead of being caught by surprise." },
    ],
    faqs: [
      {
        question: "Can I buy this without being a Business Operations client?",
        answer: "No. Business Intelligence is an expansion built on data you're already collecting with us through Business Operations. If you're not yet a client there, that's where we'd start.",
      },
      {
        question: "What data sources can you connect?",
        answer: "Any system that exports data: your POS, your accounting software, your bank, mobile-money reports, spreadsheets, even other CRMs. We connect to all of them and normalise the data.",
      },
      {
        question: "Do I need a data analyst on my team?",
        answer: "No. We build the dashboards for you and maintain them. You see the numbers, we handle the plumbing.",
      },
      {
        question: "How long until the dashboard is live?",
        answer: "Starter: 7 days. Growth: 21 days. Premium: scoped at the discovery call. We share progress weekly.",
      },
    ],
  },
  {
    id: "automation-efficiency",
    slug: "automation-efficiency",
    order: 5,
    name: "Automation & Efficiency",
    tagline: "Make your business work smarter.",
    heroHeadline: "Make the work that doesn't need you",
    heroAccent: "— disappear.",
    primaryGoal: "Reduce manual work",
    targetCustomers: ["Process-heavy businesses"],
    status: "rollout",
    tiers: [
      { name: "Starter", setupFeeGhs: 2500, monthlyFeeGhs: 680, deliveryTime: "14 days" },
      { name: "Growth", setupFeeGhs: 10000, monthlyFeeGhs: 1960, deliveryTime: "21 days" },
      { name: "Premium", setupFeeGhs: null, monthlyFeeGhs: null, deliveryTime: "Scoped at the discovery call" },
    ],
    features: [
      { feature: "Process-mapping / discovery session", starter: "Yes", growth: "Yes", premium: "Contact Sales — scoped to need" },
      { feature: "Workflow automations (n8n)", starter: "2–3 flows", growth: "6–8 flows", premium: "15+ flows" },
      { feature: "Pre-built flow template library access", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Notifications + escalation", starter: "Yes", growth: "Yes", premium: "Yes" },
      { feature: "Document processing", growth: "Yes", premium: "Yes" },
      { feature: "Approval systems", growth: "Yes", premium: "Yes" },
      { feature: "AI assistants", premium: "Yes" },
    ],
    addOns: [
      { name: "Additional workflow (beyond your tier's included count)", price: "GHS 400/flow" },
      { name: "Document Processing (if not in your tier)", price: "GHS 1,500" },
      { name: "Approval Systems (if not in your tier)", price: "GHS 1,500" },
      { name: "System Integration / Connector", price: "GHS 1,000" },
      { name: "AI Assistants", price: "GHS 5,000 (+ metered AI usage)" },
    ],
    outcomePricing: [
      { type: "Customer conversation handled", priceLabel: "GHS 2.50/conversation" },
      { type: "Document processed (invoice, order form, receipt)", priceLabel: "GHS 3.50/document" },
      { type: "Social post generated and scheduled", priceLabel: "GHS 60/post" },
    ],
    outcomePricingCapNote:
      "For customer-facing automation only, capped at GHS 2,500/month per automated process — the flat Growth tier (GHS 1,960/mo) is already cheaper than that cap, so we'll always check the crossover before quoting outcome pricing.",
    exclusionsNote: "Third-party API usage fees beyond included allowances, WhatsApp Business API verification fees (pass-through), and custom hardware/IoT integration are not included.",
    pricingNote: "Priced like a real automation agency: a setup/build fee plus a smaller monthly fee capped per automated process, not a pure subscription.",
    meteredAllowances: [
      { usage: "WhatsApp/SMS conversations", includedAllowance: "1,000/month", overageRate: "GHS 1.65/conversation thereafter" },
      { usage: "AI/LLM calls (AI-enabled features only)", includedAllowance: "2,000,000 tokens/month", overageRate: "GHS 55/100,000 tokens thereafter" },
    ],

    // Landing-page content
    heroImage: "/assets/services/automation-hero.jpg",
    heroImageAlt: "Team reviewing an automated workflow on a screen",
    problems: [
      {
        title: "The same task done a hundred times",
        description: "Copy from email, paste to spreadsheet, send a Slack message, update a tracker, send a confirmation, file a copy. The same six steps run for every order.",
      },
      {
        title: "Approvals stuck in someone's inbox",
        description: "A request sits in an email for three days. The boss is on holiday, the customer is waiting, the team is blocked, and nobody knows whose job it is to chase it.",
      },
      {
        title: "Data entered twice, then again",
        description: "The same customer record lives in three systems. Every new entry means typing the same details into all three, hoping nothing gets mistyped.",
      },
    ],
    observations: [
      {
        title: "The gap widens every month you wait",
        description: "Your competitors are starting to automate the repetitive work that eats your team's day, and every month you wait widens the gap. We close it in weeks, not years.",
      },
      {
        title: "The work that drains your best people is the work to automate first",
        description: "The tasks your skilled team hates are almost always the ones a system can do, so free them up for the work that actually requires a human.",
      },
    ],
    howWeHelp: [
      {
        title: "Workflow automation end to end",
        description: "We map your process, identify the handoffs, and build the automation from the trigger to the final notification, with no human in the loop.",
        image: "/assets/services/automation-workflow.jpg",
      },
      {
        title: "Smart document processing",
        description: "Invoices, receipts, applications, contracts: we build the extraction so your team reads the exceptions, not every line.",
        image: "/assets/services/automation-documents.jpg",
      },
      {
        title: "Approval systems and notifications",
        description: "Every request is routed with a deadline attached, and every notification reaches the right person. No more 'I thought you were handling that'.",
        image: "/assets/services/automation-approvals.jpg",
      },
    ],
    outcomes: [
      { label: "Hours back per employee, per week", description: "The work that used to take 30 minutes of typing now takes 30 seconds of review." },
      { label: "Faster turnaround", description: "Approvals that took three days now take three hours, and customers feel the difference." },
      { label: "Zero lost requests", description: "Every request is tracked with a visible status, so nothing disappears into an inbox." },
    ],
    faqs: [
      {
        question: "What can be automated?",
        answer: "Almost any rule-based, repetitive process: order handling, invoicing, approvals, data entry, notifications, report generation, customer onboarding. If it follows a pattern, we can automate it.",
      },
      {
        question: "Do you use off-the-shelf tools or custom code?",
        answer: "Both, depending on the job. Most workflows run on n8n and other proven automation platforms; for complex integrations we write custom code.",
      },
      {
        question: "What if the process changes after you build it?",
        answer: "We document every automation so your team can adjust it, and if a process changes later we update it with you as part of ongoing support.",
      },
    ],
  },
];

// ── Re-exports for legacy callers ─────────────────────────────────
// `servicePackages` is the canonical name; the type is `Service`.

export type PackageTier = ServiceTier;
export type PackageFeatureRow = ServiceFeatureRow;
export type ServicePackage = Service;
export type PackageStatus = ServiceStatus;

export interface CustomService {
  name: string;
  startingPriceUsd: number;
}

/** Bespoke offerings outside the recurring services. No GHS source for
 *  these exists in the v9.0 catalogue packages (they're scoped/quoted
 *  per engagement, not catalogue items) — stays in USD until a GHS
 *  figure is published for it. */
export const customServices: CustomService[] = [
  { name: "Custom Software Development", startingPriceUsd: 2625 },
  { name: "Mobile Applications", startingPriceUsd: 2185 },
  { name: "AI Solutions", startingPriceUsd: 3500 },
];

export interface JourneyStage {
  stage: number;
  packageName: string;
  packageId: string;
  setupFeeGhs: number;
  monthlyFeeGhs: number;
}

/** Recommended MSME growth ladder — each stage mirrors its package's Starter tier. */
export const customerJourney: JourneyStage[] = [
  { stage: 1, packageName: "Digital Foundation", packageId: "digital-foundation", setupFeeGhs: 3500, monthlyFeeGhs: 250 },
  { stage: 2, packageName: "Business Operations", packageId: "business-operations", setupFeeGhs: 0, monthlyFeeGhs: 275 },
  { stage: 3, packageName: "Customer Growth", packageId: "customer-growth", setupFeeGhs: 0, monthlyFeeGhs: 275 },
  { stage: 4, packageName: "Business Intelligence", packageId: "business-intelligence", setupFeeGhs: 0, monthlyFeeGhs: 275 },
  { stage: 5, packageName: "Automation & Efficiency", packageId: "automation-efficiency", setupFeeGhs: 2500, monthlyFeeGhs: 680 },
];

/** Find a service by its URL slug (== id, but explicit for clarity) */
export function getServiceBySlug(slug: string): Service | undefined {
  return servicePackages.find((s) => s.slug === slug);
}
