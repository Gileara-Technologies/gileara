"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import {
  servicePackages,
  customServices,
  MANAGED_SERVICES_NOTE,
  type Service,
} from "@/content/packages";
import PageHero from "@/components/PageHero";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";
import MagneticButton from "@/components/MagneticButton";

/**
 * /services — the pricing sheet.
 *
 * A focused single-page comparison matrix for clients evaluating Gileara.
 * No marketing copy, no testimonials — just the numbers, the feature
 * matrix, and a CTA. The five service landing pages
 * (`/services/[slug]`) handle the marketing narrative for each offering.
 */
export default function ServicesPageClient() {
  const [activeServiceId, setActiveServiceId] = useState<string>(servicePackages[0].id);
  const activeService = servicePackages.find((s) => s.id === activeServiceId) ?? servicePackages[0];

  return (
    <>
      {/* ── HERO — minimal, just sets the page context ──────────── */}
      <PageHero
        eyebrow="SERVICES & PRICING"
        headline={
          <>
            Five services.{" "}
            <span className="italic text-accent-cyan">One clear price list.</span>
          </>
        }
        subtitle="All-inclusive monthly pricing, USD. Managed services included from day one. No hidden costs."
        cta={
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
            <MagneticButton href="/contact" variant="primary" size="lg">
              Book a Free Consultation
            </MagneticButton>
            <a
              href="#matrix"
              className="text-on-surface-variant hover:text-accent-bright font-medium transition-colors duration-200 underline-offset-4 hover:underline"
            >
              See the full comparison ↓
            </a>
          </div>
        }
      />

      {/* ── SERVICE NAV TABS — quick switcher between services ── */}
      <section className="bg-background border-t border-on-background/10 px-6 md:px-12 sticky top-0 z-20 backdrop-blur-md bg-background/80">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex overflow-x-auto -mx-2 py-1">
            {servicePackages.map((s) => {
              const isActive = s.id === activeServiceId;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveServiceId(s.id)}
                  className={`shrink-0 px-5 py-4 font-mono text-label uppercase tracking-[0.15em] border-b-2 transition-colors duration-200 ${
                    isActive
                      ? "border-accent-bright text-accent-bright"
                      : "border-transparent text-on-surface-variant hover:text-on-background"
                  }`}
                >
                  {String(s.order).padStart(2, "0")} — {s.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ACTIVE SERVICE SUMMARY — quick at-a-glance card ───── */}
      <section className="bg-background py-20 md:py-24 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-10 items-start"
          >
            <div className="col-span-12 lg:col-span-7">
              <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-3">
                {String(activeService.order).padStart(2, "0")} · {activeService.status === "available" ? "Available now" : "Rolling out Q4 2026"}
              </div>
              <h2 className="font-serif text-4xl md:text-display-md text-on-background leading-[1.05] tracking-[-0.02em] mb-4">
                {activeService.name}
              </h2>
              <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
                {activeService.tagline}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {activeService.targetCustomers.slice(0, 4).map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-surface-container text-on-surface-variant border border-on-background/10"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <MagneticButton href={`/services/${activeService.slug}`} variant="secondary" size="md">
                Read the {activeService.name} page →
              </MagneticButton>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <div className="grid grid-cols-3 gap-3">
                {activeService.tiers.map((t, i) => (
                  <div
                    key={t.name}
                    className={`rounded-lg p-5 border ${
                      i === 1 ? "border-accent-bright bg-surface-container" : "border-on-background/15 bg-surface"
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                      {t.name}
                    </div>
                    <div className="font-serif text-2xl text-on-background leading-none">
                      ${t.monthlyFeeUsd}
                      <span className="text-xs font-sans text-on-surface-variant">/mo</span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant mt-2">
                      ${t.setupFeeUsd.toLocaleString("en-US")} setup
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING MATRIX (the actual pricing sheet) ──────────── */}
      <section id="matrix" className="bg-surface-container-lowest py-24 md:py-32 px-6 md:px-12 border-t border-on-background/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16">
            <RevealText>
              <SectionLabel label="THE FULL PRICING SHEET" className="mb-8" />
            </RevealText>
            <DisplayHeading size="md" as="h2">
              All five services.{" "}
              <span className="italic text-accent-cyan">All three tiers.</span>
            </DisplayHeading>
          </div>

          <div className="space-y-16">
            {servicePackages.map((s) => (
              <PricingBlock key={s.id} service={s} />
            ))}
          </div>

          {/* Custom services block */}
          <div className="mt-20 border-t border-on-background/15 pt-12">
            <h3 className="font-serif text-2xl text-on-background mb-6">
              Custom work outside the standard five
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customServices.map((c) => (
                <div
                  key={c.name}
                  className="border border-on-background/15 rounded-lg p-6 bg-surface"
                >
                  <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-3">
                    Custom
                  </div>
                  <div className="font-serif text-xl text-on-background leading-tight mb-2">
                    {c.name}
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    Starting at ${c.startingPriceUsd.toLocaleString("en-US")}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-on-surface-variant text-sm mt-6 max-w-2xl">
              Bespoke projects are quoted per scope. We&apos;ll scope it in your free consultation.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED — managed services note ───────────── */}
      <section className="bg-background py-24 md:py-32 px-6 md:px-12 border-t border-on-background/10">
        <div className="max-w-3xl mx-auto">
          <RevealText>
            <SectionLabel label="WHAT'S INCLUDED" className="mb-8" />
          </RevealText>
          <DisplayHeading size="sm" as="h2" className="mb-8">
            <span className="italic text-accent-cyan">Every service</span> includes:
          </DisplayHeading>
          <p className="text-on-surface-variant text-lg leading-relaxed italic">
            {MANAGED_SERVICES_NOTE}
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-surface-container py-24 md:py-32 px-6 md:px-12 border-t border-on-background/10">
        <div className="max-w-3xl mx-auto text-center">
          <RevealText>
            <SectionLabel label="READY?" className="mb-8 mx-auto" />
          </RevealText>
          <DisplayHeading size="md" as="h2" className="mb-8">
            <span className="italic text-accent-cyan">Not sure which one?</span>
          </DisplayHeading>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Thirty minutes, free. We&apos;ll listen, recommend the right tier (or none), and you leave with a clearer plan.
          </p>
          <MagneticButton href="/contact" variant="primary" size="lg">
            Book a Free Consultation
          </MagneticButton>
        </div>
      </section>
    </>
  );
}

/** Pricing block per service — full feature matrix, no marketing copy. */
function PricingBlock({ service }: { service: Service }) {
  return (
    <div className="border-t border-on-background/15 pt-10">
      <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-6 mb-8">
        <div className="col-span-12 md:col-span-8">
          <div className="flex items-baseline gap-4 flex-wrap mb-2">
            <span className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright">
              {String(service.order).padStart(2, "0")}
            </span>
            <h3 className="font-serif text-3xl md:text-4xl text-on-background leading-tight tracking-[-0.02em]">
              {service.name}
            </h3>
            {service.status === "rollout" && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant border border-on-background/20 px-2 py-1 rounded-full">
                Rolling out Q4 2026
              </span>
            )}
          </div>
          <p className="text-on-surface-variant text-base leading-relaxed max-w-2xl mb-4">
            {service.tagline}
          </p>
          <Link
            href={`/services/${service.slug}`}
            className="text-sm text-accent-bright hover:underline underline-offset-4 inline-flex items-center gap-1"
          >
            Read the {service.name} page <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Tier pricing row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {service.tiers.map((t, i) => (
          <div
            key={t.name}
            className={`rounded-lg p-6 border ${
              i === 1 ? "border-accent-bright bg-surface" : "border-on-background/15 bg-surface-container"
            }`}
          >
            <div className="flex items-baseline justify-between mb-3">
              <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant">
                {t.name}
              </div>
              {i === 1 && (
                <div className="text-[10px] font-mono uppercase tracking-wider text-accent-bright">
                  Most popular
                </div>
              )}
            </div>
            <div className="font-serif text-3xl text-on-background leading-none mb-1">
              ${t.monthlyFeeUsd}
              <span className="text-sm font-sans text-on-surface-variant">/mo</span>
            </div>
            <div className="text-sm text-on-surface-variant mb-1">
              ${t.setupFeeUsd.toLocaleString("en-US")} one-time setup
            </div>
            <div className="text-xs text-on-surface-variant font-mono uppercase tracking-wider">
              {t.deliveryTime} delivery
            </div>
          </div>
        ))}
      </div>

      {/* Feature matrix (or solutions list for Automation) */}
      {service.features && service.features.length > 0 && (
        <div className="border border-on-background/15 rounded-lg overflow-hidden bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container border-b border-on-background/15">
                <th className="text-left px-5 py-4 font-mono text-label uppercase tracking-[0.15em] text-on-surface-variant">
                  Feature
                </th>
                <th className="text-center px-3 py-4 font-mono text-label uppercase tracking-[0.15em] text-on-surface-variant">
                  Basic
                </th>
                <th className="text-center px-3 py-4 font-mono text-label uppercase tracking-[0.15em] text-accent-bright">
                  Professional
                </th>
                <th className="text-center px-3 py-4 font-mono text-label uppercase tracking-[0.15em] text-on-surface-variant">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {service.features.map((f) => (
                <tr key={f.feature} className="border-b border-on-background/10 last:border-0">
                  <td className="px-5 py-3 text-on-background">{f.feature}</td>
                  <td className="text-center px-3 py-3 text-on-surface-variant">
                    {f.basic ?? <span className="text-on-background/30">—</span>}
                  </td>
                  <td className="text-center px-3 py-3 text-on-surface-variant">
                    {f.professional ?? <span className="text-on-background/30">—</span>}
                  </td>
                  <td className="text-center px-3 py-3 text-on-surface-variant">
                    {f.enterprise ?? <span className="text-on-background/30">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {service.solutions && service.solutions.length > 0 && (
        <div className="border border-on-background/15 rounded-lg overflow-hidden bg-surface p-6">
          <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-4">
            Solutions included
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {service.solutions.map((s) => (
              <div
                key={s}
                className="flex items-center gap-3 px-4 py-3 rounded-md bg-surface-container"
              >
                <span className="material-symbols-outlined text-accent-bright text-base">check_circle</span>
                <span className="text-on-background text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
