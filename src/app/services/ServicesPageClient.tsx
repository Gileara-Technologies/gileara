"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaCheck } from "react-icons/fa6";
import {
  servicePackages,
  customServices,
  customerJourney,
  MANAGED_SERVICES_NOTE,
  type ServicePackage,
} from "@/content/packages";
import { siteConfig } from "@/content/site-config";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function StatusChip({ pkg }: { pkg: ServicePackage }) {
  return (
    <span
      className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${
        pkg.status === "available"
          ? "bg-secondary/15 dark:bg-primary/20 text-secondary dark:text-primary"
          : "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {pkg.status === "available" ? "Available now" : "Rolling out Q4 2026"}
    </span>
  );
}

function Cell({ value }: { value?: string }) {
  if (value === undefined) {
    return <span className="text-outline-variant/60" aria-label="Not included">—</span>;
  }
  if (value === "Yes") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary/15 dark:bg-primary/20">
        <FaCheck className="w-3 h-3 text-secondary dark:text-primary" aria-label="Included" />
      </span>
    );
  }
  return <span>{value}</span>;
}

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function ServicesPageClient() {
  return (
    <div className="bg-background">
      {/* ── Page hero + overview table ─────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">Packages &amp; Services</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-primary dark:text-on-background leading-tight tracking-tight">
              Five ways to transform your business.
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed">
              Every package is all-inclusive — managed services built in from day one, priced in clear USD tiers you can
              compare on this page. Start where it hurts most; grow along the ladder when you&apos;re ready.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-12 overflow-x-auto rounded-2xl border border-outline-variant/25 dark:border-outline-variant/10"
          >
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="bg-surface-container dark:bg-surface-container-high text-left font-mono text-[11px] uppercase tracking-wider text-outline">
                  <th className="px-5 py-4">Package</th>
                  <th className="px-5 py-4">Built for</th>
                  <th className="px-5 py-4">From</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4" aria-label="Details link" />
                </tr>
              </thead>
              <tbody>
                {servicePackages.map((pkg) => (
                  <tr key={pkg.id} className="border-t border-outline-variant/15 dark:border-outline-variant/10 hover:bg-surface-container/60 transition-colors">
                    <td className="px-5 py-4 font-display font-bold text-on-surface">{pkg.name}</td>
                    <td className="px-5 py-4 text-on-surface-variant">{pkg.targetCustomers.slice(0, 2).join(" · ")}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-on-surface">{usd(pkg.tiers[0].monthlyFeeUsd)}/mo</td>
                    <td className="px-5 py-4"><StatusChip pkg={pkg} /></td>
                    <td className="px-5 py-4 text-right">
                      <a href={`#${pkg.id}`} className="font-semibold text-primary hover:underline whitespace-nowrap">
                        Details ↓
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <p className="mt-6 text-sm text-on-surface-variant max-w-3xl">
            {MANAGED_SERVICES_NOTE}
          </p>
        </div>
      </section>

      {/* ── Per-package sections ───────────────────────────────────── */}
      <section className="pb-24 px-4 md:px-10">
        <div className="max-w-6xl mx-auto space-y-16">
          {servicePackages.map((pkg, idx) => {
            const basic = pkg.tiers[0];
            const isAutomation = pkg.id === "automation-efficiency";
            return (
              <motion.section
                key={pkg.id}
                id={pkg.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className={`scroll-mt-24 rounded-3xl border p-6 md:p-10 ${
                  idx % 2 === 0
                    ? "bg-surface-container dark:bg-surface-container-high border-outline-variant/20 dark:border-outline-variant/10"
                    : "bg-surface-container-high dark:bg-surface-container-lowest border-outline-variant/25 dark:border-outline-variant/10"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-display text-3xl font-bold text-primary dark:text-on-background">{pkg.name}</h2>
                      <StatusChip pkg={pkg} />
                    </div>
                    <p className="mt-3 text-on-surface-variant text-lg">{pkg.tagline}</p>
                    <p className="mt-2 text-sm text-outline">
                      Goal: <span className="text-on-surface">{pkg.primaryGoal}</span> · For{" "}
                      <span className="text-on-surface">{pkg.targetCustomers.join(", ").toLowerCase()}</span>
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold teal-gradient-btn text-white dark:text-on-primary group"
                  >
                    Discuss this package
                    <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>

                {/* Tier comparison */}
                <div className="overflow-x-auto rounded-2xl border border-outline-variant/20 dark:border-outline-variant/10 bg-surface dark:bg-surface-container">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-outline-variant/15 dark:border-outline-variant/10 text-left">
                        <th className="px-5 py-4 font-mono text-[11px] uppercase tracking-wider text-outline">What you get</th>
                        {pkg.tiers.map((t) => (
                          <th key={t.name} className="px-5 py-4">
                            <span className="font-display font-bold text-on-surface">{t.name}</span>
                            <span className="block mt-1 text-on-surface-variant font-normal">
                              {usd(t.setupFeeUsd)} setup · {usd(t.monthlyFeeUsd)}/mo
                            </span>
                            <span className="block text-xs text-outline font-normal mt-0.5">{t.deliveryTime}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {isAutomation
                        ? pkg.solutions?.map((s) => (
                            <tr key={s} className="border-b border-outline-variant/10 dark:border-outline-variant/5 last:border-0">
                              <td className="px-5 py-3.5 text-on-surface" colSpan={4}>
                                <span className="inline-flex items-center gap-3">
                                  <Cell value="Yes" /> {s}
                                </span>
                              </td>
                            </tr>
                          ))
                        : pkg.features?.map((row) => (
                            <tr key={row.feature} className="border-b border-outline-variant/10 dark:border-outline-variant/5 last:border-0">
                              <td className="px-5 py-3.5 text-on-surface">{row.feature}</td>
                              <td className="px-5 py-3.5"><Cell value={row.basic} /></td>
                              <td className="px-5 py-3.5"><Cell value={row.professional} /></td>
                              <td className="px-5 py-3.5"><Cell value={row.enterprise} /></td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 text-xs text-outline">
                  Entry point: {usd(basic.setupFeeUsd)} setup + {usd(basic.monthlyFeeUsd)}/mo · all-inclusive.
                </p>
              </motion.section>
            );
          })}
        </div>
      </section>

      {/* ── Growth ladder ──────────────────────────────────────────── */}
      <section className="py-20 bg-surface-container dark:bg-surface-container-high px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">The growth ladder</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 text-primary dark:text-on-background">
              Start small. Scale when ready.
            </h2>
            <p className="mt-4 text-on-surface-variant">
              Most MSMEs climb in stages — each step builds on the last, and nothing you own gets thrown away.
            </p>
          </div>
          <motion.ol
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {customerJourney.map((stage) => (
              <motion.li
                key={stage.stage}
                variants={item}
                className="rounded-2xl bg-surface dark:bg-surface-container p-6 border border-outline-variant/20 dark:border-outline-variant/10 flex flex-col"
              >
                <span className="font-mono text-[11px] uppercase tracking-widest text-secondary dark:text-primary mb-3">
                  Stage {stage.stage}
                </span>
                <a href={`#${stage.packageId}`} className="font-display font-bold text-on-surface hover:text-primary transition-colors">
                  {stage.packageName}
                </a>
                <span className="mt-auto pt-4 text-sm text-on-surface-variant">
                  from {usd(stage.setupFeeUsd)} + {usd(stage.monthlyFeeUsd)}/mo
                </span>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ── Ghana rails + beyond packages ──────────────────────────── */}
      <section className="py-20 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary dark:text-on-background">Rails Ghanaian businesses trust</h2>
            <p className="mt-4 text-on-surface-variant leading-relaxed">
              We integrate the platforms your customers already use — and we&apos;ll tell you plainly what we build on and why.
            </p>
            <ul className="mt-6 space-y-3">
              {["MTN MoMo payments & reconciliation", "Paystack / Hubtel card & bank rails", "WhatsApp Business messaging", "Google Workspace & email"].map((rail) => (
                <li key={rail} className="flex items-center gap-3 text-on-surface">
                  <Cell value="Yes" /> {rail}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary dark:text-on-background">Beyond packages</h2>
            <p className="mt-4 text-on-surface-variant leading-relaxed">
              Need something the packages don&apos;t cover? We take a small number of bespoke engagements each quarter.
            </p>
            <ul className="mt-6 space-y-3">
              {customServices.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-container dark:bg-surface-container-high border border-outline-variant/15 dark:border-outline-variant/10">
                  <span className="font-medium text-on-surface">{s.name}</span>
                  <span className="font-mono text-sm text-secondary dark:text-primary whitespace-nowrap">from {usd(s.startingPriceUsd)}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              Ask about a custom build
              <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary dark:text-on-background">
            Not sure which package fits?
          </h2>
          <p className="mt-4 text-on-surface-variant">
            Book a free consultation — we&apos;ll recommend one based on your goals, honestly.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold teal-gradient-btn text-white dark:text-on-primary shadow-lg group"
          >
            Book a Free Consultation
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <p className="mt-4 text-xs text-outline">{siteConfig.location} · {siteConfig.timezone}</p>
        </div>
      </section>
    </div>
  );
}
