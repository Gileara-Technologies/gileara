import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowWeTransformClient from "./HowWeTransformClient";
import { scenarios } from "@/content/scenarios";

const base = "https://gileara.org";

export const metadata: Metadata = {
  title: "How We Transform | Gileara Technologies",
  description:
    "Vertical transformation playbooks for small and growing businesses — pharmacy, school, restaurant, retail, salon. The exact problems and the exact systems for each. Currently informed by our Ghana pilot.",
  alternates: { canonical: "/how-we-transform" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "How We Solve It | Gileara Technologies",
    description:
      "The exact problems and the exact systems for pharmacy, school, restaurant, retail, salon — honest about being scenarios, not client claims.",
    url: "/how-we-transform",
    siteName: "Gileara Technologies",
    type: "website",
    // og:image is auto-injected by /opengraph-image.tsx (1200x630 PNG)
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Solve It | Gileara Technologies",
    description: "The five problems and the exact systems for pharmacy, school, restaurant, retail, salon — currently informed by our Ghana pilot.",
    // twitter:image is auto-injected by /opengraph-image.tsx
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${base}/how-we-transform/#webpage`,
      url: `${base}/how-we-transform`,
      name: "How We Transform | Gileara Technologies",
      description:
        "Vertical transformation playbooks for small and growing businesses. Honest about being scenarios, not client claims.",
      isPartOf: { "@id": `${base}/#website` },
      breadcrumb: { "@id": `${base}/how-we-transform/#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${base}/how-we-transform/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "How we solve it", item: `${base}/how-we-transform` },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${base}/how-we-transform/#playbook-list`,
      name: "Vertical transformation playbooks",
      description:
        "Playbooks for the verticals we serve. Each is a scenario we're ready to implement — not a client claim.",
      numberOfItems: scenarios.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: scenarios.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Article",
          "@id": `${base}/how-we-transform/${s.id}/#playbook`,
          headline: s.headline,
          name: `${s.vertical} Playbook`,
          description: s.ghanaContext,
          articleSection: s.vertical,
          about: s.painPoints[0],
          author: { "@id": `${base}/#organization` },
          publisher: { "@id": `${base}/#organization` },
          url: `${base}/how-we-transform/${s.id}`,
        },
      })),
    },
  ],
};

export default function HowWeTransformPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <HowWeTransformClient />
      </main>
      <Footer />
    </>
  );
}