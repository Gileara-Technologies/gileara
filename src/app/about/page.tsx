import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us | Gileara Technologies",
  description:
    "Engineering the future of high-performance digital ecosystems. Meet the leadership and engineering teams at Gileara Technologies.",
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
      "The visionary leadership steering Gileara's technological dominance. Meet Amos, Julian, and Rodney.",
    url: "/about",
    siteName: "Gileara Technologies",
    type: "website",
    images: [
      {
        url: "/assets/gileara/og-about.svg",
        width: 1200,
        height: 630,
        alt: "About Gileara Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Gileara Technologies",
    description: "Meet the team behind Gileara Technologies.",
    images: ["/assets/gileara/og-about.svg"],
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
        "Meet the team at Gileara Technologies — a lean group of engineers, designers, and strategists building technology that moves businesses forward.",
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