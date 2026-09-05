import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";

export const alt = "What we build — Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOg({
    eyebrow: "What we build",
    title: "Five problems.",
    titleAccent: "One system each.",
    description:
      "The five problems we see most in small business, and the systems we build to solve each one. With full pricing, feature matrices, and what's included.",
  });
}
