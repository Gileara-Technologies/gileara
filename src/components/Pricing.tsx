"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { servicePackages, customServices, MANAGED_SERVICES_NOTE } from "@/content/packages";

/**
 * Pricing — Terminal / Operator aesthetic.
 *
 * Layout: invoice-style numbered rows. No cards, no gradients.
 * Each row is a hairline-bordered item. Expanding reveals a
 * feature checklist styled like CLI output (▸ check).
 */
export default function Pricing() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="packages" className="relative bg-brand-soft py-section-loose px-6 md:px-12">
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <div className="font-mono text-[11px] text-accent-bright tracking-widest uppercase mb-5 flex items-center gap-2">
            <span className="text-accent-bright/50">▸</span>
            packages.ts
          </div>
          <h2 className="font-display text-display-lg text-on-background mb-5 max-w-2xl">
            Five systems. One each for where your business hurts.
          </h2>
          <p className="font-sans text-body-lg text-white/45 max-w-xl leading-relaxed">
            Each system is independently useful and stacks cleanly as you grow. Pick where it hurts most.
          </p>
        </div>

        {/* Invoice rows */}
        <div className="border-t border-white/[0.06]">
          {servicePackages.map((pkg, i) => {
            const basic = pkg.tiers[0];
            const isOpen = expanded === pkg.id;
            const isHovered = hovered === pkg.id;
            const num = String(i + 1).padStart(2, "0");

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative border-b border-white/[0.06]"
                onMouseEnter={() => setHovered(pkg.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Hover / open bg tint */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: isHovered || isOpen ? 1 : 0 }}
                  style={{
                    background: isOpen
                      ? "rgba(94,234,212,0.04)"
                      : "rgba(255,255,255,0.015)",
                  }}
                  transition={{ duration: 0.2 }}
                />
                {/* Teal left accent line */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-px bg-accent-bright"
                  animate={{ opacity: isOpen ? 1 : 0, scaleY: isOpen ? 1 : 0.3 }}
                  style={{ originY: 0 }}
                  transition={{ duration: 0.25 }}
                />

                <button
                  onClick={() => setExpanded(isOpen ? null : pkg.id)}
                  className="relative w-full text-left flex items-start md:items-center justify-between gap-6 py-6 md:py-7 pl-5 group"
                  aria-expanded={isOpen}
                >
                  {/* Left: num + name + tagline */}
                  <div className="flex items-start md:items-center gap-6 flex-1 min-w-0">
                    <span className="font-mono text-[11px] text-white/20 group-hover:text-accent-bright/50 transition-colors duration-200 shrink-0 mt-0.5 md:mt-0">
                      {num}
                    </span>
                    <div className="min-w-0">
                      <div className="font-display text-xl md:text-2xl text-on-background group-hover:text-accent-bright transition-colors duration-200 mb-0.5">
                        {pkg.name}
                      </div>
                      <div className="font-sans text-sm text-white/35 truncate max-w-md">
                        {pkg.tagline}
                      </div>
                    </div>
                  </div>

                  {/* Right: price + expand */}
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="font-mono text-lg text-on-background">
                        ${basic.monthlyFeeUsd.toLocaleString("en-US")}
                        <span className="text-xs text-white/30 font-sans">/mo</span>
                      </div>
                      <div className="font-mono text-[11px] text-white/25 mt-0.5">
                        +${basic.setupFeeUsd.toLocaleString("en-US")} setup
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="material-symbols-outlined text-xl text-white/25 group-hover:text-accent-bright transition-colors duration-200"
                    >
                      arrow_forward
                    </motion.span>
                  </div>
                </button>

                {/* Expanded — CLI checklist */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-[3.25rem] pr-6 pb-8">
                        <div className="font-mono text-[11px] text-white/25 mb-4 tracking-widest uppercase">
                          {"// what's included"}
                        </div>
                        <ul className="space-y-2.5 mb-6">
                          {(pkg.features ?? []).slice(0, 6).map((row) => (
                            <li key={row.feature} className="flex items-start gap-3 font-sans text-sm text-white/60">
                              <span className="font-mono text-accent-bright text-[11px] mt-0.5 shrink-0">✓</span>
                              {row.feature}
                            </li>
                          ))}
                        </ul>
                        <p className="font-sans text-[12px] text-white/25 italic mb-6 max-w-lg">
                          {MANAGED_SERVICES_NOTE}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-black text-sm font-sans font-medium hover:bg-white/90 transition-colors duration-150"
                          >
                            Discuss {pkg.name}
                            <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
                          </Link>
                          <Link
                            href={`/services/${pkg.slug}`}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md border border-white/10 text-white/60 text-sm font-sans hover:border-white/20 hover:text-white/80 transition-colors duration-150"
                          >
                            Full details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Custom work footer */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] text-white/25 mb-1 tracking-widest uppercase">
              {"// custom"}
            </div>
            <p className="font-sans text-sm text-white/40">
              {customServices.map((s, i) => (
                <span key={s.name}>
                  {i > 0 && <span className="text-white/20 mx-2">·</span>}
                  {s.name} from ${s.startingPriceUsd.toLocaleString("en-US")}
                </span>
              ))}
            </p>
          </div>
          <Link
            href="/services"
            className="font-mono text-[12px] text-accent-bright hover:text-accent-bright/70 transition-colors flex items-center gap-1.5"
          >
            view all →
          </Link>
        </div>
      </div>
    </section>
  );
}
