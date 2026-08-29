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
 * in the middle, price on the right. Hovering a row reveals more
 * detail. Clicking expands it (or you can deep-link via the CTA).
 *
 * Asymmetric layout: column 1 = number, columns 2-7 = copy, columns
 * 8-12 = price + CTA. Breaks the symmetric card-grid pattern.
 */
export default function Pricing() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="packages" className="relative bg-background py-32 md:py-48 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20 md:mb-28">
          <div className="col-span-12 lg:col-span-7">
            <RevealText>
              <SectionLabel number="02" label="WHAT WE BUILD" className="mb-8" />
            </RevealText>
            <DisplayHeading size="lg" as="h2" className="mb-8">
              Five systems to{" "}
              <span className="italic text-accent-cyan">fix</span>{" "}
              your business.
            </DisplayHeading>
            <RevealText delay={0.15}>
              <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                The five problems we keep seeing in small business, and the systems we build to solve each one. Pick where your business hurts first — every system is independently useful and stacks cleanly as you grow.
              </p>
            </RevealText>
          </div>
        </div>

        {/* Numbered list — one row per package */}
        <div className="border-t border-on-background/10">
          {servicePackages.map((pkg, i) => {
            const basic = pkg.tiers[0];
            const isOpen = expanded === pkg.id;
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="border-b border-on-background/10"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : pkg.id)}
                  className="w-full text-left grid grid-cols-12 gap-x-4 md:gap-x-8 items-center py-10 md:py-14 group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  {/* Number — col 1-2 */}
                  <div className="col-span-2 md:col-span-1 font-serif text-display-sm text-on-background/[0.15] group-hover:text-accent-bright/60 transition-colors duration-500 leading-none">
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
                    <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-accent-bright group-hover:translate-x-1 transition-all duration-300">
                      {isOpen ? "close" : "arrow_forward"}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 pb-12">
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
                          <div className="text-sm text-on-surface-variant mb-6 italic">
                            {MANAGED_SERVICES_NOTE}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                            <MagneticButton href="/contact" variant="primary" size="md">
                              Discuss {pkg.name}
                            </MagneticButton>
                            <Link
                              href={`/services/${pkg.slug}`}
                              className="text-on-surface-variant hover:text-accent-bright font-medium inline-flex items-center gap-1 group"
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
        <div className="mt-20 pt-12 border-t border-on-background/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
            className="text-accent-bright hover:underline font-medium inline-flex items-center gap-2 group"
          >
            See all services
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-200">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
