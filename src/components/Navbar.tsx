"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";


import { siteConfig } from "@/content/site-config";

type NavbarVariant = "default" | "legal" | "careers";

interface NavbarProps {
  /** default = marketing site · legal = terms/privacy/security · careers = careers portal */
  variant?: NavbarVariant;
  /** Required when variant="legal": which resource is being viewed */
  page?: "terms" | "privacy" | "security";
}

const LEGAL_PAGE_DETAILS = {
  terms: { badge: "Legal", mobileBadge: "Legal Resource", cta: "Legal Contact" },
  privacy: { badge: "Privacy", mobileBadge: "Privacy Resource", cta: "Privacy Request" },
  security: { badge: "Security", mobileBadge: "Security Resource", cta: "Report Issue" },
} as const;

const SHELL_CLASSES: Record<NavbarVariant, string> = {
  default: "w-[94%] max-w-6xl px-4 md:px-6",
  legal: "w-[92%] max-w-5xl px-5",
  careers: "w-[92%] max-w-4xl px-6",
};

/**
 * Single navigation shell for every page context (D7).
 * Variants change links and CTA only — scrolling behaviour, the pill shell,
 * theme toggle, and mobile drawer are shared.
 */
export default function Navbar({ variant = "default", page }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // Close drawer when viewport becomes desktop-sized
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) closeMenu();
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [closeMenu]);

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, closeMenu]);

  const navId = variant === "legal" ? `${page}-navbar` : `${variant}-navbar`;

  const links =
    variant === "default"
      ? [
          { name: "Packages", href: "/services" },
          { name: "About Us", href: "/about" },
          { name: "Insights", href: "/insights" },
          { name: "Careers", href: "/careers" },
          { name: "FAQ", href: "/faq" },
        ]
      : variant === "legal"
        ? [
            { name: "Home", href: "/" },
            { name: "Legal Terms", href: "/terms" },
            { name: "Privacy", href: "/privacy" },
            { name: "Security", href: "/security" },
          ]
        : [
            { name: "Home", href: "/" },
            { name: "Open Roles", href: "#roles", id: "roles" },
            { name: "Application", href: "#apply", id: "apply" },
          ];

  // Careers-only: highlight the section currently in view
  useEffect(() => {
    if (variant !== "careers") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );
    for (const link of links) {
      if (!link.id) continue;
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const legalDetails = variant === "legal" ? LEGAL_PAGE_DETAILS[page ?? "terms"] : null;

  const isActive = (href: string) => {
    if (variant === "legal") return pathname === href;
    if (variant === "careers" && href.startsWith("#")) return activeSection === href.slice(1);
    return false;
  };

  const linkClass = (href: string) =>
    variant === "default"
      ? "px-2 lg:px-3 py-1.5 rounded-lg text-on-surface hover:text-accent-bright transition-colors duration-200 whitespace-nowrap"
      : `relative px-1 py-1 transition-colors ${isActive(href) ? "text-primary" : "hover:text-primary"}`;

  return (
    <>
      <motion.nav
        initial={{ y: -100, x: "-50%" }}
        animate={{ y: 0, x: "-50%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-[top,padding,background-color,border-color,box-shadow] duration-500 ease-out rounded-pill bg-background/60 backdrop-blur-xl border border-on-background/10 flex justify-between items-center ${
          SHELL_CLASSES[variant]
        } ${
          isScrolled
            ? "top-3 py-2 bg-background/85 border-on-background/15 shadow-[0_8px_30px_rgb(0_0_0_/0.4)]"
            : "top-6 py-3"
        }`}
        id={navId}
      >
        <div className="flex justify-between items-center w-full gap-2">
          <Link
            href="/"
            aria-label="Gileara — go to homepage"
            className="flex items-center gap-3 shrink-0 group cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus:outline-none rounded-sm"
          >
            <Image
              src="/assets/gileara/logo-full.png"
              alt="Gileara Logo"
              width={160}
              height={40}
              priority
              sizes="(max-width: 768px) 128px, 160px"
              className="w-28 lg:w-36 h-auto group-hover:scale-[1.02] transition-transform duration-300 filter dark:brightness-0 dark:invert"
            />
            {legalDetails && (
              <span className="hidden rounded border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary md:inline-block">
                {legalDetails.badge}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center justify-center gap-1 lg:gap-3 text-sm lg:text-base font-semibold text-on-surface-variant">
            {links.map((link) => (
              <Link key={link.name} href={link.href} className={linkClass(link.href)}>
                {link.name}
                {isActive(link.href) && (
                  <motion.span
                    layoutId={`nav-active-${variant}`}
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {variant === "default" && (
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center gap-2 pl-5 pr-10 py-2.5 rounded-pill text-xs font-medium bg-accent-bright text-background hover:bg-accent-cyan transition-colors duration-300 group"
              >
                Book Free Consultation
                <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true">arrow_forward</span>
              </Link>
            )}
            {legalDetails && (
              <a
                href={`mailto:${siteConfig.email}`}
                className="hidden md:inline-flex items-center gap-2 rounded-pill bg-accent-bright text-background px-5 py-2 text-xs font-medium hover:bg-accent-cyan transition-colors"
              >
                {legalDetails.cta}
                <span className="material-symbols-outlined text-xs" aria-hidden="true">mail</span>
              </a>
            )}
            {variant === "careers" && (
              <a
                href="#apply"
                className="hidden md:inline-flex items-center gap-2 pl-5 pr-10 py-2.5 rounded-pill text-xs font-medium bg-accent-bright text-background hover:bg-accent-cyan transition-colors duration-300 group"
              >
                Apply Now
                <span className="material-symbols-outlined text-xs" aria-hidden="true">send</span>
              </a>
            )}

            {/* Hamburger Button */}
            <button
              className="md:hidden p-2 text-on-surface hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls={`${navId}-drawer`}
            >
              {isMobileMenuOpen ? <span className="material-symbols-outlined text-2xl" aria-hidden="true">close</span> : <span className="material-symbols-outlined text-2xl" aria-hidden="true">menu</span>}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[45] bg-surface/95 dark:bg-surface-container/95 backdrop-blur-2xl md:hidden pt-20 md:pt-32 px-6 overflow-y-auto"
            id={`${navId}-drawer`}
          >
            {legalDetails && (
              <span className="mb-10 inline-block rounded border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-primary">
                {legalDetails.mobileBadge}
              </span>
            )}

            <div className="flex flex-col space-y-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-3xl font-bold transition-colors flex items-center gap-4 ${
                    isActive(link.href) ? "text-primary" : "text-on-surface hover:text-primary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {isActive(link.href) && <span className="h-2 w-2 rounded-full bg-primary" />}
                  {link.name}
                </Link>
              ))}

              <div className="pt-4">
                {variant === "default" && (
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-xl font-bold teal-gradient-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Book Free Consultation
                    <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
                  </Link>
                )}
                {legalDetails && (
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-lg font-bold text-on-primary shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {legalDetails.cta}
                    <span className="material-symbols-outlined text-base" aria-hidden="true">mail</span>
                  </a>
                )}
                {variant === "careers" && (
                  <a
                    href="#apply"
                    className="inline-flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-xl font-bold teal-gradient-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Apply Now
                    <span className="material-symbols-outlined text-base" aria-hidden="true">send</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
