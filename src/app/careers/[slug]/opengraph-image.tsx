import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";
import { getPublicRole } from "@/lib/portal/public-roles";

export const alt = "Careers | Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const role = await getPublicRole(params.slug);
  if (!role) return [];
  return [
    {
      id: role.id,
      alt: `${role.title} | Gileara Careers`,
      contentType: OG_CONTENT_TYPE,
      size: OG_SIZE,
    },
  ];
}

export default async function Image({ params }: { params: { slug: string } }) {
  const role = await getPublicRole(params.slug);
  if (!role) {
    return renderOg({
      eyebrow: "Careers",
      title: "Open Roles",
      description: "Join Gileara Technologies.",
    });
  }
  return renderOg({
    eyebrow: "Careers",
    title: role.title,
    description: role.description,
    badge: "Hiring",
  });
}
