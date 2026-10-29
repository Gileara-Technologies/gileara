// FAQ content list: every FAQ (draft and published), with publish/unpublish
// and delete actions. Reads D1 per request; force-dynamic keeps the route
// out of build-time prerendering. Gated by requireContentEditorSession,
// not requireAdminSession -- a plain HR session without a matching email
// gets bounced back to /admin with ?error=content-forbidden.

import Link from "next/link";
import { listFaqs } from "@/lib/cms/db";
import type { FaqRow } from "@/lib/cms/types";
import { tryGetPortalDb } from "../../admin-db";
import { requireContentEditorSession } from "../../session-guard";
import { ActionErrorBanner, ContentStatusBadge, DbUnavailableNotice } from "../../ui";
import { deleteFaqAction, setFaqStatusAction } from "../actions";

export const dynamic = "force-dynamic";

interface FaqsPageProps {
  searchParams: Promise<{ error?: string }>;
}

const rowButtonClass =
  "inline-flex items-center gap-1 rounded border border-outline-variant px-2.5 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";

const primaryButtonClass =
  "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function FaqsHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl">FAQs</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Edit the questions and answers shown on /faq. New entries start as drafts.
        </p>
      </div>
      <Link href="/admin/content/faqs/new" className={primaryButtonClass}>
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          add
        </span>
        New FAQ
      </Link>
    </div>
  );
}

function PublishToggleForm({ faq }: { faq: FaqRow }) {
  const next = faq.status === "published" ? "draft" : "published";
  const label = faq.status === "published" ? "Unpublish" : "Publish";
  const icon = faq.status === "published" ? "visibility_off" : "check_circle";
  return (
    <form action={setFaqStatusAction}>
      <input type="hidden" name="id" value={faq.id} />
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
    <form action={deleteFaqAction}>
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

function FaqRowItem({ faq }: { faq: FaqRow }) {
  return (
    <tr className="hover:bg-surface-container-low">
      <td className="px-4 py-3 max-w-md">
        <Link
          href={`/admin/content/faqs/${faq.id}`}
          className="font-medium transition-colors hover:text-primary line-clamp-1"
        >
          {faq.question}
        </Link>
        <p className="mt-0.5 line-clamp-1 text-xs text-on-surface-variant">{faq.answer}</p>
      </td>
      <td className="px-4 py-3">
        <ContentStatusBadge status={faq.status} />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{faq.display_order}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/content/faqs/${faq.id}`} className={rowButtonClass}>
            <span className="material-symbols-outlined text-sm" aria-hidden="true">
              edit
            </span>
            Edit
          </Link>
          <PublishToggleForm faq={faq} />
          <DeleteForm id={faq.id} />
        </div>
      </td>
    </tr>
  );
}

export default async function FaqsPage({ searchParams }: FaqsPageProps) {
  const { error } = await searchParams;
  await requireContentEditorSession();

  const db = tryGetPortalDb();
  if (!db) {
    return (
      <div className="space-y-6">
        <FaqsHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  let faqs: FaqRow[] = [];
  let failed = false;
  try {
    faqs = await listFaqs(db);
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="space-y-6">
        <FaqsHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FaqsHeader />
      <ActionErrorBanner code={error} />
      {faqs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant" aria-hidden="true">
            help
          </span>
          <p className="mt-3 font-display text-base">No FAQs yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Create the first one to seed the public FAQ page.
          </p>
          <Link href="/admin/content/faqs/new" className={`${primaryButtonClass} mt-4`}>
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              add
            </span>
            New FAQ
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-left text-xs uppercase tracking-wide text-on-surface-variant">
                <th className="px-4 py-3 font-medium">Question</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {faqs.map((faq) => (
                <FaqRowItem key={faq.id} faq={faq} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
