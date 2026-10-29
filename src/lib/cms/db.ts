/**
 * Typed helpers for the CMS D1 tables. Schema: migrations/0004_create-cms-faqs.sql.
 * Same binding as the careers portal (gileara_careers_db) and the same
 * D1Like structural type from src/lib/portal/db.ts -- reusing it here
 * rather than redefining it keeps one contract for "the D1 binding this
 * app talks to," even though CMS and careers are separate bounded
 * contexts living in the same physical database.
 *
 * ---- Testing ----
 * Every function takes the binding as its first argument, so tests inject
 * an in-memory fake implementing D1Like (no wrangler/miniflare needed) --
 * see tests/lib/cms/db.test.ts.
 */

import type { D1Like } from "@/lib/portal/db";
import type { ContentStatus, CreateFaqInput, FaqPatch, FaqRow } from "./types";

const SELECT_FAQS = "SELECT * FROM cms_faqs ORDER BY display_order ASC, id ASC";
const SELECT_FAQS_BY_STATUS =
  "SELECT * FROM cms_faqs WHERE status = ? ORDER BY display_order ASC, id ASC";
const SELECT_FAQ_BY_ID = "SELECT * FROM cms_faqs WHERE id = ?";
const INSERT_FAQ =
  "INSERT INTO cms_faqs (question, answer, display_order, updated_by) VALUES (?, ?, ?, ?)";
const UPDATE_FAQ_STATUS =
  "UPDATE cms_faqs SET status = ?, updated_at = datetime('now'), updated_by = ? WHERE id = ?";
const DELETE_FAQ = "DELETE FROM cms_faqs WHERE id = ?";

const isContentStatus = (value: unknown): value is ContentStatus =>
  value === "draft" || value === "published";

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;

/** Tolerant row coercion: missing/scalar-typed fields get safe defaults. */
function toFaqRow(value: unknown): FaqRow | null {
  const row = asRecord(value);
  if (!row || typeof row.id !== "number") {
    return null;
  }
  return {
    id: row.id,
    question: typeof row.question === "string" ? row.question : "",
    answer: typeof row.answer === "string" ? row.answer : "",
    display_order: typeof row.display_order === "number" ? row.display_order : 0,
    status: isContentStatus(row.status) ? row.status : "draft",
    created_at: typeof row.created_at === "string" ? row.created_at : "",
    updated_at: typeof row.updated_at === "string" ? row.updated_at : "",
    updated_by: typeof row.updated_by === "string" ? row.updated_by : null,
  };
}

/** All FAQs, optionally filtered by status. Ordered by display_order, id. */
export async function listFaqs(db: D1Like, status?: ContentStatus): Promise<FaqRow[]> {
  const statement = status
    ? db.prepare(SELECT_FAQS_BY_STATUS).bind(status)
    : db.prepare(SELECT_FAQS);
  const { results } = await statement.all();
  return results.map(toFaqRow).filter((row): row is FaqRow => row !== null);
}

/** One FAQ by id, or null if it doesn't exist. */
export async function getFaq(db: D1Like, id: number): Promise<FaqRow | null> {
  const raw = await db.prepare(SELECT_FAQ_BY_ID).bind(id).first();
  return toFaqRow(raw);
}

/** Insert a FAQ (starts as 'draft') and return the stored row. */
export async function createFaq(
  db: D1Like,
  input: CreateFaqInput,
  actorEmail: string,
): Promise<FaqRow | null> {
  const result = await db
    .prepare(INSERT_FAQ)
    .bind(input.question, input.answer, input.displayOrder ?? 0, actorEmail)
    .run();
  const { last_row_id: lastRowId } = result.meta;
  if (lastRowId === null) {
    return null;
  }
  return getFaq(db, lastRowId);
}

/** Partial update (question/answer/displayOrder). Returns null if the id doesn't exist. */
export async function updateFaq(
  db: D1Like,
  id: number,
  patch: FaqPatch,
  actorEmail: string,
): Promise<FaqRow | null> {
  const existing = await getFaq(db, id);
  if (!existing) {
    return null;
  }
  const question = patch.question ?? existing.question;
  const answer = patch.answer ?? existing.answer;
  const displayOrder = patch.displayOrder ?? existing.display_order;
  await db
    .prepare(
      "UPDATE cms_faqs SET question = ?, answer = ?, display_order = ?, updated_at = datetime('now'), updated_by = ? WHERE id = ?",
    )
    .bind(question, answer, displayOrder, actorEmail, id)
    .run();
  return getFaq(db, id);
}

/** Move a FAQ between draft and published. Returns null if the id doesn't exist. */
export async function setFaqStatus(
  db: D1Like,
  id: number,
  status: ContentStatus,
  actorEmail: string,
): Promise<FaqRow | null> {
  await db.prepare(UPDATE_FAQ_STATUS).bind(status, actorEmail, id).run();
  return getFaq(db, id);
}

/** Hard delete. Unlike roles/applications, a removed FAQ has no audit value worth keeping. */
export async function deleteFaq(db: D1Like, id: number): Promise<boolean> {
  const result = await db.prepare(DELETE_FAQ).bind(id).run();
  return result.success;
}
