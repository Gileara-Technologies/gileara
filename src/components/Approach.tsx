"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";

/**
 * How We Work — numbered process steps with scroll-linked motion.
 *
 * Each step is a numbered row with a horizontal progress line that
 * fills as the row scrolls into view. The line is the connecting
 * thread — you see the whole process as a single horizontal journey.
 *
 * The connector line is the "little aspect of white" bright accent
 * — a single horizontal teal thread that ties the section together.
 */
export default function Approach() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  // Width animates from 0 to 100% as you scroll past the section
  const lineWidth = useTransform(scrollYProgress, [0, 0.7], ["0%", "100%"]);

  const steps = [
    {
      num: "01",
      title: "Diagnose",
      desc: "We map how your business actually runs — sales, stock, customers, cashflow. Not how you wish it ran.",
    },
    {
      num: "02",
      title: "Design",
      desc: "A package + customisations that fit your operations. We don't ask you to change the way you work — we meet you where you are.",
    },
    {
      num: "03",
      title: "Deploy",
      desc: "Live in 7 days. You keep operating. We handle the build, the migration, the training.",
    },
    {
      num: "04",
      title: "Manage",
      desc: "We monitor, fix, and improve. Monthly. Backups, security, support — included from day one.",
    },
  ];

  return (
    <section ref={ref} id="approach" className="relative bg-surface-container py-32 md:py-48 px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20 md:mb-28">
          <div className="col-span-12 lg:col-span-7">
            <RevealText>
              <SectionLabel number="03" label="HOW WE WORK" className="mb-8" />
            </RevealText>
            <DisplayHeading size="lg" as="h2" className="mb-8">
              How we work{" "}
              <span className="italic text-accent-cyan">with you.</span>
            </DisplayHeading>
            <RevealText delay={0.15}>
              <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                A predictable, four-step engagement. We&apos;ve done this enough times to know what works — and what to avoid.
              </p>
            </RevealText>
          </div>
        </div>

        {/* Numbered list with horizontal connector line */}
        <div className="relative">
          {/* Background track */}
          <div className="absolute left-0 right-0 top-[60px] md:top-[72px] h-px bg-on-background/10 hidden md:block" aria-hidden="true" />
          {/* Animated bright line */}
          <motion.div
            className="absolute left-0 top-[60px] md:top-[72px] h-px bg-accent-bright hidden md:block"
            style={{ width: lineWidth }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-16 md:gap-y-0 md:gap-x-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Dot on the line */}
                <div className="hidden md:block absolute -top-px left-0 w-2 h-2 rounded-full bg-accent-bright" style={{ left: 0, transform: "translateY(-3px)" }} aria-hidden="true" />
                <div className="font-serif text-display-sm text-on-background/[0.15] leading-none mb-6">
                  {step.num}
                </div>
                <h3 className="font-serif text-3xl text-on-background leading-tight tracking-[-0.02em] mb-3">
                  {step.title}
                </h3>
                <p className="text-on-surface-variant text-base leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom strip — managed services reminder */}
        <RevealText delay={0.4}>
          <div className="mt-24 pt-8 border-t border-on-background/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-on-surface-variant text-base">
              <span className="text-on-background font-medium">Every package includes managed services from day one</span> — IT support, backups, security monitoring, SLA support. No hidden costs.
            </p>
          </div>
        </RevealText>
      </div>
    </section>
  );
}
