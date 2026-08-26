"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Tilt3D from "@/components/Tilt3D";
import { POST_TAGS, type PostTag } from "@/content/posts";

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

function ArticleCard({ post }: { post: PostMeta }) {
  return (
    <Tilt3D maxDeg={4} className="h-full">
      <div className="bg-surface-container-low/80 backdrop-blur-sm border border-outline-variant/20 rounded-xl p-4 flex flex-col h-full group hover:border-primary/40 transition-colors duration-300">
      <Link href={`/insights/${post.slug}`} className="flex flex-col h-full">
        <div className="h-40 rounded-lg overflow-hidden mb-3 relative">
          {post.image ? (
            <Image src={post.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-surface-container-high to-surface-container transition-transform duration-500 group-hover:scale-110" />
          )}
          <div className="absolute top-2 right-2">
            <span className="bg-surface-dim/80 backdrop-blur-sm text-secondary dark:text-primary text-xs font-mono uppercase tracking-wider px-2 py-1 rounded border border-outline-variant/30">
              {post.tag}
            </span>
          </div>
        </div>
        <div className="px-1 flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-on-surface-variant">
              {formatDate(post.date)}
            </span>
            <span className="text-xs font-medium text-on-surface-variant">
              {post.readTime}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold font-display text-on-surface mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-base text-on-surface-variant line-clamp-3 mb-4">
            {post.excerpt}
          </p>
          <div className="mt-auto pt-3 flex items-center text-primary text-sm font-semibold group/link">
            Read More
            <span className="material-symbols-outlined text-base ml-1 transition-transform group-hover/link:translate-x-1">
              chevron_right
            </span>
          </div>
        </div>
      </Link>
    </div>
    </Tilt3D>
  );
}

export default function InsightsListClient({ posts }: { posts: PostMeta[] }) {
  const [activeTag, setActiveTag] = useState<PostTag | "All">("All");
  const featured = posts[0];
  const rest =
    activeTag === "All" ? posts.slice(1) : posts.filter((p) => p.slug !== featured?.slug && p.tag === activeTag);

  return (
    <>
      {/* FEATURED ARTICLE */}
      {featured && (
        <section className="py-16 md:py-20 px-4 md:px-10 relative">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <Link
                href={`/insights/${featured.slug}`}
                className="relative group cursor-pointer overflow-hidden rounded-xl h-[400px] lg:h-[500px]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent z-10" />
                {featured.image ? (
                  <Image src={featured.image} alt="" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 via-surface-container-high to-surface-dim transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">
                    Featured · {featured.tag}
                  </span>
                </div>
              </Link>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm font-semibold">
                  <span>{formatDate(featured.date)}</span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant" />
                  <span>{featured.readTime}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-display text-on-surface leading-tight tracking-tight">
                  {featured.title}
                </h1>
                <p className="text-lg text-on-surface-variant max-w-xl">
                  {featured.excerpt}
                </p>
                <div className="mt-2 flex gap-4">
                  <Link
                    href={`/insights/${featured.slug}`}
                    className="bg-primary-container text-on-primary-container px-8 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
                  >
                    Read Full Insight
                    <span className="material-symbols-outlined text-lg">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAG FILTER */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-10 py-4">
        <div className="flex flex-wrap gap-3 items-center border-y border-outline-variant/20 py-4">
          <span className="text-sm font-semibold text-on-surface-variant mr-2">
            Filter by:
          </span>
          {(["All", ...POST_TAGS] as const).map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              aria-pressed={activeTag === tag}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeTag === tag
                  ? "bg-primary/10 text-primary border border-primary/40"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/30"
              }`}
            >
              {tag === "All" ? "All Insights" : tag}
            </button>
          ))}
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-10 pb-20">
        {rest.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-on-surface-variant py-12 text-center">
            More {activeTag === "All" ? "" : `${activeTag} `}insights are on the way — this section grows as we do.
          </p>
        )}
      </section>

      {/* HONEST CLOSER — no fake newsletter counts */}
      <section className="px-4 md:px-10 pb-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-surface-container rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-on-surface mb-3">
                Questions these didn&apos;t answer?
              </h2>
              <p className="text-base text-on-surface-variant">
                Skip the inbox-warming. Book a free consultation and ask us directly — a real person replies, usually the same day.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold teal-gradient-btn text-white dark:text-on-primary group"
              >
                Book a Free Consultation
                <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
