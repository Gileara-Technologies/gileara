import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/components/OgImage";
import { posts } from "@/content/posts";

export const alt = "Insights | Gileara Technologies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return [];
  return [
    {
      id: post.slug,
      alt: `${post.title} | Gileara Insights`,
      contentType: OG_CONTENT_TYPE,
      size: OG_SIZE,
    },
  ];
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) {
    return renderOg({
      eyebrow: "Insights",
      title: "Gileara Insights",
      description: "Practical insights for small business operators.",
    });
  }
  return renderOg({
    eyebrow: `Insights · ${post.tag}`,
    title: post.title,
    description: post.excerpt,
    badge: post.tag,
  });
}
