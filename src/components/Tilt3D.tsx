"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Structural CSS-3D tilt (tier 1 of the 3D-first system — zero dependencies,
 * no WebGL). Rotates the card toward the pointer, max 6°, springs back on
 * leave. Disabled for touch devices and prefers-reduced-motion.
 */
export default function Tilt3D({
  children,
  className = "",
  maxDeg = 6,
}: {
  children: ReactNode;
  className?: string;
  maxDeg?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${px * maxDeg}deg) rotateX(${-py * maxDeg}deg) translateZ(0)`;
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`will-change-transform [transform-style:preserve-3d] transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
