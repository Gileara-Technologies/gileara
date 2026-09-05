import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";
import { scenarios } from "@/content/scenarios";

export const alt = "Playbook | Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return scenarios.map((s) => ({ slug: s.id }));
}

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const scenario = scenarios.find((s) => s.id === params.slug);
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
  const scenario = scenarios.find((s) => s.id === params.slug);
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
