"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import DisplayHeading from "@/components/DisplayHeading";
import RevealText from "@/components/RevealText";

const BENEFITS = [
  "Spreadsheets → live data",
  "Chat threads → one inbox",
  "Lost leads → followed up",
];

/**
 * CinematicStory — the reality section.
 *
 * Visual upgrades:
 * - A second, faster parallax layer on the stats numbers (numbers drift
 *   at a different rate from the image for a sense of depth stacking)
 * - The stat number uses the full display-lg scale for maximum drama
 * - An ambient warm glow on the image corner to reinforce the teal brand
 * - The "What changes" benefits use a staggered entrance
 * - The background gets a very subtle diagonal gradient to break the flat
 *   surface-container colour
 */
export default function CinematicStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Portrait parallax
  const visualY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  // Stats drift a bit faster — depth layering
  const statsY = useTransform(scrollYProgress, [0, 1], [40, -20]);

  return (
    <section
      ref={ref}
      className="relative bg-surface-container py-section-tight px-6 md:px-12 overflow-hidden"
    >
      {/* Diagonal gradient overlay to break the flat background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(94,234,212,0.04) 0%, transparent 50%, rgba(8,20,32,0.15) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Corner glow — upper left */}
      <div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(94,234,212,0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-16">
          {/* Left: narrative (cols 1-7) */}
          <div className="col-span-12 lg:col-span-7">
            <DisplayHeading size="lg" as="h2" className="mb-10">
              Great businesses are running on{" "}
              <span className="italic text-accent-bright">manual work.</span>
            </DisplayHeading>

            <RevealText delay={0.15}>
              <p className="text-body-lg text-on-surface-variant leading-relaxed mb-6 max-w-2xl">
                Stock in notebooks. Orders lost in chat threads. Payment alerts matched against books by hand, line by line, night after night. No dashboard telling you what sold, what&apos;s owed, or what&apos;s actually profitable.
              </p>
            </RevealText>

            <RevealText delay={0.25}>
              <p className="text-body-lg text-on-surface-variant leading-relaxed mb-10 max-w-2xl">
                We&apos;ve seen it up close. We know what it takes to fix it, and what changes the day the right system goes live.
              </p>
            </RevealText>

            <RevealText delay={0.35}>
              <div className="border-t border-on-background/10 pt-8 max-w-2xl">
                <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                  What changes
                </div>
                <ul className="space-y-4 mb-8">
                  {BENEFITS.map((benefit, i) => (
                    <motion.li
                      key={benefit}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-start gap-3 text-on-background text-base"
                    >
                      <span
                        className="material-symbols-outlined text-accent-bright text-lg shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
                <p className="text-xl md:text-2xl text-on-background font-serif leading-snug">
                  You get hours back every week. Errors get caught before they hurt you, and the whole business shows up in one view that fits in your pocket.
                </p>
              </div>
            </RevealText>
          </div>

          {/* Right: image + stats (cols 9-12) */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-9 relative">
            {/* Portrait — parallax layer 1 */}
            <motion.div style={{ y: visualY }}>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface-container-high mb-12">
                <Image
                  src="/assets/imagery/reality-msme.jpg"
                  alt="A small Ghanaian business owner with his shop signage"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                {/* Cinematic gradient */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(8,20,32,0.0) 0%, rgba(8,20,32,0.5) 75%, rgba(8,20,32,0.9) 100%)",
                  }}
                  aria-hidden="true"
                />
                {/* Teal corner accent */}
                <div
                  className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 0% 100%, rgba(94,234,212,0.18) 0%, transparent 70%)",
                  }}
                  aria-hidden="true"
                />
                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright">
                    The real MSME
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats — parallax layer 2 (slightly different rate) */}
            <motion.div style={{ y: statsY }}>
              <div className="border-t border-on-background/10 pt-8">
                <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-6">
                  The pattern
                </div>

                {/* Stat 1 — big display number */}
                <div className="border-t border-on-background/10 pt-8 mb-0">
                  <div className="font-serif text-display-lg leading-none tracking-[-0.04em] text-accent-bright mb-3">
                    20+
                  </div>
                  <p className="text-on-surface-variant text-base leading-relaxed max-w-xs mb-8">
                    hours per week, on average, that an owner loses to work a system should be doing for them.
                  </p>
                </div>

                {/* Stat 2 */}
                <div className="border-t border-on-background/10 pt-8">
                  <div className="font-serif text-display-md leading-none tracking-[-0.04em] text-on-background mb-3">
                    7 days
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
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
