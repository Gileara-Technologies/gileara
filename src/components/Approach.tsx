"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";

/**
 * How We Work — numbered process steps with photography and connector line.
 *
 * Visual upgrades:
 * - Step cards now sit on a subtle raised surface (bg-surface-container-low)
 *   on hover with a teal left-border flash — tactile, not flat
 * - The progress line is thicker and animated to the full width instead of
 *   70%, finishing the thought rather than stopping mid-way
 * - The image gets a parallax treatment matching CinematicStory
 * - Numbers are slightly larger and hover to accent-bright
 */
export default function Approach() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const lineWidth = useTransform(scrollYProgress, [0, 0.85], ["0%", "100%"]);

  // Image parallax
  const imgScrollYProgress = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  }).scrollYProgress;
  const imgY = useTransform(imgScrollYProgress, [0, 1], [40, -40]);

  const steps = [
    {
      num: "01",
      title: "Diagnose",
      desc: "We map what actually happens day to day: sales, stock, customers, cashflow.",
    },
    {
      num: "02",
      title: "Design",
      desc: "A system with small customisations that fit your operations. You keep working the way you already do; we build around it.",
    },
    {
      num: "03",
      title: "Deploy",
      desc: "Live in 7 days. Your team keeps running the business while we handle the build, the migration, and the training.",
    },
    {
      num: "04",
      title: "Stay with you",
      desc: "We monitor, fix, and improve every day. Backups, security, and real support come as standard.",
    },
  ];

  return (
    <section
      ref={ref}
      id="approach"
      className="relative bg-surface-container py-section px-6 md:px-12 overflow-hidden"
    >
      {/* Decorative radial glow — bottom right */}
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(94,234,212,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Header + image */}
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12 mb-20 md:mb-28">
          {/* Header — cols 1-7 */}
          <div className="col-span-12 lg:col-span-7">
            <RevealText>
              <SectionLabel label="HOW WE WORK" className="mb-8" />
            </RevealText>
            <DisplayHeading size="lg" as="h2" className="mb-8">
              How we work{" "}
              <span className="italic text-accent-bright">with you.</span>
            </DisplayHeading>
            <RevealText delay={0.15}>
              <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                A predictable, four-step engagement. We&apos;ve done this enough times to know what works and what to avoid.
              </p>
            </RevealText>
          </div>

          {/* Image — cols 9-12 */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-9">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container-high">
              <motion.div className="absolute inset-0" style={{ y: imgY }}>
                <Image
                  src="/assets/imagery/howwework-team.jpg"
                  alt="Diverse colleagues collaborating in an office"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover scale-[1.08]"
                />
              </motion.div>
              {/* Teal edge glow */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(94,234,212,0.12)",
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Steps with connector line */}
        <div className="relative">
          {/* Track */}
          <div
            className="absolute left-0 right-0 top-[68px] md:top-[80px] h-[1.5px] bg-on-background/10 hidden md:block"
            aria-hidden="true"
          />
          {/* Fill */}
          <motion.div
            className="absolute left-0 top-[68px] md:top-[80px] h-[1.5px] bg-accent-bright hidden md:block"
            style={{ width: lineWidth }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-16 md:gap-y-0 md:gap-x-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                {/* Dot on the connector */}
                <div
                  className="hidden md:block absolute -top-[4.5px] left-0 w-3 h-3 rounded-full bg-accent-bright ring-4 ring-surface-container transition-transform duration-300 group-hover:scale-125"
                  aria-hidden="true"
                />

                {/* Step card — subtle lift on hover */}
                <div className="md:pt-14 transition-all duration-300">
                  <div className="font-serif text-display-sm text-on-background/[0.12] group-hover:text-accent-bright/60 leading-none mb-6 transition-colors duration-400">
                    {step.num}
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-on-background leading-tight tracking-[-0.02em] mb-3 group-hover:text-accent-bright transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-on-surface-variant text-base leading-relaxed max-w-[28ch]">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing statement */}
        <RevealText delay={0.4}>
          <div className="mt-24 pt-8 border-t border-on-background/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-on-surface-variant text-base max-w-xl leading-relaxed">
              <span className="text-on-background font-medium">Once it&apos;s live, it stays live</span>. Every day after launch is covered by what you already bought. Nothing bolted on later.
            </p>
          </div>
        </RevealText>
      </div>
    </section>
  );
}
