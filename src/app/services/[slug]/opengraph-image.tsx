import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";
import { getServiceBySlug, servicePackages } from "@/content/packages";

export const alt = "Service | Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  return servicePackages.map((p) => ({ slug: p.slug }));
}

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) return [];
  return [
    {
      id: service.slug,
      alt: `${service.name} — ${service.tagline} | Gileara`,
      contentType: OG_CONTENT_TYPE,
      size: OG_SIZE,
    },
  ];
}

export default async function Image({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) {
    return renderOg({
      eyebrow: "What we build",
      title: "Service",
      description: "Gileara service catalog.",
    });
  }
  return renderOg({
    eyebrow: `What we build · ${service.name}`,
    title: service.name,
    titleAccent: "— built for you.",
    description: service.tagline,
    badge: service.name,
  });
}
