/**
 * Public Insights read side: /insights and /insights/[slug] fetch through
 * this module so every public page shares one source of truth and one
 * fallback rule. Same hybrid rule as public-roles.ts / public-faqs.ts:
 * read published posts from D1 first, fall back to src/content/posts.ts
 * whenever D1 is empty or unreachable.
 *
 * D1 rows store `body` as the markdown-subset source (src/lib/cms/markdown.ts);
 * this module parses it into the exact PostBlock[] shape src/content/posts.ts
 * entries already use, so a D1 row and a fallback entry become
 * interchangeable InsightPost objects and every existing consumer
 * (InsightsPostClient, postReadTime, the JSON-LD builders) needs zero
 * changes.
 *
 * Long-term intent (docs/CMS-PLAN.md): once D1 is proven in production,
 * delete src/content/posts.ts and this fallback branch.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { listPosts } from "@/lib/cms/db";
import { parsePostBody } from "@/lib/cms/markdown";
import type { D1Like } from "@/lib/portal/db";
import type { PostRow } from "@/lib/cms/types";
import { posts as fallbackPostEntries, type InsightPost } from "@/content/posts";

function toInsightPost(row: PostRow): InsightPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: row.post_date,
    author: row.author,
    tag: row.tag,
    image: row.image ?? undefined,
    content: parsePostBody(row.body),
  };
}

/** The fallback list: every entry from src/content/posts.ts, unchanged. */
export function fallbackPosts(): InsightPost[] {
  return [...fallbackPostEntries];
}

/** Fallback selection: use the D1 result when it has at least one row. */
export function selectPublicPosts(rows: InsightPost[] | null | undefined): InsightPost[] {
  return rows && rows.length > 0 ? rows : fallbackPosts();
}

/** Read published posts from D1. Throws when the context/binding is absent. */
async function readPublishedPostsFromD1(): Promise<InsightPost[]> {
  const { env } = getCloudflareContext();
  const db = (env as unknown as { gileara_careers_db?: D1Like }).gileara_careers_db;
  if (!db) {
    throw new Error("gileara_careers_db binding is missing from the Cloudflare env");
  }
  const rows = await listPosts(db, "published");
  return rows.map(toInsightPost);
}

/**
 * Published Insight posts for the public pages. Tries D1 first; on any
 * failure (no Cloudflare context in dev/build, D1 error) or an empty
 * result it falls back to src/content/posts.ts.
 */
export async function getPublicPosts(): Promise<InsightPost[]> {
  try {
    const rows = await readPublishedPostsFromD1();
    if (rows.length === 0) {
      console.warn("[insights] D1 returned no published posts, falling back to src/content/posts.ts.");
    }
    return selectPublicPosts(rows);
  } catch (error) {
    console.warn("[insights] D1 unavailable, falling back to src/content/posts.ts:", error);
    return fallbackPosts();
  }
}

/** Single published post by slug, or null (callers use notFound()). */
export async function getPublicPost(slug: string): Promise<InsightPost | null> {
  const all = await getPublicPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

/** Absolute image URL for JSON-LD: pass external URLs through untouched,
 *  prefix a relative /public path with the site origin. Posts created
 *  through the CMS may use either (the form accepts "a path under
 *  /public or a full URL"), unlike the fallback module's entries, which
 *  are always relative paths. */
export function absoluteImageUrl(image: string): string {
  return image.startsWith("http") ? image : `https://gileara.org${image}`;
}
