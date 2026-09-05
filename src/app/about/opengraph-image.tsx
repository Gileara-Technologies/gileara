import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";

export const alt = "About — Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOg({
    eyebrow: "About",
    title: "Built by people who've",
    titleAccent: "lived the problem.",
    description:
      "Three founders. One mission. We build the systems small business can't build alone — currently piloting in Ghana, designed to scale globally.",
  });
}
