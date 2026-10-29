/**
 * Row and domain shapes for the CMS data layer. First content type: FAQs
 * (migrations/0004_create-cms-faqs.sql). Insights and Playbooks follow the
 * same shape once this slice is proven.
 */

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
