/**
 * Single source of truth for Gileara's five recurring services, seeded
 * from Ideaverse Strategy §3 (tech-wing-consolidated-strategy.md,
 * service-catalogue v3.0, USD all-inclusive pricing).
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

export interface ServiceTier {
  name: "Basic" | "Professional" | "Enterprise";
  setupFeeUsd: number;
  monthlyFeeUsd: number;
  /** Delivery duration, e.g. "4–6 weeks" */
  deliveryTime: string;
}

export interface ServiceFeatureRow {
  feature: string;
  /** undefined = not included at this tier; otherwise "Yes" or a specific value */
  basic?: string;
  professional?: string;
  enterprise?: string;
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
  /** Tier comparison matrix; absent for Automation (solutions list instead) */
  features?: ServiceFeatureRow[];
  /** Automation-only solution list */
  solutions?: string[];

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
  "Every service includes managed services from day one — IT support, software updates, backups, security monitoring (tier-based), SLA support, and dedicated engineering (Enterprise). No hidden costs.";

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

    // Landing-page content
    heroImage: "/assets/services/digital-foundation-hero.jpg",
    heroImageAlt: "A man using a smartphone",
    problems: [
      {
        title: "No online presence",
        description: "You run a real business but customers can&apos;t find you on Google. Your competitors show up first — and win the orders.",
      },
      {
        title: "Renting tools, not owning anything",
        description: "A friend's cousin built a website on his laptop. The login is lost. The hosting expired. Nothing belongs to you.",
      },
      {
        title: "Inbox is your CRM",
        description: "Customer enquiries land in personal Gmail. You reply from your phone. There's no record, no follow-up, no way to scale.",
      },
      {
        title: "No way to be reached professionally",
        description: "You don&apos;t have a business email. You use a Yahoo address from 2010. Customers notice — and it costs you trust.",
      },
    ],
    observations: [
      {
        title: "The best businesses in your space already have a site",
        description: "When we search for your category in Accra, the businesses ranking on page one all have professional sites, real domains, and active Google Business profiles. If you&apos;re not there, you&apos;re invisible to the next customer who&apos;s looking.",
      },
      {
        title: "Your brand is being decided without you",
        description: "Without a website, your customers form their first impression from a Facebook page, a Google Maps listing, or word of mouth. You can&apos;t control any of it. A simple, fast site puts you back in charge of how you&apos;re seen.",
      },
    ],
    howWeHelp: [
      {
        title: "A business website you actually own",
        description: "Custom-built for your industry, hosted on your domain, designed mobile-first. You get the login. You own the content. We host it for you.",
        image: "/assets/services/digital-foundation-website.jpg",
        imageAlt: "Online shopping on a computer screen",
      },
      {
        title: "A real business email and Google presence",
        description: "you@yourbusiness.com, a verified Google Business Profile, and SEO that puts you on the map locally. Customers find you, trust you, and contact you directly.",
        // Auto-change carousel: chat-on-laptop → google-browser-on-laptop
        images: [
          { src: "/assets/services/digital-foundation-google.jpg", alt: "A woman using chat while typing on a laptop at home" },
          { src: "/assets/services/digital-foundation-google-alt.jpg", alt: "Google browser open on a laptop" },
        ],
      },
      {
        title: "Booking, payments, and contact — all in one place",
        description: "Customers can book a service, pay a deposit, or send a message without WhatsApp back-and-forth. The site works while you sleep.",
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
        answer: "No. We handle everything — domain registration, hosting, design, content uploads, email setup. You approve the look and we do the rest.",
      },
      {
        question: "Who owns the website and domain?",
        answer: "You do. The domain is registered in your name. The website files and content belong to you. If you ever leave us, you can take everything with you.",
      },
      {
        question: "How long until my site is live?",
        answer: "Basic: 2–3 weeks. Professional: 4–6 weeks. Enterprise: 6–10 weeks. We share progress every week so you know exactly where things stand.",
      },
    ],
  },
  {
    id: "business-operations",
    slug: "business-operations",
    order: 2,
    name: "Business Operations",
    tagline: "Replace spreadsheets and paperwork with intelligent business management.",
    heroHeadline: "Run your operations from one place",
    heroAccent: "— not twenty.",
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
        description: "Sales live in one notebook, expenses in another, MoMo statements on a phone, cash in a drawer. The real numbers live in your head — and your head is full.",
      },
      {
        title: "Customer records that walk out the door",
        description: "When the only person who knows a customer&apos;s history leaves, the relationship leaves with them. You have no system of record.",
      },
      {
        title: "Reconciling by hand, line by line",
        description: "Every night, you match MoMo SMS against receipts against a sales book. It&apos;s slow, error-prone, and the kind of work that drains a founder.",
      },
    ],
    observations: [
      {
        title: "Most of your week is admin, not selling",
        description: "When we audit a business like yours, the owner spends 15–25 hours a week on tasks a system should be doing — counting stock, typing receipts, chasing payments, building reports. That&apos;s time you&apos;ll never get back.",
      },
      {
        title: "Your margins are leaking in places you can&apos;t see",
        description: "Without a single source of truth, expenses get miscategorised, stock gets misplaced, and small losses compound. We see it in every business we walk into.",
      },
    ],
    howWeHelp: [
      {
        title: "A single system for sales, stock, and customers",
        description: "One login, one place. Every sale, every expense, every customer is recorded in real time. The system tells you what sold, what&apos;s left, and who owes you — without you asking.",
        image: "/assets/services/business-operations-dashboard.jpg",
      },
      {
        title: "MoMo, cash, and bank in one view",
        description: "We integrate with MTN MoMo and your bank so the reconciliation happens automatically. No more matching SMS to receipts at midnight.",
        image: "/assets/services/business-operations-payments.jpg",
      },
      {
        title: "Reports you actually read",
        description: "Daily sales, weekly expenses, monthly profit, branch-by-branch comparison. We build the reports that matter for your business — not a generic dashboard you&apos;ll never open.",
        image: "/assets/services/business-operations-reports.jpg",
      },
    ],
    outcomes: [
      { label: "Hours back every week", description: "The admin work that consumed your evenings gets done in minutes. You get your time back." },
      { label: "Stock you can trust", description: "Real-time inventory means no more 'we thought we had it' conversations. You know what's on the shelf right now." },
      { label: "Decisions on real numbers", description: "When you know your margins, you can price, hire, and invest with confidence — not gut feel." },
    ],
    faqs: [
      {
        question: "Will my staff need training?",
        answer: "Yes, but we provide it. We train your team in person and provide written guides. Most teams are fully comfortable within a week.",
      },
      {
        question: "Can you migrate my existing data?",
        answer: "Yes. We import your current customer list, inventory, and historical sales so you start with a complete picture — not an empty system.",
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

    // Landing-page content
    heroImage: "/assets/services/customer-growth-hero.jpg",
    heroImageAlt: "Sales team using a CRM dashboard on a laptop",
    problems: [
      {
        title: "Enquiries lost in WhatsApp",
        description: "Customers message your business number. The chats mix with personal messages. Someone on the team says they'll follow up — and forgets.",
      },
      {
        title: "No view of your sales pipeline",
        description: "You know you closed 12 deals last month, but you don&apos;t know how many you lost, where they dropped off, or which source actually converts.",
      },
      {
        title: "Customers buy once, then disappear",
        description: "You have no way to stay in touch, no loyalty programme, no email list. Every new sale is a stranger again — and you start the trust-building from zero.",
      },
    ],
    observations: [
      {
        title: "You&apos;re leaving revenue on the table every week",
        description: "When we audit your enquiries, typically 30–50% of warm leads never get a follow-up. That&apos;s money you already earned and didn&apos;t collect.",
      },
      {
        title: "Your competitors are building the relationship you aren&apos;t",
        description: "The businesses winning your customers are running email follow-ups, WhatsApp broadcasts, and loyalty programmes. The customers don&apos;t leave because they feel remembered. You can do the same — without a marketing team.",
      },
    ],
    howWeHelp: [
      {
        title: "A CRM built for the way Ghanaian businesses sell",
        description: "Capture every WhatsApp, call, and form enquiry in one place. Assign it to a salesperson, set a follow-up reminder, and never lose a lead to a forgotten chat again.",
        image: "/assets/services/customer-growth-crm.jpg",
      },
      {
        title: "WhatsApp and email — automated, not spammy",
        description: "Send order updates, appointment reminders, and re-engagement messages through WhatsApp and email. Personalised to the customer, not a blast.",
        image: "/assets/services/customer-growth-whatsapp.jpg",
      },
      {
        title: "A loyalty programme that actually retains",
        description: "Points, rewards, and member-only offers that keep customers coming back. We build the programme and integrate it with your sales system.",
        image: "/assets/services/customer-growth-loyalty.jpg",
      },
    ],
    outcomes: [
      { label: "No enquiry falls through", description: "Every WhatsApp, call, and form lands in the CRM with a follow-up assigned. Nothing slips." },
      { label: "Repeat customers, not strangers", description: "Email and WhatsApp re-engagement turn one-time buyers into recurring revenue." },
      { label: "A pipeline you can forecast", description: "See exactly what's closing this month, what's stalled, and what to push. No more guessing." },
    ],
    faqs: [
      {
        question: "Does it work with our existing WhatsApp Business account?",
        answer: "Yes. We integrate with your current WhatsApp Business setup. No need to change your number or start a new account.",
      },
      {
        question: "Do my salespeople need to be tech-savvy?",
        answer: "No. The CRM is built for sales, not IT. Most teams are productive within three days of training.",
      },
      {
        question: "Can I send bulk messages to customers?",
        answer: "Yes, through WhatsApp broadcasts and email. We help you set up compliant, opt-in lists so you reach customers who actually want to hear from you.",
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

    // Landing-page content
    heroImage: "/assets/services/business-intelligence-hero.jpg",
    heroImageAlt: "Founder reviewing business analytics on a dashboard",
    problems: [
      {
        title: "Decisions on gut feel",
        description: "You price, hire, and invest based on what feels right. Sometimes it works, sometimes it doesn&apos;t — and you can&apos;t tell which was which.",
      },
      {
        title: "Reports that take a week to build",
        description: "Your accountant sends a PDF three weeks after month-end. By the time you see the numbers, the data is stale and the opportunity is gone.",
      },
      {
        title: "Flying blind on cash",
        description: "You can&apos;t predict next quarter&apos;s revenue, can&apos;t see which customers are about to churn, and don&apos;t know which products are dragging you down.",
      },
    ],
    observations: [
      {
        title: "You have the data — it&apos;s just scattered",
        description: "Your sales system, your bank, your MoMo statements, and your spreadsheets are all telling parts of the story. Nobody&apos;s put them together. We do.",
      },
      {
        title: "The businesses growing fastest have a weekly review rhythm",
        description: "The owners we work with who scale consistently sit down once a week with one dashboard and make three decisions. That&apos;s the pattern we build for you.",
      },
    ],
    howWeHelp: [
      {
        title: "One dashboard, every source, real time",
        description: "Sales, expenses, inventory, customer data — all in one view. The dashboard updates as your business does, so the numbers you see are the numbers right now.",
        image: "/assets/services/business-intelligence-dashboard.jpg",
      },
      {
        title: "Automated weekly and monthly reports",
        description: "Your key numbers arrive in your inbox every Monday morning. No more chasing the accountant. No more stale PDFs.",
        image: "/assets/services/business-intelligence-reports.jpg",
      },
      {
        title: "Forecasting and AI insights (Enterprise)",
        description: "Predict next quarter&apos;s revenue, identify customers at risk of churning, and surface the products that are quietly losing you money. The data tells you what to do next.",
        image: "/assets/services/business-intelligence-ai.jpg",
      },
    ],
    outcomes: [
      { label: "Decisions on real numbers", description: "Pricing, hiring, inventory — every decision backed by data, not instinct." },
      { label: "Stale reports, eliminated", description: "Weekly automated reports mean you always know where you stand, not where you stood a month ago." },
      { label: "Predictable growth", description: "When you can see what's coming, you can prepare for it. No more surprises." },
    ],
    faqs: [
      {
        question: "What data sources can you connect?",
        answer: "Any system that exports data — your POS, your accounting software, your bank, your MoMo, spreadsheets, even other CRMs. We connect to all of them and normalise the data.",
      },
      {
        question: "Do I need a data analyst on my team?",
        answer: "No. We build the dashboards for you and maintain them. You see the numbers, we handle the plumbing.",
      },
      {
        question: "How long until the dashboard is live?",
        answer: "Basic: 4 weeks. Professional: 8 weeks. Enterprise (with predictive AI): 3–6 months. We share progress weekly.",
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

    // Landing-page content
    heroImage: "/assets/services/automation-hero.jpg",
    heroImageAlt: "Team reviewing an automated workflow on a screen",
    problems: [
      {
        title: "The same task done a hundred times",
        description: "Every order triggers the same six manual steps: copy from email, paste to spreadsheet, send a Slack message, update a tracker, send a confirmation, file a copy. Every time.",
      },
      {
        title: "Approvals stuck in someone&apos;s inbox",
        description: "A request sits in an email for three days. The boss is on holiday. The customer is waiting. The team is blocked. Nobody knows whose job it is to chase it.",
      },
      {
        title: "Data entered twice, then again",
        description: "The same customer record lives in three systems. Every new entry means typing the same details into all three, hoping nothing gets mistyped.",
      },
    ],
    observations: [
      {
        title: "Automation isn&apos;t the future — it&apos;s the gap",
        description: "Your competitors are starting to automate the repetitive work that eats your team&apos;s day. Every month you wait, the gap widens. We close it in weeks, not years.",
      },
      {
        title: "The work that drains your best people is the work to automate first",
        description: "The tasks your skilled team hates are almost always the ones a system can do. Free them up for the work that actually requires a human.",
      },
    ],
    howWeHelp: [
      {
        title: "Workflow automation end to end",
        description: "We map your process, identify the handoffs, and build the automation. From the trigger to the final notification — without a human in the loop.",
        image: "/assets/services/automation-workflow.jpg",
      },
      {
        title: "Smart document processing",
        description: "Invoices, receipts, applications, contracts. We build the extraction so your team reads the exceptions, not every line.",
        image: "/assets/services/automation-documents.jpg",
      },
      {
        title: "Approval systems and notifications",
        description: "Every request gets routed, every approval gets a deadline, every notification reaches the right person. No more 'I thought you were handling that'.",
        image: "/assets/services/automation-approvals.jpg",
      },
    ],
    outcomes: [
      { label: "Hours back per employee, per week", description: "The work that used to take 30 minutes of typing now takes 30 seconds of review." },
      { label: "Faster turnaround", description: "Approvals that took three days now take three hours. Customers feel the difference." },
      { label: "Zero lost requests", description: "Every request is tracked, every status is visible, nothing disappears into an inbox." },
    ],
    faqs: [
      {
        question: "What can be automated?",
        answer: "Almost any rule-based, repetitive process. Order handling, invoicing, approvals, data entry, notifications, report generation, customer onboarding — if it follows a pattern, we can automate it.",
      },
      {
        question: "Do you use off-the-shelf tools or custom code?",
        answer: "Both, depending on the job. For most workflows we use proven platforms (Zapier, n8n, custom Node). For complex integrations we write code. The right tool for the work.",
      },
      {
        question: "What if the process changes after you build it?",
        answer: "We document every automation so your team can adjust it. We also offer ongoing support — if a process changes, we update the automation with you.",
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

/** Bespoke offerings outside the recurring services */
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

/** Find a service by its URL slug (== id, but explicit for clarity) */
export function getServiceBySlug(slug: string): Service | undefined {
  return servicePackages.find((s) => s.slug === slug);
}
