"use client";

import { useRef, useState, type ReactNode, type CSSProperties } from "react";
import Link from "next/link";

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
    "bg-accent-bright text-background hover:bg-accent-cyan hover:text-background",
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

/**
 * Andela-style pill button with subtle magnetic hover.
 * - Pill shape (rounded-pill)
 * - Asymmetric horizontal padding so the arrow has its own "lane"
 * - On hover near the button, the button drifts toward the cursor (magnetic)
 * - Variants: primary (bright accent), secondary (outline), ghost (text only)
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
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.15, y: y * 0.15 });
  };

  const handleLeave = () => setPos({ x: 0, y: 0 });

  const style: CSSProperties = {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
  };

  const baseClass = `group inline-flex items-center justify-center rounded-pill font-medium transition-colors duration-300 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (external) {
    return (
      <a
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
        {showArrow && (
          <span className="ml-6 inline-block transition-transform duration-300 group-hover:translate-x-1.5">
            <span className="material-symbols-outlined align-middle text-xl">arrow_forward</span>
          </span>
        )}
      </a>
    );
  }

  return (
    <Link
      ref={btnRef as React.RefObject<HTMLAnchorElement>}
      href={href}
      className={baseClass}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      {showArrow && (
        <span className="ml-6 inline-block transition-transform duration-300 group-hover:translate-x-1.5">
          <span className="material-symbols-outlined align-middle text-xl">arrow_forward</span>
        </span>
      )}
    </Link>
  );
}
