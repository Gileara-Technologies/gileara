import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CinematicStory from "@/components/CinematicStory";
import BentoGrid from "@/components/BentoGrid";
import Positioning from "@/components/Positioning";
import Approach from "@/components/Approach";
import Founders from "@/components/Founders";
import CareersCTA from "@/components/CareersCTA";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://gileara.org",
  },
  keywords: [
    "Gileara Technologies",
    "custom software development",
    "workflow automation",
    "digital strategy",
    "business technology systems",
    "SME technology solutions",
    "software engineering Ghana",
    "startup technology partner",
  ],
  openGraph: {
    url: "https://gileara.org",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://gileara.org/#organization",
      name: "Gileara Technologies",
      url: "https://gileara.org",
      logo: "https://gileara.org/assets/gileara/logo-icon.png",
      description:
        "Gileara builds the custom software and digital systems that power modern businesses.",
      foundingDate: "2024",
      contactPoint: {
        "@type": "ContactPoint",
        email: "tech.gileara@gmail.com",
        contactType: "sales",
      },
      sameAs: ["https://www.linkedin.com/company/gileara"],
    },
    {
      "@type": "WebSite",
      "@id": "https://gileara.org/#website",
      url: "https://gileara.org",
      name: "Gileara Technologies | Systems for Growing Businesses",
      publisher: { "@id": "https://gileara.org/#organization" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://gileara.org/#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://gileara.org" },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <CinematicStory />
        <BentoGrid />
        <Positioning />
        <Approach />
        <Founders />
        <CareersCTA />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
