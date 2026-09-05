import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";

export const alt = "Security & reliability — Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOg({
    eyebrow: "Security & reliability",
    title: "How we keep the systems",
    titleAccent: "your business runs on.",
    description:
      "Support, updates, backups, and monitoring — how we keep Gileara-built systems running safely. Plus how to report vulnerabilities.",
  });
}
