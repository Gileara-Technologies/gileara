"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { siteConfig } from "@/content/site-config";

/**
 * Slim conversion band — the full booking experience lives on /contact.
 * Keeps id="contact" so legacy /#contact anchors still land somewhere sensible.
 */
export default function ContactCTA() {
  return (
    <section id="contact" className="py-24 bg-background px-4 md:px-10">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">Get Started</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary dark:text-on-background leading-tight">
            Let&apos;s talk about your business
          </h2>
          <p className="text-on-surface-variant text-lg">
            Thirty minutes, free. We&apos;ll map your goals to the right package — even if you don&apos;t buy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/contact"
              className="teal-gradient-btn px-8 py-4 rounded-lg font-semibold shadow-lg text-white dark:text-on-primary inline-flex items-center justify-center gap-2 group"
            >
              Book a Free Consultation
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">arrow_forward</span>
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="border border-outline-variant px-8 py-4 rounded-lg font-semibold text-primary dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors inline-flex items-center justify-center gap-2"
            >
              Email us instead
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
