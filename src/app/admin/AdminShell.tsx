"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { logoutAction } from "./logout/action";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const BASE_NAV_ITEMS: readonly NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/roles", label: "Roles", icon: "work" },
  { href: "/admin/applications", label: "Applications", icon: "inbox" },
];

/** Shown only to signed-in users who pass isAllowedContentEditorEmail --
 *  HR and content editing are separate permission tiers. */
const CONTENT_NAV_ITEMS: readonly NavItem[] = [
  { href: "/admin/content/insights", label: "Insights", icon: "article" },
  { href: "/admin/content/playbooks", label: "Playbooks", icon: "account_tree" },
  { href: "/admin/content/faqs", label: "FAQs", icon: "help" },
];

/** `/admin` matches only the dashboard itself; every other item also
 *  matches its own sub-routes (e.g. /admin/roles/new, /admin/roles/abc). */
function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`relative flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
        active
          ? "text-primary bg-primary/10"
          : "text-on-surface-variant hover:text-on-background hover:bg-surface-container"
      }`}
    >
      {active && (
        <span
          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary"
          aria-hidden="true"
        />
      )}
      <span className="material-symbols-outlined text-xl" aria-hidden="true">
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}

function SignOutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex w-full items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-on-background cursor-pointer"
      >
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          logout
        </span>
        Sign out
      </button>
    </form>
  );
}

/**
 * AdminShell — the dashboard chrome shared by every /admin/* page.
 *
 * A fixed left sidebar on desktop (Dashboard / Roles / Applications, plus
 * FAQs for signed-in content editors, active-route highlighted), collapsing
 * to a top bar + full-screen drawer on mobile. The actual session checks
 * stay server-side in layout.tsx — this component only renders navigation
 * around whatever children it's given, using `isContentEditor` purely to
 * decide which nav items to show (not a security boundary by itself).
 */
export default function AdminShell({
  email,
  isContentEditor,
  children,
}: {
  email: string;
  isContentEditor: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = isContentEditor ? [...BASE_NAV_ITEMS, ...CONTENT_NAV_ITEMS] : BASE_NAV_ITEMS;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 md:z-20 border-r border-outline-variant bg-surface-container-lowest">
        <div className="px-5 py-5 border-b border-outline-variant">
          <Link href="/admin" className="font-display text-base transition-colors hover:text-primary">
            Gileara{" "}
            <span className="font-sans text-sm font-normal text-on-surface-variant">· Admin</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin sections">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActiveRoute(pathname, item.href)} />
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-outline-variant">
          <p className="mb-2 truncate text-xs text-on-surface-variant">{email}</p>
          <SignOutButton />
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────────── */}
      <header className="md:hidden fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest/95 px-4 py-3 backdrop-blur-sm">
        <Link href="/admin" className="font-display text-base">
          Gileara{" "}
          <span className="font-sans text-sm font-normal text-on-surface-variant">· Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="p-2 text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </header>

      {/* ── Mobile drawer ───────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-30 flex flex-col bg-background px-4 pt-20 pb-6"
          >
            <nav className="space-y-1" aria-label="Admin sections">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isActiveRoute(pathname, item.href)}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </nav>
            <div className="mt-auto border-t border-outline-variant pt-4">
              <p className="mb-2 text-xs text-on-surface-variant">{email}</p>
              <SignOutButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="md:ml-60 pt-16 md:pt-0">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</div>
      </main>
    </div>
  );
}
