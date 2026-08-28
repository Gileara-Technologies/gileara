"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  servicePackages,
  customServices,
  MANAGED_SERVICES_NOTE,
} from "@/content/packages";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ghanaReady = ["WhatsApp integration", "MTN MoMo billing", "Offline-tolerant", "Low-bandwidth builds"];

/**
 * The five recurring transformation packages — Andela-style clean cards.
 * No tilt, no ghost numerals, no alternating fills. Just clean white cards
 * with cyan accents on alternating navy/ice-blue sections.
 */
export default function Pricing() {
  return (
    <section id="packages" className="py-32 bg-background px-4 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">Packages</span>
          <h2 className="font-serif text-4xl md:text-6xl font-normal mt-4 text-on-background leading-tight" style={{ letterSpacing: "-0.02em" }}>
            One partner. Five ways to transform.
          </h2>
          <p className="mt-6 text-on-surface-variant text-lg">
            Pick where your business needs help first — every package is all-inclusive, with managed services built in
            from day one. No hidden costs, ever.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch"
        >
          {servicePackages.map((pkg) => {
            const basic = pkg.tiers[0];
            const anchor = pkg.id === "business-operations";
            return (
              <motion.article key={pkg.id} variants={item} className="h-full">
                <div
                  className={`relative flex flex-col h-full rounded-xl p-8 border transition-all duration-200 group ${
                    anchor
                      ? "border-primary/60 bg-white dark:bg-surface-container-low shadow-lg shadow-primary/10"
                      : "border-outline-variant/20 bg-white dark:bg-surface-container hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  {anchor && (
                    <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-white text-[11px] font-mono uppercase tracking-widest">
                      Most popular
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="font-display text-xl font-bold text-on-surface">{pkg.name}</h3>
                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                        pkg.status === "available"
                          ? "bg-primary/15 text-primary"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {pkg.status === "available" ? "Available now" : "Rolling out Q4"}
                    </span>
                  </div>

                  <p className="text-on-surface-variant text-sm leading-relaxed flex-grow">{pkg.tagline}</p>

                  <div className="mt-6 pt-6 border-t border-outline-variant/15">
                    <p className="font-display text-3xl font-bold text-on-background">
                      ${basic.monthlyFeeUsd.toLocaleString("en-US")}
                      <span className="text-sm font-normal text-on-surface-variant">/mo</span>
                    </p>
                    <p className="text-xs font-sans text-on-surface-variant mt-1">
                      from ${basic.setupFeeUsd.toLocaleString("en-US")} setup
                    </p>
                  </div>

                  <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-outline">
                    For {pkg.targetCustomers.slice(0, 3).join(" · ").toLowerCase()}
                  </p>

                  <Link
                    href="/contact"
                    className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full pl-5 pr-10 py-2.5 text-sm font-medium transition-opacity duration-200 group ${
                      anchor
                        ? "bg-tertiary text-on-tertiary hover:opacity-90"
                        : "border border-outline-variant text-primary hover:border-primary"
                    }`}
                  >
                    Discuss this package
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">arrow_forward</span>
                  </Link>
                </div>
              </motion.article>
            );
          })}

          {/* Managed-services band */}
          <motion.div variants={item} className="h-full">
            <div className="flex flex-col justify-center h-full rounded-xl p-8 border border-dashed border-primary/25 bg-surface-container-lowest">
              <span className="material-symbols-outlined text-primary text-3xl mb-4" aria-hidden>
                verified_user
              </span>
              <h3 className="font-display text-lg font-bold text-on-surface mb-3">Included in every package</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{MANAGED_SERVICES_NOTE}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Ghana-ready proof strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
          <span className="font-mono text-xs uppercase tracking-widest text-outline">Ghana-ready by default</span>
          {ghanaReady.map((g) => (
            <span key={g} className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-lg" aria-hidden>
                check_circle
              </span>
              {g}
            </span>
          ))}
        </div>

        {/* Beyond packages */}
        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface-variant">
            Need something outside the packages?{" "}
            {customServices.map((s, i) => (
              <span key={s.name}>
                {i > 0 && " · "}
                <span className="text-on-surface">
                  {s.name} from ${s.startingPriceUsd.toLocaleString("en-US")}
                </span>
              </span>
            ))}
            .{" "}
            <Link href="/services" className="text-primary font-semibold hover:underline">
              See all services
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
