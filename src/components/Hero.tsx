"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import DisplayHeading from "@/components/DisplayHeading";
import MagneticButton from "@/components/MagneticButton";
import RevealText from "@/components/RevealText";

const SLIDES = [
  {
    src: "/assets/imagery/carousel-fashion-boutique.jpg",
    alt: "Customers browsing a fashion boutique in Accra",
    caption: "Retail",
    region: "Accra, Ghana",
  },
  {
    src: "/assets/imagery/carousel-flowers.jpg",
    alt: "Couple browsing flowers at a market",
    caption: "Hospitality",
    region: "West Africa",
  },
  {
    src: "/assets/imagery/carousel-sale-card.jpg",
    alt: "Smiling woman holding a sale card to inform customers",
    caption: "Sales",
    region: "Emerging Markets",
  },
  {
    src: "/assets/imagery/carousel-crate.jpg",
    alt: "A man holding a crate of produce",
    caption: "Distribution",
    region: "Supply Chain",
  },
  {
    src: "/assets/imagery/carousel-apron-workshop.jpg",
    alt: "A man in an apron working in his workshop",
    caption: "Services",
    region: "Trade & Craft",
  },
  {
    src: "/assets/imagery/carousel-barber.jpg",
    alt: "Barber shaving a young boy's hair",
    caption: "Personal services",
    region: "Community",
  },
];

const ROTATE_MS = 5000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
function getReducedMotionOnServer() {
  return false;
}

/**
 * Hero — full-bleed immersive carousel.
 *
 * Upgrades over the original:
 * - Dramatic multi-layer gradient with a teal radial glow at bottom-left
 *   so the accent colour bleeds into the scene.
 * - Slide counter (active / total) rendered in mono — a cinematic touch.
 * - Parallax content: the text block drifts up slightly as the visitor
 *   scrolls, creating depth and the sense of peeling off the image.
 * - "Scroll to explore" prompt with a bouncing arrow that fades once
 *   the visitor starts scrolling.
 * - Animated pill progress bar replaces the simple dot strip.
 */
export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer
  );

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // Content rises as user scrolls — parallax pull-through
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  // Image very subtly scales up as it exits (Ken Burns on scroll)
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const stopped = !playing || paused || prefersReducedMotion;

  useEffect(() => {
    if (stopped) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [stopped]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) setHasScrolled(true);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    setPaused(false);
    setPlaying(true);
  };

  const selectSlide = (i: number) => {
    setIndex(i);
    setPlaying(false);
  };

  const current = SLIDES[index];

  return (
    <section
      ref={heroRef}
      className="relative flex items-center bg-background overflow-hidden"
      style={{ minHeight: "100dvh" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* ── Background carousel ──────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          {SLIDES.map(
            (slide, i) =>
              i === index && (
                <motion.div
                  key={slide.src}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  aria-hidden={i !== index}
                >
                  <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Three-layer gradient for extreme text legibility + mood */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: [
                        // Left-edge darkening
                        "linear-gradient(90deg, rgba(8,20,32,0.6) 0%, transparent 55%)",
                        // Bottom darkening (text sits over bottom-left)
                        "linear-gradient(0deg, rgba(8,20,32,0.98) 0%, rgba(8,20,32,0.7) 30%, rgba(8,20,32,0.35) 60%, rgba(8,20,32,0.15) 100%)",
                        // Teal atmospheric bleed from bottom-left
                        "radial-gradient(ellipse 50% 40% at 15% 90%, rgba(94,234,212,0.12) 0%, transparent 70%)",
                      ].join(", "),
                    }}
                    aria-hidden="true"
                  />
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* ── Main content — parallax on scroll ──────────────────────────── */}
      <motion.div
        className="relative z-10 w-full pt-36 pb-40 px-6 md:px-12"
        style={prefersReducedMotion ? {} : { y: textY, opacity: textOpacity }}
      >
        <div className="max-w-[1440px] mx-auto">
          {/* Slide counter — mono, cinematic */}
          <motion.div
            key={`counter-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-label tracking-[0.2em] text-on-background/50 mb-8 flex items-center gap-3"
            aria-hidden="true"
          >
            <span className="text-accent-bright">{String(index + 1).padStart(2, "0")}</span>
            <span className="w-8 h-px bg-on-background/30" />
            <span>{String(SLIDES.length).padStart(2, "0")}</span>
          </motion.div>

          <div className="max-w-4xl">
            <DisplayHeading size="xl" as="h1" className="mb-8 md:mb-10 text-on-background">
              We build the systems{" "}
              <br className="hidden md:block" />
              your business{" "}
              <span className="italic text-accent-bright">runs on.</span>
            </DisplayHeading>

            <RevealText delay={0.2}>
              <p className="text-body-lg md:text-2xl text-on-background/80 max-w-2xl leading-relaxed font-sans mb-10 md:mb-12">
                Small businesses everywhere run on manual work. We build the systems that fix it, piloting in Ghana.
              </p>
            </RevealText>

            <RevealText delay={0.35}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <MagneticButton href="/contact" variant="primary" size="md">
                  Book a Free Consultation
                </MagneticButton>
                <MagneticButton href="/how-we-transform" variant="secondary" size="md" showArrow={false}>
                  See how it works
                </MagneticButton>
              </div>
            </RevealText>
          </div>
        </div>
      </motion.div>

      {/* ── Bottom bar: caption, region, controls ─────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-12 pb-8">
        <div className="max-w-[1440px] mx-auto">
          {/* Slim divider */}
          <div className="h-px bg-on-background/10 mb-6" />

          <div className="flex items-center justify-between gap-6">
            {/* Caption + region */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.caption}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:flex items-center gap-6"
              >
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-bright shrink-0" />
                  <span className="font-mono text-label uppercase tracking-[0.2em] text-on-background">
                    {current.caption}
                  </span>
                </div>
                <span className="text-on-background/30 text-xs font-mono">/</span>
                <span className="font-mono text-label text-on-background/50 tracking-widest">
                  {current.region}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Controls: play/pause + progress pills */}
            <div className="flex items-center gap-4 ml-auto">
              {!prefersReducedMotion && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                  className="flex h-10 w-10 items-center justify-center text-on-background/60 hover:text-accent-bright transition-colors duration-200"
                >
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    {playing ? "pause" : "play_arrow"}
                  </span>
                </button>
              )}

              {/* Progress pills — wider for active, dots for inactive */}
              <div className="flex items-center gap-2">
                {SLIDES.map((slide, i) => (
                  <button
                    key={slide.src}
                    onClick={() => selectSlide(i)}
                    aria-label={`Show ${slide.caption} slide`}
                    aria-current={i === index}
                    className="group flex items-center py-3"
                  >
                    <motion.span
                      animate={{
                        width: i === index ? 28 : 6,
                        height: i === index ? 3 : 3,
                        backgroundColor: i === index ? "#5EEAD4" : "rgba(216,227,245,0.3)",
                      }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="block rounded-full"
                      style={{ minWidth: 6 }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator — fades once user scrolls ──────────────── */}
      <AnimatePresence>
        {!hasScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="absolute bottom-24 right-6 md:right-12 z-10 flex flex-col items-center gap-2"
            aria-hidden="true"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-on-background/40 rotate-90 origin-center translate-x-6 mb-2">
              scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-5 h-5 text-on-background/40"
            >
              <span className="material-symbols-outlined text-base">arrow_downward</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
