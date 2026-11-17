// Edit-Person form. Reads D1 per request; force-dynamic keeps the route
// out of build-time prerendering.

import { notFound } from "next/navigation";
import Link from "next/link";
import { getPerson } from "@/lib/cms/db";
import type { PersonRow } from "@/lib/cms/types";
import { tryGetPortalDb } from "../../../admin-db";
import { requireContentEditorSession } from "../../../session-guard";
import { ActionErrorBanner, ContentStatusBadge, DbUnavailableNotice } from "../../../ui";
import { PersonForm } from "../person-form";

export const dynamic = "force-dynamic";

interface EditPersonPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

function BackToPeople() {
  return (
    <Link
      href="/admin/content/people"
      className="inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
    >
      <span className="material-symbols-outlined text-base" aria-hidden="true">
        arrow_back
      </span>
      People
    </Link>
  );
}

export default async function EditPersonPage({ params, searchParams }: EditPersonPageProps) {
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
        <BackToPeople />
        <DbUnavailableNotice />
      </div>
    );
  }

  let person: PersonRow | null = null;
  let failed = false;
  try {
    person = await getPerson(db, id);
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <BackToPeople />
        <DbUnavailableNotice />
      </div>
    );
  }
  if (!person) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <BackToPeople />
        {error && (
          <div className="mt-3">
            <ActionErrorBanner code={error} />
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl">Edit person</h2>
          <ContentStatusBadge status={person.status} />
        </div>
        {person.updated_by && (
          <p className="mt-2 text-sm text-on-surface-variant">
            Last edited by {person.updated_by}
          </p>
        )}
      </div>
      <PersonForm mode="edit" personId={person.id} initial={person} />
    </div>
  );
}
