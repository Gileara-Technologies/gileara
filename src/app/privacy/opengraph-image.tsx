import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";

export const alt = "Privacy practices | Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOg({
    eyebrow: "Privacy",
    title: "Privacy practices built for",
    titleAccent: "trust and clarity.",
    description:
      "What information we collect, why, how long we keep it, and your rights. Written for clarity, not for cover.",
  });
}
