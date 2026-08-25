"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

interface ContentBlock {
  type: "paragraph" | "heading";
  text: string;
}

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  content: ContentBlock[];
}

export default function InsightsPostClient({ post }: { post: Post }) {
  return (
    <section className="pt-36 pb-24 md:pb-32 px-4 md:px-10 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
          >
            <FaArrowLeft className="w-3 h-3" />
            Back to Insights
          </Link>

          <p className="text-xs font-mono text-secondary uppercase tracking-widest mb-3">
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} &middot; {post.author}
          </p>

          <h1 className="text-3xl md:text-5xl font-bold text-on-surface mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-on-surface-variant mb-12 leading-relaxed">
            {post.excerpt}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-6"
        >
          {post.content.map((block, i) => {
            if (block.type === "heading") {
              return (
                <h2 key={i} className="text-xl md:text-2xl font-bold text-on-surface pt-4">
                  {block.text}
                </h2>
              );
            }
            return (
              <p key={i} className="text-on-surface leading-[1.8] text-[15px] md:text-base">
                {block.text}
              </p>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 pt-12 border-t border-outline-variant/10"
        >
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all font-semibold"
          >
            <FaArrowLeft className="w-3 h-3" />
            View All Insights
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
