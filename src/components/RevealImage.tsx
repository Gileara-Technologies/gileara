"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useScrollProgress";

interface RevealImageProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  scale?: number; // start scale, e.g. 1.05 for "zoom out" reveal
}

/**
 * Image-style reveal. Triggers once on viewport entry.
 * Starts scaled-up slightly, fades in, settles to scale 1.
 * Respects prefers-reduced-motion.
 */
export default function RevealImage({
  children,
  className = "",
  delay = 0,
  duration = 1.0,
  scale = 1.05,
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(ref, 0.15);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
      return;
    }
    if (inView) {
      el.style.transition = `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`;
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
    }
  }, [inView, delay, duration, scale]);

  const initialStyle = {
    opacity: 0,
    transform: `scale(${scale})`,
    willChange: "opacity, transform",
  } as const;

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div style={initialStyle} className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
