"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import MagneticButton from "@/components/MagneticButton";
import RevealText from "@/components/RevealText";

import {
  servicePackages,
  customServices,
  MANAGED_SERVICES_NOTE,
} from "@/content/packages";

/**
 * Pricing — numbered full-width list (not a 3-col card grid).
 *
 * Each package is a row: huge number on the left, title + tagline
 * in the middle, price on the right. Hovering a row reveals a teal
 * left-border glow and lifts the row. Clicking expands more detail.
 *
 * The background of each open row shifts to a very subtle teal tint
 * so the expanded state feels alive rather than just taller.
 */
export default function Pricing() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="packages" className="relative bg-background py-section-loose px-6 md:px-12">
      {/* Ambient top glow */}
      <div
        className="absolute inset-x-0 top-0 h-96 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 40% at 70% 0%, rgba(94,234,212,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20 md:mb-28">
          <div className="col-span-12 lg:col-span-7">
            <RevealText>
              <SectionLabel label="WHAT WE BUILD" className="mb-8" />
            </RevealText>
            <DisplayHeading size="lg" as="h2" className="mb-8">
              Five systems to{" "}
              <span className="italic text-accent-bright">fix</span>{" "}
              your business.
            </DisplayHeading>
            <RevealText delay={0.15}>
              <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                The five problems we keep seeing in small business, and the systems we build to solve each one. Pick where your business hurts first. Each system is independently useful and stacks cleanly as you grow.
              </p>
            </RevealText>
          </div>
        </div>

        {/* Numbered list — one row per package */}
        <div className="border-t border-on-background/10">
          {servicePackages.map((pkg, i) => {
            const basic = pkg.tiers[0];
            const isOpen = expanded === pkg.id;
            const isHovered = hovered === pkg.id;
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="relative border-b border-on-background/10 overflow-hidden"
                onMouseEnter={() => setHovered(pkg.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Row hover / active background */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: isHovered || isOpen ? 1 : 0,
                    background: isOpen
                      ? "linear-gradient(90deg, rgba(94,234,212,0.07) 0%, transparent 60%)"
                      : "linear-gradient(90deg, rgba(94,234,212,0.04) 0%, transparent 60%)",
                  }}
                  transition={{ duration: 0.35 }}
                  aria-hidden="true"
                />
                {/* Left accent bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px] pointer-events-none"
                  style={{ background: "#5EEAD4" }}
                  animate={{ scaleY: isOpen || isHovered ? 1 : 0, originY: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                />

                <button
                  onClick={() => setExpanded(isOpen ? null : pkg.id)}
                  className="relative w-full text-left grid grid-cols-12 gap-x-4 md:gap-x-8 items-center py-10 md:py-14 group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  {/* Number — col 1-2 */}
                  <div className="col-span-2 md:col-span-1 font-serif text-display-sm text-on-background/[0.12] group-hover:text-accent-bright/50 transition-colors duration-500 leading-none pl-4">
                    {num}
                  </div>

                  {/* Title + tagline — col 3-7 */}
                  <div className="col-span-10 md:col-span-6 lg:col-span-6">
                    <h3 className="font-serif text-3xl md:text-display-sm text-on-background leading-tight tracking-[-0.02em] mb-2 group-hover:text-accent-bright transition-colors duration-300">
                      {pkg.name}
                    </h3>
                    <p className="text-on-surface-variant text-sm md:text-base leading-relaxed max-w-md">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Price — col 8-10 */}
                  <div className="col-span-8 md:col-span-3 lg:col-span-3 md:text-right">
                    <div className="font-serif text-2xl md:text-3xl text-on-background">
                      ${basic.monthlyFeeUsd.toLocaleString("en-US")}
                      <span className="text-sm font-sans text-on-surface-variant">/mo</span>
                    </div>
                    <div className="text-xs font-mono text-on-surface-variant mt-1">
                      from ${basic.setupFeeUsd.toLocaleString("en-US")} setup
                    </div>
                  </div>

                  {/* Arrow — col 11-12 */}
                  <div className="hidden md:flex col-span-2 justify-end">
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-accent-bright transition-colors duration-300"
                    >
                      arrow_forward
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 pb-14 pl-4">
                        <div className="col-span-12 md:col-start-3 md:col-span-7">
                          <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-4">
                            What&apos;s included
                          </div>
                          <ul className="space-y-3 mb-8">
                            {(pkg.features ?? []).slice(0, 5).map((row) => (
                              <li key={row.feature} className="flex items-start gap-3 text-on-surface">
                                <span className="material-symbols-outlined text-accent-bright text-lg shrink-0 mt-0.5">
                                  check_circle
                                </span>
                                <span className="text-base">{row.feature}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="text-sm text-on-surface-variant mb-6 italic max-w-[72ch]">
                            {MANAGED_SERVICES_NOTE}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                            <MagneticButton href="/contact" variant="primary" size="md">
                              Discuss {pkg.name}
                            </MagneticButton>
                            <Link
                              href={`/services/${pkg.slug}`}
                              className="text-on-surface-variant hover:text-accent-bright font-medium inline-flex items-center gap-1 group animated-underline"
                            >
                              Read the {pkg.name} page
                              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-200">
                                arrow_forward
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Beyond the 5 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 pt-12 border-t border-on-background/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-3">
              When the five don&apos;t fit
            </div>
            <p className="text-on-surface text-lg">
              {customServices.map((s, i) => (
                <span key={s.name}>
                  {i > 0 && " · "}
                  {s.name} from ${s.startingPriceUsd.toLocaleString("en-US")}
                </span>
              ))}
            </p>
          </div>
          <Link
            href="/services"
            className="text-accent-bright hover:underline font-medium inline-flex items-center gap-2 group animated-underline"
          >
            See all services
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-200">
              arrow_forward
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
