/**
 * Row and domain shapes for the CMS data layer. Content types so far:
 * FAQs (migrations/0004_create-cms-faqs.sql) and Insight posts
 * (migrations/0005_create-cms-posts.sql). Playbooks follow the same shape
 * once this slice is proven.
 */

import type { PostTag } from "@/content/posts";

export type ContentStatus = "draft" | "published";

/** Raw `cms_faqs` row as stored in D1. */
export interface FaqRow {
  id: number;
  question: string;
  answer: string;
  display_order: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

/** Input for createFaq. `displayOrder` defaults to 0 (top) when omitted. */
export interface CreateFaqInput {
  question: string;
  answer: string;
  displayOrder?: number;
}

/** Partial update for updateFaq. `id` itself is not patchable. */
export interface FaqPatch {
  question?: string;
  answer?: string;
  displayOrder?: number;
}

/** Raw `cms_posts` row as stored in D1. `body` is the markdown-subset
 *  source (src/lib/cms/markdown.ts), parsed at read time -- never stored
 *  pre-parsed, so editing shows back exactly what was written. */
export interface PostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  post_date: string;
  author: string;
  tag: PostTag;
  image: string | null;
  body: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

/** Input for createPost. `slug` is resolved via uniqueSlug against
 *  existing slugs when omitted, same convention as CreateRoleInput. */
export interface CreatePostInput {
  slug?: string;
  title: string;
  excerpt: string;
  postDate: string;
  author: string;
  tag: PostTag;
  image?: string;
  body: string;
}

/** Partial update for updatePost. `slug` is fixed after creation, same
 *  convention as roles -- it's a stable URL, not editable. */
export interface PostPatch {
  title?: string;
  excerpt?: string;
  postDate?: string;
  author?: string;
  tag?: PostTag;
  image?: string;
  body?: string;
}
