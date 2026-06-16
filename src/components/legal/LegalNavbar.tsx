"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { FaEnvelope } from "react-icons/fa6";
import { ThemeToggle } from "@/components/ThemeToggle";

type LegalNavbarProps = {
  page: "terms" | "privacy" | "security";
};

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Legal Terms", href: "/terms" },
  { name: "Privacy", href: "/privacy" },
  { name: "Security", href: "/security" },
];

const pageDetails = {
  terms: {
    badge: "Legal",
    mobileBadge: "Legal Resource",
    cta: "Legal Contact",
  },
  privacy: {
    badge: "Privacy",
    mobileBadge: "Privacy Resource",
    cta: "Privacy Request",
  },
  security: {
    badge: "Security",
    mobileBadge: "Security Resource",
    cta: "Report Issue",
  },
};

export default function LegalNavbar({ page }: LegalNavbarProps) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const details = pageDetails[page];

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <>
      <motion.nav
        initial={{ y: -100, x: "-50%" }}
        animate={{ y: 0, x: "-50%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-1/2 top-4 z-50 flex w-[92%] max-w-5xl -translate-x-1/2 items-center justify-between rounded-full border border-outline-variant bg-surface/80 px-5 py-3 shadow-lg backdrop-blur-xl transition-all duration-300 dark:bg-surface-container/80 ${
          isScrolled
            ? "top-2 bg-surface/95 py-2.5 shadow-primary/10 dark:bg-surface-container/95"
            : ""
        }`}
        id={`${page}-navbar`}
      >
        <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Image
              src="/assets/gileara/logo-full.png"
              alt="Gileara Logo"
              width={140}
              height={35}
              className="h-auto w-28 transition-transform duration-300 group-hover:scale-[1.02] dark:brightness-0 dark:invert md:w-32"
              priority
            />
            <span className="hidden rounded border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary md:inline-block">
              {details.badge}
            </span>
          </Link>

          <div className="relative hidden items-center space-x-8 text-sm font-semibold text-on-surface-variant md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-1 py-1 transition-colors ${
                    isActive ? "text-primary" : "hover:text-primary"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="legalNavActive"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <a
              href="mailto:tech.gileara@gmail.com"
              className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-on-primary shadow-sm transition-colors hover:bg-primary-container hover:text-on-primary-container md:inline-flex"
            >
              {details.cta}
              <FaEnvelope className="h-3 w-3" />
            </a>

            <button
              className="rounded-lg p-2 text-on-surface transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <HiXMark className="h-6 w-6" />
              ) : (
                <HiBars3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[45] flex flex-col bg-surface/98 px-6 pt-24 backdrop-blur-2xl dark:bg-surface-container/98 md:hidden"
          >
            <span className="mb-10 self-start rounded border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-primary">
              {details.mobileBadge}
            </span>

            <div className="flex flex-col space-y-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-4 text-3xl font-bold transition-colors ${
                      isActive ? "text-primary" : "text-on-surface hover:text-primary"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {isActive && <span className="h-2 w-2 rounded-full bg-primary" />}
                    {link.name}
                  </Link>
                );
              })}

              <div className="mt-4 border-t border-outline-variant/20 pt-8">
                <a
                  href="mailto:tech.gileara@gmail.com"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-lg font-bold text-on-primary shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {details.cta}
                  <FaEnvelope className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
