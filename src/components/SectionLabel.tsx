"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SectionLabelProps {
  number?: string; // "01", "02", "03"
  label: string;    // "THE REALITY"
  className?: string;
}

/**
 * SectionLabel — animated eyebrow label.
 *
 * A teal line draws from left to right before the text fades in,
 * which creates a subtle "signal" that a new section is starting.
 * The number is huge (96–120px), low-opacity, and aria-hidden.
 */
export default function SectionLabel({ number, label, className = "" }: SectionLabelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className={`flex items-baseline gap-4 md:gap-6 ${className}`}>
      {number && (
        <span
          className="font-serif text-display-md leading-none text-on-background/[0.08] select-none"
          aria-hidden="true"
        >
          {number}
        </span>
      )}
      <div className="flex flex-col gap-1.5">
        {/* Animated lead line */}
        <motion.div
          className="h-[1px] rounded-full"
          style={{ background: "#5EEAD4", originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />
        <motion.span
          className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant"
          initial={{ opacity: 0, y: 4 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
}
