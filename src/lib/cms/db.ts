/**
 * Typed helpers for the CMS D1 tables. Schema: migrations/0004_create-cms-faqs.sql,
 * migrations/0005_create-cms-posts.sql, migrations/0006_create-cms-scenarios.sql.
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
import { POST_TAGS, type PostTag } from "@/content/posts";
import type { ImplementationStep, ScenarioStatus } from "@/content/scenarios";
import { uniqueSlug } from "@/lib/portal/slug";
import type {
  ContentStatus,
  CreateFaqInput,
  CreatePostInput,
  CreateScenarioInput,
  FaqPatch,
  FaqRow,
  ParsedScenario,
  PostPatch,
  PostRow,
  ScenarioPatch,
} from "./types";

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

// ---------------------------------------------------------------------------
// Insight posts (migrations/0005_create-cms-posts.sql)
// ---------------------------------------------------------------------------

const SELECT_POSTS = "SELECT * FROM cms_posts ORDER BY post_date DESC, id DESC";
const SELECT_POSTS_BY_STATUS =
  "SELECT * FROM cms_posts WHERE status = ? ORDER BY post_date DESC, id DESC";
const SELECT_POST_BY_ID = "SELECT * FROM cms_posts WHERE id = ?";
const SELECT_POST_SLUGS = "SELECT slug FROM cms_posts";
const INSERT_POST =
  "INSERT INTO cms_posts (slug, title, excerpt, post_date, author, tag, image, body, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
const UPDATE_POST_STATUS =
  "UPDATE cms_posts SET status = ?, updated_at = datetime('now'), updated_by = ? WHERE id = ?";
const DELETE_POST = "DELETE FROM cms_posts WHERE id = ?";

const isPostTag = (value: unknown): value is PostTag =>
  typeof value === "string" && (POST_TAGS as readonly string[]).includes(value);

/** Tolerant row coercion: missing/scalar-typed fields get safe defaults. */
function toPostRow(value: unknown): PostRow | null {
  const row = asRecord(value);
  if (!row || typeof row.id !== "number" || typeof row.slug !== "string") {
    return null;
  }
  return {
    id: row.id,
    slug: row.slug,
    title: typeof row.title === "string" ? row.title : "",
    excerpt: typeof row.excerpt === "string" ? row.excerpt : "",
    post_date: typeof row.post_date === "string" ? row.post_date : "",
    author: typeof row.author === "string" ? row.author : "",
    tag: isPostTag(row.tag) ? row.tag : "Operations",
    image: typeof row.image === "string" ? row.image : null,
    body: typeof row.body === "string" ? row.body : "",
    status: isContentStatus(row.status) ? row.status : "draft",
    created_at: typeof row.created_at === "string" ? row.created_at : "",
    updated_at: typeof row.updated_at === "string" ? row.updated_at : "",
    updated_by: typeof row.updated_by === "string" ? row.updated_by : null,
  };
}

async function listPostSlugs(db: D1Like): Promise<string[]> {
  const { results } = await db.prepare(SELECT_POST_SLUGS).all();
  return results
    .map((row) => {
      const record = asRecord(row);
      return typeof record?.slug === "string" ? record.slug : "";
    })
    .filter((slug) => slug !== "");
}

/** All posts, optionally filtered by status. Ordered by post_date, id (newest first). */
export async function listPosts(db: D1Like, status?: ContentStatus): Promise<PostRow[]> {
  const statement = status
    ? db.prepare(SELECT_POSTS_BY_STATUS).bind(status)
    : db.prepare(SELECT_POSTS);
  const { results } = await statement.all();
  return results.map(toPostRow).filter((row): row is PostRow => row !== null);
}

/** One post by id, or null if it doesn't exist. */
export async function getPost(db: D1Like, id: number): Promise<PostRow | null> {
  const raw = await db.prepare(SELECT_POST_BY_ID).bind(id).first();
  return toPostRow(raw);
}

/**
 * Insert a post (starts as 'draft'). Resolves the slug via uniqueSlug
 * against existing slugs when input.slug is omitted, same convention as
 * createRole -- titles may repeat without colliding. Returns the stored
 * row, or null on failure.
 */
export async function createPost(
  db: D1Like,
  input: CreatePostInput,
  actorEmail: string,
): Promise<PostRow | null> {
  const slug = input.slug ?? uniqueSlug(input.title, await listPostSlugs(db));
  const result = await db
    .prepare(INSERT_POST)
    .bind(
      slug,
      input.title,
      input.excerpt,
      input.postDate,
      input.author,
      input.tag,
      input.image ?? null,
      input.body,
      actorEmail,
    )
    .run();
  const { last_row_id: lastRowId } = result.meta;
  if (lastRowId === null) {
    return null;
  }
  return getPost(db, lastRowId);
}

/** Partial update. `slug` is fixed after creation (same as roles). Returns null if the id doesn't exist. */
export async function updatePost(
  db: D1Like,
  id: number,
  patch: PostPatch,
  actorEmail: string,
): Promise<PostRow | null> {
  const existing = await getPost(db, id);
  if (!existing) {
    return null;
  }
  const title = patch.title ?? existing.title;
  const excerpt = patch.excerpt ?? existing.excerpt;
  const postDate = patch.postDate ?? existing.post_date;
  const author = patch.author ?? existing.author;
  const tag = patch.tag ?? existing.tag;
  const image = patch.image !== undefined ? patch.image : existing.image;
  const body = patch.body ?? existing.body;
  await db
    .prepare(
      "UPDATE cms_posts SET title = ?, excerpt = ?, post_date = ?, author = ?, tag = ?, image = ?, body = ?, updated_at = datetime('now'), updated_by = ? WHERE id = ?",
    )
    .bind(title, excerpt, postDate, author, tag, image, body, actorEmail, id)
    .run();
  return getPost(db, id);
}

/** Move a post between draft and published. Returns null if the id doesn't exist. */
export async function setPostStatus(
  db: D1Like,
  id: number,
  status: ContentStatus,
  actorEmail: string,
): Promise<PostRow | null> {
  await db.prepare(UPDATE_POST_STATUS).bind(status, actorEmail, id).run();
  return getPost(db, id);
}

/** Hard delete. */
export async function deletePost(db: D1Like, id: number): Promise<boolean> {
  const result = await db.prepare(DELETE_POST).bind(id).run();
  return result.success;
}

// ---------------------------------------------------------------------------
// Playbooks (migrations/0006_create-cms-scenarios.sql)
// ---------------------------------------------------------------------------

const SELECT_SCENARIOS = "SELECT * FROM cms_scenarios ORDER BY vertical ASC, id ASC";
const SELECT_SCENARIOS_BY_STATUS =
  "SELECT * FROM cms_scenarios WHERE status = ? ORDER BY vertical ASC, id ASC";
const SELECT_SCENARIO_BY_ID = "SELECT * FROM cms_scenarios WHERE id = ?";
const SELECT_SCENARIO_SLUGS = "SELECT slug FROM cms_scenarios";
const INSERT_SCENARIO =
  "INSERT INTO cms_scenarios (slug, vertical, icon, headline, pain_points, package_ids, implementation, target_outcomes, ghana_context, image, scenario_status, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
const UPDATE_SCENARIO_CONTENT_STATUS =
  "UPDATE cms_scenarios SET status = ?, updated_at = datetime('now'), updated_by = ? WHERE id = ?";
const UPDATE_SCENARIO_STAGE =
  "UPDATE cms_scenarios SET scenario_status = ?, updated_at = datetime('now'), updated_by = ? WHERE id = ?";
const DELETE_SCENARIO = "DELETE FROM cms_scenarios WHERE id = ?";

const isScenarioStatus = (value: unknown): value is ScenarioStatus =>
  value === "scenario" || value === "pilot" || value === "case-study";

/** Tolerant JSON-array parse: anything that isn't a valid JSON array of
 *  strings safely falls back to [], same convention as portal/db.ts's
 *  private parseJsonList. */
function parseJsonStringList(value: unknown): string[] {
  if (typeof value !== "string" || value.trim() === "") {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

/** Tolerant JSON-array parse for the implementation column -- an array
 *  of {phase, detail} objects rather than plain strings. */
function parseImplementationList(value: unknown): ImplementationStep[] {
  if (typeof value !== "string" || value.trim() === "") {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is ImplementationStep =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).phase === "string" &&
        typeof (item as Record<string, unknown>).detail === "string",
    );
  } catch {
    return [];
  }
}

/** Tolerant row coercion + JSON-column parsing in one step -- scenarios
 *  have JSON list columns, so (unlike FAQs/posts) the raw row shape
 *  isn't exposed at all; every caller gets the parsed domain shape. */
function toParsedScenario(value: unknown): ParsedScenario | null {
  const row = asRecord(value);
  if (!row || typeof row.id !== "number" || typeof row.slug !== "string") {
    return null;
  }
  return {
    id: row.id,
    slug: row.slug,
    vertical: typeof row.vertical === "string" ? row.vertical : "",
    icon: typeof row.icon === "string" ? row.icon : "business_center",
    headline: typeof row.headline === "string" ? row.headline : "",
    painPoints: parseJsonStringList(row.pain_points),
    packageIds: parseJsonStringList(row.package_ids),
    implementation: parseImplementationList(row.implementation),
    targetOutcomes: parseJsonStringList(row.target_outcomes),
    ghanaContext: typeof row.ghana_context === "string" ? row.ghana_context : "",
    image: typeof row.image === "string" ? row.image : null,
    scenarioStatus: isScenarioStatus(row.scenario_status) ? row.scenario_status : "scenario",
    status: isContentStatus(row.status) ? row.status : "draft",
    createdAt: typeof row.created_at === "string" ? row.created_at : "",
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : "",
    updatedBy: typeof row.updated_by === "string" ? row.updated_by : null,
  };
}

async function listScenarioSlugs(db: D1Like): Promise<string[]> {
  const { results } = await db.prepare(SELECT_SCENARIO_SLUGS).all();
  return results
    .map((row) => {
      const record = asRecord(row);
      return typeof record?.slug === "string" ? record.slug : "";
    })
    .filter((slug) => slug !== "");
}

/** All playbooks, optionally filtered by (content) status. Ordered by vertical, id. */
export async function listScenarios(db: D1Like, status?: ContentStatus): Promise<ParsedScenario[]> {
  const statement = status
    ? db.prepare(SELECT_SCENARIOS_BY_STATUS).bind(status)
    : db.prepare(SELECT_SCENARIOS);
  const { results } = await statement.all();
  return results.map(toParsedScenario).filter((row): row is ParsedScenario => row !== null);
}

/** One playbook by id, or null if it doesn't exist. */
export async function getScenario(db: D1Like, id: number): Promise<ParsedScenario | null> {
  const raw = await db.prepare(SELECT_SCENARIO_BY_ID).bind(id).first();
  return toParsedScenario(raw);
}

/**
 * Insert a playbook (starts as 'draft', scenario_status defaults to
 * 'scenario' -- no client yet, the honest default). Resolves the slug
 * via uniqueSlug against existing slugs when input.slug is omitted,
 * same convention as createRole/createPost.
 */
export async function createScenario(
  db: D1Like,
  input: CreateScenarioInput,
  actorEmail: string,
): Promise<ParsedScenario | null> {
  const slug = input.slug ?? uniqueSlug(input.vertical, await listScenarioSlugs(db));
  const result = await db
    .prepare(INSERT_SCENARIO)
    .bind(
      slug,
      input.vertical,
      input.icon,
      input.headline,
      JSON.stringify(input.painPoints),
      JSON.stringify(input.packageIds),
      JSON.stringify(input.implementation),
      JSON.stringify(input.targetOutcomes),
      input.ghanaContext,
      input.image ?? null,
      input.scenarioStatus ?? "scenario",
      actorEmail,
    )
    .run();
  const { last_row_id: lastRowId } = result.meta;
  if (lastRowId === null) {
    return null;
  }
  return getScenario(db, lastRowId);
}

/** Partial update. `slug` is fixed after creation. Returns null if the id doesn't exist. */
export async function updateScenario(
  db: D1Like,
  id: number,
  patch: ScenarioPatch,
  actorEmail: string,
): Promise<ParsedScenario | null> {
  const existing = await getScenario(db, id);
  if (!existing) {
    return null;
  }
  const vertical = patch.vertical ?? existing.vertical;
  const icon = patch.icon ?? existing.icon;
  const headline = patch.headline ?? existing.headline;
  const painPoints = patch.painPoints ?? existing.painPoints;
  const packageIds = patch.packageIds ?? existing.packageIds;
  const implementation = patch.implementation ?? existing.implementation;
  const targetOutcomes = patch.targetOutcomes ?? existing.targetOutcomes;
  const ghanaContext = patch.ghanaContext ?? existing.ghanaContext;
  const image = patch.image !== undefined ? patch.image : existing.image;
  const scenarioStatus = patch.scenarioStatus ?? existing.scenarioStatus;
  await db
    .prepare(
      "UPDATE cms_scenarios SET vertical = ?, icon = ?, headline = ?, pain_points = ?, package_ids = ?, implementation = ?, target_outcomes = ?, ghana_context = ?, image = ?, scenario_status = ?, updated_at = datetime('now'), updated_by = ? WHERE id = ?",
    )
    .bind(
      vertical,
      icon,
      headline,
      JSON.stringify(painPoints),
      JSON.stringify(packageIds),
      JSON.stringify(implementation),
      JSON.stringify(targetOutcomes),
      ghanaContext,
      image,
      scenarioStatus,
      actorEmail,
      id,
    )
    .run();
  return getScenario(db, id);
}

/** Move a playbook between draft and published (visibility). Returns null if the id doesn't exist. */
export async function setScenarioContentStatus(
  db: D1Like,
  id: number,
  status: ContentStatus,
  actorEmail: string,
): Promise<ParsedScenario | null> {
  await db.prepare(UPDATE_SCENARIO_CONTENT_STATUS).bind(status, actorEmail, id).run();
  return getScenario(db, id);
}

/**
 * Move a playbook along scenario -> pilot -> case-study (the honesty-
 * contract label, not visibility). This is the edit the whole slice
 * exists for -- it used to require a code change and a deploy.
 */
export async function setScenarioStage(
  db: D1Like,
  id: number,
  scenarioStatus: ScenarioStatus,
  actorEmail: string,
): Promise<ParsedScenario | null> {
  await db.prepare(UPDATE_SCENARIO_STAGE).bind(scenarioStatus, actorEmail, id).run();
  return getScenario(db, id);
}

/** Hard delete. */
export async function deleteScenario(db: D1Like, id: number): Promise<boolean> {
  const result = await db.prepare(DELETE_SCENARIO).bind(id).run();
  return result.success;
}
