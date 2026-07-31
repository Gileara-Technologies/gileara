"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { FaArrowRight } from "react-icons/fa6";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "How We Work", href: "#approach" },
    { name: "About Us", href: "#founders" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, x: "-50%" }}
        animate={{ y: 0, x: "-50%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[92%] max-w-5xl rounded-full bg-surface/75 dark:bg-surface-container/75 backdrop-blur-xl border border-outline-variant shadow-lg px-6 py-3 flex justify-between items-center ${
          isScrolled ? "top-2 py-2.5 bg-surface/90 dark:bg-surface-container/90" : ""
        }`}
        id="navbar"
      >
        <div className="flex justify-between items-center w-full">
          <Link href="/" className="flex items-center group cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus:outline-none rounded-sm" onClick={closeMenu}>
            <Image
              src="/assets/gileara/logo-full.png"
              alt="Gileara Logo"
              width={160}
              height={40}
              priority
              sizes="(max-width: 768px) 128px, 160px"
              className="w-32 md:w-40 h-auto group-hover:scale-[1.02] transition-transform duration-300 filter dark:brightness-0 dark:invert"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-10 text-base font-semibold text-on-surface-variant">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="#contact"
              className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold teal-gradient-btn group"
            >
              Get Started
              <FaArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>

            {/* Hamburger Button */}
            <button
              className="md:hidden p-2 text-on-surface hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              {isMobileMenuOpen ? (
                <HiXMark className="w-7 h-7" />
              ) : (
                <HiBars3 className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop – tap-to-close */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[44] bg-black/40 backdrop-blur-sm md:hidden"
              aria-hidden="true"
              onClick={closeMenu}
            />

            {/* Drawer panel */}
            <motion.div
              key="mobile-drawer"
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className={[
                // Positioning & sizing
                "fixed top-0 right-0 z-[45] h-dvh w-full max-w-sm",
                // Fallback for browsers without dvh support
                "h-screen",
                // Visual
                "bg-surface dark:bg-surface-container",
                "border-l border-outline-variant/30",
                "shadow-2xl",
                // Layout
                "flex flex-col",
                "md:hidden",
              ].join(" ")}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 border-b border-outline-variant/20">
                <Link href="/" onClick={closeMenu} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                  <Image
                    src="/assets/gileara/logo-full.png"
                    alt="Gileara Logo"
                    width={130}
                    height={34}
                    sizes="130px"
                    className="h-auto filter dark:brightness-0 dark:invert"
                  />
                </Link>
                <button
                  onClick={closeMenu}
                  aria-label="Close navigation menu"
                  className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable nav links area */}
              <nav
                aria-label="Mobile navigation"
                className="flex-1 overflow-y-auto overscroll-contain px-6 py-6"
              >
                <ul className="flex flex-col gap-1" role="list">
                  {navLinks.map((link, idx) => (
                    <li key={link.name}>
                      <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.05 + idx * 0.06,
                          duration: 0.35,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          className="group flex items-center justify-between w-full px-4 py-4 rounded-xl text-xl font-semibold text-on-surface hover:text-primary hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <span>{link.name}</span>
                          <FaArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Drawer footer – CTA always visible */}
              <div className="shrink-0 px-6 pb-8 pt-4 border-t border-outline-variant/20">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href="#contact"
                    onClick={closeMenu}
                    className="inline-flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-base font-bold teal-gradient-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    Get Started
                    <FaArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
