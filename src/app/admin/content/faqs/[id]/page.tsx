// Edit-FAQ form. Reads D1 per request; force-dynamic keeps the route out
// of build-time prerendering.

import { notFound } from "next/navigation";
import Link from "next/link";
import { getFaq } from "@/lib/cms/db";
import type { FaqRow } from "@/lib/cms/types";
import { tryGetPortalDb } from "../../../admin-db";
import { requireContentEditorSession } from "../../../session-guard";
import { ActionErrorBanner, ContentStatusBadge, DbUnavailableNotice } from "../../../ui";
import { FaqForm } from "../faq-form";

export const dynamic = "force-dynamic";

interface EditFaqPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

function BackToFaqs() {
  return (
    <Link
      href="/admin/content/faqs"
      className="inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
    >
      <span className="material-symbols-outlined text-base" aria-hidden="true">
        arrow_back
      </span>
      FAQs
    </Link>
  );
}

export default async function EditFaqPage({ params, searchParams }: EditFaqPageProps) {
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
        <BackToFaqs />
        <DbUnavailableNotice />
      </div>
    );
  }

  let faq: FaqRow | null = null;
  let failed = false;
  try {
    faq = await getFaq(db, id);
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <BackToFaqs />
        <DbUnavailableNotice />
      </div>
    );
  }
  if (!faq) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <BackToFaqs />
        {error && (
          <div className="mt-3">
            <ActionErrorBanner code={error} />
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl">Edit FAQ</h2>
          <ContentStatusBadge status={faq.status} />
        </div>
        {faq.updated_by && (
          <p className="mt-2 text-sm text-on-surface-variant">
            Last edited by {faq.updated_by}
          </p>
        )}
      </div>
      <FaqForm mode="edit" faqId={faq.id} initial={faq} />
    </div>
  );
}
