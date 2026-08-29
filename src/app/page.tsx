import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CinematicStory from "@/components/CinematicStory";
import Pricing from "@/components/Pricing";
import Approach from "@/components/Approach";
import Positioning from "@/components/Positioning";
import Founders from "@/components/Founders";
import FoundingClient from "@/components/FoundingClient";
import ContactBand from "@/components/ContactBand";
import Footer from "@/components/Footer";
import { servicePackages, customServices, MANAGED_SERVICES_NOTE } from "@/content/packages";
import { siteConfig } from "@/content/site-config";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://gileara.org",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Gileara Technologies",
    "digital transformation",
    "small business technology packages",
    "business automation",
    "mobile money integration",
    "WhatsApp business systems",
    "inventory management system",
    "CRM for small business",
    "business intelligence dashboards",
    "managed IT services",
    "Africa tech partner",
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
      name: siteConfig.name,
      url: "https://gileara.org",
      logo: "https://gileara.org/assets/gileara/logo-icon.png",
      description: siteConfig.positioningLine,
      foundingDate: "2024",
      contactPoint: {
        "@type": "ContactPoint",
        email: siteConfig.email,
        contactType: "sales",
      },
      sameAs: ["https://www.linkedin.com/company/gileara"],
      address: {
        "@type": "PostalAddress",
        addressCountry: "GH",
        addressLocality: "Accra",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://gileara.org/#organization-business",
      name: siteConfig.name,
      url: "https://gileara.org",
      logo: "https://gileara.org/assets/gileara/logo-icon.png",
      image: "https://gileara.org/assets/gileara/logo-full.png",
      description:
        "All-inclusive monthly digital transformation packages for small and growing businesses — currently piloting in Ghana, built to scale globally. Managed services included from day one.",
      foundingDate: "2024",
      email: siteConfig.email,
      sameAs: ["https://www.linkedin.com/company/gileara"],
      address: {
        "@type": "PostalAddress",
        addressCountry: "GH",
        addressLocality: siteConfig.location,
      },
      areaServed: [
        { "@type": "Country", name: "Ghana" },
        { "@type": "Place", name: "Africa" },
        { "@type": "Place", name: "Worldwide" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: siteConfig.email,
        contactType: "sales",
        areaServed: ["GH", "AF", "Worldwide"],
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://gileara.org/#webpage",
      url: "https://gileara.org",
      name: `${siteConfig.name} | We Build the Systems Your Business Runs On`,
      description: siteConfig.positioningLine,
      about: { "@id": "https://gileara.org/#organization" },
      mainEntity: { "@id": "https://gileara.org/#organization" },
    },
    {
      "@type": "WebSite",
      "@id": "https://gileara.org/#website",
      url: "https://gileara.org",
      name: siteConfig.name,
      publisher: { "@id": "https://gileara.org/#organization" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://gileara.org/#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://gileara.org" },
      ],
    },
    // Service schema generated from the same data the UI renders (packages.ts)
    ...servicePackages.map((pkg) => ({
      "@type": "Service",
      "@id": `https://gileara.org/#package-${pkg.id}`,
      name: `Gileara ${pkg.name}`,
      description: `${pkg.tagline} ${MANAGED_SERVICES_NOTE}`,
      serviceType: pkg.name,
      provider: { "@id": "https://gileara.org/#organization" },
      areaServed: [
        { "@type": "Country", name: "Ghana" },
        { "@type": "Place", name: "Africa" },
        { "@type": "Place", name: "Worldwide" },
      ],
      category: pkg.primaryGoal,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: pkg.tiers[0].setupFeeUsd,
        priceSpecification: {
          "@type": "CompoundPriceSpecification",
          price: pkg.tiers[0].setupFeeUsd,
          priceCurrency: "USD",
          valueAddedTaxIncluded: true,
        },
      },
    })),
    ...customServices.map((s) => ({
      "@type": "Service",
      "@id": `https://gileara.org/#service-${s.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: s.name,
      description: `Bespoke engagement starting at $${s.startingPriceUsd.toLocaleString("en-US")} USD.`,
      serviceType: s.name,
      provider: { "@id": "https://gileara.org/#organization" },
      areaServed: { "@type": "Country", name: "Ghana" },
      category: "Technology Consulting",
    })),
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
        <Pricing />
        <Approach />
        <Positioning />
        <Founders />
        <FoundingClient />
        <ContactBand
          headline={
            <>
              Ready when{" "}
              <span className="italic text-accent-cyan">you are.</span>
            </>
          }
        />
      </main>
      <Footer />
    </>
  );
}