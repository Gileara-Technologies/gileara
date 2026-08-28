"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Hero Section — Andela-inspired design language
 *
 * Design principles:
 * - Copy leads (headline is the hero, not a visual effect)
 * - Navy background with minimal ambient treatment
 * - Clear CTA hierarchy (primary: cyan, secondary: outline)
 * - Breathing room (60% whitespace)
 * - No 3D, no gimmicks — pure typography and messaging
 */
export default function Hero() {
  return (
    <section className="relative min-h-screen bg-primary flex items-center justify-center overflow-hidden">
      {/* Minimal ambient gradient (Andela-style subtle treatment) */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-tertiary opacity-100" />

      {/* Content layer */}
      <div className="relative z-10 w-full">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-8 text-center"
          >
            {/* Overline badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-mono font-medium tracking-wider uppercase mx-auto"
            >
              <span className="inline-block w-2 h-2 bg-accent rounded-full" />
              FOR GHANAIAN MSMEs
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-5xl md:text-7xl font-bold leading-tight text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Transform Your Business With Systems Built for Scale
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            >
              One platform. All your operations. No more spreadsheets. Deploy in days, not months. From WhatsApp automation to payment processing, we handle the tech so you focus on growth.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-8 justify-center"
            >
              {/* Primary CTA — Cyan button */}
              <Link
                href="/contact"
                className="px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200 inline-flex items-center justify-center gap-2 group shadow-lg"
              >
                Start Your Transformation
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform duration-200">
                  arrow_forward
                </span>
              </Link>

              {/* Secondary CTA — Outline button */}
              <Link
                href="#platforms"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-200 inline-flex items-center justify-center gap-2 group"
              >
                See Our Platforms
                <span className="material-symbols-outlined text-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                  arrow_forward
                </span>
              </Link>
            </motion.div>

            {/* Trust badges / Key metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="pt-12 flex flex-col sm:flex-row gap-8 sm:gap-12 justify-center text-white/70 text-sm font-mono uppercase"
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold text-white mb-2">500+</span>
                <span>MSMEs Transformed</span>
              </div>
              <div className="hidden sm:block w-px bg-white/20" />
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</span>
                <span>Uptime SLA</span>
              </div>
              <div className="hidden sm:block w-px bg-white/20" />
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold text-white mb-2">7 Days</span>
                <span>Average Deployment</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
