import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, servicePackages } from "@/content/packages";
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
  return <ServiceLandingPage service={service} />;
}
