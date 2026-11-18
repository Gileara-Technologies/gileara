// Instagram connector status page: NOT a create/edit form like the other
// content types -- nothing is authored here. Shows last-synced time,
// total cached posts, a "Sync now" button, and a table of cached posts
// with a visible/hidden toggle per row. No delete: the next sync
// naturally refreshes/replaces stale rows, and a cache row the API still
// returns would just reappear if deleted.
//
// Gated by requireContentEditorSession, same as every other content-admin
// page. Reads D1 per request; force-dynamic keeps this out of build-time
// prerendering (same convention as src/app/admin/content/faqs/page.tsx).

import { listInstagramPosts } from "@/lib/instagram/db";
import type { InstagramPostRow } from "@/lib/instagram/db";
import { instagramSecretNames, readInstagramCredentials } from "@/lib/instagram/accounts";
import { instagramAccounts } from "@/content/site-config";
import { tryGetCloudflareEnv, tryGetPortalDb } from "../../admin-db";
import { requireContentEditorSession } from "../../session-guard";
import { DbUnavailableNotice } from "../../ui";
import { setInstagramPostVisibleAction, syncInstagramPostsAction } from "../instagram-actions";

export const dynamic = "force-dynamic";

interface InstagramPageProps {
  searchParams: Promise<{ error?: string; synced?: string; partial?: string }>;
}

const rowButtonClass =
  "inline-flex items-center gap-1 rounded border border-outline-variant px-2.5 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";

const primaryButtonClass =
  "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

/** Local error/success messages -- not reused from ../../ui.tsx's
 *  ActionErrorBanner, which is shared infrastructure another concurrent
 *  change may also be editing; the Instagram-specific "sync-failed" code
 *  needs a message that module doesn't define. */
const ERROR_MESSAGES: Record<string, string> = {
  unavailable: "Database unavailable in this environment.",
  invalid: "That action was not valid, so nothing changed.",
  save: "That change could not be saved, so nothing changed.",
  "sync-failed":
    "Instagram sync failed. Check that each account's access token and account id are set as Cloudflare Secrets (see the account list below) and that the tokens have not expired.",
};

function StatusBanner({ error, synced, partial }: { error?: string; synced?: string; partial?: string }) {
  if (error) {
    const message = ERROR_MESSAGES[error] ?? "Something went wrong, so nothing changed.";
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-md border border-error bg-error-container p-4 text-sm text-on-error-container"
      >
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          error
        </span>
        <p>{message}</p>
      </div>
    );
  }
  if (synced !== undefined) {
    const count = Number(synced);
    const label = Number.isInteger(count) ? count : 0;
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-md border border-outline-variant bg-secondary-container p-4 text-sm text-on-secondary-container"
      >
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          check_circle
        </span>
        <p>
          Synced {label} post{label === 1 ? "" : "s"} from Instagram.
          {partial === "1" && " One account failed to sync, so its posts were not refreshed. Check its token."}
        </p>
      </div>
    );
  }
  return null;
}

function AccountStatusList({ env }: { env: Record<string, unknown> }) {
  return (
    <div className="op-card rounded-lg p-4">
      <p className="text-xs uppercase tracking-wide text-on-surface-variant mb-3">Accounts</p>
      <ul className="space-y-2">
        {instagramAccounts.map((account) => {
          const configured = readInstagramCredentials(env, account) !== null;
          const names = instagramSecretNames(account);
          return (
            <li key={account.handle} className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <a href={account.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary">
                @{account.handle}
              </a>
              <span className="flex items-center gap-2">
                <code className="font-mono text-xs text-on-surface-variant">
                  {names.token} + {names.accountId}
                </code>
                <span
                  className={`inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium ${
                    configured
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-tertiary-container text-on-tertiary-container"
                  }`}
                >
                  {configured ? "Configured" : "Not set"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function InstagramHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl">Instagram</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Cached posts shown on the homepage. Sync pulls recent media from the Instagram
          Graph API; toggle a post hidden to keep it cached but off the public site.
        </p>
      </div>
      <form action={syncInstagramPostsAction}>
        <button type="submit" className={primaryButtonClass}>
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            restart_alt
          </span>
          Sync now
        </button>
      </form>
    </div>
  );
}

function StatsRow({ posts }: { posts: InstagramPostRow[] }) {
  const visibleCount = posts.filter((p) => p.visible).length;
  const lastSyncedAt = posts
    .map((p) => p.synced_at)
    .filter(Boolean)
    .sort()
    .at(-1);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="op-card rounded-lg p-4">
        <p className="text-xs uppercase tracking-wide text-on-surface-variant">Cached posts</p>
        <p className="mt-1 font-display text-2xl">{posts.length}</p>
      </div>
      <div className="op-card rounded-lg p-4">
        <p className="text-xs uppercase tracking-wide text-on-surface-variant">Visible on site</p>
        <p className="mt-1 font-display text-2xl">{visibleCount}</p>
      </div>
      <div className="op-card rounded-lg p-4">
        <p className="text-xs uppercase tracking-wide text-on-surface-variant">Last synced</p>
        <p className="mt-1 font-display text-2xl">
          {lastSyncedAt ? lastSyncedAt : "never"}
        </p>
      </div>
    </div>
  );
}

function VisibleToggleForm({ post }: { post: InstagramPostRow }) {
  const nextVisible = post.visible ? "0" : "1";
  const label = post.visible ? "Hide" : "Show";
  const icon = post.visible ? "visibility_off" : "check_circle";
  return (
    <form action={setInstagramPostVisibleAction}>
      <input type="hidden" name="id" value={post.id} />
      <input type="hidden" name="visible" value={nextVisible} />
      <button type="submit" className={rowButtonClass}>
        <span className="material-symbols-outlined text-sm" aria-hidden="true">
          {icon}
        </span>
        {label}
      </button>
    </form>
  );
}

function PostRowItem({ post }: { post: InstagramPostRow }) {
  const caption = post.caption?.trim();
  return (
    <tr className="hover:bg-surface-container-low">
      <td className="px-4 py-3 max-w-md">
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium transition-colors hover:text-primary line-clamp-1"
        >
          {caption || post.id}
        </a>
        <p className="mt-0.5 line-clamp-1 text-xs text-on-surface-variant">
          {post.account_handle ? `@${post.account_handle} · ` : ""}
          {post.media_type}
        </p>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{post.posted_at}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium ${
            post.visible
              ? "bg-secondary-container text-on-secondary-container"
              : "bg-surface-container-highest text-on-surface-variant"
          }`}
        >
          {post.visible ? "Visible" : "Hidden"}
        </span>
      </td>
      <td className="px-4 py-3">
        <VisibleToggleForm post={post} />
      </td>
    </tr>
  );
}

export default async function InstagramAdminPage({ searchParams }: InstagramPageProps) {
  const { error, synced, partial } = await searchParams;
  await requireContentEditorSession();

  const db = tryGetPortalDb();
  if (!db) {
    return (
      <div className="space-y-6">
        <InstagramHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  const env = tryGetCloudflareEnv() ?? {};
  const configured = instagramAccounts.some((a) => readInstagramCredentials(env, a) !== null);

  let posts: InstagramPostRow[] = [];
  let failed = false;
  try {
    posts = await listInstagramPosts(db);
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="space-y-6">
        <InstagramHeader />
        <DbUnavailableNotice />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InstagramHeader />
      <StatusBanner error={error} synced={synced} partial={partial} />
      {!configured && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-md border border-outline-variant bg-tertiary-container p-4 text-sm text-on-tertiary-container"
        >
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            cloud_off
          </span>
          <p>
            No Instagram account has its secrets set in this environment. &ldquo;Sync now&rdquo;
            will fail until a human operator sets at least one account&apos;s pair as Cloudflare
            Secrets -- see docs/INSTAGRAM-CONNECTOR-PLAN.md.
          </p>
        </div>
      )}
      <AccountStatusList env={env} />
      <StatsRow posts={posts} />
      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant" aria-hidden="true">
            cloud_off
          </span>
          <p className="mt-3 font-display text-base">No posts cached yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Run &ldquo;Sync now&rdquo; once Instagram credentials are configured.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-left text-xs uppercase tracking-wide text-on-surface-variant">
                <th className="px-4 py-3 font-medium">Post</th>
                <th className="px-4 py-3 font-medium">Posted</th>
                <th className="px-4 py-3 font-medium">Status</th>
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
