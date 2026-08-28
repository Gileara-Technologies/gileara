"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import {
  servicePackages,
  customServices,
  customerJourney,
  MANAGED_SERVICES_NOTE,
  type ServicePackage,
} from "@/content/packages";
import { siteConfig } from "@/content/site-config";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";

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
      className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
        pkg.status === "available"
          ? "border-accent-bright text-accent-bright"
          : "border-on-background/20 text-on-surface-variant"
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
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-accent-bright text-accent-bright">
        <span className="material-symbols-outlined text-sm" role="img" aria-label="Included">check</span>
      </span>
    );
  }
  return <span>{value}</span>;
}

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function ServicesPageClient() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <PageHero
        number="01"
        eyebrow="PACKAGES & SERVICES"
        headline={
          <>
            Five ways to{" "}
            <span className="italic text-accent-cyan">transform</span>{" "}
            your business.
          </>
        }
        subtitle="Every package is all-inclusive — managed services built in from day one, priced in clear USD tiers you can compare on this page. Start where it hurts most; grow along the ladder when you're ready."
      />

      {/* Overview table */}
      <section className="bg-background py-20 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="overflow-x-auto border-t border-b border-on-background/10">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant">
                  <th className="py-6">Package</th>
                  <th className="py-6">Built for</th>
                  <th className="py-6">From</th>
                  <th className="py-6">Status</th>
                  <th className="py-6" aria-label="Details link" />
                </tr>
              </thead>
              <tbody>
                {servicePackages.map((pkg) => (
                  <tr key={pkg.id} className="border-t border-on-background/10 hover:bg-surface-container/40 transition-colors">
                    <td className="py-6 font-serif text-xl text-on-background">{pkg.name}</td>
                    <td className="py-6 text-on-surface-variant">{pkg.targetCustomers.slice(0, 2).join(" · ")}</td>
                    <td className="py-6 whitespace-nowrap text-on-background">{usd(pkg.tiers[0].monthlyFeeUsd)}/mo</td>
                    <td className="py-6"><StatusChip pkg={pkg} /></td>
                    <td className="py-6 text-right">
                      <a href={`#${pkg.id}`} className="text-accent-bright hover:underline whitespace-nowrap font-medium">
                        Details ↓
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-sm text-on-surface-variant max-w-3xl">
            {MANAGED_SERVICES_NOTE}
          </p>
        </div>
      </section>

      {/* Per-package sections — numbered, alternating surface elevation */}
      <section className="pb-24">
        <div className="max-w-[1440px] mx-auto space-y-0">
          {servicePackages.map((pkg, idx) => {
            const basic = pkg.tiers[0];
            const isAutomation = pkg.id === "automation-efficiency";
            const num = String(idx + 2).padStart(2, "0"); // 02..06
            const bgClass = idx % 2 === 0 ? "bg-surface-container" : "bg-background";
            return (
              <motion.section
                key={pkg.id}
                id={pkg.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className={`scroll-mt-24 ${bgClass} py-32 md:py-40 px-6 md:px-12 border-t border-on-background/10`}
              >
                <div className="max-w-[1440px] mx-auto">
                  <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-12">
                    <div className="col-span-12 lg:col-span-8">
                      <div className="font-mono text-label uppercase tracking-[0.2em] text-on-background/[0.4] mb-4">
                        {num}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap mb-3">
                        <h2 className="font-serif text-display-sm text-on-background leading-tight tracking-[-0.02em]">
                          {pkg.name}
                        </h2>
                        <StatusChip pkg={pkg} />
                      </div>
                      <p className="text-on-surface-variant text-lg max-w-2xl mb-3">
                        {pkg.tagline}
                      </p>
                      <p className="text-on-surface-variant text-sm">
                        Goal: <span className="text-on-background">{pkg.primaryGoal}</span> · For{" "}
                        <span className="text-on-background">{pkg.targetCustomers.join(", ").toLowerCase()}</span>
                      </p>
                    </div>
                    <div className="col-span-12 lg:col-span-4 lg:text-right mt-8 lg:mt-0 flex lg:justify-end items-end">
                      <Link
                        href="/contact"
                        className="group inline-flex items-center pl-6 pr-10 py-3 rounded-pill bg-accent-bright text-background font-medium hover:bg-accent-cyan transition-colors duration-300"
                      >
                        Discuss this package
                        <span className="ml-4 material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">arrow_forward</span>
                      </Link>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-on-background/10 rounded-xl bg-background/40">
                    <table className="w-full min-w-[640px] text-sm">
                      <thead>
                        <tr className="border-b border-on-background/10 text-left">
                          <th className="px-5 py-4 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">What you get</th>
                          {pkg.tiers.map((t) => (
                            <th key={t.name} className="px-5 py-4">
                              <span className="font-serif text-lg text-on-background">{t.name}</span>
                              <span className="block mt-1 text-on-surface-variant font-normal">
                                {usd(t.setupFeeUsd)} setup · {usd(t.monthlyFeeUsd)}/mo
                              </span>
                              <span className="block text-xs text-on-surface-variant font-normal mt-0.5">{t.deliveryTime}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {isAutomation
                          ? pkg.solutions?.map((s) => (
                              <tr key={s} className="border-b border-on-background/5 last:border-0">
                                <td className="px-5 py-3.5 text-on-background" colSpan={4}>
                                  <span className="inline-flex items-center gap-3">
                                    <Cell value="Yes" /> {s}
                                  </span>
                                </td>
                              </tr>
                            ))
                          : pkg.features?.map((row) => (
                              <tr key={row.feature} className="border-b border-on-background/5 last:border-0">
                                <td className="px-5 py-3.5 text-on-background">{row.feature}</td>
                                <td className="px-5 py-3.5"><Cell value={row.basic} /></td>
                                <td className="px-5 py-3.5"><Cell value={row.professional} /></td>
                                <td className="px-5 py-3.5"><Cell value={row.enterprise} /></td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-4 text-xs text-on-surface-variant">
                    Entry point: {usd(basic.setupFeeUsd)} setup + {usd(basic.monthlyFeeUsd)}/mo · all-inclusive.
                  </p>
                </div>
              </motion.section>
            );
          })}
        </div>
      </section>

      {/* Growth ladder */}
      <section className="py-32 md:py-48 px-6 md:px-12 bg-surface-container">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-16">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel number="07" label="THE GROWTH LADDER" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                Start small.{" "}
                <span className="italic text-accent-cyan">Scale when ready.</span>
              </DisplayHeading>
              <RevealText delay={0.15}>
                <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                  Most MSMEs climb in stages — each step builds on the last, and nothing you own gets thrown away.
                </p>
              </RevealText>
            </div>
          </div>

          <motion.ol
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            {customerJourney.map((stage) => (
              <motion.li
                key={stage.stage}
                variants={item}
                className="border-t border-on-background/20 pt-6 flex flex-col"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-bright mb-3">
                  Stage {stage.stage}
                </span>
                <a href={`#${stage.packageId}`} className="font-serif text-xl text-on-background hover:text-accent-bright transition-colors leading-tight">
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

      {/* Ghana rails + custom */}
      <section className="py-32 md:py-48 px-6 md:px-12 bg-background">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-x-12 gap-y-16">
          <div>
            <SectionLabel number="08" label="GHANA RAILS" className="mb-8" />
            <h2 className="font-serif text-display-sm text-on-background leading-tight tracking-[-0.02em] mb-6">
              Rails Ghanaian businesses{" "}
              <span className="italic text-accent-cyan">trust.</span>
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              We integrate the platforms your customers already use — and we&apos;ll tell you plainly what we build on and why.
            </p>
            <ul className="space-y-3">
              {["MTN MoMo payments & reconciliation", "Paystack / Hubtel card & bank rails", "WhatsApp Business messaging", "Google Workspace & email"].map((rail) => (
                <li key={rail} className="flex items-center gap-3 text-on-background">
                  <Cell value="Yes" /> {rail}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel number="09" label="BEYOND PACKAGES" className="mb-8" />
            <h2 className="font-serif text-display-sm text-on-background leading-tight tracking-[-0.02em] mb-6">
              Bespoke builds,{" "}
              <span className="italic text-accent-cyan">by quote.</span>
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              Need something the packages don&apos;t cover? We take a small number of bespoke engagements each quarter.
            </p>
            <ul className="space-y-3">
              {customServices.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-4 py-4 border-t border-on-background/10">
                  <span className="font-medium text-on-background">{s.name}</span>
                  <span className="font-mono text-sm text-on-surface-variant whitespace-nowrap">from {usd(s.startingPriceUsd)}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-accent-bright hover:underline font-medium group">
              Ask about a custom build
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABand
        eyebrow="NOT SURE?"
        headline={
          <>
            Not sure which package{" "}
            <span className="italic text-accent-cyan">fits?</span>
          </>
        }
        body="Book a free consultation — we'll recommend one based on your goals, honestly."
        secondaryLabel={`${siteConfig.location} · ${siteConfig.timezone}`}
        secondaryHref="/contact"
      />
    </div>
  );
}
