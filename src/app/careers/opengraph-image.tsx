import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";

export const alt = "Careers — Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOg({
    eyebrow: "Careers",
    title: "Build the systems",
    titleAccent: "small businesses run on.",
    description:
      "We're hiring full-stack, UI/UX, DevOps, and PM. Help us build the operating system for the next generation of small business.",
    badge: "Hiring",
  });
}
