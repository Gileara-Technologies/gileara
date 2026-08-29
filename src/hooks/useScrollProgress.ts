"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useMotionValue, type MotionValue } from "framer-motion";

/**
 * Returns 0 → 1 scroll progress for the current viewport.
 * 0 = at the top of the page, 1 = at the bottom.
 *
 * Uses Framer Motion's useScroll (no GSAP dep, no jank) for simple
 * progress bars and reveal triggers. For more elaborate pinned-section
 * choreography, use GSAP/ScrollTrigger directly in the component.
 */
export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
}

/**
 * Returns a motion value 0 → 1 as the target element enters the viewport.
 * Useful for triggering animations on intersection.
 */
export function useElementScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const progress = useMotionValue(0);
  const [bounds, setBounds] = useState<{ top: number; bottom: number } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setBounds({ top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref]);

  useEffect(() => {
    if (!bounds) return;
    function onScroll() {
      const vh = window.innerHeight;
      const enter = bounds!.top - vh;
      const exit = bounds!.bottom;
      const raw = (window.scrollY - enter) / (exit - enter);
      progress.set(Math.max(0, Math.min(1, raw)));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [bounds, progress]);

  return progress;
}

/**
 * Returns true once the element has scrolled into the viewport.
 * Used to trigger one-shot reveal animations.
 */
export function useInViewOnce(ref: React.RefObject<HTMLElement | null>, threshold = 0.15): boolean {
  const [inView, setInView] = useState(false);
  const seen = useRef(false);

  useEffect(() => {
    if (!ref.current || seen.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !seen.current) {
          seen.current = true;
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return inView;
}

/** Helper: turn a motion value (0-1) into a CSS variable for transforms. */
export function useTransformVar(mv: MotionValue<number>, from: number, to: number, varName: string) {
  const transformed = useTransform(mv, [0, 1], [from, to]);
  useEffect(() => {
    return transformed.on("change", (v) => {
      document.documentElement.style.setProperty(varName, String(v));
    });
  }, [transformed, varName]);
}
