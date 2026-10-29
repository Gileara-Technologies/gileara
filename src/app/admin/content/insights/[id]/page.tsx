// Edit-post form. Reads D1 per request; force-dynamic keeps the route
// out of build-time prerendering.

import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost } from "@/lib/cms/db";
import type { PostRow } from "@/lib/cms/types";
import { tryGetPortalDb } from "../../../admin-db";
import { requireContentEditorSession } from "../../../session-guard";
import { ActionErrorBanner, ContentStatusBadge, DbUnavailableNotice } from "../../../ui";
import { PostForm } from "../post-form";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

function BackToInsights() {
  return (
    <Link
      href="/admin/content/insights"
      className="inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
    >
      <span className="material-symbols-outlined text-base" aria-hidden="true">
        arrow_back
      </span>
      Insights
    </Link>
  );
}

export default async function EditPostPage({ params, searchParams }: EditPostPageProps) {
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
        <BackToInsights />
        <DbUnavailableNotice />
      </div>
    );
  }

  let post: PostRow | null = null;
  let failed = false;
  try {
    post = await getPost(db, id);
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <BackToInsights />
        <DbUnavailableNotice />
      </div>
    );
  }
  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <BackToInsights />
        {error && (
          <div className="mt-3">
            <ActionErrorBanner code={error} />
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl">Edit post</h2>
          <ContentStatusBadge status={post.status} />
        </div>
        {post.updated_by && (
          <p className="mt-2 text-sm text-on-surface-variant">Last edited by {post.updated_by}</p>
        )}
      </div>
      <PostForm mode="edit" postId={post.id} initial={post} />
    </div>
  );
}
