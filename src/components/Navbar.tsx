"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "How We Work", href: "#approach" }, // Using existing anchor #approach for now, will update if needed
    { name: "About Us", href: "#founders" }, // Mapping About Us to #founders
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed w-full z-50 transition-all duration-300 py-2.5 bg-brand-surface/30 backdrop-blur-xl border-b border-brand-secondary/20 shadow-sm ${
          isScrolled ? "bg-brand-surface/60 border-brand-secondary/40 shadow-lg" : ""
        }`}
        id="navbar"
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center group cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary focus:outline-none rounded-sm">
            <Image
              src="/assets/logo-full.png"
              alt="Gileara Logo"
              width={224}
              height={56}
              className="w-40 md:w-56 h-auto group-hover:scale-[1.02] transition-transform duration-300 filter dark:brightness-0 dark:invert"
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-10 text-sm font-semibold text-brand-muted">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="hover:text-brand-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="#contact"
              className="hidden sm:inline-block px-5 py-2 bg-brand-primary hover:bg-teal-500 rounded-full text-xs font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-brand-primary/20"
            >
              Book a Call
            </Link>
            
            {/* Hamburger Button */}
            <button 
              className="md:hidden p-2 text-brand-text focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <span className="material-symbols-outlined text-3xl">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[45] bg-brand-surface/95 backdrop-blur-2xl md:hidden pt-32 px-6"
          >
            <div className="flex flex-col space-y-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-3xl font-bold text-brand-text hover:text-brand-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="#contact"
                className="inline-block w-full py-4 bg-brand-primary text-center rounded-2xl text-xl font-bold text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book a Call
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
