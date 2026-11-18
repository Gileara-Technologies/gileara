import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IndustryStrip from "@/components/IndustryStrip";
import InstagramFeed from "@/components/InstagramFeed";
import HomeScene from "@/components/scene/HomeScene";
import CinematicStory from "@/components/CinematicStory";
import Pricing from "@/components/Pricing";
import Approach from "@/components/Approach";
import AuditSection from "@/components/audit/AuditSection";
import Positioning from "@/components/Positioning";
import FoundingClient from "@/components/FoundingClient";
import ContactBand from "@/components/ContactBand";
import Footer from "@/components/Footer";
import { servicePackages, customServices, MANAGED_SERVICES_NOTE } from "@/content/packages";
import { siteConfig, socialProfiles } from "@/content/site-config";
import { founders } from "@/content/founders";
import { getPublicInstagramPosts } from "@/lib/instagram/public-instagram";

// The Instagram strip reads cms_instagram_posts per request (D1, no
// fallback -- docs/INSTAGRAM-CONNECTOR-PLAN.md), so this route is no
// longer prerenderable at build time -- same reasoning as /faq,
// /insights, /how-we-transform, and /about's force-dynamic. Without
// this, Next would have statically baked in whatever
// getPublicInstagramPosts() resolved to at build time (always [], since
// there is no Cloudflare context during `next build`) and the homepage
// would show the empty state forever, even after a real sync.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description:
    "Gileara builds the operations, sales, customer, and reporting systems small businesses run on. Piloting in Ghana, built to scale globally.",
  alternates: {
    canonical: "https://gileara.org",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Gileara Technologies",
    "small business systems",
    "operations for small business",
    "business automation",
    "mobile money integration",
    "chat-based business systems",
    "inventory management system",
    "CRM for small business",
    "business intelligence dashboards",
    "managed IT services",
    "Africa tech partner",
  ],
  openGraph: {
    type: "website",
    siteName: "Gileara Technologies",
    locale: "en_US",
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
      sameAs: socialProfiles.map((p) => p.url),
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
        "We build the systems your business runs on — the operations, sales, customer, and reporting infrastructure small business can't build alone. Currently piloting in Ghana, designed to scale globally.",
      foundingDate: "2024",
      email: siteConfig.email,
      sameAs: socialProfiles.map((p) => p.url),
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
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://gileara.org/insights?q={search_term_string}",
        },
        // Google ignores custom search unless wired to a real search endpoint.
        // This SearchAction still serves as a structured hint that the site has
        // a topical hub at /insights. A real `query-input` requires an actual
        // site-search index; we'll wire it once that lands.
        queryInput: "required name=search_term_string",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://gileara.org/#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://gileara.org" },
      ],
    },
    // Founder Person schema — one node per co-founder, linked back
    // to the Organization. Helps Knowledge Graph associate the
    // founder LinkedIn URLs with the brand.
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
      // Starter's monthly fee, not the setup fee: three of the five
      // packages have no onboarding fee at all (setupFeeGhs: 0), which
      // would read as "price: 0" (free) to a crawler -- the monthly
      // subscription is the real, always-defined recurring price point.
      offers: {
        "@type": "Offer",
        priceCurrency: "GHS",
        price: pkg.tiers[0].monthlyFeeGhs,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: pkg.tiers[0].monthlyFeeGhs,
          priceCurrency: "GHS",
          unitText: "month",
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

export default async function Home() {
  const instagramPosts = await getPublicInstagramPosts();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeScene />
      <Navbar />
      {/* data-scene-root: each direct child is one "station" of the 3D
          scene (src/components/scene/pieces.tsx lists the set piece for
          each, in this order). Reordering sections here reorders the
          journey; keep the two lists aligned. */}
      <main data-scene-root>
        <Hero />
        <IndustryStrip />
        <InstagramFeed posts={instagramPosts} />
        <CinematicStory />
        <Pricing />
        <Approach />
        <AuditSection />
        <Positioning />
        <FoundingClient />
        <ContactBand
          headline={
            <>
              Ready when{" "}
              <span className="italic text-accent-bright">you are.</span>
            </>
          }
        />
      </main>
      <Footer />
    </>
  );
}