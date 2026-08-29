import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesPageClient from "./ServicesPageClient";
import { servicePackages, MANAGED_SERVICES_NOTE } from "@/content/packages";

export const metadata: Metadata = {
  title: "What we build | Gileara Technologies",
  description:
    "The five problems we see most in small business, and the systems we build to solve each one — with full pricing, feature matrices, and what's included. Currently piloting in Ghana, built to scale globally.",
  alternates: { canonical: "/services" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "What we build | Gileara Technologies",
    description: "The five problems we see most in small business, and the systems we build to solve each one. With full pricing and feature matrices.",
    url: "/services",
    siteName: "Gileara Technologies",
    type: "website",
    images: [{ url: "/assets/gileara/og-services.svg", width: 1200, height: 630, alt: "Gileara Technologies services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What we build | Gileara Technologies",
    description: "The five problems we see most in small business, and the systems we build to solve each one.",
    images: ["/assets/gileara/og-services.svg"],
  },
};

const base = "https://gileara.org";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${base}/services/#webpage`,
      url: `${base}/services`,
      name: "What we build | Gileara Technologies",
      description:
        "The five problems we see most in small business, and the systems we build to solve each one.",
      isPartOf: { "@id": `${base}/#website` },
      breadcrumb: { "@id": `${base}/services/#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${base}/services/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "What we build", item: `${base}/services` },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${base}/services/#service-catalog`,
      name: "Gileara service catalog",
      description:
        "The five problems we see most in small business, and the systems we build to solve each one.",
      numberOfItems: servicePackages.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: servicePackages.map((pkg, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          "@id": `${base}/services/${pkg.slug}/#service`,
          name: `Gileara ${pkg.name}`,
          description: `${pkg.tagline} ${MANAGED_SERVICES_NOTE}`,
          serviceType: pkg.name,
          provider: { "@id": `${base}/#organization` },
          url: `${base}/services/${pkg.slug}`,
          areaServed: [
            { "@type": "Country", name: "Ghana" },
            { "@type": "Place", name: "Africa" },
            { "@type": "Place", name: "Worldwide" },
          ],
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: pkg.tiers[0].monthlyFeeUsd,
            highPrice: pkg.tiers[pkg.tiers.length - 1].monthlyFeeUsd,
            offerCount: pkg.tiers.length,
            category: pkg.primaryGoal,
          },
        },
      })),
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <ServicesPageClient />
      </main>
      <Footer />
    </>
  );
}