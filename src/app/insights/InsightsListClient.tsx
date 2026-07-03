"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
}

export default function InsightsListClient({ posts }: { posts: PostMeta[] }) {
  return (
    <section className="pt-36 pb-24 md:pb-32 px-4 md:px-10 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <p className="font-mono text-xs text-secondary uppercase tracking-widest mb-4">
            Insights
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-on-surface mb-6">
            Engineering perspectives for growing businesses.
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Technical deep-dives, architecture decisions, and strategy notes from the
            team building production systems for startups and SMEs.
          </p>
        </motion.div>

        <div className="space-y-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/insights/${post.slug}`}
                className="block bg-surface-container-low dark:bg-surface-container rounded-2xl border border-outline-variant/20 dark:border-outline-variant/10 p-6 md:p-8 hover:border-primary/30 dark:hover:border-primary/20 transition-all group"
              >
                <p className="text-xs font-mono text-on-surface-variant mb-2">
                  {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} &middot; {post.author}
                </p>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg md:text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-on-surface-variant mt-1.5">
                      {post.excerpt}
                    </p>
                  </div>
                  <FaArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1 hidden md:block" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
