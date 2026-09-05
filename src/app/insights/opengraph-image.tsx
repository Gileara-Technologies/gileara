import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";

export const alt = "Insights — Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOg({
    eyebrow: "Insights",
    title: "Practical insights for",
    titleAccent: "small business operators.",
    description:
      "On operations, growth, automation, and the realities of going digital. Written from the field, not from a slide deck.",
    badge: "Blog",
  });
}
