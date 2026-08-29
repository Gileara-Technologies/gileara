"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Service } from "@/content/packages";
import PageHero from "@/components/PageHero";
import SectionLabel from "@/components/SectionLabel";
import DisplayHeading from "@/components/DisplayHeading";
import MagneticButton from "@/components/MagneticButton";
import RevealText from "@/components/RevealText";
import { MANAGED_SERVICES_NOTE, servicePackages } from "@/content/packages";

interface ServiceLandingPageProps {
  service: Service;
}

/**
 * ServiceLandingPage — the reusable template for each of the 5
 * service landing pages (`/services/[slug]`).
 *
 * Structure (and the narrative arc):
 *   1. Hero         — page number, hero headline + accent, hero image, scroll cue
 *   2. Problems     — 4 numbered problems the business has
 *   3. Observations — 2 "what we see when we walk in" notes
 *   4. Solutions    — 3 numbered how-we-help blocks, each with an image
 *   5. Outcomes     — 3 expected results (no fabricated stats)
 *   6. Pricing      — 3-tier comparison table (full or solutions list)
 *   7. FAQ          — 3 short service-specific FAQs
 *   8. CTA          — book a consultation
 *   9. Related      — links to the other 4 services
 */
export default function ServiceLandingPage({ service }: ServiceLandingPageProps) {
  const num = String(service.order).padStart(2, "0");
  const related = servicePackages.filter((s) => s.id !== service.id);

  return (
    <>
      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <PageHero
        number={num}
        eyebrow={service.name.toUpperCase()}
        headline={
          <>
            {service.heroHeadline}{" "}
            <span className="italic text-accent-cyan">{service.heroAccent}</span>
          </>
        }
        subtitle={service.tagline}
        cta={
          <RevealText delay={0.2}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
              <MagneticButton href="/contact" variant="primary" size="lg">
                Discuss {service.name}
              </MagneticButton>
              <a
                href="#pricing"
                className="text-on-surface-variant hover:text-accent-bright font-medium transition-colors duration-200 underline-offset-4 hover:underline"
              >
                See pricing ↓
              </a>
            </div>
          </RevealText>
        }
        decoration={
          <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-[36%] max-w-[460px] aspect-[4/5] rounded-xl overflow-hidden bg-surface-container shadow-2xl">
            <Image
              src={service.heroImage}
              alt={service.heroImageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 36vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, rgba(8, 20, 32, 0.05) 0%, rgba(8, 20, 32, 0.25) 100%)",
              }}
              aria-hidden="true"
            />
          </div>
        }
      />

      {/* ── Mobile hero image (only shown on small screens) ──────── */}
      <section className="lg:hidden bg-background py-8 px-6">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-container">
          <Image
            src={service.heroImage}
            alt={service.heroImageAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* ── 2. PROBLEMS ─────────────────────────────────────────── */}
      <section className="bg-background py-32 md:py-48 px-6 md:px-12 border-t border-on-background/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel label="THE PROBLEM" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                What we hear from{" "}
                <span className="italic text-accent-cyan">businesses like yours.</span>
              </DisplayHeading>
              <RevealText delay={0.15}>
                <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                  These are the same four problems we hear, in different words, every time we talk to a business that needs {service.name.toLowerCase()}.
                </p>
              </RevealText>
            </div>
          </div>

          <div className="space-y-0 border-t border-on-background/10">
            {service.problems.map((p, i) => {
              const pn = String(i + 1).padStart(2, "0");
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-4 items-start border-b border-on-background/10 py-10"
                >
                  <div className="col-span-2 md:col-span-1 font-serif text-display-sm text-on-background/[0.15] leading-none">
                    {pn}
                  </div>
                  <div className="col-span-10 md:col-span-4">
                    <h3 className="font-serif text-2xl md:text-3xl text-on-background leading-tight tracking-[-0.02em]">
                      {p.title}
                    </h3>
                  </div>
                  <div className="col-span-12 md:col-span-7 text-on-surface-variant text-base leading-relaxed">
                    {p.description}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. OBSERVATIONS ─────────────────────────────────────── */}
      <section className="bg-surface-container py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12 mb-12">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel label="WHAT WE SEE" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                When we walk into a business{" "}
                <span className="italic text-accent-cyan">that needs this.</span>
              </DisplayHeading>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.observations.map((o, i) => (
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-surface-container-lowest rounded-xl p-10 border border-on-background/10"
              >
                <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                  Observation {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-serif text-2xl text-on-background leading-tight tracking-[-0.02em] mb-4">
                  {o.title}
                </h3>
                <p className="text-on-surface-variant text-base leading-relaxed">
                  {o.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SOLUTIONS ────────────────────────────────────────── */}
      <section className="bg-background py-32 md:py-48 px-6 md:px-12 border-y border-on-background/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12 mb-20">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel label="HOW WE HELP" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                What we build{" "}
                <span className="italic text-accent-cyan">for you.</span>
              </DisplayHeading>
              <RevealText delay={0.15}>
                <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                  Three concrete things that change the day your service goes live.
                </p>
              </RevealText>
            </div>
          </div>

          <div className="space-y-24">
            {service.howWeHelp.map((s, i) => {
              const sn = String(i + 1).padStart(2, "0");
              const flip = i % 2 === 1;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-10 items-center"
                >
                  <div className={`col-span-12 lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
                    <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                      {sn}
                    </div>
                    <h3 className="font-serif text-3xl md:text-display-sm text-on-background leading-tight tracking-[-0.02em] mb-5">
                      {s.title}
                    </h3>
                    <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
                      {s.description}
                    </p>
                  </div>
                  {s.image && (
                    <div className={`col-span-12 lg:col-span-6 ${flip ? "lg:order-1" : ""}`}>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-container">
                        <Image
                          src={s.image}
                          alt={s.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: "linear-gradient(180deg, rgba(8, 20, 32, 0.05) 0%, rgba(8, 20, 32, 0.2) 100%)",
                          }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. OUTCOMES ─────────────────────────────────────────── */}
      <section className="bg-surface-container-lowest py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12 mb-16">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel label="WHAT YOU GET" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                What to expect{" "}
                <span className="italic text-accent-cyan">after go-live.</span>
              </DisplayHeading>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {service.outcomes.map((o, i) => {
              const on = String(i + 1).padStart(2, "0");
              return (
                <motion.div
                  key={o.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="border-t-2 border-accent-bright pt-6"
                >
                  <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-3">
                    {on}
                  </div>
                  <h3 className="font-serif text-2xl text-on-background leading-tight tracking-[-0.02em] mb-3">
                    {o.label}
                  </h3>
                  <p className="text-on-surface-variant text-base leading-relaxed">
                    {o.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. PRICING ──────────────────────────────────────────── */}
      <section id="pricing" className="bg-background py-32 md:py-48 px-6 md:px-12 border-t border-on-background/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12 mb-16">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel label="PRICING" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                All-inclusive{" "}
                <span className="italic text-accent-cyan">monthly pricing.</span>
              </DisplayHeading>
              <RevealText delay={0.15}>
                <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                  Three tiers. Managed services included from day one. No hidden costs. USD pricing — pay in cedis at our published rate.
                </p>
              </RevealText>
            </div>
          </div>

          {/* Tier cards (mobile-friendly stacked) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {service.tiers.map((t, i) => (
              <div
                key={t.name}
                className={`rounded-xl p-8 border ${
                  i === 1
                    ? "border-accent-bright bg-surface-container md:scale-[1.02]"
                    : "border-on-background/15 bg-surface"
                }`}
              >
                <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-3">
                  {t.name}
                </div>
                <div className="font-serif text-display-md text-on-background leading-none tracking-[-0.03em] mb-2">
                  ${t.monthlyFeeUsd.toLocaleString("en-US")}
                  <span className="text-base font-sans text-on-surface-variant">/mo</span>
                </div>
                <div className="text-sm text-on-surface-variant mb-6">
                  ${t.setupFeeUsd.toLocaleString("en-US")} setup · {t.deliveryTime} delivery
                </div>
                {i === 1 && (
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-accent-bright mb-6">
                    Most popular
                  </div>
                )}
                <MagneticButton
                  href="/contact"
                  variant={i === 1 ? "primary" : "secondary"}
                  size="md"
                >
                  Discuss {t.name}
                </MagneticButton>
              </div>
            ))}
          </div>

          <p className="text-on-surface-variant text-sm italic max-w-2xl">{MANAGED_SERVICES_NOTE}</p>
        </div>
      </section>

      {/* ── 7. FAQ ──────────────────────────────────────────────── */}
      <ServiceFAQ faqs={service.faqs} />

      {/* ── 8. CTA ──────────────────────────────────────────────── */}
      <section className="bg-surface-container py-32 md:py-48 px-6 md:px-12 border-t border-on-background/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
            <div className="col-span-12 lg:col-span-9">
              <RevealText>
                <SectionLabel label="READY TO START?" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-10 max-w-4xl">
                Let&apos;s talk about your{" "}
                <span className="italic text-accent-cyan">{service.name.toLowerCase()}.</span>
              </DisplayHeading>
              <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed mb-12">
                Thirty minutes, free. We&apos;ll walk through your business, recommend the right tier, and answer every question. Even if you don&apos;t buy, you leave with a clearer plan.
              </p>
              <MagneticButton href="/contact" variant="primary" size="lg">
                Book a Free Consultation
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. RELATED SERVICES ─────────────────────────────────── */}
      <section className="bg-background py-32 md:py-48 px-6 md:px-12 border-t border-on-background/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-16">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel label="OTHER SERVICES" className="mb-8" />
              </RevealText>
              <DisplayHeading size="md" as="h2">
                Explore{" "}
                <span className="italic text-accent-cyan">the other four.</span>
              </DisplayHeading>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/services/${r.slug}`}
                className="group block border-t border-on-background/20 pt-6"
              >
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <h3 className="font-serif text-2xl md:text-3xl text-on-background leading-tight tracking-[-0.02em] group-hover:text-accent-bright transition-colors duration-300">
                    {r.name}
                  </h3>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-accent-bright group-hover:translate-x-1 transition-all duration-300">
                    arrow_forward
                  </span>
                </div>
                <p className="text-on-surface-variant text-base leading-relaxed max-w-xl">
                  {r.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/** FAQ accordion — short, service-specific. */
function ServiceFAQ({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="bg-background py-32 md:py-48 px-6 md:px-12 border-t border-on-background/10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <RevealText>
            <SectionLabel label="FAQ" className="mb-8" />
          </RevealText>
          <DisplayHeading size="md" as="h2">
            Questions about{" "}
            <span className="italic text-accent-cyan">this service.</span>
          </DisplayHeading>
        </div>

        <div className="space-y-0 border-t border-on-background/10">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            const num = String(i + 1).padStart(2, "0");
            return (
              <div key={f.question} className="border-b border-on-background/10">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-7 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-6 flex-1">
                    <span className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant pt-1 shrink-0 w-10">
                      {num}
                    </span>
                    <span className="font-serif text-xl md:text-2xl text-on-background leading-snug group-hover:text-accent-bright transition-colors duration-300">
                      {f.question}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant shrink-0 mt-1 transition-transform duration-300 group-hover:text-accent-bright">
                    {isOpen ? "remove" : "add"}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pl-16 pr-12 pb-8 text-on-surface-variant text-base leading-relaxed max-w-2xl">
                    {f.answer}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
