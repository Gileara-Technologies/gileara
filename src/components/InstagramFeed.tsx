"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa6";
import type { InstagramPost } from "@/lib/instagram/public-instagram";
import { instagramAccounts } from "@/content/site-config";

/**
 * InstagramFeed — a small grid of recent Instagram posts, reusing this
 * site's established card idiom (Roster.tsx's portrait-forward grid cell,
 * IndustryStrip.tsx's image-with-gradient-caption treatment): dark-mode
 * only, Tailwind + globals.css tokens, Material Symbols, no new libraries.
 *
 * Posts come from getPublicInstagramPosts() -- D1-first, no fallback
 * array (docs/INSTAGRAM-CONNECTOR-PLAN.md: there is no honest hand-authored
 * stand-in for someone else's real photos). When the list is empty (D1
 * unreachable, cache empty, or the connector not yet configured), this
 * renders a single "Follow us on Instagram" link instead of an empty or
 * broken-looking grid -- never fake post tiles.
 */
function EmptyState() {
  return (
    <div className="op-card rounded-lg flex flex-col items-center justify-center gap-3 py-12 px-6 text-center">
      <span className="material-symbols-outlined text-3xl text-on-surface-variant" aria-hidden="true">
        cloud_off
      </span>
      <p className="text-sm text-on-surface-variant max-w-xs">
        Our latest work in progress, behind the scenes, and client moments live on Instagram.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {instagramAccounts.map((account) => (
          <a
            key={account.handle}
            href={account.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2.5 font-mono text-[13px] text-accent-bright transition-colors hover:border-accent-bright/40"
          >
            <FaInstagram className="h-4 w-4" aria-hidden="true" />
            Follow @{account.handle}
          </a>
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, index }: { post: InstagramPost; index: number }) {
  const imageSrc = post.mediaType === "VIDEO" ? post.thumbnailUrl ?? post.mediaUrl : post.mediaUrl;
  const caption = post.caption?.trim();
  return (
    <motion.a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="op-card group relative aspect-square w-full overflow-hidden rounded-lg block"
    >
      <Image
        src={imageSrc}
        alt={caption || "Gileara Technologies on Instagram"}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: "linear-gradient(180deg, transparent 50%, rgba(3,10,12,0.85) 100%)" }}
        aria-hidden="true"
      />
      {post.mediaType !== "IMAGE" && (
        <span
          className="material-symbols-outlined absolute top-2.5 right-2.5 text-base text-white/85"
          aria-hidden="true"
        >
          {post.mediaType === "VIDEO" ? "play_arrow" : "account_tree"}
        </span>
      )}
      {(caption || post.accountHandle) && (
        <div className="absolute bottom-2.5 left-3 right-3 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
          {post.accountHandle && (
            <p className="font-mono text-[11px] text-accent-bright">@{post.accountHandle}</p>
          )}
          {caption && <p className="line-clamp-2 text-xs text-white/85">{caption}</p>}
        </div>
      )}
    </motion.a>
  );
}

export default function InstagramFeed({ posts }: { posts: InstagramPost[] }) {
  return (
    <section className="relative bg-background border-t border-white/[0.06] py-10 md:py-12">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div className="font-mono text-[13px] text-white/40">on instagram</div>
          <div className="flex items-center gap-4">
            {instagramAccounts.map((account) => (
              <a
                key={account.handle}
                href={account.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[12px] text-white/40 hover:text-accent-bright transition-colors duration-150"
              >
                @{account.handle}
              </a>
            ))}
          </div>
        </div>

        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
