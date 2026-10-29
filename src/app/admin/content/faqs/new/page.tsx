// Create-FAQ form. The D1 binding check runs up front so a plain
// `next dev` environment shows a clear notice instead of a dead form.

import Link from "next/link";
import { tryGetPortalDb } from "../../../admin-db";
import { requireContentEditorSession } from "../../../session-guard";
import { DbUnavailableNotice } from "../../../ui";
import { FaqForm } from "../faq-form";

export const dynamic = "force-dynamic";

export default async function NewFaqPage() {
  await requireContentEditorSession();
  const dbAvailable = tryGetPortalDb() !== null;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/content/faqs"
          className="inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            arrow_back
          </span>
          FAQs
        </Link>
        <h2 className="mt-3 font-display text-2xl">New FAQ</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Starts as a draft. Publish it from the FAQ list once you&apos;re happy with the wording.
        </p>
      </div>
      {!dbAvailable && <DbUnavailableNotice />}
      <FaqForm mode="create" />
    </div>
  );
}
