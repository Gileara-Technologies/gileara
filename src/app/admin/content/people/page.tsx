// People content list: every person (draft and published, both the
// Foundation and Roster /about groups), with publish/unpublish and
// delete actions. Reads D1 per request; force-dynamic keeps the route
// out of build-time prerendering. Gated by requireContentEditorSession.

import Link from "next/link";
import { listPeople } from "@/lib/cms/db";
import type { PersonRow } from "@/lib/cms/types";
import { tryGetPortalDb } from "../../admin-db";
import { requireContentEditorSession } from "../../session-guard";
import { ActionErrorBanner, ContentStatusBadge, DbUnavailableNotice } from "../../ui";
import { deletePersonAction, setPersonStatusAction } from "../actions";

export const dynamic = "force-dynamic";

interface PeoplePageProps {
  searchParams: Promise<{ error?: string }>;
}

const rowButtonClass =
  "inline-flex items-center gap-1 rounded border border-outline-variant px-2.5 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";

const primaryButtonClass =
  "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const secondaryButtonClass =
  "inline-flex items-center gap-1.5 rounded-md border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high";

const GROUP_LABEL: Record<PersonRow["person_group"], string> = {
  foundation: "Foundation",
  roster: "Roster",
};

const GROUP_BADGE_CLASS: Record<PersonRow["person_group"], string> = {
  foundation: "bg-primary-container text-on-primary-container",
  roster: "bg-surface-container-highest text-on-surface-variant",
};

function PersonGroupBadge({ group }: { group: PersonRow["person_group"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium ${GROUP_BADGE_CLASS[group]}`}
    >
      {GROUP_LABEL[group]}
    </span>
  );
}

function PeopleHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl">People</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Edit who shows up in the Foundation and Roster sections of /about. New entries start as drafts.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/content/people/new?group=foundation" className={secondaryButtonClass}>
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            add
          </span>
          Add founder
        </Link>
        <Link href="/admin/content/people/new?group=roster" className={primaryButtonClass}>
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            add
          </span>
          Add roster member
        </Link>
      </div>
    </div>
  );
}

function PublishToggleForm({ person }: { person: PersonRow }) {
  const next = person.status === "published" ? "draft" : "published";
  const label = person.status === "published" ? "Unpublish" : "Publish";
  const icon = person.status === "published" ? "visibility_off" : "check_circle";
  return (
    <form action={setPersonStatusAction}>
      <input type="hidden" name="id" value={person.id} />
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
    <form action={deletePersonAction}>
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

function PersonRowItem({ person }: { person: PersonRow }) {
  return (
    <tr className="hover:bg-surface-container-low">
      <td className="px-4 py-3 max-w-xs">
        <Link
          href={`/admin/content/people/${person.id}`}
          className="font-medium transition-colors hover:text-primary line-clamp-1"
        >
          {person.name}
        </Link>
        <p className="mt-0.5 line-clamp-1 text-xs text-on-surface-variant">{person.role}</p>
      </td>
      <td className="px-4 py-3">
        <PersonGroupBadge group={person.person_group} />
      </td>
      <td className="px-4 py-3 text-xs text-on-surface-variant">{person.department ?? "—"}</td>
      <td className="px-4 py-3">
        <ContentStatusBadge status={person.status} />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{person.display_order}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/content/people/${person.id}`} className={rowButtonClass}>
            <span className="material-symbols-outlined text-sm" aria-hidden="true">
              edit
            </span>
            Edit
          </Link>
          <PublishToggleForm person={person} />
          <DeleteForm id={person.id} />
        </div>
      </td>
    </tr>
  );
}

export default async function PeoplePage({ searchParams }: PeoplePageProps) {
  const { error } = await searchParams;
  await requireContentEditorSession();

  const db = tryGetPortalDb();
  if (!db) {
    return (
      <div className="space-y-6">
        <PeopleHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  let people: PersonRow[] = [];
  let failed = false;
  try {
    people = await listPeople(db);
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="space-y-6">
        <PeopleHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PeopleHeader />
      <ActionErrorBanner code={error} />
      {people.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant" aria-hidden="true">
            groups
          </span>
          <p className="mt-3 font-display text-base">No one here yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Add the founders first, then the rest of the roster.
          </p>
          <Link href="/admin/content/people/new?group=foundation" className={`${primaryButtonClass} mt-4`}>
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              add
            </span>
            Add founder
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full min-w-[840px] text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-left text-xs uppercase tracking-wide text-on-surface-variant">
                <th className="px-4 py-3 font-medium">Person</th>
                <th className="px-4 py-3 font-medium">Section</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {people.map((person) => (
                <PersonRowItem key={person.id} person={person} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
