"use client";

// Insight-post create/edit form. The body textarea uses a small
// markdown-subset syntax (src/lib/cms/markdown.ts) rather than a rich
// block editor -- see the hint box below the field.

import { useActionState } from "react";
import Link from "next/link";
import { POST_TAGS } from "@/content/posts";
import type { PostRow } from "@/lib/cms/types";
import { createPostAction, updatePostAction } from "../actions";
import type { ActionState } from "../../form-logic";

const fieldClass =
  "w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface transition-colors placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-on-surface-variant";

const submitClass =
  "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

interface PostFormProps {
  mode: "create" | "edit";
  /** Required in edit mode; sent as a hidden field to the update action. */
  postId?: number;
  initial?: PostRow;
}

const initialState: ActionState = { error: null };

export function PostForm({ mode, postId, initial }: PostFormProps) {
  const action = mode === "create" ? createPostAction : updatePostAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const submitLabel = pending ? "Saving..." : mode === "create" ? "Create post" : "Save changes";

  return (
    <form action={formAction} className="op-card space-y-6 rounded-lg p-6">
      {mode === "edit" && postId ? <input type="hidden" name="postId" value={postId} /> : null}

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

      {mode === "edit" && initial && (
        <p className="font-mono text-xs text-on-surface-variant">/insights/{initial.slug}</p>
      )}

      <div>
        <label htmlFor="post-title" className={labelClass}>
          Title
        </label>
        <input
          id="post-title"
          type="text"
          name="title"
          required
          defaultValue={initial?.title ?? ""}
          placeholder="What All-Inclusive Should Mean When You Buy Software"
          className={fieldClass}
        />
        {mode === "create" && (
          <p className="mt-1 text-xs text-on-surface-variant">
            The URL slug is generated from this title and fixed once the post is created.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="post-excerpt" className={labelClass}>
          Excerpt
        </label>
        <textarea
          id="post-excerpt"
          name="excerpt"
          required
          rows={2}
          defaultValue={initial?.excerpt ?? ""}
          placeholder="One or two sentences shown on the Insights list and in link previews."
          className={fieldClass}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="post-date" className={labelClass}>
            Post date
          </label>
          <input
            id="post-date"
            type="date"
            name="postDate"
            required
            defaultValue={initial?.post_date ?? ""}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="post-author" className={labelClass}>
            Author
          </label>
          <input
            id="post-author"
            type="text"
            name="author"
            required
            defaultValue={initial?.author ?? ""}
            placeholder="Amos Frederick Hughes"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="post-tag" className={labelClass}>
            Tag
          </label>
          <select
            id="post-tag"
            name="tag"
            required
            defaultValue={initial?.tag ?? POST_TAGS[0]}
            className={`${fieldClass} appearance-none`}
          >
            {POST_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="post-image" className={labelClass}>
          Cover image
        </label>
        <input
          id="post-image"
          type="text"
          name="image"
          defaultValue={initial?.image ?? ""}
          placeholder="/assets/insights/your-cover.jpg (optional)"
          className={fieldClass}
        />
        <p className="mt-1 text-xs text-on-surface-variant">
          Optional. A path under /public or a full URL. Leave blank for a gradient placeholder. There&apos;s no
          upload yet — a developer needs to add the file first.
        </p>
      </div>

      <div>
        <label htmlFor="post-body" className={labelClass}>
          Body
        </label>
        <textarea
          id="post-body"
          name="body"
          required
          rows={16}
          defaultValue={initial?.body ?? ""}
          placeholder={"Ask any business what surprised them most.\n\n## A heading\n\nAnother paragraph."}
          className={`${fieldClass} font-mono text-[13px]`}
        />
        <div className="mt-2 rounded-md border border-outline-variant bg-surface-container-low p-3 text-xs text-on-surface-variant">
          <p className="mb-1.5 font-medium text-on-surface">Formatting (not full markdown):</p>
          <ul className="space-y-1">
            <li>Blank line between paragraphs.</li>
            <li>
              <code className="font-mono">## A heading</code> on its own line for a subheading.
            </li>
            <li>
              A call-to-action block:
              <pre className="mt-1 whitespace-pre-wrap font-mono">{"::: cta\nThe pitch sentence.\nhref: /services\nlabel: See the packages\n:::"}</pre>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-outline-variant pt-5">
        <button type="submit" disabled={pending} className={submitClass}>
          {submitLabel}
        </button>
        <Link
          href="/admin/content/insights"
          className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
