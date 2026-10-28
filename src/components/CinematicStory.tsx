"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const PROBLEMS = [
  { id: "01", label: "inventory",    text: "Stock tracked in notebooks. You find out you're out of something when a customer tells you." },
  { id: "02", label: "orders",       text: "Orders arrive through three different chat threads. Something always gets missed." },
  { id: "03", label: "payments",     text: "Mobile money alerts matched against sales manually, late at night, by the owner." },
  { id: "04", label: "visibility",   text: "No dashboard. You can't tell what sold today, what's owed, or what's actually profitable." },
];

/**
 * CinematicStory — Terminal / Operator aesthetic.
 *
 * Four problem cards in a 2×2 op-card grid, each styled like a
 * dashboard panel with a mono identifier and a short, punchy description.
 * An image on the right anchors the abstract in a real scene.
 * Below: a "what changes" output block — styled like terminal diff output.
 */
export default function CinematicStory() {
  const ref = useRef<HTMLElement>(null);

  const CHANGES = [
    { from: "spreadsheets",   to: "live data dashboard" },
    { from: "chat threads",   to: "one unified inbox" },
    { from: "lost leads",     to: "automated follow-up" },
    { from: "manual matching",to: "instant reconciliation" },
  ];

  return (
    <section ref={ref} className="relative bg-brand-soft-alt border-t border-white/[0.06] py-section-tight px-6 md:px-12">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

          {/* Left: problems + changes */}
          <div className="lg:col-span-7">
            {/* Section label */}
            <div className="font-mono text-[11px] text-accent-bright tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="text-accent-bright/40">▸</span>
              the problem
            </div>

            <h2 className="font-display text-display-md text-on-background mb-3 max-w-xl">
              Great businesses running on manual work.
            </h2>
            <p className="font-sans text-body-lg text-white/40 mb-10 max-w-xl leading-relaxed">
              We&apos;ve seen it up close. The owner is the system — the only person who knows where everything is, what&apos;s been paid, and what&apos;s next.
            </p>

            {/* Problem cards — 2×2 op-card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
              {PROBLEMS.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="op-card rounded-lg p-5"
                >
                  <div className="font-mono text-[10px] text-accent-bright/50 tracking-widest uppercase mb-3">
                    {p.id} · {p.label}
                  </div>
                  <p className="font-sans text-sm text-white/55 leading-relaxed">
                    {p.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Terminal diff — what changes */}
            <div className="rounded-lg border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
              {/* Terminal chrome */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06]">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="ml-2 font-mono text-[11px] text-white/20">{"what changes on day one"}</span>
              </div>
              <div className="p-4 space-y-2">
                {CHANGES.map((c, i) => (
                  <motion.div
                    key={c.from}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                    className="flex items-center gap-3 font-mono text-sm"
                  >
                    <span className="text-red-400/60">- {c.from}</span>
                    <span className="text-white/20">→</span>
                    <span className="text-accent-bright/80">+ {c.to}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: photo + stat */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-white/[0.06]">
              <Image
                src="/assets/imagery/reality-msme.jpg"
                alt="A small Ghanaian business owner"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover grayscale opacity-70"
              />
              {/* Tint */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8) 100%)" }}
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="font-mono text-[10px] text-accent-bright/60 tracking-widest uppercase mb-1">
                  the real MSME
                </div>
                <p className="font-sans text-xs text-white/40">Accra, Ghana · 2024</p>
              </div>
            </div>

            {/* Key stat */}
            <div className="op-card rounded-lg p-6">
              <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-3">
                {"// measured"}
              </div>
              <div className="font-mono text-4xl text-accent-bright mb-2">20+</div>
              <p className="font-sans text-sm text-white/40 leading-relaxed">
                hours per week an owner loses to work a system should be doing.
              </p>
              <div className="mt-5 pt-4 border-t border-white/[0.06] font-mono text-[11px] text-white/25">
                7 days from kickoff → live system
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
