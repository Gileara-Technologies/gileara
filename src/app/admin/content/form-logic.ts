/**
 * Pure helpers for the content-admin UI: FAQ, Insight-post, and playbook
 * form validation. No I/O, no React, no Cloudflare context -- unit
 * tested in tests/app/admin/content/form-logic.test.ts.
 */

import { POST_TAGS, type PostTag } from "@/content/posts";
import { servicePackages } from "@/content/packages";
import type { ImplementationStep, ScenarioStatus } from "@/content/scenarios";
import { formList } from "../form-logic";

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

const SCENARIO_DEFAULT_ICON = "business_center";
const SCENARIO_STATUSES: readonly ScenarioStatus[] = ["scenario", "pilot", "case-study"];

function isScenarioStatus(value: unknown): value is ScenarioStatus {
  return typeof value === "string" && (SCENARIO_STATUSES as readonly string[]).includes(value);
}

/** Zips the paired implementationPhase/implementationDetail row inputs
 *  by index. A row is kept only when BOTH its phase and detail are
 *  non-empty after trimming -- same "drop the incomplete one rather
 *  than fail the whole save" judgment as the markdown parser's cta
 *  fence handling. */
export function formImplementationSteps(formData: FormData): ImplementationStep[] {
  const phases = formData.getAll("implementationPhase").map((v) => String(v).trim());
  const details = formData.getAll("implementationDetail").map((v) => String(v).trim());
  const steps: ImplementationStep[] = [];
  const length = Math.max(phases.length, details.length);
  for (let i = 0; i < length; i += 1) {
    const phase = phases[i] ?? "";
    const detail = details[i] ?? "";
    if (phase && detail) {
      steps.push({ phase, detail });
    }
  }
  return steps;
}

const REAL_PACKAGE_IDS = new Set(servicePackages.map((p) => p.id));

/** Every checked packageIds value that matches a real servicePackages
 *  id. Checkboxes are rendered from that same real list, so a mismatch
 *  would mean tampering, not a normal user error -- silently dropped
 *  rather than failing the save. */
function formPackageIds(formData: FormData): string[] {
  return formData.getAll("packageIds").filter((v): v is string => typeof v === "string" && REAL_PACKAGE_IDS.has(v));
}

export interface ScenarioFormValue {
  vertical: string;
  icon: string;
  headline: string;
  painPoints: string[];
  packageIds: string[];
  implementation: ImplementationStep[];
  targetOutcomes: string[];
  ghanaContext: string;
  image?: string;
  scenarioStatus: ScenarioStatus;
}

export type ScenarioFormResult =
  | { ok: true; value: ScenarioFormValue }
  | { ok: false; error: string };

/** Validate the create/edit playbook form. */
export function validateScenarioForm(formData: FormData): ScenarioFormResult {
  const vertical = String(formData.get("vertical") ?? "").trim();
  if (!vertical) {
    return { ok: false, error: "Give the playbook a vertical (e.g. Pharmacy)." };
  }
  const headline = String(formData.get("headline") ?? "").trim();
  if (!headline) {
    return { ok: false, error: "Add a headline." };
  }
  const ghanaContext = String(formData.get("ghanaContext") ?? "").trim();
  if (!ghanaContext) {
    return { ok: false, error: "Add the local-context paragraph." };
  }
  const painPoints = formList(formData, "painPoints");
  if (painPoints.length === 0) {
    return { ok: false, error: "Add at least one pain point." };
  }
  const implementation = formImplementationSteps(formData);
  if (implementation.length === 0) {
    return { ok: false, error: "Add at least one implementation step with both a phase and a detail." };
  }
  const targetOutcomes = formList(formData, "targetOutcomes");
  if (targetOutcomes.length === 0) {
    return { ok: false, error: "Add at least one target outcome." };
  }
  const icon = String(formData.get("icon") ?? "").trim() || SCENARIO_DEFAULT_ICON;
  const packageIds = formPackageIds(formData);
  const statusRaw = formData.get("scenarioStatus");
  const imageRaw = String(formData.get("image") ?? "").trim();
  return {
    ok: true,
    value: {
      vertical,
      icon,
      headline,
      painPoints,
      packageIds,
      implementation,
      targetOutcomes,
      ghanaContext,
      image: imageRaw || undefined,
      scenarioStatus: isScenarioStatus(statusRaw) ? statusRaw : "scenario",
    },
  };
}
