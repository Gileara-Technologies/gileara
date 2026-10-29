/**
 * Pure helpers for the content-admin UI: FAQ form validation. No I/O, no
 * React, no Cloudflare context -- unit tested in tests/app/admin/content/form-logic.test.ts.
 */

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
