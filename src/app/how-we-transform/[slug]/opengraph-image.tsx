import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";
import { getPublicScenario } from "@/lib/cms/public-scenarios";

export const alt = "Playbook | Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// No generateStaticParams -- same move as the main [slug]/page.tsx: a
// CMS-created playbook has no build-time-known slug, so every slug
// (seeded or CMS-created) resolves on demand via getPublicScenario.

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const scenario = await getPublicScenario(params.slug);
  if (!scenario) return [];
  return [
    {
      id: scenario.id,
      alt: `${scenario.vertical} Playbook | Gileara`,
      contentType: OG_CONTENT_TYPE,
      size: OG_SIZE,
    },
  ];
}

export default async function Image({ params }: { params: { slug: string } }) {
  const scenario = await getPublicScenario(params.slug);
  if (!scenario) {
    return renderOg({
      eyebrow: "How we solve it",
      title: "Playbook",
      description: "Vertical transformation playbooks.",
    });
  }
  return renderOg({
    eyebrow: `How we solve it · ${scenario.vertical}`,
    title: scenario.headline,
    description: scenario.ghanaContext,
    badge: scenario.status,
  });
}
