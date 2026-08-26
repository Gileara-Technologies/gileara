/**
 * Single source of truth for Insights articles.
 * Consumers: /insights list + /insights/[slug] detail + sitemap generation.
 *
 * Honesty rules (D4): no invented metrics, no claimed client outcomes.
 * Tags use the fixed taxonomy below — do not invent new ones casually.
 */

export const POST_TAGS = ["Packages", "Operations", "Growth", "Automation", "Ghana-market"] as const;
export type PostTag = (typeof POST_TAGS)[number];

export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "cta"; text: string; href: string; label: string };

export interface InsightPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  author: string;
  tag: PostTag;
  /** Optional local cover photo (under /public); gradient fallback when absent (D15). */
  image?: string;
  content: PostBlock[];
}

/** Rough reading time from word count (~200 wpm), minimum 2 minutes. */
export function postReadTime(post: InsightPost): string {
  const words = post.content
    .map((b) => ("text" in b ? b.text : ""))
    .join(" ")
    .split(/\s+/).length;
  return `${Math.max(2, Math.round(words / 200))} min read`;
}

export const posts: InsightPost[] = [
  // ── Seeded package-aligned posts (D11) ────────────────────────────
  {
    slug: "what-all-inclusive-should-mean",
    title: "What \u201CAll-Inclusive\u201D Should Mean When You Buy Software",
    excerpt:
      "Most software quotes hide their real cost in support fees, update charges, and \u201Cmaintenance packages.\u201D Here's what genuinely all-inclusive pricing must cover.",
    date: "2026-09-01",
    author: "Amos Frederick Hughes",
    tag: "Packages",
    content: [
      { type: "paragraph", text: "Ask any business that bought custom software what surprised them most, and the answer is rarely the build price. It's month three, when the support invoice arrives. Or month seven, when an OS update breaks something and fixing it costs extra." },
      { type: "heading", text: "The quote is not the price" },
      { type: "paragraph", text: "Software has two costs: building it and keeping it alive. Many vendors sell you the first and rent you the second, line by line — support tickets, backups, security patches, \u201Cpremium maintenance tiers.\u201D By year two, the hidden half can exceed the original quote." },
      { type: "heading", text: "What all-inclusive must actually cover" },
      { type: "paragraph", text: "If a provider says all-inclusive, hold them to this list: IT support when things break, software updates as platforms evolve, regular backups you can actually restore from, and security monitoring appropriate to your tier. If any of those appear as add-ons later, the promise was marketing." },
      { type: "paragraph", text: "That list isn't theoretical for us — it's written into every Gileara package as managed services from day one, including SLA-backed response and dedicated engineering at Enterprise tier. We publish what's included so you can compare us against quotes that aren't." },
      { type: "heading", text: "Questions to ask any vendor" },
      { type: "paragraph", text: "Before signing anything: What happens when it breaks — who pays? Are updates included forever or billed per release? Where are my backups and how often are they tested? What exactly does the monthly fee cover after launch? Vague answers are your answer." },
      {
        type: "cta",
        text: "Every Gileara package publishes its full tier matrix and managed-services coverage up front.",
        href: "/services",
        label: "See the packages",
      },
    ],
  },
  {
    slug: "from-notebook-to-dashboard",
    title: "From Notebook to Dashboard: What Digital Foundation Actually Changes",
    excerpt:
      "Your business already runs on skill and hustle. Digital Foundation adds the layer that makes both visible — here's what changes in the first ninety days.",
    date: "2026-09-08",
    author: "Rodney Hagan",
    tag: "Ghana-market",
    content: [
      { type: "paragraph", text: "Most Ghanaian MSMEs don't have a technology problem — they have a visibility problem. The sales happened, the customers came, the money moved. But it all lives in notebooks, memory, and WhatsApp threads, which means nobody can see patterns until it's too late to act on them." },
      { type: "heading", text: "Stage one: being findable" },
      { type: "paragraph", text: "Digital Foundation starts with the basics done properly: a real website, mobile-responsive because almost all your traffic will be phones, set up on your own domain, with Google Business Profile configured so nearby customers searching for what you sell actually find you — and can call or get directions in one tap." },
      { type: "heading", text: "Stage two: being measurable" },
      { type: "paragraph", text: "Analytics setup comes standard, scaled by tier — from basic traffic tracking to custom dashboards at Enterprise. The goal isn't vanity graphs; it's answering practical questions: where do enquiries come from, what do people look at, did last week's push change anything?" },
      { type: "heading", text: "What doesn't change" },
      { type: "paragraph", text: "Your operations don't get disrupted. Foundation is deliberately the entry rung — it doesn't ask you to change how you work, it makes sure the market can find the work you already do. When you're ready for inventory, sales recording, and customer systems, Business Operations builds on top of it. Nothing gets thrown away." },
      {
        type: "cta",
        text: "Digital Foundation starts at $550 setup + $85/month, all-inclusive.",
        href: "/services#digital-foundation",
        label: "See the tier details",
      },
    ],
  },
  {
    slug: "momo-reconciliation-without-the-headache",
    title: "MoMo Reconciliation Without the Nightly Headache",
    excerpt:
      "If closing your books means matching MoMo SMS alerts against a notebook every night, this is the workflow fix built for you.",
    date: "2026-09-15",
    author: "Julian Hagan",
    tag: "Operations",
    content: [
      { type: "paragraph", text: "Mobile Money solved payments and created a reconciliation problem. Sales arrive as MoMo, sometimes cash, sometimes both in one transaction — and at closing time somebody matches alerts against notes against memory, night after night." },
      { type: "heading", text: "Why manual matching fails quietly" },
      { type: "paragraph", text: "It's not discipline that's missing, it's structure. A payment recorded in a notebook has no link to the MoMo reference it came from. One transposed digit and the books disagree with the wallet — and the gap only surfaces when it's expensive." },
      { type: "heading", text: "Record the channel with the sale" },
      { type: "paragraph", text: "The fix is structural: every sale records how it was paid at the moment it's entered. Our Business Operations package captures cash and MoMo as separate, structured fields from day one — so the daily summary shows exactly what came through each channel, without anyone re-typing anything." },
      { type: "heading", text: "Close in minutes, not evenings" },
      { type: "paragraph", text: "When channels are structured, closing becomes arithmetic instead of archaeology: totals per channel, discrepancies flagged while they're still traceable, and a record your accountant will actually thank you for. Automation & Efficiency extends this further once you outgrow manual entry entirely." },
      {
        type: "cta",
        text: "Business Operations starts at $1,625 setup + $140/month — inventory, sales, expenses, and structured MoMo capture included.",
        href: "/services#business-operations",
        label: "See Business Operations",
      },
    ],
  },

  // ── Migrated legacy posts (retagged) ──────────────────────────────
  {
    slug: "building-scalable-mvps",
    title: "Building MVPs That Actually Scale",
    excerpt: "How to go from idea to production without painting yourself into a corner.",
    date: "2026-06-15",
    author: "Amos Frederick Hughes",
    tag: "Growth",
    content: [
      { type: "paragraph", text: "Every startup founder hears the same advice: build an MVP, ship fast, iterate. But there's a fine line between moving fast and building something you'll have to throw away entirely." },
      { type: "heading", text: "The MVP Trap" },
      { type: "paragraph", text: "The classic MVP approach — build the smallest possible thing and launch — works great for validating demand. But too many teams treat \"minimum\" as an excuse to cut every corner. The result? A product that collapses under its first wave of real users." },
      { type: "paragraph", text: "The trick isn't to build less. It's to build the right things in the right order, with an architecture that lets you add complexity later without rewriting everything." },
      { type: "heading", text: "Start With the Data Model" },
      { type: "paragraph", text: "Before writing a single line of frontend code, we spend time designing the data model. The data model is the foundation everything else sits on. If it's wrong, every feature built on top of it will need to be reworked." },
      { type: "paragraph", text: "A well-designed data model can handle changes in business logic, new feature additions, and even pivots in product direction — without requiring a full rewrite." },
      { type: "heading", text: "Ship Slices, Not Layers" },
      { type: "paragraph", text: "Instead of building the entire backend first, then the entire frontend, we ship vertical slices — small end-to-end features that go from database to UI. Each slice is a complete, working piece of functionality." },
      { type: "paragraph", text: "This approach means you always have something shippable. If priorities change mid-build, you haven't wasted time on infrastructure that may never be used." },
    ],
  },
  {
    slug: "automating-sme-workflows",
    title: "Where to Start With Workflow Automation",
    excerpt: "A practical guide for SMEs drowning in manual processes.",
    date: "2026-05-28",
    author: "Julian Hagan",
    tag: "Automation",
    content: [
      { type: "paragraph", text: "Every growing business hits a point where spreadsheets, email chains, and manual data entry become a bottleneck. The fix isn't always a massive ERP implementation. Often, it's targeted automation of specific workflows." },
      { type: "heading", text: "Find the Pain Points" },
      { type: "paragraph", text: "Start by asking your team: what task do you dread most? What process takes longer than it should? What requires the most manual rework? These are your candidates for automation." },
      { type: "paragraph", text: "Map out the current workflow step by step. You'll often find that the \"real\" process looks nothing like the documented one." },
      { type: "heading", text: "Measure Before You Build" },
      { type: "paragraph", text: "Before automating anything, measure: how much time does this process take per week? What's the error rate? How does it affect customer satisfaction? These metrics become your ROI baseline." },
      { type: "paragraph", text: "In our experience, the best automation targets are processes that are repetitive, rule-based, and involve moving data between systems. These are high-ROI and low-risk to automate." },
      { type: "heading", text: "Build, Don't Buy" },
      { type: "paragraph", text: "Off-the-shelf tools work for generic processes, but every business has unique workflows that make it competitive. Custom automation that fits your exact process — rather than forcing you to adapt to a tool — delivers far more value over time." },
    ],
  },
  {
    slug: "choosing-tech-stack",
    title: "How We Choose a Tech Stack",
    excerpt: "Our framework for picking the right tools for each project.",
    date: "2026-04-10",
    author: "Rodney Hagan",
    tag: "Operations",
    content: [
      { type: "paragraph", text: "Picking a tech stack is one of the most consequential decisions in any software project. Get it right, and you build momentum. Get it wrong, and you're fighting your tools for years." },
      { type: "heading", text: "Context Over Trends" },
      { type: "paragraph", text: "We don't choose technologies based on what's popular. We choose based on the specific context of each project: the team's expertise, the problem domain, expected scale, and long-term maintenance requirements." },
      { type: "paragraph", text: "A blockchain-backed microservice architecture might be impressive on a resume, but it's probably wrong for an internal reporting tool." },
      { type: "heading", text: "The Right Tradeoffs" },
      { type: "paragraph", text: "Every technology choice involves tradeoffs. TypeScript gives us type safety at the cost of upfront verbosity. Python gives us rapid iteration at the cost of runtime performance. PostgreSQL gives us reliability at the cost of horizontal scaling complexity." },
      { type: "paragraph", text: "The key is understanding which tradeoffs matter for your specific use case — and which ones you'll regret six months from now." },
      { type: "heading", text: "Our Default Stack" },
      { type: "paragraph", text: "For most projects, our default stack is TypeScript (both frontend and backend), Next.js for web applications, PostgreSQL for data, and Cloudflare or AWS for infrastructure. But we'll happily deviate from this when the project calls for it." },
    ],
  },
];
