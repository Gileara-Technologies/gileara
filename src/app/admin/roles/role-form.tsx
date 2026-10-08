"use client";

// Role create/edit form. Scalar fields post straight to the server actions;
// the three list fields are dynamic row inputs (add/remove) whose named
// inputs are collected by FormData.getAll on submit. Slug is not editable:
// it is generated from the title on create and fixed afterwards.

import { useActionState, useState } from "react";
import Link from "next/link";
import type { ParsedRole } from "@/lib/portal/types";
import { createRoleAction, updateRoleAction } from "../actions";
import {
  DEFAULT_ICON,
  ROLE_STATUSES,
  statusLabel,
  type ActionState,
} from "../form-logic";

const fieldClass =
  "w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface transition-colors placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-on-surface-variant";

const secondaryButtonClass =
  "inline-flex items-center gap-1 rounded border border-outline-variant px-2.5 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high";

const submitClass =
  "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

/** Seed one blank row so an empty list still shows an input to type in. */
function seedRows(rows: string[] | undefined): string[] {
  return rows && rows.length > 0 ? [...rows] : [""];
}

interface ListFieldProps {
  label: string;
  name: string;
  hint: string;
  rows: string[];
  onChange: (rows: string[]) => void;
}

function ListField({ label, name, hint, rows, onChange }: ListFieldProps) {
  const updateRow = (index: number, value: string): void => {
    onChange(rows.map((row, i) => (i === index ? value : row)));
  };
  const addRow = (): void => {
    onChange([...rows, ""]);
  };
  const removeRow = (index: number): void => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <fieldset className="space-y-2">
      <legend className={labelClass}>{label}</legend>
      <p className="text-xs text-on-surface-variant">{hint}</p>
      {rows.length === 0 && (
        <p className="text-sm text-on-surface-variant">No items yet.</p>
      )}
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div key={index} className="flex items-start gap-2">
            <input
              type="text"
              name={name}
              value={row}
              onChange={(e) => updateRow(index, e.target.value)}
              placeholder={label}
              aria-label={`${label} item ${index + 1}`}
              className={fieldClass}
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              aria-label={`Remove ${label.toLowerCase()} item ${index + 1}`}
              className={`${secondaryButtonClass} shrink-0 px-2`}
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">
                remove
              </span>
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addRow} className={secondaryButtonClass}>
        <span className="material-symbols-outlined text-sm" aria-hidden="true">
          add
        </span>
        Add {label.toLowerCase()}
      </button>
    </fieldset>
  );
}

interface RoleFormProps {
  mode: "create" | "edit";
  /** Required in edit mode; sent as a hidden field to the update action. */
  roleId?: string;
  initial?: ParsedRole;
}

const initialState: ActionState = { error: null };

export function RoleForm({ mode, roleId, initial }: RoleFormProps) {
  const action = mode === "create" ? createRoleAction : updateRoleAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const [icon, setIcon] = useState(initial?.icon ?? DEFAULT_ICON);
  const [responsibilities, setResponsibilities] = useState(
    seedRows(initial?.responsibilities),
  );
  const [requiredSkills, setRequiredSkills] = useState(
    seedRows(initial?.requiredSkills),
  );
  const [niceToHave, setNiceToHave] = useState(seedRows(initial?.niceToHave));

  const submitLabel = pending
    ? "Saving..."
    : mode === "create"
      ? "Create role"
      : "Save changes";

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-lg border border-outline-variant bg-surface-container-lowest p-6"
    >
      {mode === "edit" && roleId ? (
        <input type="hidden" name="roleId" value={roleId} />
      ) : null}

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
        <label htmlFor="role-title" className={labelClass}>
          Title
        </label>
        <input
          id="role-title"
          type="text"
          name="title"
          required
          defaultValue={initial?.title ?? ""}
          placeholder="Full-Stack Engineer"
          className={fieldClass}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="role-openings" className={labelClass}>
            Openings
          </label>
          <input
            id="role-openings"
            type="number"
            name="openings"
            required
            min={1}
            step={1}
            defaultValue={initial?.openings ?? 1}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="role-icon" className={labelClass}>
            Icon
          </label>
          <div className="flex items-center gap-3">
            <input
              id="role-icon"
              type="text"
              name="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder={DEFAULT_ICON}
              className={fieldClass}
            />
            <span
              className="material-symbols-outlined shrink-0 text-2xl text-primary"
              aria-hidden="true"
            >
              {icon.trim() || DEFAULT_ICON}
            </span>
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            Material glyph name, such as code_blocks or palette.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="role-location" className={labelClass}>
          Location
        </label>
        <input
          id="role-location"
          type="text"
          name="location"
          required
          defaultValue={initial?.location ?? ""}
          placeholder="Accra, Ghana · Hybrid"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="role-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="role-description"
          name="description"
          required
          rows={4}
          defaultValue={initial?.description ?? ""}
          placeholder="What the person will do, in a few sentences."
          className={fieldClass}
        />
      </div>

      <ListField
        label="Responsibilities"
        name="responsibilities"
        hint="One per row. These show as the role's day-to-day list."
        rows={responsibilities}
        onChange={setResponsibilities}
      />
      <ListField
        label="Required skills"
        name="requiredSkills"
        hint="One per row. What a strong applicant already has."
        rows={requiredSkills}
        onChange={setRequiredSkills}
      />
      <ListField
        label="Nice to have"
        name="niceToHave"
        hint="Optional. One per row."
        rows={niceToHave}
        onChange={setNiceToHave}
      />

      {mode === "edit" && (
        <div>
          <label htmlFor="role-status" className={labelClass}>
            Status
          </label>
          <select
            id="role-status"
            name="status"
            defaultValue={initial?.status ?? "open"}
            className={`${fieldClass} appearance-none`}
          >
            {ROLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-4 border-t border-outline-variant pt-5">
        <button type="submit" disabled={pending} className={submitClass}>
          {submitLabel}
        </button>
        <Link
          href="/admin"
          className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
