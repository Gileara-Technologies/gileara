"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { scenarios, SCENARIO_STATUS_LEGEND, scenarioPackages, type ScenarioStatus } from "@/content/scenarios";

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
      ? "bg-secondary/15 dark:bg-primary/20 text-secondary dark:text-primary"
      : status === "pilot"
        ? "bg-tertiary/15 text-tertiary"
        : "bg-surface-container-high text-on-surface-variant";
  return (
    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${styles}`}>
      {status}
    </span>
  );
}

export default function HowWeTransformClient() {
  return (
    <div className="bg-background pt-36 pb-24 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Honesty-first intro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">How We Transform</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-primary dark:text-on-background leading-tight tracking-tight">
            Playbooks, not promises.
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed">
            We&apos;re new, and we won&apos;t pretend otherwise: there are no client logos on this page yet. What we have
            instead is better than borrowed credibility — exact playbooks for businesses like yours, written from our
            packages, with every outcome stated as a goal rather than a claim.
          </p>

          {/* Status legend */}
          <div className="mt-8 flex flex-col gap-2 p-5 rounded-2xl border border-outline-variant/25 dark:border-outline-variant/10 bg-surface-container dark:bg-surface-container-high">
            <span className="font-mono text-[11px] uppercase tracking-widest text-outline mb-1">Status labels</span>
            {(Object.keys(SCENARIO_STATUS_LEGEND) as ScenarioStatus[]).map((key) => (
              <div key={key} className="flex items-center gap-3 text-sm">
                <StatusChip status={key} />
                <span className="text-on-surface-variant">{SCENARIO_STATUS_LEGEND[key]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scenario grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch"
        >
          {scenarios.map((scenario) => {
            const pkgs = scenarioPackages(scenario);
            return (
              <motion.article key={scenario.id} variants={item} className="group">
                <Link
                  href={`/how-we-transform/${scenario.id}`}
                  className="flex flex-col h-full rounded-2xl p-8 bg-surface-container dark:bg-surface-container-high border border-outline-variant/25 dark:border-outline-variant/10 hover:border-primary/40 dark:hover:border-primary/30 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="material-symbols-outlined text-secondary dark:text-primary text-4xl" aria-hidden>
                      {scenario.icon}
                    </span>
                    <StatusChip status={scenario.status} />
                  </div>
                  <h2 className="font-display text-xl font-bold text-on-surface">{scenario.vertical}</h2>
                  <p className="mt-1 font-display text-lg font-semibold text-primary dark:text-on-background leading-snug">
                    {scenario.headline}
                  </p>
                  <p className="mt-4 text-sm text-on-surface-variant leading-relaxed line-clamp-3 flex-grow">
                    {scenario.painPoints[0]}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {pkgs.map((p) => (
                      <span key={p.id} className="px-2 py-0.5 rounded-md bg-secondary/10 dark:bg-primary/15 text-[11px] font-mono text-secondary dark:text-primary">
                        {p.name}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                    Read the playbook
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </motion.article>
            );
          })}

          {/* Founding-client invitation card fills the sixth cell */}
          <motion.div
            variants={item}
            className="flex flex-col justify-center rounded-2xl p-8 border border-dashed border-secondary/50 dark:border-primary/40 bg-surface-container dark:bg-surface-container-high"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-secondary dark:text-primary mb-3">
              Founding clients
            </span>
            <h2 className="font-display text-xl font-bold text-on-surface mb-3">
              Be the first real story in your vertical.
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
              One business per vertical becomes a founding client: priority onboarding and a documented transformation
              story published with your approval — when the results are real.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold teal-gradient-btn text-white dark:text-on-primary group"
            >
              Ask about it
              <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
