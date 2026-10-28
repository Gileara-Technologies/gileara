"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const STEPS = [
  { num: "01", cmd: "diagnose", title: "Diagnose", desc: "We map what actually happens day to day: sales, stock, customers, cashflow. One week of observation before a single line of code." },
  { num: "02", cmd: "design",   title: "Design",   desc: "A system built around how you already work. Small customisations, not a workflow revolution. You keep running the business." },
  { num: "03", cmd: "deploy",   title: "Deploy",   desc: "Live in 7 days. Your team keeps operating while we handle the build, the migration, and the training." },
  { num: "04", cmd: "stay",     title: "Stay",     desc: "IT support, software updates, backups, security monitoring — built into the price from day one. SLA-backed." },
];

/**
 * Approach — Terminal / Operator aesthetic.
 *
 * Steps render as a command-log — each step is a "process" with a
 * command name, a mono number, and a description. The animated
 * connector line becomes a vertical terminal trace on mobile,
 * horizontal on desktop.
 */
export default function Approach() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const lineWidth = useTransform(scrollYProgress, [0, 0.9], ["0%", "100%"]);

  return (
    <section ref={ref} id="approach" className="relative bg-brand-soft border-t border-white/[0.06] py-section px-6 md:px-12">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 md:mb-20">
          <div className="lg:col-span-6">
            <div className="font-mono text-[11px] text-accent-bright tracking-widest uppercase mb-5 flex items-center gap-2">
              <span className="text-accent-bright/40">▸</span>
              how we work
            </div>
            <h2 className="font-display text-display-md text-on-background mb-5">
              Four steps. Predictable every time.
            </h2>
            <p className="font-sans text-body-lg text-white/40 leading-relaxed max-w-md">
              We&apos;ve done this enough to know what breaks. The process is fixed so you can predict exactly what you&apos;re buying.
            </p>
          </div>
        </div>

        {/* Progress line — horizontal on desktop */}
        <div className="relative mb-0">
          <div className="absolute left-0 right-0 top-[28px] h-px bg-white/[0.06] hidden md:block" aria-hidden="true" />
          <motion.div
            className="absolute left-0 top-[28px] h-px bg-accent-bright hidden md:block"
            style={{ width: lineWidth }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="group relative border-l border-white/[0.06] md:border-l-0 pl-6 md:pl-0 pb-10 md:pb-0 md:pr-8"
              >
                {/* Node dot */}
                <div
                  className="hidden md:block absolute -top-[3px] left-0 w-[7px] h-[7px] rounded-full bg-background border border-accent-bright/60 group-hover:bg-accent-bright/20 transition-colors duration-200"
                  aria-hidden="true"
                />

                <div className="md:pt-14">
                  {/* Command line */}
                  <div className="font-mono text-[11px] text-white/20 mb-4 group-hover:text-accent-bright/50 transition-colors duration-200">
                    <span className="text-accent-bright/30">$</span>{" "}run {step.cmd}
                  </div>
                  <div className="font-display text-xl text-on-background mb-3 group-hover:text-accent-bright transition-colors duration-300">
                    {step.title}
                  </div>
                  <p className="font-sans text-sm text-white/40 leading-relaxed max-w-[26ch]">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex items-start gap-3">
          <span className="font-mono text-accent-bright text-[11px] mt-0.5">✓</span>
          <p className="font-sans text-sm text-white/35 max-w-xl">
            Once it&apos;s live, it stays live. Every day after launch is covered by what you already bought. Nothing bolted on later.
          </p>
        </div>
      </div>
    </section>
  );
}
