import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";

export const alt = "Gileara Technologies — We build the systems your business runs on";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOg({
    eyebrow: "Gileara Technologies",
    title: "We build the systems",
    titleAccent: "your business runs on.",
    description:
      "The operations, sales, customer, and reporting infrastructure small business can't build alone. Currently piloting in Ghana, designed to scale globally.",
  });
}
