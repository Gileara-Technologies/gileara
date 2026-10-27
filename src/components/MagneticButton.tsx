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

/**
 * MagneticButton — Terminal / Operator aesthetic.
 *
 * Primary: white fill on black (Vercel-style inversion).
 * Secondary: 1px border, transparent bg.
 * Ghost: text only.
 *
 * Keeps the magnetic hover behaviour from before.
 */
const variantClasses: Record<NonNullable<MagneticButtonProps["variant"]>, string> = {
  primary:   "bg-white text-black hover:bg-white/90",
  secondary: "border border-white/15 text-white/70 hover:border-white/30 hover:text-white",
  ghost:     "text-white/50 hover:text-white",
};

const sizeClasses: Record<NonNullable<MagneticButtonProps["size"]>, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const MotionLink = motion.create(Link);

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
    x.set((e.clientX - rect.left - rect.width / 2) * 0.12);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.12);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  const style = { x, y, transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)" };

  const baseClass = `inline-flex items-center justify-center rounded-md font-sans font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-bright focus-visible:ring-offset-1 focus-visible:ring-offset-black ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const arrow = showArrow ? (
    <span className="ml-2 inline-block material-symbols-outlined align-middle text-base transition-transform duration-200 group-hover:translate-x-0.5">
      arrow_forward
    </span>
  ) : null;

  if (external) {
    return (
      <motion.a ref={btnRef} href={href} target="_blank" rel="noopener noreferrer"
        className={`group ${baseClass}`} style={style} onMouseMove={handleMove} onMouseLeave={handleLeave}>
        {children}{arrow}
      </motion.a>
    );
  }

  return (
    <MotionLink ref={btnRef as React.RefObject<HTMLAnchorElement>} href={href}
      className={`group ${baseClass}`} style={style} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}{arrow}
    </MotionLink>
  );
}
