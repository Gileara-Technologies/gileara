import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";

export const alt = "FAQ — Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOg({
    eyebrow: "FAQ",
    title: "Straight answers about",
    titleAccent: "working with us.",
    description:
      "Where we work, who we work with, how the engagement works, contracts, data ownership. No spin.",
  });
}
