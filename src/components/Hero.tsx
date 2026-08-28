"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Hero Section — Andela UI pattern applied to Gileara.
 *
 * Andela's signature hero anatomy:
 *   1. Serif H1 (Droid Serif equivalent — IBM Plex Serif) at 64-72px
 *   2. Inter subheading at 18-20px
 *   3. Three checkmark benefit lines (green checkmark + short label)
 *   4. Pill-shaped CTA button (dark bg, asymmetric padding for icon)
 *   5. Centered layout, generous 128px vertical padding
 *
 * Gileara colors preserved: teal accent + dark navy background (Velocity Dark).
 */
export default function Hero() {
  const benefits = [
    "All-inclusive monthly packages",
    "WhatsApp-ready and MTN MoMo-integrated",
    "Managed services from day one",
  ];

  return (
    <section className="relative bg-background py-32 md:py-48 px-4 md:px-10 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-center gap-8"
        >
          {/* H1 — Serif, Andela-style */}
          <h1
            className="font-serif text-5xl md:text-7xl leading-tight text-on-background max-w-4xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            We Build the Systems{" "}
            <span className="text-primary italic">Your Business Runs On</span>
          </h1>

          {/* Subheading — Inter body */}
          <p className="font-sans text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            All-inclusive monthly digital transformation packages for Ghanaian MSMEs — replacing spreadsheets and manual work with systems built for scale.
          </p>

          {/* Checkmark list — Andela's signature */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mt-2">
            {benefits.map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M10.2003 14.8518L18.4731 6.57812L19.7466 7.85073L10.2003 17.397L4.47266 11.6694L5.74526 10.3968L10.2003 14.8518Z" fill="currentColor" className="text-primary" />
                </svg>
                <span className="text-on-surface font-medium">{b}</span>
              </motion.div>
            ))}
          </div>

          {/* Pill CTA — Andela's exact pattern: dark bg, asymmetric padding, rounded-full */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-6"
          >
            <Link
              href="/contact"
              className="inline-flex items-center bg-tertiary text-on-tertiary font-medium text-lg rounded-full pl-6 pr-12 py-4 hover:opacity-90 transition-opacity duration-200 group"
            >
              Book a Free Consultation
              <span className="ml-6 material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
            </Link>
            <Link
              href="#packages"
              className="text-primary font-medium hover:underline"
            >
              See Our Packages
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
