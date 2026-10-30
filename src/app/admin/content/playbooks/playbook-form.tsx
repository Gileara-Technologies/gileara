"use client";

// Playbook create/edit form. The most complex of the three content
// forms: two plain string-list fields (ListField, same pattern as the
// role form), one paired phase+detail dynamic list (implementation
// steps), and a checkbox set constrained to the real servicePackages
// list rather than freeform text (packages/pricing stayed out of CMS
// scope -- a typo here can't produce a dead reference).

import { useActionState, useState } from "react";
import Link from "next/link";
import { servicePackages } from "@/content/packages";
import { SCENARIO_STATUS_LEGEND, type ScenarioStatus } from "@/content/scenarios";
import type { ParsedScenario } from "@/lib/cms/types";
import { createScenarioAction, updateScenarioAction } from "../actions";
import type { ActionState } from "../../form-logic";
import { MediaUploadField } from "../media-upload-field";

const fieldClass =
  "w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface transition-colors placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-on-surface-variant";

const secondaryButtonClass =
  "inline-flex items-center gap-1 rounded border border-outline-variant px-2.5 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high";

const submitClass =
  "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

const DEFAULT_ICON = "business_center";
const SCENARIO_STATUSES = Object.keys(SCENARIO_STATUS_LEGEND) as ScenarioStatus[];

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

interface StepRow {
  phase: string;
  detail: string;
}

function seedStepRows(steps: ParsedScenario["implementation"] | undefined): StepRow[] {
  return steps && steps.length > 0 ? steps.map((s) => ({ ...s })) : [{ phase: "", detail: "" }];
}

/** Paired phase+detail dynamic rows. Posts as two parallel arrays
 *  (implementationPhase[], implementationDetail[]), zipped back
 *  together by formImplementationSteps on the server. */
function ImplementationField({
  rows,
  onChange,
}: {
  rows: StepRow[];
  onChange: (rows: StepRow[]) => void;
}) {
  const updateRow = (index: number, field: keyof StepRow, value: string): void => {
    onChange(rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };
  const addRow = (): void => {
    onChange([...rows, { phase: "", detail: "" }]);
  };
  const removeRow = (index: number): void => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <fieldset className="space-y-2">
      <legend className={labelClass}>Implementation steps</legend>
      <p className="text-xs text-on-surface-variant">
        Each row is one phase of the playbook (e.g. &quot;Diagnose&quot;, &quot;Implement&quot;, &quot;Run&quot;,
        &quot;Grow&quot;) with what happens in it.
      </p>
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="flex items-start gap-2 rounded-md border border-outline-variant p-3">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                name="implementationPhase"
                value={row.phase}
                onChange={(e) => updateRow(index, "phase", e.target.value)}
                placeholder="Phase, e.g. Diagnose"
                aria-label={`Phase ${index + 1}`}
                className={fieldClass}
              />
              <input
                type="text"
                name="implementationDetail"
                value={row.detail}
                onChange={(e) => updateRow(index, "detail", e.target.value)}
                placeholder="What happens in this phase"
                aria-label={`Detail ${index + 1}`}
                className={fieldClass}
              />
            </div>
            <button
              type="button"
              onClick={() => removeRow(index)}
              aria-label={`Remove step ${index + 1}`}
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
        Add step
      </button>
    </fieldset>
  );
}

function PackageCheckboxes({ defaultChecked }: { defaultChecked: string[] }) {
  return (
    <fieldset className="space-y-2">
      <legend className={labelClass}>Referenced packages</legend>
      <p className="text-xs text-on-surface-variant">
        Which service packages this playbook implements. Constrained to the real list on /services.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {servicePackages.map((pkg) => (
          <label key={pkg.id} className="flex items-center gap-2 text-sm text-on-surface">
            <input
              type="checkbox"
              name="packageIds"
              value={pkg.id}
              defaultChecked={defaultChecked.includes(pkg.id)}
              className="h-4 w-4 rounded border-outline-variant"
            />
            {pkg.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface PlaybookFormProps {
  mode: "create" | "edit";
  /** Required in edit mode; sent as a hidden field to the update action. */
  scenarioId?: number;
  initial?: ParsedScenario;
}

const initialState: ActionState = { error: null };

export function PlaybookForm({ mode, scenarioId, initial }: PlaybookFormProps) {
  const action = mode === "create" ? createScenarioAction : updateScenarioAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const [icon, setIcon] = useState(initial?.icon ?? DEFAULT_ICON);
  const [painPoints, setPainPoints] = useState(seedRows(initial?.painPoints));
  const [targetOutcomes, setTargetOutcomes] = useState(seedRows(initial?.targetOutcomes));
  const [steps, setSteps] = useState(seedStepRows(initial?.implementation));

  const submitLabel = pending ? "Saving..." : mode === "create" ? "Create playbook" : "Save changes";

  return (
    <form action={formAction} className="op-card space-y-6 rounded-lg p-6">
      {mode === "edit" && scenarioId ? (
        <input type="hidden" name="scenarioId" value={scenarioId} />
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

      {mode === "edit" && initial && (
        <p className="font-mono text-xs text-on-surface-variant">/how-we-transform/{initial.slug}</p>
      )}

      <div>
        <label htmlFor="scenario-vertical" className={labelClass}>
          Vertical
        </label>
        <input
          id="scenario-vertical"
          type="text"
          name="vertical"
          required
          defaultValue={initial?.vertical ?? ""}
          placeholder="Pharmacy"
          className={fieldClass}
        />
        {mode === "create" && (
          <p className="mt-1 text-xs text-on-surface-variant">
            The URL slug is generated from this and fixed once the playbook is created.
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="scenario-icon" className={labelClass}>
            Icon
          </label>
          <div className="flex items-center gap-3">
            <input
              id="scenario-icon"
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
          <p className="mt-1 text-xs text-on-surface-variant">Material glyph name, such as medication or school.</p>
        </div>
        <div>
          <label htmlFor="scenario-status" className={labelClass}>
            Stage
          </label>
          <select
            id="scenario-status"
            name="scenarioStatus"
            defaultValue={initial?.scenarioStatus ?? "scenario"}
            className={`${fieldClass} appearance-none`}
          >
            {SCENARIO_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status} — {SCENARIO_STATUS_LEGEND[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="scenario-headline" className={labelClass}>
          Headline
        </label>
        <input
          id="scenario-headline"
          type="text"
          name="headline"
          required
          defaultValue={initial?.headline ?? ""}
          placeholder="The pharmacy that always knows its stock"
          className={fieldClass}
        />
      </div>

      <ListField
        label="Pain points"
        name="painPoints"
        hint="One per row. The problems this vertical actually has today."
        rows={painPoints}
        onChange={setPainPoints}
      />

      <ImplementationField rows={steps} onChange={setSteps} />

      <ListField
        label="Target outcomes"
        name="targetOutcomes"
        hint="One per row. Goals we aim for -- never claimed results (honesty contract)."
        rows={targetOutcomes}
        onChange={setTargetOutcomes}
      />

      <PackageCheckboxes defaultChecked={initial?.packageIds ?? []} />

      <div>
        <label htmlFor="scenario-ghana-context" className={labelClass}>
          Local context
        </label>
        <textarea
          id="scenario-ghana-context"
          name="ghanaContext"
          required
          rows={3}
          defaultValue={initial?.ghanaContext ?? ""}
          placeholder="How this plays out in the actual market this vertical operates in."
          className={fieldClass}
        />
      </div>

      <MediaUploadField
        prefix="playbooks"
        name="image"
        label="Photo"
        defaultValue={initial?.image ?? ""}
        placeholder="/assets/gileara/photos/pharmacy.jpg (optional)"
        hint="Optional. Real photography of the actual business context only -- never Western/AI stock. Leave blank until that exists."
      />

      <div className="flex items-center gap-4 border-t border-outline-variant pt-5">
        <button type="submit" disabled={pending} className={submitClass}>
          {submitLabel}
        </button>
        <Link
          href="/admin/content/playbooks"
          className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
