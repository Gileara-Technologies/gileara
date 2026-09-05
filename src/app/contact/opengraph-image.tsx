import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";

export const alt = "Talk to Gileara — free 30-minute consultation";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOg({
    eyebrow: "Let's talk",
    title: "Tell us what's hard about",
    titleAccent: "running your business.",
    description:
      "Thirty minutes, free. Bring the mess — sales, stock, customers, cashflow, all of it — and we'll help you think through it.",
  });
}
