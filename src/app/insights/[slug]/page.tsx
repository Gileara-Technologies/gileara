import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactBand from "@/components/ContactBand";
import InsightsPostClient from "./InsightsPostClient";
import { posts } from "@/content/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | Insights | Gileara Technologies`,
    description: post.excerpt,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      title: `${post.title} | Gileara Technologies`,
      description: post.excerpt,
      url: `/insights/${slug}`,
      siteName: "Gileara Technologies",
      type: "article",
      publishedTime: post.date,
      images: [{ url: "https://gileara.org/assets/gileara/og-insights.svg", width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function InsightsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main>
        <InsightsPostClient post={post} />
        <ContactBand
          eyebrow="WANT TO GO DEEPER?"
          headline={
            <>
              Have a question about{" "}
              <span className="italic text-accent-cyan">your own business?</span>
            </>
          }
          body="Free 30-minute call — bring this post's idea (or any other) and we'll apply it to your situation."
        />
      </main>
      <Footer />
    </>
  );
}
