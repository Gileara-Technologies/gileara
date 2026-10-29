"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, useSpring, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/content/site-config";

type NavbarVariant = "default" | "legal" | "careers";

interface NavbarProps {
  variant?: NavbarVariant;
  page?: "terms" | "privacy" | "security";
}

const LEGAL_PAGE_DETAILS = {
  terms:    { badge: "Legal",    mobileBadge: "Legal Resource",   cta: "Legal Contact" },
  privacy:  { badge: "Privacy",  mobileBadge: "Privacy Resource", cta: "Privacy Request" },
  security: { badge: "Security", mobileBadge: "Security Resource",cta: "Report Issue" },
} as const;

/**
 * Navbar — Terminal / Operator aesthetic.
 *
 * Vercel-style: no glass, no blur on desktop. A dead-flat bar that gains
 * a 1px bottom border on scroll. The primary CTA is a WHITE pill (inverted
 * from the page), which Vercel uses to signal "this is the action".
 *
 * Scroll progress bar: a 1px teal line runs across the top of the viewport.
 */
export default function Navbar({ variant = "default", page }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => { if (e.matches) closeMenu(); };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [closeMenu]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") closeMenu(); };
    if (isMobileMenuOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, closeMenu]);

  const navId = variant === "legal" ? `${page}-navbar` : `${variant}-navbar`;
  const navLabel = variant === "default" ? "Primary" : variant === "careers" ? "Careers" : "Legal resources";
  const legalDetails = variant === "legal" ? LEGAL_PAGE_DETAILS[page ?? "terms"] : null;

  const links =
    variant === "default"
      ? [
          { name: "Packages",  href: "/services" },
          { name: "About",     href: "/about" },
          { name: "Insights",  href: "/insights" },
          { name: "Careers",   href: "/careers" },
          { name: "FAQ",       href: "/faq" },
        ]
      : variant === "legal"
        ? [
            { name: "Home",     href: "/" },
            { name: "Terms",    href: "/terms" },
            { name: "Privacy",  href: "/privacy" },
            { name: "Security", href: "/security" },
          ]
        : [
            { name: "Home",        href: "/",       id: undefined },
            { name: "Open Roles",  href: "#roles",  id: "roles" },
            { name: "Application", href: "#apply",  id: "apply" },
          ];

  useEffect(() => {
    if (variant !== "careers") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );
    for (const link of links) {
      if (!("id" in link) || !link.id) continue;
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const isActive = (href: string) => {
    if (variant === "legal") return pathname === href;
    if (variant === "careers" && href.startsWith("#")) return activeSection === href.slice(1);
    return false;
  };

  const focusRing = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-bright focus-visible:ring-offset-1 focus-visible:ring-offset-background";

  const linkClass = (href: string) =>
    variant === "default"
      ? `px-3 py-1.5 text-[13px] font-sans font-medium transition-colors duration-150 whitespace-nowrap ${focusRing} ${
          pathname === href ? "text-on-background" : "text-white/50 hover:text-white/90"
        }`
      : `relative px-1 py-1 text-sm font-sans transition-colors ${focusRing} ${
          isActive(href) ? "text-accent-bright" : "text-white/50 hover:text-white/80"
        }`;

  return (
    <header>
      {/* Scroll progress line — 1px teal, spring-animated */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-px origin-left bg-accent-bright"
        style={{ scaleX }}
        aria-hidden="true"
      />

      {/* Nav bar */}
      <motion.nav
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${
          isScrolled
            ? "h-20 bg-background/85 backdrop-blur-md border-b border-white/[0.07]"
            : "h-24 bg-transparent"
        }`}
        id={navId}
        aria-label={navLabel}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Gileara — go to homepage"
          className={`flex items-center gap-2.5 shrink-0 ${focusRing} rounded-sm`}
        >
          <Image
            src="/assets/gileara/logo-ui.png"
            alt="Gileara"
            width={664}
            height={246}
            priority
            sizes="220px"
            className="h-12 md:h-16 w-auto drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] opacity-95 hover:opacity-100 transition-opacity duration-150"
          />
          {legalDetails && (
            <span className="rounded border border-accent-bright/30 bg-accent-bright/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-accent-bright tracking-wider uppercase hidden md:inline-block">
              {legalDetails.badge}
            </span>
          )}
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((link) => (
            <Link key={link.name} href={link.href} className={linkClass(link.href)}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {variant === "default" && (
            <Link
              href="/contact"
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-white text-black text-[13px] font-sans font-medium hover:bg-white/90 transition-colors duration-150 ${focusRing}`}
            >
              Book a Free Consultation
              <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
            </Link>
          )}
          {legalDetails && (
            <a
              href={`mailto:${siteConfig.email}`}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-white text-black text-[13px] font-sans font-medium hover:bg-white/90 transition-colors duration-150 ${focusRing}`}
            >
              {legalDetails.cta}
            </a>
          )}
          {variant === "careers" && (
            <a
              href="#apply"
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-white text-black text-[13px] font-sans font-medium hover:bg-white/90 transition-colors duration-150 ${focusRing}`}
            >
              Apply Now
            </a>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white/60 hover:text-white transition-colors rounded-md"
          onClick={() => setIsMobileMenuOpen((p) => !p)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls={`${navId}-drawer`}
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </motion.nav>

      {/* Mobile drawer — full-screen, terminal style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[45] bg-brand md:hidden flex flex-col pt-28 px-6 pb-10"
            id={`${navId}-drawer`}
          >
            {/* Grid bg in drawer */}
            <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 flex flex-col gap-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 py-4 border-b border-white/[0.06] text-2xl font-display font-medium ${focusRing} ${
                      isActive(link.href) ? "text-accent-bright" : "text-white/80 hover:text-white"
                    }`}
                    onClick={closeMenu}
                  >
                    {isActive(link.href) && (
                      <span className="font-mono text-accent-bright text-sm">▸</span>
                    )}
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: links.length * 0.05 + 0.1 }}
              >
                {variant === "default" && (
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-md bg-white text-black text-base font-sans font-medium"
                    onClick={closeMenu}
                  >
                    Book a Free Consultation
                    <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
                  </Link>
                )}
                {variant === "careers" && (
                  <a
                    href="#apply"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-md bg-white text-black text-base font-sans font-medium"
                    onClick={closeMenu}
                  >
                    Apply Now
                  </a>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
