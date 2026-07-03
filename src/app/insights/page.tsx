import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InsightsListClient from "./InsightsListClient";

export const metadata: Metadata = {
  title: "Insights | Gileara Technologies",
  description:
    "Technical insights, engineering perspectives, and strategic thinking from the team at Gileara Technologies.",
  alternates: { canonical: "/insights" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Insights | Gileara Technologies",
    description: "Technical insights, engineering perspectives, and strategic thinking from the team at Gileara.",
    url: "/insights",
    siteName: "Gileara Technologies",
    type: "website",
    images: [{ url: "/assets/gileara/og-insights.svg", width: 1200, height: 630, alt: "Gileara Technologies insights" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights | Gileara Technologies",
    description: "Technical insights from the team at Gileara.",
    images: ["/assets/gileara/og-insights.svg"],
  },
};

const posts = [
  {
    slug: "building-scalable-mvps",
    title: "Building MVPs That Actually Scale",
    excerpt: "How to go from idea to production without painting yourself into a corner.",
    date: "2026-06-15",
    author: "Amos Frederick Hughes",
  },
  {
    slug: "automating-sme-workflows",
    title: "Where to Start With Workflow Automation",
    excerpt: "A practical guide for SMEs drowning in manual processes.",
    date: "2026-05-28",
    author: "Julian Hagan",
  },
  {
    slug: "choosing-tech-stack",
    title: "How We Choose a Tech Stack",
    excerpt: "Our framework for picking the right tools for each project.",
    date: "2026-04-10",
    author: "Rodney Hagan",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://gileara.org/insights/#webpage",
      name: "Insights | Gileara Technologies",
      description: "Technical insights, engineering perspectives, and strategic thinking from the team at Gileara Technologies.",
      url: "https://gileara.org/insights",
      publisher: { "@type": "Organization", name: "Gileara Technologies", url: "https://gileara.org", logo: "https://gileara.org/assets/gileara/logo-icon.png" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://gileara.org/insights/#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://gileara.org" },
        { "@type": "ListItem", position: 2, name: "Insights", item: "https://gileara.org/insights" },
      ],
    },
    ...posts.map((p, i) => ({
      "@type": "BlogPosting",
      "@id": `https://gileara.org/insights/${p.slug}/#post`,
      headline: p.title,
      description: p.excerpt,
      datePublished: p.date,
      author: { "@type": "Person", name: p.author },
      publisher: { "@type": "Organization", name: "Gileara Technologies" },
      url: `https://gileara.org/insights/${p.slug}`,
    })),
  ],
};

export default function InsightsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <InsightsListClient posts={posts} />
      </main>
      <Footer />
    </>
  );
}
