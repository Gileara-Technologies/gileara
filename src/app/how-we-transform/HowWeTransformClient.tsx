"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { scenarios, SCENARIO_STATUS_LEGEND, scenarioPackages, type ScenarioStatus } from "@/content/scenarios";
import PageHero from "@/components/PageHero";
import ContactBand from "@/components/ContactBand";
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

function StatusChip({ status }: { status: ScenarioStatus }) {
  const styles =
    status === "case-study"
      ? "border-accent-bright text-accent-bright"
      : status === "pilot"
        ? "border-accent-cyan text-accent-cyan"
        : "border-on-background/20 text-on-surface-variant";
  return (
    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${styles}`}>
      {status}
    </span>
  );
}

export default function HowWeTransformClient() {
  return (
    <div className="bg-background">
      <PageHero
        number="01"
        eyebrow="HOW WE TRANSFORM"
        headline={
          <>
            Playbooks, not{" "}
            <span className="italic text-accent-cyan">promises.</span>
          </>
        }
        subtitle="We're new, and we won't pretend otherwise: there are no client logos on this page yet. What we have instead is better than borrowed credibility — exact playbooks for businesses like yours, written from our packages, with every outcome stated as a goal rather than a claim."
      />

      {/* Status legend */}
      <section className="bg-background py-16 px-6 md:px-12 border-t border-on-background/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            {(Object.keys(SCENARIO_STATUS_LEGEND) as ScenarioStatus[]).map((key) => (
              <div key={key} className="flex items-start gap-3 border-t border-on-background/10 pt-5">
                <StatusChip status={key} />
                <span className="text-on-surface-variant text-sm leading-relaxed">
                  {SCENARIO_STATUS_LEGEND[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scenario grid */}
      <section className="bg-surface-container py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <RevealText>
            <SectionLabel number="02" label="VERTICAL PLAYBOOKS" className="mb-10" />
          </RevealText>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16 items-stretch"
          >
            {scenarios.map((scenario, i) => {
              const pkgs = scenarioPackages(scenario);
              const num = String(i + 1).padStart(2, "0");
              return (
                <motion.article key={scenario.id} variants={item} className="group h-full">
                  <Link
                    href={`/how-we-transform/${scenario.id}`}
                    className="flex flex-col h-full"
                  >
                    {scenario.image && (
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-6 bg-surface-container-high">
                        <Image
                          src={scenario.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright">
                        {num}
                      </span>
                      <StatusChip status={scenario.status} />
                    </div>
                    <h2 className="font-serif text-2xl text-on-background leading-tight tracking-[-0.02em] group-hover:text-accent-bright transition-colors duration-300">
                      {scenario.vertical}
                    </h2>
                    <p className="mt-2 text-on-surface-variant text-base leading-snug font-medium">
                      {scenario.headline}
                    </p>
                    <p className="mt-4 text-on-surface-variant text-sm leading-relaxed line-clamp-3 flex-grow">
                      {scenario.painPoints[0]}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {pkgs.map((p) => (
                        <span key={p.id} className="px-2.5 py-1 rounded-full bg-background/60 text-on-surface-variant text-[10px] font-mono uppercase tracking-wider border border-on-background/10">
                          {p.name}
                        </span>
                      ))}
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-accent-bright text-sm font-medium">
                      Read the playbook
                      <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">arrow_forward</span>
                    </span>
                  </Link>
                </motion.article>
              );
            })}

            {/* Founding-client invitation card fills the last cell */}
            <motion.div
              variants={item}
              className="flex flex-col justify-center border-t border-on-background/20 pt-8 md:border-t-0 md:border-l md:pl-12 md:pt-0"
            >
              <span className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                Founding clients
              </span>
              <h2 className="font-serif text-2xl text-on-background leading-tight tracking-[-0.02em] mb-4">
                Be the first real story in your vertical.
              </h2>
              <p className="text-on-surface-variant text-base leading-relaxed mb-6">
                One business per vertical becomes a founding client: priority onboarding and a documented transformation story published with your approval — when the results are real.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center pl-6 pr-10 py-3 rounded-pill bg-accent-bright text-background font-medium hover:bg-accent-cyan transition-colors duration-300 w-fit"
              >
                Ask about it
                <span className="ml-4 material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">arrow_forward</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* In-page contact band — placed just above the footer.
         The founding-client card above already covers the contact ask;
         this band is the universal channel row (book, email, phone/WhatsApp). */}
      <ContactBand
        eyebrow="GET IN TOUCH"
        headline={
          <>
            Let&apos;s build your{" "}
            <span className="italic text-accent-cyan">playbook</span> together.
          </>
        }
        body="If you run a pharmacy, school, restaurant, salon, or retail store — we'd like to write your transformation story together."
      />
    </div>
  );
}
