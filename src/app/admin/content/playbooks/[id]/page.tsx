// Edit-playbook form. Reads D1 per request; force-dynamic keeps the
// route out of build-time prerendering.

import { notFound } from "next/navigation";
import Link from "next/link";
import { getScenario } from "@/lib/cms/db";
import type { ParsedScenario } from "@/lib/cms/types";
import { tryGetPortalDb } from "../../../admin-db";
import { requireContentEditorSession } from "../../../session-guard";
import { ActionErrorBanner, ContentStatusBadge, DbUnavailableNotice } from "../../../ui";
import { PlaybookForm } from "../playbook-form";

export const dynamic = "force-dynamic";

interface EditPlaybookPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

function BackToPlaybooks() {
  return (
    <Link
      href="/admin/content/playbooks"
      className="inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
    >
      <span className="material-symbols-outlined text-base" aria-hidden="true">
        arrow_back
      </span>
      Playbooks
    </Link>
  );
}

export default async function EditPlaybookPage({ params, searchParams }: EditPlaybookPageProps) {
  await requireContentEditorSession();
  const { id: idRaw } = await params;
  const { error } = await searchParams;
  const id = Number(idRaw);
  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  const db = tryGetPortalDb();
  if (!db) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <BackToPlaybooks />
        <DbUnavailableNotice />
      </div>
    );
  }

  let scenario: ParsedScenario | null = null;
  let failed = false;
  try {
    scenario = await getScenario(db, id);
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <BackToPlaybooks />
        <DbUnavailableNotice />
      </div>
    );
  }
  if (!scenario) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <BackToPlaybooks />
        {error && (
          <div className="mt-3">
            <ActionErrorBanner code={error} />
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl">Edit playbook</h2>
          <ContentStatusBadge status={scenario.status} />
        </div>
        {scenario.updatedBy && (
          <p className="mt-2 text-sm text-on-surface-variant">Last edited by {scenario.updatedBy}</p>
        )}
      </div>
      <PlaybookForm mode="edit" scenarioId={scenario.id} initial={scenario} />
    </div>
  );
}
