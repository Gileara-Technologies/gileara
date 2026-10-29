/**
 * Pure helpers for the content-admin UI: FAQ and Insight-post form
 * validation. No I/O, no React, no Cloudflare context -- unit tested in
 * tests/app/admin/content/form-logic.test.ts.
 */

import { POST_TAGS, type PostTag } from "@/content/posts";

export interface FaqFormValue {
  question: string;
  answer: string;
  displayOrder: number;
}

export type FaqFormResult =
  | { ok: true; value: FaqFormValue }
  | { ok: false; error: string };

/** Validate the create/edit FAQ form. displayOrder defaults to 0 when blank. */
export function validateFaqForm(formData: FormData): FaqFormResult {
  const question = String(formData.get("question") ?? "").trim();
  if (!question) {
    return { ok: false, error: "Give the FAQ a question." };
  }
  const answer = String(formData.get("answer") ?? "").trim();
  if (!answer) {
    return { ok: false, error: "Add an answer." };
  }
  const displayOrderRaw = String(formData.get("displayOrder") ?? "").trim();
  const displayOrder = displayOrderRaw === "" ? 0 : Number(displayOrderRaw);
  if (!Number.isInteger(displayOrder)) {
    return { ok: false, error: "Display order must be a whole number." };
  }
  return { ok: true, value: { question, answer, displayOrder } };
}

export interface PostFormValue {
  title: string;
  excerpt: string;
  postDate: string;
  author: string;
  tag: PostTag;
  image?: string;
  body: string;
}

export type PostFormResult =
  | { ok: true; value: PostFormValue }
  | { ok: false; error: string };

function isPostTag(value: unknown): value is PostTag {
  return typeof value === "string" && (POST_TAGS as readonly string[]).includes(value);
}

/** Validate the create/edit Insight-post form. `image` is optional (a
 *  plain path/URL for now -- no upload pipeline yet). */
export function validatePostForm(formData: FormData): PostFormResult {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { ok: false, error: "Give the post a title." };
  }
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  if (!excerpt) {
    return { ok: false, error: "Add an excerpt." };
  }
  const postDate = String(formData.get("postDate") ?? "").trim();
  if (!postDate || Number.isNaN(Date.parse(postDate))) {
    return { ok: false, error: "Add a valid post date." };
  }
  const author = String(formData.get("author") ?? "").trim();
  if (!author) {
    return { ok: false, error: "Add an author." };
  }
  const tagRaw = formData.get("tag");
  if (!isPostTag(tagRaw)) {
    return { ok: false, error: "Choose a valid tag." };
  }
  const body = String(formData.get("body") ?? "").trim();
  if (!body) {
    return { ok: false, error: "Write the post body." };
  }
  const imageRaw = String(formData.get("image") ?? "").trim();
  return {
    ok: true,
    value: {
      title,
      excerpt,
      postDate,
      author,
      tag: tagRaw,
      image: imageRaw || undefined,
      body,
    },
  };
}
