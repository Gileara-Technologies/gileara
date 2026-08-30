import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";

export const alt = "How we solve it — vertical transformation playbooks | Gileara";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOg({
    eyebrow: "How we solve it",
    title: "Playbooks, not",
    titleAccent: "promises.",
    description:
      "Vertical transformation playbooks for pharmacy, school, restaurant, retail, salon. The exact problems and the exact systems for each.",
  });
}
