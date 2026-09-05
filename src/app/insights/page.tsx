import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InsightsListClient from "./InsightsListClient";
import { posts, postReadTime } from "@/content/posts";

export const metadata: Metadata = {
  title: "Insights | Gileara Technologies",
  description:
    "Practical insights for small and growing businesses — operations, growth, automation, and the realities of going digital. Currently informed by our Ghana pilot, applicable globally.",
  alternates: { canonical: "/insights" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Insights | Gileara Technologies",
    description: "Practical insights for small and growing businesses going digital — currently informed by our Ghana pilot, applicable globally.",
    url: "/insights",
    siteName: "Gileara Technologies",
    type: "website",
    // og:image is auto-injected by /opengraph-image.tsx (1200x630 PNG)
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights | Gileara Technologies",
    description: "Practical insights for small and growing businesses going digital — currently informed by our Ghana pilot, applicable globally.",
    // twitter:image is auto-injected by /opengraph-image.tsx
  },
};

const postMeta = [...posts]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    author: p.author,
    tag: p.tag,
    readTime: postReadTime(p),
    image: p.image,
  }));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://gileara.org/insights/#webpage",
      name: "Insights | Gileara Technologies",
      description: "Practical insights for small and growing businesses going digital — currently informed by our Ghana pilot, applicable globally.",
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
    ...posts.map((p) => ({
      "@type": "BlogPosting",
      "@id": `https://gileara.org/insights/${p.slug}/#post`,
      headline: p.title,
      description: p.excerpt,
      datePublished: p.date,
      author: { "@type": "Person", name: p.author },
      publisher: { "@type": "Organization", name: "Gileara Technologies" },
      url: `https://gileara.org/insights/${p.slug}`,
      ...(p.image
        ? {
            image: {
              "@type": "ImageObject",
              url: `https://gileara.org${p.image}`,
              width: 1200,
              height: 630,
            },
          }
        : {}),
    })),
  ],
};

export default function InsightsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <InsightsListClient posts={postMeta} />
      </main>
      <Footer />
    </>
  );
}
