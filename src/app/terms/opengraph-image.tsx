import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";

export const alt = "Legal terms | Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOg({
    eyebrow: "Legal terms",
    title: "Terms for a",
    titleAccent: "trusted partnership.",
    description:
      "Website usage, intellectual property, disclaimers, and the terms of working with Gileara. Plain language where the law allows.",
  });
}
