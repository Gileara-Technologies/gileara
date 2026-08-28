"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { POST_TAGS, type PostTag } from "@/content/posts";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";

interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tag: PostTag;
  readTime: string;
  image?: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ArticleCard({ post, index }: { post: PostMeta; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group flex flex-col"
    >
      <div className="aspect-[16/10] rounded-xl overflow-hidden mb-5 relative bg-surface-container">
        {post.image ? (
          <Image src={post.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent-bright/20 via-surface-container-high to-surface-container transition-transform duration-700 group-hover:scale-105" />
        )}
        <div className="absolute top-3 right-3">
          <span className="bg-background/80 backdrop-blur-sm text-accent-bright text-xs font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-on-background/20">
            {post.tag}
          </span>
        </div>
      </div>
      <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-3">
        {num} · {formatDate(post.date)} · {post.readTime}
      </div>
      <h3 className="font-serif text-2xl md:text-3xl text-on-background leading-tight tracking-[-0.02em] mb-3 group-hover:text-accent-bright transition-colors duration-300">
        {post.title}
      </h3>
      <p className="text-on-surface-variant text-base leading-relaxed line-clamp-3 mb-4">
        {post.excerpt}
      </p>
      <div className="mt-auto inline-flex items-center text-accent-bright text-sm font-medium">
        Read article
        <span className="material-symbols-outlined text-base ml-1.5 transition-transform duration-300 group-hover:translate-x-1">
          arrow_forward
        </span>
      </div>
    </Link>
  );
}

export default function InsightsListClient({ posts }: { posts: PostMeta[] }) {
  const [activeTag, setActiveTag] = useState<PostTag | "All">("All");
  const featured = posts[0];
  const rest =
    activeTag === "All" ? posts.slice(1) : posts.filter((p) => p.slug !== featured?.slug && p.tag === activeTag);

  return (
    <>
      <PageHero
        number="01"
        eyebrow="INSIGHTS"
        headline={
          <>
            Practical insights for{" "}
            <span className="italic text-accent-cyan">Ghanaian</span> MSMEs.
          </>
        }
        subtitle="On packages, operations, growth, automation, and the local realities of going digital — written from the field, not from a slide deck."
      />

      {/* FEATURED ARTICLE — asymmetric layout */}
      {featured && (
        <section className="bg-background py-24 md:py-32 px-6 md:px-12 border-t border-on-background/10">
          <div className="max-w-[1440px] mx-auto">
            <RevealText>
              <SectionLabel number="02" label="FEATURED" className="mb-10" />
            </RevealText>
            <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-10 items-center">
              <Link
                href={`/insights/${featured.slug}`}
                className="col-span-12 lg:col-span-7 relative group cursor-pointer overflow-hidden rounded-xl aspect-[16/10] bg-surface-container"
              >
                {featured.image ? (
                  <Image src={featured.image} alt="" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent-bright/20 via-surface-container-high to-surface-container transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-background/80 backdrop-blur-sm text-accent-bright px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.2em] border border-on-background/20">
                    {featured.tag}
                  </span>
                </div>
              </Link>
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant">
                  {formatDate(featured.date)} · {featured.readTime}
                </div>
                <h2 className="font-serif text-display-sm text-on-background leading-tight tracking-[-0.02em]">
                  {featured.title}
                </h2>
                <p className="text-on-surface-variant text-lg leading-relaxed">
                  {featured.excerpt}
                </p>
                <Link
                  href={`/insights/${featured.slug}`}
                  className="mt-2 group inline-flex items-center pl-6 pr-10 py-3 rounded-pill bg-accent-bright text-background font-medium hover:bg-accent-cyan transition-colors duration-300 w-fit"
                >
                  Read Full Insight
                  <span className="ml-4 material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAG FILTER + ARTICLE LIST */}
      <section className="bg-surface-container py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <RevealText>
            <SectionLabel number="03" label="ALL ARTICLES" className="mb-10" />
          </RevealText>

          {/* Tag filter */}
          <div className="flex flex-wrap gap-3 items-center mb-12 border-b border-on-background/10 pb-6">
            <span className="text-sm font-mono text-on-surface-variant mr-2 uppercase tracking-[0.2em]">
              Filter
            </span>
            {(["All", ...POST_TAGS] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                aria-pressed={activeTag === tag}
                className={`pl-5 pr-8 py-2 rounded-pill text-sm font-medium transition-colors duration-300 ${
                  activeTag === tag
                    ? "bg-accent-bright text-background"
                    : "border border-on-background/20 text-on-surface hover:border-accent-bright hover:text-accent-bright"
                }`}
              >
                {tag === "All" ? "All Insights" : tag}
              </button>
            ))}
          </div>

          {rest.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {rest.map((post, i) => (
                <ArticleCard key={post.slug} post={post} index={i + 2} />
              ))}
            </div>
          ) : (
            <p className="text-on-surface-variant py-16 text-center border-t border-on-background/10">
              More {activeTag === "All" ? "" : `${activeTag} `}insights are on the way — this section grows as we do.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <CTABand
        eyebrow="STILL CURIOUS?"
        headline={
          <>
            Questions these{" "}
            <span className="italic text-accent-cyan">didn&apos;t answer?</span>
          </>
        }
        body="Skip the inbox-warming. Book a free consultation and ask us directly — a real person replies, usually the same day."
      />
    </>
  );
}
