"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";

/**
 * The Reality — asymmetric, business-outcome story.
 *
 * Andela's editorial structure: oversized section number, large
 * headline, narrative paragraph on the left, visual element (or
 * typographic stat) on the right. No centered card grid.
 *
 * We layer: a "before" paragraph (the problem) and a "what changes"
 * paragraph (the outcome), separated by a horizontal rule, with a
 * large visual statistic on the right.
 */
export default function CinematicStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Subtle parallax: visual block drifts opposite the text
  const visualY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={ref}
      className="relative bg-surface-container py-32 md:py-48 px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-16">
          {/* Left: narrative (cols 1-7) */}
          <div className="col-span-12 lg:col-span-7">
            <RevealText>
              <SectionLabel number="01" label="THE REALITY" className="mb-8 md:mb-12" />
            </RevealText>

            <DisplayHeading size="lg" as="h2" className="mb-10">
              Great businesses are running on{" "}
              <span className="italic text-accent-cyan">manual work.</span>
            </DisplayHeading>

            <RevealText delay={0.15}>
              <p className="text-body-lg text-on-surface-variant leading-relaxed mb-6 max-w-2xl">
                Stock in notebooks. Orders lost in WhatsApp threads. MoMo statements matched against books by hand, line by line, night after night. No dashboard telling you what sold, what&apos;s owed, or what&apos;s actually profitable.
              </p>
            </RevealText>

            <RevealText delay={0.25}>
              <p className="text-body-lg text-on-surface-variant leading-relaxed mb-10 max-w-2xl">
                We&apos;ve seen it. We know what it costs. And we know what changes the day the right system goes live.
              </p>
            </RevealText>

            <RevealText delay={0.35}>
              <div className="border-t border-on-background/10 pt-8 max-w-2xl">
                <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-3">
                  What changes
                </div>
                <p className="text-xl md:text-2xl text-on-background font-serif leading-snug">
                  Hours back every week. Errors caught before they cost you. A single view of the business that fits in your pocket.
                </p>
              </div>
            </RevealText>
          </div>

          {/* Right: visual block (cols 9-12) — giant stat, parallaxed */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-9 relative">
            <motion.div style={{ y: visualY }} className="lg:sticky lg:top-32">
              <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-6">
                The cost
              </div>
              <div className="border-t border-on-background/10 pt-8">
                <div className="font-serif text-display-lg leading-none tracking-[-0.04em] text-accent-cyan mb-4">
                  20+
                </div>
                <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                  hours per week, on average, that an MSME owner loses to work a system should be doing.
                </p>
              </div>
              <div className="border-t border-on-background/10 pt-8 mt-10">
                <div className="font-serif text-display-md leading-none tracking-[-0.04em] text-on-background mb-4">
                  7 days
                </div>
                <p className="text-on-surface-variant text-base leading-relaxed max-w-md">
                  from kickoff to live system. You keep operating. We do the build.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
