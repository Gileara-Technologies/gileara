import Link from "next/link";

/**
 * Editorial-style breadcrumb. Renders as a small text trail just
 * under the page H1. Mirrors the JSON-LD BreadcrumbList on the
 * same page so screen readers and search engines see the same
 * structure.
 *
 * The current (last) item is rendered as a non-link so it's
 * visually distinct as "where you are."
 *
 * Example:
 *   <Breadcrumbs
 *     items={[
 *       { label: "Services", href: "/services" },
 *       { label: "Digital Foundation", href: "/services/digital-foundation" },
 *     ]}
 *   />
 *   // renders: Services  /  Digital Foundation
 */
export interface BreadcrumbItem {
  /** Display label for this crumb (e.g. "Services") */
  label: string;
  /** Absolute path (e.g. "/services") */
  href: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-x-2">
              {isLast ? (
                <span aria-current="page" className="text-on-surface">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="hover:text-accent-bright transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="text-on-surface-variant/50">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
