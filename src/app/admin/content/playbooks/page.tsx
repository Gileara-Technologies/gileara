// Playbook content list: every How-We-Transform playbook (draft and
// published), with publish/unpublish, a quick scenario-stage control
// (scenario -> pilot -> case-study), and delete. Reads D1 per request;
// force-dynamic keeps the route out of build-time prerendering. Gated
// by requireContentEditorSession, not requireAdminSession.

import Link from "next/link";
import { listScenarios } from "@/lib/cms/db";
import type { ParsedScenario } from "@/lib/cms/types";
import { SCENARIO_STATUS_LEGEND, type ScenarioStatus } from "@/content/scenarios";
import { tryGetPortalDb } from "../../admin-db";
import { requireContentEditorSession } from "../../session-guard";
import { ActionErrorBanner, ContentStatusBadge, DbUnavailableNotice } from "../../ui";
import {
  deleteScenarioAction,
  setScenarioContentStatusAction,
  setScenarioStageAction,
} from "../actions";

export const dynamic = "force-dynamic";

const SCENARIO_STATUSES = Object.keys(SCENARIO_STATUS_LEGEND) as ScenarioStatus[];

interface PlaybooksPageProps {
  searchParams: Promise<{ error?: string }>;
}

const rowButtonClass =
  "inline-flex items-center gap-1 rounded border border-outline-variant px-2.5 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";

const primaryButtonClass =
  "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const selectClass =
  "rounded-md border border-outline-variant bg-surface-container-lowest px-2.5 py-1.5 text-xs text-on-surface";

function PlaybooksHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl">Playbooks</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Edit the vertical playbooks shown on /how-we-transform. Moving a playbook from scenario to pilot to
          case-study no longer needs a deploy.
        </p>
      </div>
      <Link href="/admin/content/playbooks/new" className={primaryButtonClass}>
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          add
        </span>
        New playbook
      </Link>
    </div>
  );
}

/** The quick stage control -- scenario -> pilot -> case-study -- the
 *  reason this slice exists. Same <select> + submit shape as the
 *  applications status control. */
function StageForm({ scenario }: { scenario: ParsedScenario }) {
  return (
    <form action={setScenarioStageAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={scenario.id} />
      <label htmlFor={`stage-${scenario.id}`} className="sr-only">
        Stage for {scenario.vertical}
      </label>
      <select
        id={`stage-${scenario.id}`}
        name="scenarioStatus"
        defaultValue={scenario.scenarioStatus}
        className={selectClass}
      >
        {SCENARIO_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button type="submit" className={rowButtonClass}>
        Update
      </button>
    </form>
  );
}

function PublishToggleForm({ scenario }: { scenario: ParsedScenario }) {
  const next = scenario.status === "published" ? "draft" : "published";
  const label = scenario.status === "published" ? "Unpublish" : "Publish";
  const icon = scenario.status === "published" ? "visibility_off" : "check_circle";
  return (
    <form action={setScenarioContentStatusAction}>
      <input type="hidden" name="id" value={scenario.id} />
      <input type="hidden" name="status" value={next} />
      <button type="submit" className={rowButtonClass}>
        <span className="material-symbols-outlined text-sm" aria-hidden="true">
          {icon}
        </span>
        {label}
      </button>
    </form>
  );
}

function DeleteForm({ id }: { id: number }) {
  return (
    <form action={deleteScenarioAction}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={rowButtonClass}>
        <span className="material-symbols-outlined text-sm" aria-hidden="true">
          close
        </span>
        Delete
      </button>
    </form>
  );
}

function ScenarioRowItem({ scenario }: { scenario: ParsedScenario }) {
  return (
    <tr className="hover:bg-surface-container-low">
      <td className="px-4 py-3 max-w-xs">
        <Link
          href={`/admin/content/playbooks/${scenario.id}`}
          className="font-medium transition-colors hover:text-primary line-clamp-1"
        >
          {scenario.vertical}
        </Link>
        <p className="mt-0.5 line-clamp-1 text-xs text-on-surface-variant">{scenario.headline}</p>
      </td>
      <td className="px-4 py-3">
        <ContentStatusBadge status={scenario.status} />
      </td>
      <td className="px-4 py-3">
        <StageForm scenario={scenario} />
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/content/playbooks/${scenario.id}`} className={rowButtonClass}>
            <span className="material-symbols-outlined text-sm" aria-hidden="true">
              edit
            </span>
            Edit
          </Link>
          <PublishToggleForm scenario={scenario} />
          <DeleteForm id={scenario.id} />
        </div>
      </td>
    </tr>
  );
}

export default async function PlaybooksAdminPage({ searchParams }: PlaybooksPageProps) {
  const { error } = await searchParams;
  await requireContentEditorSession();

  const db = tryGetPortalDb();
  if (!db) {
    return (
      <div className="space-y-6">
        <PlaybooksHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  let scenarios: ParsedScenario[] = [];
  let failed = false;
  try {
    scenarios = await listScenarios(db);
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="space-y-6">
        <PlaybooksHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PlaybooksHeader />
      <ActionErrorBanner code={error} />
      {scenarios.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant" aria-hidden="true">
            account_tree
          </span>
          <p className="mt-3 font-display text-base">No playbooks yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Create the first one to seed the public How We Transform page.
          </p>
          <Link href="/admin/content/playbooks/new" className={`${primaryButtonClass} mt-4`}>
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              add
            </span>
            New playbook
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-left text-xs uppercase tracking-wide text-on-surface-variant">
                <th className="px-4 py-3 font-medium">Vertical</th>
                <th className="px-4 py-3 font-medium">Visibility</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {scenarios.map((scenario) => (
                <ScenarioRowItem key={scenario.id} scenario={scenario} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
