// Insight-post content list: every post (draft and published), with
// publish/unpublish and delete actions. Reads D1 per request;
// force-dynamic keeps the route out of build-time prerendering. Gated by
// requireContentEditorSession, not requireAdminSession.

import Link from "next/link";
import { listPosts } from "@/lib/cms/db";
import type { PostRow } from "@/lib/cms/types";
import { tryGetPortalDb } from "../../admin-db";
import { requireContentEditorSession } from "../../session-guard";
import { ActionErrorBanner, ContentStatusBadge, DbUnavailableNotice } from "../../ui";
import { deletePostAction, setPostStatusAction } from "../actions";

export const dynamic = "force-dynamic";

interface InsightsPageProps {
  searchParams: Promise<{ error?: string }>;
}

const rowButtonClass =
  "inline-flex items-center gap-1 rounded border border-outline-variant px-2.5 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";

const primaryButtonClass =
  "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function InsightsHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl">Insights</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Edit the articles shown on /insights. New posts start as drafts.
        </p>
      </div>
      <Link href="/admin/content/insights/new" className={primaryButtonClass}>
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          add
        </span>
        New post
      </Link>
    </div>
  );
}

function PublishToggleForm({ post }: { post: PostRow }) {
  const next = post.status === "published" ? "draft" : "published";
  const label = post.status === "published" ? "Unpublish" : "Publish";
  const icon = post.status === "published" ? "visibility_off" : "check_circle";
  return (
    <form action={setPostStatusAction}>
      <input type="hidden" name="id" value={post.id} />
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
    <form action={deletePostAction}>
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

function PostRowItem({ post }: { post: PostRow }) {
  return (
    <tr className="hover:bg-surface-container-low">
      <td className="px-4 py-3 max-w-md">
        <Link
          href={`/admin/content/insights/${post.id}`}
          className="font-medium transition-colors hover:text-primary line-clamp-1"
        >
          {post.title}
        </Link>
        <p className="mt-0.5 line-clamp-1 text-xs text-on-surface-variant">{post.excerpt}</p>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{post.tag}</td>
      <td className="px-4 py-3">
        <ContentStatusBadge status={post.status} />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{post.post_date}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/admin/content/insights/${post.id}`} className={rowButtonClass}>
            <span className="material-symbols-outlined text-sm" aria-hidden="true">
              edit
            </span>
            Edit
          </Link>
          <PublishToggleForm post={post} />
          <DeleteForm id={post.id} />
        </div>
      </td>
    </tr>
  );
}

export default async function InsightsAdminPage({ searchParams }: InsightsPageProps) {
  const { error } = await searchParams;
  await requireContentEditorSession();

  const db = tryGetPortalDb();
  if (!db) {
    return (
      <div className="space-y-6">
        <InsightsHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  let posts: PostRow[] = [];
  let failed = false;
  try {
    posts = await listPosts(db);
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="space-y-6">
        <InsightsHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InsightsHeader />
      <ActionErrorBanner code={error} />
      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant" aria-hidden="true">
            article
          </span>
          <p className="mt-3 font-display text-base">No posts yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Create the first one to seed the public Insights page.
          </p>
          <Link href="/admin/content/insights/new" className={`${primaryButtonClass} mt-4`}>
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              add
            </span>
            New post
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-left text-xs uppercase tracking-wide text-on-surface-variant">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Tag</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {posts.map((post) => (
                <PostRowItem key={post.id} post={post} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
