"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useScrollProgress";

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "h4" | "span";
}

/**
 * Fade + slide-up reveal. Triggers once when the element scrolls into
 * the viewport. Uses CSS transitions (no GSAP dep, no jank) for the
 * simple case; for advanced choreography use GSAP directly in the
 * component.
 *
 * Respects `prefers-reduced-motion: reduce` — the element is visible
 * from the start and does not animate.
 */
export default function RevealText({
  children,
  className = "",
  delay = 0,
  y = 24,
  duration = 0.7,
  as: Tag = "div",
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(ref, 0.2);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    if (inView) {
      el.style.transition = `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  }, [inView, delay, duration]);

  const initialStyle = {
    opacity: 0,
    transform: `translateY(${y}px)`,
    willChange: "opacity, transform",
  } as const;

  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement & HTMLParagraphElement & HTMLHeadingElement>} className={className} style={initialStyle}>
      {children}
    </Tag>
  );
}
