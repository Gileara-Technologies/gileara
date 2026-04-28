"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed w-full z-50 transition-all duration-300 py-4 ${
        isScrolled ? "bg-brand-surface/80 backdrop-blur-md border-b border-brand-secondary/50 shadow-lg" : ""
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
          <Link href="#about" className="hover:text-brand-primary transition-colors">About</Link>
          <Link href="#services" className="hover:text-brand-primary transition-colors">Services</Link>
          <Link href="#solutions" className="hover:text-brand-primary transition-colors">Solutions</Link>
          <Link href="#approach" className="hover:text-brand-primary transition-colors">Approach</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="#contact"
            className="hidden sm:inline-block px-6 py-3 bg-brand-primary hover:bg-teal-500 rounded-full text-sm font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-brand-primary/20"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
