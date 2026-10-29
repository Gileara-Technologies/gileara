"use client";

// FAQ create/edit form. Question + answer + an optional display-order
// number; much simpler than the role form (no dynamic list fields).

import { useActionState } from "react";
import Link from "next/link";
import type { FaqRow } from "@/lib/cms/types";
import { createFaqAction, updateFaqAction } from "../actions";
import type { ActionState } from "../../form-logic";

const fieldClass =
  "w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface transition-colors placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-on-surface-variant";

const submitClass =
  "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

interface FaqFormProps {
  mode: "create" | "edit";
  /** Required in edit mode; sent as a hidden field to the update action. */
  faqId?: number;
  initial?: FaqRow;
}

const initialState: ActionState = { error: null };

export function FaqForm({ mode, faqId, initial }: FaqFormProps) {
  const action = mode === "create" ? createFaqAction : updateFaqAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const submitLabel = pending ? "Saving..." : mode === "create" ? "Create FAQ" : "Save changes";

  return (
    <form action={formAction} className="op-card space-y-6 rounded-lg p-6">
      {mode === "edit" && faqId ? <input type="hidden" name="faqId" value={faqId} /> : null}

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-error px-3 py-2 text-sm text-error"
        >
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            error
          </span>
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="faq-question" className={labelClass}>
          Question
        </label>
        <input
          id="faq-question"
          type="text"
          name="question"
          required
          defaultValue={initial?.question ?? ""}
          placeholder="Can I pay with mobile money?"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="faq-answer" className={labelClass}>
          Answer
        </label>
        <textarea
          id="faq-answer"
          name="answer"
          required
          rows={6}
          defaultValue={initial?.answer ?? ""}
          placeholder="Write the full answer HR would give a candidate or client who asked this directly."
          className={fieldClass}
        />
      </div>

      <div className="max-w-[12rem]">
        <label htmlFor="faq-display-order" className={labelClass}>
          Display order
        </label>
        <input
          id="faq-display-order"
          type="number"
          name="displayOrder"
          step={1}
          defaultValue={initial?.display_order ?? 0}
          className={fieldClass}
        />
        <p className="mt-1 text-xs text-on-surface-variant">
          Lower numbers show first. FAQs with the same number keep insertion order.
        </p>
      </div>

      <div className="flex items-center gap-4 border-t border-outline-variant pt-5">
        <button type="submit" disabled={pending} className={submitClass}>
          {submitLabel}
        </button>
        <Link
          href="/admin/content/faqs"
          className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
