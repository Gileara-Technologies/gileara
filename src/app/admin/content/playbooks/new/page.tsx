// Create-playbook form. The D1 binding check runs up front so a plain
// `next dev` environment shows a clear notice instead of a dead form.

import Link from "next/link";
import { tryGetPortalDb } from "../../../admin-db";
import { requireContentEditorSession } from "../../../session-guard";
import { DbUnavailableNotice } from "../../../ui";
import { PlaybookForm } from "../playbook-form";

export const dynamic = "force-dynamic";

export default async function NewPlaybookPage() {
  await requireContentEditorSession();
  const dbAvailable = tryGetPortalDb() !== null;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/content/playbooks"
          className="inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            arrow_back
          </span>
          Playbooks
        </Link>
        <h2 className="mt-3 font-display text-2xl">New playbook</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Starts as a draft, stage &quot;scenario&quot; (no client yet). Publish it from the Playbooks list once
          you&apos;re happy with it.
        </p>
      </div>
      {!dbAvailable && <DbUnavailableNotice />}
      <PlaybookForm mode="create" />
    </div>
  );
}
