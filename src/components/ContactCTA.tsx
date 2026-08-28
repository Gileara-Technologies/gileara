"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { siteConfig } from "@/content/site-config";

/**
 * ContactCTA — the homepage climax.
 *
 * Andela's full-bleed dark CTA section. We do the same.
 * - 200px+ vertical padding (huge breathing room)
 * - 120px serif H1 that parallaxes on scroll
 * - Two CTAs (primary pill + email link)
 * - Subtle ambient teal glow from above
 *
 * Scroll-linked motion: the headline drifts up as you scroll past
 * (useScroll + useTransform) — adds the "premium" feel without
 * being noisy.
 */
export default function ContactCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Parallax: headline drifts from y=80 to y=-40 as you scroll through
  const y = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.3, 1, 1, 0.5]);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative bg-surface-container-lowest py-40 md:py-56 px-6 md:px-12 overflow-hidden"
    >
      {/* Ambient teal glow from above — the "little aspects of white" */}
      <div
        className="absolute inset-x-0 -top-40 h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center top, rgba(94, 234, 212, 0.18) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      {/* Subtle bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
          <div className="col-span-12 lg:col-span-10">
            <motion.div
              style={{ y, opacity }}
              className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-10"
            >
              Get in touch
            </motion.div>

            <motion.h2
              style={{ y, opacity }}
              className="font-serif text-display-lg md:text-display-xl leading-[0.9] tracking-[-0.03em] text-on-background max-w-5xl mb-12"
            >
              Ready when
              <br />
              <span className="italic text-accent-cyan">you are.</span>
            </motion.h2>

            <motion.p
              style={{ y, opacity }}
              className="text-body-lg md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed mb-12"
            >
              Thirty minutes, free. We&apos;ll map your goals to the right package — even if you don&apos;t buy.
            </motion.p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
              <Link
                href="/contact"
                className="group inline-flex items-center pl-8 pr-14 py-4 rounded-pill bg-accent-bright text-background font-medium text-lg hover:bg-accent-cyan transition-colors duration-300"
              >
                Book a Free Consultation
                <span className="ml-6 material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1.5">
                  arrow_forward
                </span>
              </Link>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-on-surface-variant hover:text-accent-bright font-medium transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Or email us at {siteConfig.email}
              </a>
            </div>

            <div className="mt-20 pt-10 border-t border-on-background/10 flex flex-col sm:flex-row gap-4 sm:gap-12 text-sm text-on-surface-variant font-mono">
              <span>{siteConfig.location}</span>
              <span>{siteConfig.timezone}</span>
              <span>Replies within 1 business day</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
