import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, servicePackages, MANAGED_SERVICES_NOTE } from "@/content/packages";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceLandingPage from "@/components/ServiceLandingPage";

const base = "https://gileara.org";

export async function generateStaticParams() {
  return servicePackages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service not found — Gileara" };
  return {
    title: `${service.name} — ${service.tagline} | Gileara`,
    description: service.tagline,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `Gileara ${service.name} — ${service.tagline}`,
      description: service.tagline,
      url: `/services/${service.slug}`,
      siteName: "Gileara Technologies",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Gileara ${service.name}`,
      description: service.tagline,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  // Structured data: Service + Offer (per tier) + BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${base}/services/${service.slug}/#service`,
        name: `Gileara ${service.name}`,
        description: `${service.tagline} ${MANAGED_SERVICES_NOTE}`,
        serviceType: service.name,
        provider: { "@id": `${base}/#organization` },
        url: `${base}/services/${service.slug}`,
        image: `${base}/assets/services/${service.slug === "automation-efficiency" ? "automation" : service.slug.split("-")[0]}-hero.jpg`,
        areaServed: [
          { "@type": "Country", name: "Ghana" },
          { "@type": "Place", name: "Africa" },
          { "@type": "Place", name: "Worldwide" },
        ],
        category: service.primaryGoal,
        offers: service.tiers.map((tier) => ({
          "@type": "Offer",
          name: `Gileara ${service.name} — ${tier.name}`,
          category: service.name,
          priceCurrency: "USD",
          price: tier.monthlyFeeUsd,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            priceCurrency: "USD",
            price: tier.monthlyFeeUsd,
            unitText: "month",
          },
          description: `Setup $${tier.setupFeeUsd.toLocaleString("en-US")} + $${tier.monthlyFeeUsd}/month — ${tier.deliveryTime} delivery.`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${base}/services/${service.slug}/#faq`,
        url: `${base}/services/${service.slug}`,
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${base}/services/${service.slug}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: base },
          { "@type": "ListItem", position: 2, name: "What we build", item: `${base}/services` },
          { "@type": "ListItem", position: 3, name: service.name, item: `${base}/services/${service.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <ServiceLandingPage service={service} />
      </main>
      <Footer />
    </>
  );
}
