"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";

const SLIDES = [
  { src: "/assets/imagery/carousel-fashion-boutique.jpg", alt: "Customers browsing a fashion boutique in Accra", caption: "Retail" },
  { src: "/assets/imagery/carousel-flowers.jpg",          alt: "Couple browsing flowers at a market",             caption: "Hospitality" },
  { src: "/assets/imagery/carousel-sale-card.jpg",        alt: "Smiling woman holding a sale card",               caption: "Sales" },
  { src: "/assets/imagery/carousel-crate.jpg",            alt: "A man holding a crate of produce",                caption: "Distribution" },
  { src: "/assets/imagery/carousel-apron-workshop.jpg",   alt: "A man in an apron working in his workshop",       caption: "Services" },
  { src: "/assets/imagery/carousel-barber.jpg",           alt: "Barber shaving a young boy's hair",               caption: "Personal services" },
];

const ROTATE_MS = 5500;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(cb: () => void) {
  const q = window.matchMedia(REDUCED_MOTION_QUERY);
  q.addEventListener("change", cb);
  return () => q.removeEventListener("change", cb);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getReducedMotionSSR = () => false;

// ── Typewriter hook ──────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const startTimer = setTimeout(() => {
      // Reset inside the callback so it's async, not synchronous in the effect body
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
 * Hero — Terminal / Operator aesthetic.
 *
 * - Pure black bg with a grid-line overlay (structural, not decorative)
 * - Radial teal glow top-center (Vercel-style)
 * - Typewriter effect on the headline's accent phrase
 * - Two CTAs: white fill (primary) + outline (secondary) — Vercel inversion
 * - Carousel images render as a right-column photo stack (not full bleed)
 *   so the page's black base dominates, image is context not wallpaper
 * - Mono stat strip at the bottom replaces the dot controls
 */
export default function Hero() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const prefersReducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, getReducedMotionSSR);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const { displayed, done } = useTypewriter("runs on.", 42, 800);

  const stopped = !playing || paused || prefersReducedMotion;
  useEffect(() => {
    if (stopped) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [stopped]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen bg-black overflow-hidden flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Structural grid bg ──────────────────────────────────────── */}
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden="true" />

      {/* ── Radial teal glow — top center, Vercel-style ─────────────── */}
      <div
        className="absolute inset-x-0 -top-px h-[640px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(94,234,212,0.18) 0%, rgba(94,234,212,0.06) 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Image column — right side ───────────────────────────────── */}
      <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block overflow-hidden">
        <AnimatePresence mode="sync">
          {SLIDES.map((slide, i) =>
            i === index ? (
              <motion.div
                key={slide.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 1.2 }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="45vw"
                  className="object-cover"
                />
                {/* Left-edge gradient blends image into black */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, #000000 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.2) 70%, transparent 100%)",
                  }}
                  aria-hidden="true"
                />
                {/* Dark overlay for depth */}
                <div
                  className="absolute inset-0 pointer-events-none bg-black/30"
                  aria-hidden="true"
                />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* Caption chip — bottom-left of image column */}
        <div className="absolute bottom-8 left-8 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={SLIDES[index].caption}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-white/[0.08] bg-black/60 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-bright" aria-hidden="true" />
              <span className="font-mono text-[11px] text-white/60 tracking-wider uppercase">
                {SLIDES[index].caption}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide controls — dots */}
        <div className="absolute bottom-8 right-8 z-10 flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.src}
              onClick={() => { setIndex(i); setPlaying(false); }}
              aria-label={`Show ${s.caption} slide`}
              aria-current={i === index}
              className="p-1"
            >
              <motion.div
                animate={{ width: i === index ? 18 : 4, backgroundColor: i === index ? "#5EEAD4" : "rgba(255,255,255,0.25)" }}
                transition={{ duration: 0.3 }}
                className="h-[2px] rounded-full"
                style={{ width: 4 }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 pt-32 pb-24 lg:w-[58%]"
        style={prefersReducedMotion ? {} : { y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-[680px]">
          {/* Status badge — Vercel-style */}
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

          {/* Headline — JetBrains Mono at display-xl */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-display-xl text-white mb-6 tracking-tight"
          >
            We build the systems
            <br />
            your business{" "}
            <span className="text-accent-bright">
              {displayed}
              {!done && <span className="typewriter-cursor" aria-hidden="true" />}
            </span>
          </motion.h1>

          {/* Sub-copy — Inter, not mono */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="font-sans text-body-lg text-white/50 max-w-xl leading-relaxed mb-10"
          >
            Small businesses everywhere run on manual work. We build the systems that fix it — operations, sales, customer, and reporting infrastructure your business can&apos;t build alone.
          </motion.p>

          {/* CTAs — white fill + outline (Vercel inversion) */}
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
        </div>
      </motion.div>

      {/* ── Bottom stat strip ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="relative z-10 border-t border-white/[0.06] px-6 md:px-12"
      >
        <div className="max-w-[680px] lg:max-w-none grid grid-cols-3 lg:grid-cols-3 lg:w-[58%]">
          {[
            { value: "7 days", label: "avg. deployment" },
            { value: "24/7",   label: "managed monitoring" },
            { value: "99.9%",  label: "uptime SLA" },
          ].map((stat) => (
            <div key={stat.value} className="py-5 pr-8 border-r border-white/[0.06] last:border-r-0">
              <div className="font-mono text-base text-accent-bright">{stat.value}</div>
              <div className="font-sans text-[12px] text-white/35 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
