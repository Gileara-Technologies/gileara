import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutPageClient from "./AboutPageClient";
import { founders } from "@/content/founders";

export const metadata: Metadata = {
  title: "About Us | Gileara Technologies",
  description:
    "Meet the founders, leaders, and engineering team at Gileara Technologies, and where the name comes from.",
  alternates: {
    canonical: "/about",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "About Us | Gileara Technologies",
    description:
      "Meet Amos, Julian, and Rodney, the three founders behind Gileara Technologies.",
    url: "/about",
    siteName: "Gileara Technologies",
    type: "website",
    // og:image is auto-injected by /opengraph-image.tsx (1200x630 PNG)
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Gileara Technologies",
    description: "Meet the team behind Gileara Technologies.",
    // twitter:image is auto-injected by /opengraph-image.tsx
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://gileara.org/about/#webpage",
      name: "About Us | Gileara Technologies",
      description:
        "Meet the team at Gileara Technologies: a small group of engineers, designers, and strategists building the systems small businesses run on.",
      url: "https://gileara.org/about",
      publisher: {
        "@type": "Organization",
        name: "Gileara Technologies",
        url: "https://gileara.org",
        logo: "https://gileara.org/assets/gileara/logo-icon.png",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://gileara.org/about/#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://gileara.org" },
        { "@type": "ListItem", position: 2, name: "About", item: "https://gileara.org/about" },
      ],
    },
    // Person schema for the three co-founders — used by Google
    // Knowledge Graph to associate the founders' LinkedIn profiles
    // with the brand. Mirrors the homepage Person block.
    ...founders.map((f) => ({
      "@type": "Person",
      "@id": `https://gileara.org/#person-${f.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: f.name,
      jobTitle: f.role,
      description: f.cred,
      image: `https://gileara.org${f.image}`,
      worksFor: { "@id": "https://gileara.org/#organization" },
      sameAs: [f.linkedin],
    })),
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <AboutPageClient />
      </main>
      <Footer />
    </>
  );
}