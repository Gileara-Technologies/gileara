import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InsightsPostClient from "./InsightsPostClient";

interface Props {
  params: Promise<{ slug: string }>;
}

const posts = [
  {
    slug: "building-scalable-mvps",
    title: "Building MVPs That Actually Scale",
    excerpt: "How to go from idea to production without painting yourself into a corner.",
    date: "2026-06-15",
    author: "Amos Frederick Hughes",
    content: [
      { type: "paragraph" as const, text: "Every startup founder hears the same advice: build an MVP, ship fast, iterate. But there's a fine line between moving fast and building something you'll have to throw away entirely." },
      { type: "heading" as const, text: "The MVP Trap" },
      { type: "paragraph" as const, text: "The classic MVP approach — build the smallest possible thing and launch — works great for validating demand. But too many teams treat \"minimum\" as an excuse to cut every corner. The result? A product that collapses under its first wave of real users." },
      { type: "paragraph" as const, text: "The trick isn't to build less. It's to build the right things in the right order, with an architecture that lets you add complexity later without rewriting everything." },
      { type: "heading" as const, text: "Start With the Data Model" },
      { type: "paragraph" as const, text: "Before writing a single line of frontend code, we spend time designing the data model. The data model is the foundation everything else sits on. If it's wrong, every feature built on top of it will need to be reworked." },
      { type: "paragraph" as const, text: "A well-designed data model can handle changes in business logic, new feature additions, and even pivots in product direction — without requiring a full rewrite." },
      { type: "heading" as const, text: "Ship Slices, Not Layers" },
      { type: "paragraph" as const, text: "Instead of building the entire backend first, then the entire frontend, we ship vertical slices — small end-to-end features that go from database to UI. Each slice is a complete, working piece of functionality." },
      { type: "paragraph" as const, text: "This approach means you always have something shippable. If priorities change mid-build, you haven't wasted time on infrastructure that may never be used." },
    ],
  },
  {
    slug: "automating-sme-workflows",
    title: "Where to Start With Workflow Automation",
    excerpt: "A practical guide for SMEs drowning in manual processes.",
    date: "2026-05-28",
    author: "Julian Hagan",
    content: [
      { type: "paragraph" as const, text: "Every growing business hits a point where spreadsheets, email chains, and manual data entry become a bottleneck. The fix isn't always a massive ERP implementation. Often, it's targeted automation of specific workflows." },
      { type: "heading" as const, text: "Find the Pain Points" },
      { type: "paragraph" as const, text: "Start by asking your team: what task do you dread most? What process takes longer than it should? What requires the most manual rework? These are your candidates for automation." },
      { type: "paragraph" as const, text: "Map out the current workflow step by step. You'll often find that the \"real\" process looks nothing like the documented one." },
      { type: "heading" as const, text: "Measure Before You Build" },
      { type: "paragraph" as const, text: "Before automating anything, measure: how much time does this process take per week? What's the error rate? How does it affect customer satisfaction? These metrics become your ROI baseline." },
      { type: "paragraph" as const, text: "In our experience, the best automation targets are processes that are repetitive, rule-based, and involve moving data between systems. These are high-ROI and low-risk to automate." },
      { type: "heading" as const, text: "Build, Don't Buy" },
      { type: "paragraph" as const, text: "Off-the-shelf tools work for generic processes, but every business has unique workflows that make it competitive. Custom automation that fits your exact process — rather than forcing you to adapt to a tool — delivers far more value over time." },
    ],
  },
  {
    slug: "choosing-tech-stack",
    title: "How We Choose a Tech Stack",
    excerpt: "Our framework for picking the right tools for each project.",
    date: "2026-04-10",
    author: "Rodney Hagan",
    content: [
      { type: "paragraph" as const, text: "Picking a tech stack is one of the most consequential decisions in any software project. Get it right, and you build momentum. Get it wrong, and you're fighting your tools for years." },
      { type: "heading" as const, text: "Context Over Trends" },
      { type: "paragraph" as const, text: "We don't choose technologies based on what's popular. We choose based on the specific context of each project: the team's expertise, the problem domain, expected scale, and long-term maintenance requirements." },
      { type: "paragraph" as const, text: "A blockchain-backed microservice architecture might be impressive on a resume, but it's probably wrong for an internal reporting tool." },
      { type: "heading" as const, text: "The Right Tradeoffs" },
      { type: "paragraph" as const, text: "Every technology choice involves tradeoffs. TypeScript gives us type safety at the cost of upfront verbosity. Python gives us rapid iteration at the cost of runtime performance. PostgreSQL gives us reliability at the cost of horizontal scaling complexity." },
      { type: "paragraph" as const, text: "The key is understanding which tradeoffs matter for your specific use case — and which ones you'll regret six months from now." },
      { type: "heading" as const, text: "Our Default Stack" },
      { type: "paragraph" as const, text: "For most projects, our default stack is TypeScript (both frontend and backend), Next.js for web applications, PostgreSQL for data, and Cloudflare or AWS for infrastructure. But we'll happily deviate from this when the project calls for it." },
    ],
  },
];

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | Insights | Gileara Technologies`,
    description: post.excerpt,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      title: `${post.title} | Gileara Technologies`,
      description: post.excerpt,
      url: `/insights/${slug}`,
      siteName: "Gileara Technologies",
      type: "article",
      publishedTime: post.date,
      images: [{ url: "https://gileara.org/assets/gileara/og-insights.svg", width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function InsightsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main>
        <InsightsPostClient post={post} />
      </main>
      <Footer />
    </>
  );
}
