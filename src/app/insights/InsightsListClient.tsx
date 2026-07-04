"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
}

const categories = [
  "All Insights",
  "Engineering",
  "Strategy",
  "E-Commerce",
  "Productivity",
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ArticleCard({ post }: { post: PostMeta }) {
  return (
    <div className="bg-surface-container-low/80 backdrop-blur-sm border border-outline-variant/20 rounded-xl p-4 flex flex-col h-full group hover:border-primary/40 transition-all duration-300">
      <Link href={`/insights/${post.slug}`} className="flex flex-col h-full">
        <div className="h-48 rounded-lg overflow-hidden mb-3 relative">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-surface-container-high to-surface-container transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute top-2 right-2">
            <span className="bg-surface-dim/80 backdrop-blur-sm text-on-surface text-xs font-medium px-2 py-1 rounded border border-outline-variant/30">
              {post.category}
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
  );
}

export default function InsightsListClient({ posts }: { posts: PostMeta[] }) {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      {/* FEATURED ARTICLE */}
      <section className="py-16 md:py-20 px-4 md:px-10 relative">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <Link
              href={`/insights/${featured.slug}`}
              className="relative group cursor-pointer overflow-hidden rounded-xl h-[400px] lg:h-[500px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent z-10" />
              <div className="w-full h-full bg-gradient-to-br from-primary/20 via-surface-container-high to-surface-dim transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">
                  Featured
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

      {/* CATEGORY FILTER */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-10 py-4">
        <div className="flex flex-wrap gap-3 items-center border-y border-outline-variant/20 py-4">
          <span className="text-sm font-semibold text-on-surface-variant mr-2">
            Filter by:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                cat === "All Insights"
                  ? "bg-primary/10 text-primary border border-primary/40"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-4 md:px-10 pb-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-surface-container rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <div className="relative z-10 max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-on-surface mb-3">
                Stay at the Forefront
              </h2>
              <p className="text-base text-on-surface-variant">
                Join 20,000+ industry leaders who receive our bi-weekly deep
                dives into engineering excellence and digital strategy.
              </p>
            </div>
            <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <input
                className="bg-surface-dim border border-outline-variant/40 rounded-lg px-6 py-3 text-on-surface focus:border-primary focus:ring-0 w-full sm:w-80 transition-all text-base"
                placeholder="Enter your business email"
                type="email"
              />
              <button className="bg-primary-container text-on-primary-container px-8 py-3 rounded-lg text-sm font-semibold hover:bg-primary transition-all whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
