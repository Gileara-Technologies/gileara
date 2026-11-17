"use client";

// Person create/edit form. One shared shape for both /about groups --
// Foundation (full quote + required portrait) and Roster (department
// tag, optional portrait) -- switched by a group toggle rather than two
// separate forms, since every other field (name, role, image, display
// order) is identical either way.

import { useActionState, useState } from "react";
import Link from "next/link";
import { DEPARTMENTS } from "@/content/team";
import type { PersonRow } from "@/lib/cms/types";
import { createPersonAction, updatePersonAction } from "../actions";
import type { ActionState } from "../../form-logic";
import { MediaUploadField } from "../media-upload-field";

const fieldClass =
  "w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface transition-colors placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-on-surface-variant";

const submitClass =
  "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

type PersonGroupValue = "foundation" | "roster";

const GROUP_OPTIONS: ReadonlyArray<{ value: PersonGroupValue; label: string; hint: string }> = [
  { value: "foundation", label: "Foundation", hint: "A founding partner -- full portrait + quote." },
  { value: "roster", label: "Roster", hint: "Everyone else -- a department-tagged grid card." },
];

interface PersonFormProps {
  mode: "create" | "edit";
  /** Required in edit mode; sent as a hidden field to the update action. */
  personId?: number;
  initial?: PersonRow;
  /** Pre-selects the group in create mode (from the list page's two "Add" links). */
  defaultGroup?: PersonGroupValue;
}

const initialState: ActionState = { error: null };

export function PersonForm({ mode, personId, initial, defaultGroup }: PersonFormProps) {
  const action = mode === "create" ? createPersonAction : updatePersonAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [group, setGroup] = useState<PersonGroupValue>(initial?.person_group ?? defaultGroup ?? "roster");

  const isFoundation = group === "foundation";
  const submitLabel = pending ? "Saving..." : mode === "create" ? "Add person" : "Save changes";

  return (
    <form action={formAction} className="op-card space-y-6 rounded-lg p-6">
      {mode === "edit" && personId ? <input type="hidden" name="personId" value={personId} /> : null}

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
        <span className={labelClass}>Section</span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GROUP_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer flex-col gap-1 rounded-md border px-3 py-2.5 text-sm transition-colors ${
                group === option.value
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="flex items-center gap-2 font-medium text-on-surface">
                <input
                  type="radio"
                  name="personGroup"
                  value={option.value}
                  checked={group === option.value}
                  onChange={() => setGroup(option.value)}
                  className="h-4 w-4"
                />
                {option.label}
              </span>
              <span className="text-xs text-on-surface-variant">{option.hint}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="person-name" className={labelClass}>
            Name
          </label>
          <input
            id="person-name"
            type="text"
            name="name"
            required
            defaultValue={initial?.name ?? ""}
            placeholder="Full name"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="person-role" className={labelClass}>
            Role
          </label>
          <input
            id="person-role"
            type="text"
            name="role"
            required
            defaultValue={initial?.role ?? ""}
            placeholder="e.g. Head of Marketing"
            className={fieldClass}
          />
        </div>
      </div>

      {!isFoundation && (
        <div className="max-w-xs">
          <label htmlFor="person-department" className={labelClass}>
            Department
          </label>
          <select
            id="person-department"
            name="department"
            required={!isFoundation}
            defaultValue={initial?.department ?? ""}
            className={fieldClass}
          >
            <option value="" disabled>
              Choose a department
            </option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      )}

      {isFoundation && (
        <div>
          <label htmlFor="person-quote" className={labelClass}>
            Quote
          </label>
          <textarea
            id="person-quote"
            name="quote"
            required={isFoundation}
            rows={3}
            defaultValue={initial?.quote ?? ""}
            placeholder="Rendered as a blockquote next to the portrait."
            className={fieldClass}
          />
        </div>
      )}

      <MediaUploadField
        prefix="team"
        name="image"
        label={isFoundation ? "Portrait (required)" : "Portrait"}
        defaultValue={initial?.image ?? ""}
        placeholder="/assets/images/name.jpg"
        hint={
          isFoundation
            ? "Every founder has a photo -- upload one, paste a /public path, or paste a full URL."
            : "Optional. Upload one, paste a /public path, or paste a full URL. Leave blank to render initials."
        }
      />

      <div className="max-w-[12rem]">
        <label htmlFor="person-display-order" className={labelClass}>
          Display order
        </label>
        <input
          id="person-display-order"
          type="number"
          name="displayOrder"
          step={1}
          defaultValue={initial?.display_order ?? 0}
          className={fieldClass}
        />
        <p className="mt-1 text-xs text-on-surface-variant">
          Lower numbers show first, within this section. Ties keep insertion order.
        </p>
      </div>

      <div className="flex items-center gap-4 border-t border-outline-variant pt-5">
        <button type="submit" disabled={pending} className={submitClass}>
          {submitLabel}
        </button>
        <Link
          href="/admin/content/people"
          className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
