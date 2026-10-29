"use server";

/**
 * Server actions for the content-admin area (FAQs first; Insights and
 * Playbooks will follow the same shape). Every action starts with
 * requireContentEditorSession() -- server actions run without rendering
 * the layout, so the layout guard alone would let an authenticated-but-
 * unauthorized HR session (or an unauthenticated POST) mutate D1.
 */

import { redirect } from "next/navigation";
import {
  createFaq,
  createPost,
  deleteFaq,
  deletePost,
  setFaqStatus,
  setPostStatus,
  updateFaq,
  updatePost,
} from "@/lib/cms/db";
import type { ContentStatus } from "@/lib/cms/types";
import { tryGetPortalDb, DB_UNAVAILABLE_MESSAGE } from "../admin-db";
import type { ActionState } from "../form-logic";
import { requireContentEditorSession } from "../session-guard";
import { validateFaqForm, validatePostForm } from "./form-logic";

const CREATE_FAILED_MESSAGE = "The FAQ could not be created. Nothing was saved.";
const UPDATE_FAILED_MESSAGE = "That change could not be saved, so nothing changed.";

export async function createFaqAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireContentEditorSession();
  const parsed = validateFaqForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }
  const db = tryGetPortalDb();
  if (!db) {
    return { error: DB_UNAVAILABLE_MESSAGE };
  }
  let created;
  try {
    created = await createFaq(
      db,
      { question: parsed.value.question, answer: parsed.value.answer, displayOrder: parsed.value.displayOrder },
      session.email,
    );
  } catch {
    return { error: CREATE_FAILED_MESSAGE };
  }
  if (!created) {
    return { error: CREATE_FAILED_MESSAGE };
  }
  redirect("/admin/content/faqs");
}

export async function updateFaqAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireContentEditorSession();
  const idRaw = String(formData.get("faqId") ?? "").trim();
  const id = Number(idRaw);
  if (!idRaw || !Number.isInteger(id) || id < 1) {
    return { error: "That FAQ could not be found." };
  }
  const parsed = validateFaqForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }
  const db = tryGetPortalDb();
  if (!db) {
    return { error: DB_UNAVAILABLE_MESSAGE };
  }
  let updated;
  try {
    updated = await updateFaq(
      db,
      id,
      { question: parsed.value.question, answer: parsed.value.answer, displayOrder: parsed.value.displayOrder },
      session.email,
    );
  } catch {
    return { error: UPDATE_FAILED_MESSAGE };
  }
  if (!updated) {
    return { error: "That FAQ could not be found." };
  }
  redirect("/admin/content/faqs");
}

function isContentStatus(value: unknown): value is ContentStatus {
  return value === "draft" || value === "published";
}

/** Posted from the plain publish/unpublish buttons on the FAQ list. */
export async function setFaqStatusAction(formData: FormData): Promise<void> {
  const session = await requireContentEditorSession();
  const idRaw = String(formData.get("id") ?? "").trim();
  const id = Number(idRaw);
  const status = formData.get("status");
  if (!idRaw || !Number.isInteger(id) || id < 1 || !isContentStatus(status)) {
    redirect("/admin/content/faqs?error=invalid");
  }
  const db = tryGetPortalDb();
  if (!db) {
    redirect("/admin/content/faqs?error=unavailable");
  }
  let saved = false;
  try {
    const updated = await setFaqStatus(db, id, status, session.email);
    saved = updated !== null;
  } catch {
    saved = false;
  }
  if (!saved) {
    redirect("/admin/content/faqs?error=save");
  }
  redirect("/admin/content/faqs");
}

/** Posted from the plain delete button on the FAQ list. */
export async function deleteFaqAction(formData: FormData): Promise<void> {
  await requireContentEditorSession();
  const idRaw = String(formData.get("id") ?? "").trim();
  const id = Number(idRaw);
  if (!idRaw || !Number.isInteger(id) || id < 1) {
    redirect("/admin/content/faqs?error=invalid");
  }
  const db = tryGetPortalDb();
  if (!db) {
    redirect("/admin/content/faqs?error=unavailable");
  }
  let saved = false;
  try {
    saved = await deleteFaq(db, id);
  } catch {
    saved = false;
  }
  if (!saved) {
    redirect("/admin/content/faqs?error=save");
  }
  redirect("/admin/content/faqs");
}

// ---------------------------------------------------------------------------
// Insight posts
// ---------------------------------------------------------------------------

const POST_CREATE_FAILED_MESSAGE = "The post could not be created. Nothing was saved.";
const POST_UPDATE_FAILED_MESSAGE = "That change could not be saved, so nothing changed.";

export async function createPostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireContentEditorSession();
  const parsed = validatePostForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }
  const db = tryGetPortalDb();
  if (!db) {
    return { error: DB_UNAVAILABLE_MESSAGE };
  }
  let created;
  try {
    created = await createPost(
      db,
      {
        title: parsed.value.title,
        excerpt: parsed.value.excerpt,
        postDate: parsed.value.postDate,
        author: parsed.value.author,
        tag: parsed.value.tag,
        image: parsed.value.image,
        body: parsed.value.body,
      },
      session.email,
    );
  } catch {
    return { error: POST_CREATE_FAILED_MESSAGE };
  }
  if (!created) {
    return { error: POST_CREATE_FAILED_MESSAGE };
  }
  redirect("/admin/content/insights");
}

export async function updatePostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireContentEditorSession();
  const idRaw = String(formData.get("postId") ?? "").trim();
  const id = Number(idRaw);
  if (!idRaw || !Number.isInteger(id) || id < 1) {
    return { error: "That post could not be found." };
  }
  const parsed = validatePostForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }
  const db = tryGetPortalDb();
  if (!db) {
    return { error: DB_UNAVAILABLE_MESSAGE };
  }
  let updated;
  try {
    updated = await updatePost(
      db,
      id,
      {
        title: parsed.value.title,
        excerpt: parsed.value.excerpt,
        postDate: parsed.value.postDate,
        author: parsed.value.author,
        tag: parsed.value.tag,
        image: parsed.value.image,
        body: parsed.value.body,
      },
      session.email,
    );
  } catch {
    return { error: POST_UPDATE_FAILED_MESSAGE };
  }
  if (!updated) {
    return { error: "That post could not be found." };
  }
  redirect("/admin/content/insights");
}

/** Posted from the plain publish/unpublish buttons on the Insights list. */
export async function setPostStatusAction(formData: FormData): Promise<void> {
  const session = await requireContentEditorSession();
  const idRaw = String(formData.get("id") ?? "").trim();
  const id = Number(idRaw);
  const status = formData.get("status");
  if (!idRaw || !Number.isInteger(id) || id < 1 || !isContentStatus(status)) {
    redirect("/admin/content/insights?error=invalid");
  }
  const db = tryGetPortalDb();
  if (!db) {
    redirect("/admin/content/insights?error=unavailable");
  }
  let saved = false;
  try {
    const updated = await setPostStatus(db, id, status, session.email);
    saved = updated !== null;
  } catch {
    saved = false;
  }
  if (!saved) {
    redirect("/admin/content/insights?error=save");
  }
  redirect("/admin/content/insights");
}

/** Posted from the plain delete button on the Insights list. */
export async function deletePostAction(formData: FormData): Promise<void> {
  await requireContentEditorSession();
  const idRaw = String(formData.get("id") ?? "").trim();
  const id = Number(idRaw);
  if (!idRaw || !Number.isInteger(id) || id < 1) {
    redirect("/admin/content/insights?error=invalid");
  }
  const db = tryGetPortalDb();
  if (!db) {
    redirect("/admin/content/insights?error=unavailable");
  }
  let saved = false;
  try {
    saved = await deletePost(db, id);
  } catch {
    saved = false;
  }
  if (!saved) {
    redirect("/admin/content/insights?error=save");
  }
  redirect("/admin/content/insights");
}
