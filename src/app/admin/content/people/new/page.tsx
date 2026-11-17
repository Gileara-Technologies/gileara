// Create-Person form. The D1 binding check runs up front so a plain
// `next dev` environment shows a clear notice instead of a dead form.
// ?group=foundation|roster pre-selects the section this person renders
// in -- the People list's two "Add" buttons each link here with it set.

import Link from "next/link";
import { tryGetPortalDb } from "../../../admin-db";
import { requireContentEditorSession } from "../../../session-guard";
import { DbUnavailableNotice } from "../../../ui";
import { PersonForm } from "../person-form";

export const dynamic = "force-dynamic";

interface NewPersonPageProps {
  searchParams: Promise<{ group?: string }>;
}

export default async function NewPersonPage({ searchParams }: NewPersonPageProps) {
  await requireContentEditorSession();
  const { group } = await searchParams;
  const dbAvailable = tryGetPortalDb() !== null;
  const defaultGroup = group === "foundation" ? "foundation" : "roster";
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/content/people"
          className="inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            arrow_back
          </span>
          People
        </Link>
        <h2 className="mt-3 font-display text-2xl">New person</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Starts as a draft. Publish it from the People list once you&apos;re happy with it.
        </p>
      </div>
      {!dbAvailable && <DbUnavailableNotice />}
      <PersonForm mode="create" defaultGroup={defaultGroup} />
    </div>
  );
}
