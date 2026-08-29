import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, servicePackages } from "@/content/packages";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceLandingPage from "@/components/ServiceLandingPage";

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
  return (
    <>
      <Navbar />
      <main>
        <ServiceLandingPage service={service} />
      </main>
      <Footer />
    </>
  );
}
