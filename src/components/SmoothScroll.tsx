"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth-scroll wrapper. Provides a premium scroll feel
 * (the "Andela" cadence) without overpowering native browser scroll.
 * Pauses on `prefers-reduced-motion: reduce`.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    });

    lenisRef.current = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Cursor spotlight: track mouse position and update CSS custom properties
    // on the root so the .cursor-glow radial gradient follows the mouse.
    const glowEl = document.getElementById("cursor-glow");
    function handleMouseMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--cursor-x", `${x}%`);
      document.documentElement.style.setProperty("--cursor-y", `${y}%`);
      if (glowEl) {
        glowEl.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(94, 234, 212, 0.045) 0%, transparent 70%)`;
      }
    }
    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <>{children}</>;
}
