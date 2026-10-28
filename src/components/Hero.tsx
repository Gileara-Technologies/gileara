"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import DashboardMock from "@/components/DashboardMock";

// ── Typewriter hook ──────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const startTimer = setTimeout(() => {
      setDisplayed("");
      setDone(false);
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);
  return { displayed, done };
}

/**
 * Hero — Operator aesthetic, brand gradient base.
 *
 * - The teal↔black brand gradient (.bg-brand) sits under a structural grid
 * - Typewriter effect on the headline's accent phrase
 * - Right column: an illustrative "systems" dashboard mock (DashboardMock),
 *   not a photo — the proof-by-photography moved to IndustryStrip right
 *   below the fold, so the Hero can say what Gileara does without relying
 *   on stock-feeling imagery to carry it
 * - Two CTAs: white fill (primary) + outline (secondary) — Vercel inversion
 * - Mono stat strip at the bottom
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const mockY = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);

  const { displayed, done } = useTypewriter("runs on.", 42, 800);

  return (
    <section ref={heroRef} className="relative min-h-screen bg-brand overflow-hidden flex flex-col">
      {/* ── Structural grid bg ──────────────────────────────────────── */}
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden="true" />

      {/* ── Content row: headline left, dashboard mock right ─────────── */}
      <div className="relative z-10 flex-1 flex items-center px-6 md:px-12 pt-28 pb-16">
        <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: headline */}
          <motion.div
            className="lg:col-span-7"
            style={{ y: contentY, opacity: contentOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-10"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] font-mono text-[11px] text-white/50 tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-bright animate-pulse" />
                Piloting in Accra, Ghana
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-display-xl text-on-background mb-6 tracking-tight"
            >
              We build the systems
              <br />
              your business{" "}
              <span className="text-accent-bright">
                {displayed}
                {!done && <span className="typewriter-cursor" aria-hidden="true" />}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="font-sans text-body-lg text-white/50 max-w-xl leading-relaxed mb-10"
            >
              Small businesses everywhere run on manual work. We build the systems that fix it — operations, sales, customer, and reporting infrastructure your business can&apos;t build alone.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-white text-black text-sm font-sans font-medium hover:bg-white/90 transition-colors duration-150"
              >
                Book a Free Consultation
                <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-white/15 text-white/80 text-sm font-sans font-medium hover:border-white/30 hover:text-white transition-colors duration-150"
              >
                See our packages
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: dashboard mock */}
          <motion.div
            className="hidden lg:block lg:col-span-5"
            style={{ y: mockY }}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <DashboardMock />
          </motion.div>
        </div>
      </div>

      {/* ── Bottom stat strip ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="relative z-10 border-t border-white/[0.06] px-6 md:px-12"
      >
        <div className="max-w-[1200px] mx-auto grid grid-cols-3">
          {[
            { value: "7 days", label: "avg. deployment" },
            { value: "24/7", label: "managed monitoring" },
            { value: "99.9%", label: "uptime SLA" },
          ].map((stat, i) => (
            <div key={stat.value} className={`py-5 pr-8 ${i < 2 ? "border-r border-white/[0.06]" : ""}`}>
              <div className="font-mono text-base text-accent-bright">{stat.value}</div>
              <div className="font-sans text-[12px] text-white/35 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
