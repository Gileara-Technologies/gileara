"use client";

import { useState, useEffect } from "react";
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
        initial={{ y: -100, x: "-50%" }}
        animate={{ y: 0, x: "-50%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[92%] max-w-5xl rounded-full bg-surface/75 dark:bg-surface-container/75 backdrop-blur-xl border border-outline-variant shadow-lg px-6 py-3 flex justify-between items-center ${
          isScrolled ? "top-2 py-2.5 bg-surface/90 dark:bg-surface-container/90" : ""
        }`}
        id="navbar"
      >
        <div className="flex justify-between items-center w-full">
          <Link href="/" className="flex items-center group cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus:outline-none rounded-sm">
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[45] bg-surface/95 backdrop-blur-2xl md:hidden pt-20 md:pt-32 px-6"
          >
            <div className="flex flex-col space-y-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-3xl font-bold text-on-surface hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-xl font-bold teal-gradient-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
