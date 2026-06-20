"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { FaPaperPlane } from "react-icons/fa6";

export default function CareersNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Intersection Observer to highlight active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" } // Trigger when element is near top
    );

    const rolesSection = document.getElementById("roles");
    const applySection = document.getElementById("apply");

    if (rolesSection) observer.observe(rolesSection);
    if (applySection) observer.observe(applySection);

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Open Roles", href: "#roles", id: "roles" },
    { name: "Application", href: "#apply", id: "apply" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, x: "-50%" }}
        animate={{ y: 0, x: "-50%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[92%] max-w-4xl rounded-full bg-surface/80 dark:bg-surface-container/80 backdrop-blur-xl border border-outline-variant shadow-lg px-6 py-3 flex justify-between items-center ${
          isScrolled ? "top-2 py-2.5 bg-surface/95 dark:bg-surface-container/95 shadow-primary/10" : ""
        }`}
        id="careers-navbar"
      >
        <div className="flex justify-between items-center w-full">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus:outline-none rounded-sm">
            <Image
              src="/assets/gileara/logo-full.png"
              alt="Gileara Logo"
              width={140}
              height={35}
              priority
              sizes="(max-width: 768px) 112px, 128px"
              className="w-28 md:w-32 h-auto group-hover:scale-[1.02] transition-transform duration-300 filter dark:brightness-0 dark:invert"
            />
            <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20">
              Careers
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-base font-semibold text-on-surface-variant relative">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`relative px-1 py-1 transition-colors ${isActive ? "text-primary" : "hover:text-primary"}`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link
              href="#apply"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
            >
              Apply Now
              <FaPaperPlane className="w-3 h-3" />
            </Link>
            
            {/* Hamburger Button */}
            <button 
              className="md:hidden p-2 text-on-surface hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <HiXMark className="w-6 h-6" />
              ) : (
                <HiBars3 className="w-6 h-6" />
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
            className="fixed inset-0 z-[45] bg-surface/98 dark:bg-surface-container/98 backdrop-blur-2xl md:hidden pt-24 px-6 flex flex-col"
          >
            <span className="inline-block px-3 py-1 rounded text-xs font-mono font-bold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20 self-start mb-10">
              Careers Portal
            </span>
            <div className="flex flex-col space-y-8">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`text-3xl font-bold transition-colors flex items-center gap-4 ${isActive ? "text-primary" : "text-on-surface hover:text-primary"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {isActive && <span className="w-2 h-2 rounded-full bg-primary" />}
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-8 mt-4 border-t border-outline-variant/20">
                <Link
                  href="#apply"
                  className="inline-flex items-center justify-center gap-3 w-full py-4 rounded-xl text-lg font-bold bg-primary text-on-primary shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Apply Now
                  <FaPaperPlane className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
