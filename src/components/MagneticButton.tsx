"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
  showArrow?: boolean;
}

const variantClasses: Record<NonNullable<MagneticButtonProps["variant"]>, string> = {
  primary:
    "bg-accent-bright text-background hover:bg-accent-bright/90 hover:text-background shadow-[0_0_0_0_rgba(94,234,212,0)] hover:shadow-[0_0_32px_rgba(94,234,212,0.35)] transition-shadow",
  secondary:
    "border border-on-background/20 text-on-background hover:border-accent-bright hover:text-accent-bright",
  ghost:
    "text-on-surface-variant hover:text-accent-bright",
};

const sizeClasses: Record<NonNullable<MagneticButtonProps["size"]>, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "pl-6 pr-12 py-3.5 text-base",
  lg: "pl-8 pr-14 py-4 text-lg",
};

/** Next's Link, wrapped so Framer Motion can drive it with motion values. */
const MotionLink = motion.create(Link);

/**
 * Andela-style pill button with subtle magnetic hover.
 * - Pill shape (rounded-pill)
 * - Asymmetric horizontal padding so the arrow has its own "lane"
 * - On hover near the button, the button drifts toward the cursor (magnetic)
 * - Variants: primary (bright accent), secondary (outline), ghost (text only)
 * - Motion: the pointer offset lives in motion values, so moving the mouse
 *   writes straight to the DOM transform instead of re-rendering React on
 *   every event, and the drift is skipped under `prefers-reduced-motion`
 *   (the button then stays perfectly still).
 */
export default function MagneticButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  external = false,
  showArrow = true,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMove = (e: { clientX: number; clientY: number }) => {
    if (prefersReducedMotion) return;
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Same 300 ms ease-out the previous inline transform string carried.
  const style = {
    x,
    y,
    transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
  };

  const baseClass = `group inline-flex items-center justify-center rounded-pill font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const arrow = showArrow ? (
    <span className="ml-6 inline-block transition-transform duration-300 group-hover:translate-x-1.5">
      <span className="material-symbols-outlined align-middle text-xl">arrow_forward</span>
    </span>
  ) : null;

  if (external) {
    return (
      <motion.a
        ref={btnRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        style={style}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
        {arrow}
      </motion.a>
    );
  }

  return (
    <MotionLink
      ref={btnRef as React.RefObject<HTMLAnchorElement>}
      href={href}
      className={baseClass}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      {arrow}
    </MotionLink>
  );
}
