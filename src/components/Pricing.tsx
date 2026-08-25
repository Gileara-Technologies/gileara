"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import {
  servicePackages,
  customServices,
  MANAGED_SERVICES_NOTE,
} from "@/content/packages";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ghanaReady = ["WhatsApp integration", "MTN MoMo billing", "Offline-tolerant", "Low-bandwidth builds"];

/**
 * The five recurring transformation packages (strategy v3.0 §3).
 * Status chips implement D5 phased-honest launch: packages that have passed
 * readiness sign-off show "Available now"; the rest "Rolling out Q4".
 */
export default function Pricing() {
  return (
    <section id="packages" className="py-24 bg-surface-container dark:bg-surface-container-high px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">Packages</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-primary dark:text-on-background leading-tight">
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
              <motion.article
                key={pkg.id}
                variants={item}
                className={`relative flex flex-col rounded-2xl p-8 border transition-colors duration-300 group ${
                  anchor
                    ? "bg-surface dark:bg-surface-container-lowest border-secondary/50 dark:border-primary/60 shadow-lg"
                    : "bg-surface dark:bg-surface-container-lowest border-outline-variant/25 dark:border-outline-variant/10 hover:border-primary/40 dark:hover:border-primary/30"
                }`}
              >
                {anchor && (
                  <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-on-primary text-[11px] font-mono uppercase tracking-widest">
                    Most popular
                  </span>
                )}

                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="font-display text-xl font-bold text-on-surface">{pkg.name}</h3>
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                      pkg.status === "available"
                        ? "bg-secondary/15 dark:bg-primary/20 text-secondary dark:text-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {pkg.status === "available" ? "Available now" : "Rolling out Q4"}
                  </span>
                </div>

                <p className="text-on-surface-variant text-sm leading-relaxed flex-grow">{pkg.tagline}</p>

                <p className="mt-6 font-display text-3xl font-bold text-primary dark:text-on-background">
                  ${basic.monthlyFeeUsd.toLocaleString("en-US")}
                  <span className="text-sm font-normal text-on-surface-variant">/mo</span>
                  <span className="block text-xs font-sans font-normal text-on-surface-variant mt-1">
                    from · ${basic.setupFeeUsd.toLocaleString("en-US")} setup
                  </span>
                </p>

                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-outline">
                  For {pkg.targetCustomers.slice(0, 3).join(" · ").toLowerCase()}
                </p>

                <Link
                  href="/contact"
                  className={`mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-colors ${
                    anchor
                      ? "teal-gradient-btn text-white dark:text-on-primary"
                      : "border border-outline-variant text-primary dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-high"
                  }`}
                >
                  Discuss this package
                  <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.article>
            );
          })}

          {/* Managed-services band occupies the sixth grid cell */}
          <motion.div
            variants={item}
            className="flex flex-col justify-center rounded-2xl p-8 border border-dashed border-outline-variant/40 dark:border-outline-variant/15 bg-background dark:bg-surface-container"
          >
            <span className="material-symbols-outlined text-secondary dark:text-primary text-3xl mb-4" aria-hidden>
              verified_user
            </span>
            <h3 className="font-display text-lg font-bold text-on-surface mb-3">Included in every package</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">{MANAGED_SERVICES_NOTE}</p>
          </motion.div>
        </motion.div>

        {/* Ghana-ready proof strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 rounded-xl bg-background dark:bg-surface-container border border-outline-variant/20 dark:border-outline-variant/10">
          <span className="font-mono text-xs uppercase tracking-widest text-outline">Ghana-ready by default</span>
          {ghanaReady.map((g) => (
            <span key={g} className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary dark:text-primary text-lg" aria-hidden>
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
