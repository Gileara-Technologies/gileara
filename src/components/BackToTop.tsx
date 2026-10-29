"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * BackToTop — floating button with a circular scroll-progress ring.
 *
 * The ring fills clockwise as the user reads down the page, giving
 * both a "where am I" reading indicator and a satisfying visual goal
 * for the "scroll back to top" affordance.
 */
export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  // Map 0–1 scroll progress to the SVG stroke-dashoffset.
  // The circle has r=18, circumference = 2π×18 ≈ 113.1
  const CIRC = 113.1;
  const dashOffset = useTransform(scrollYProgress, [0, 1], [CIRC, 0]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[520px] w-px"
      />

      <motion.button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 16,
          pointerEvents: isVisible ? "auto" : "none",
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:bottom-8 md:right-8"
      >
        {/* SVG ring progress */}
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="rgba(216,227,245,0.12)"
            strokeWidth="1.5"
          />
          {/* Fill */}
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            stroke="#5EEAD4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>

        {/* Button face */}
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface-container/90 backdrop-blur-xl border border-on-background/15 hover:border-accent-bright hover:bg-surface-container-high transition-all duration-300">
          <span
            className="material-symbols-outlined text-base text-on-background/70 hover:text-accent-bright transition-colors duration-200"
            aria-hidden="true"
          >
            arrow_upward
          </span>
        </div>
      </motion.button>
    </>
  );
}
