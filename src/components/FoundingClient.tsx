"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import MagneticButton from "@/components/MagneticButton";

/**
 * FoundingClient — full-bleed dark section with photography.
 *
 * Visual upgrades:
 * - Photo now has a parallax (drifts slowly as you scroll through the section)
 * - The teal glow is now a stronger, shifted ellipse that creates atmospheric
 *   depth rather than a simple corner radial
 * - A thin horizontal rule with a teal gradient anchors the visual weight at
 *   the top of the section
 * - The stat (one per vertical) is rendered as a display number
 */
export default function FoundingClient() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const contentY = useTransform(scrollYProgress, [0, 1], [20, -10]);

  return (
    <section
      ref={ref}
      aria-labelledby="founding-clients-heading"
      className="relative bg-brand-soft border-t border-white/[0.06] py-section-tight px-6 md:px-12 overflow-hidden"
    >

      {/* Background photo with parallax */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <div className="absolute inset-0 opacity-25">
            <Image
              src="/assets/imagery/founding-founders.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover scale-[1.15]"
            />
          </div>
        </motion.div>
        <div className="absolute inset-0 bg-surface-container-lowest/82" />
      </div>

      {/* Atmospheric teal glow — shifted upward so it bleeds into the image */}
      <div
        className="absolute top-0 right-0 w-[800px] h-[600px] pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 100% 0%, rgba(94,234,212,0.16) 0%, rgba(94,234,212,0.05) 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />
      {/* Secondary subtle glow — lower left, for depth */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[400px] pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(ellipse at 0% 100%, rgba(94,234,212,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <motion.div className="max-w-[1440px] mx-auto relative z-10" style={{ y: contentY }}>
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
          <div className="col-span-12 lg:col-span-9">
            {/* Eyebrow */}
            <div className="font-mono text-[11px] text-accent-bright tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="text-accent-bright/40">▸</span>
              founding clients
            </div>

            <h2 id="founding-clients-heading" className="font-display text-display-md text-on-background mb-8 max-w-2xl">
              One business per vertical gets founder-level attention.
            </h2>

            <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-8 mb-14">
              <div className="col-span-12 md:col-span-7 font-sans text-body-lg text-white/40 leading-relaxed max-w-2xl">
                <p>
                  As we launch, we&apos;re taking a limited set of founding clients, one per vertical. You get priority onboarding and direct founder involvement. In return, we document your transformation story and publish it with your approval when the results are real.
                </p>
              </div>
              <div className="col-span-12 md:col-span-4 md:col-start-9">
                <div className="border-t border-white/[0.08] pt-6">
                  <div className="font-mono text-display-sm text-accent-bright leading-none mb-2">
                    5
                  </div>
                  <div className="font-mono text-[11px] text-white/30 tracking-widest uppercase mb-3">
                    verticals open
                  </div>
                  <p className="font-sans text-white/35 text-sm leading-relaxed max-w-[30ch]">
                    No discounts. Founding means more attention at the standard price.
                  </p>
                </div>
              </div>
            </div>

            <MagneticButton href="/contact" variant="primary" size="lg">
              Ask about a founding slot
            </MagneticButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
