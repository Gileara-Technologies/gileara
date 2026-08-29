"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";

/**
 * The Reality — asymmetric, business-outcome story with imagery.
 *
 * The left side is the narrative (cols 1-7). The right side (cols 9-12)
 * is a parallaxed photo of a small business owner in their store,
 * grounding the abstract "manual work" in a real scene.
 *
 * Below: stats block + "what changes" block.
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

          {/* Right: image + stats (cols 9-12) */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-9 relative">
            <motion.div style={{ y: visualY }}>
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-high mb-12">
                <Image
                  src="/assets/imagery/reality-msme.jpg"
                  alt="A small Ghanaian business owner with his shop signage"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, rgba(21, 32, 45, 0.05) 0%, rgba(21, 32, 45, 0.4) 100%)",
                  }}
                  aria-hidden="true"
                />
                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-surface-container-lowest/95 to-transparent">
                  <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright">
                    The real MSME
                  </div>
                </div>
              </div>

              <div className="border-t border-on-background/10 pt-8">
                <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-6">
                  The cost
                </div>
                <div className="border-t border-on-background/10 pt-8">
                  <div className="font-serif text-display-md leading-none tracking-[-0.04em] text-accent-cyan mb-4">
                    20+
                  </div>
                  <p className="text-on-surface-variant text-base leading-relaxed max-w-md mb-8">
                    hours per week, on average, that an owner loses to work a system should be doing for them.
                  </p>
                </div>
                <div className="border-t border-on-background/10 pt-8">
                  <div className="font-serif text-2xl leading-none tracking-[-0.04em] text-on-background mb-3">
                    7 days
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed max-w-md">
                    from kickoff to live system. You keep operating. We do the build.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
