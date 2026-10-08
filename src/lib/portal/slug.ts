/**
 * Slug helpers for role ids (docs/PORTAL-PLAN.md, open question #4).
 * The slug doubles as the `roles` primary key, so it must be URL-safe and
 * unique. ASCII-only: non-alphanumerics (including punctuation, spaces, and
 * non-Latin script) become '-'; this keeps ids predictable across browsers
 * and URL paths.
 */

/**
 * Lowercase ASCII slug: runs of non-alphanumeric characters collapse to a
 * single '-', then leading/trailing dashes are trimmed. Returns "" when the
 * title has no ASCII alphanumerics at all.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Unique slug for `title` against an existing id set (e.g. current `roles`
 * ids): returns `slugify(title)` when free, otherwise appends -2, -3, …
 * until an unused candidate is found.
 *
 * Returns "" when the title slugifies to "" — callers must supply a manual
 * id in that case (there is no meaningful suffix to append).
 */
export function uniqueSlug(title: string, existingIds: string[]): string {
  const base = slugify(title);
  if (!base) {
    return "";
  }
  const taken = new Set(existingIds);
  if (!taken.has(base)) {
    return base;
  }
  let suffix = 2;
  let candidate = `${base}-${suffix}`;
  while (taken.has(candidate)) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  return candidate;
}