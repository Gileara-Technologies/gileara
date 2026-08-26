"use client";

import { useReducedMotion } from "framer-motion";

const KEYWORDS = [
  "Custom Software",
  "WhatsApp Integration",
  "MTN MoMo",
  "Inventory Systems",
  "Sales Recording",
  "Customer Pipelines",
  "Dashboards",
  "Managed Services",
  "Ghana-First",
];

/**
 * Capability marquee in the DayNight idiom — pure CSS loop, duplicated
 * track for seamlessness, frozen under prefers-reduced-motion.
 * Decorative only: aria-hidden, no content gated on it.
 */
export default function KeywordMarquee() {
  const reduced = useReducedMotion();
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {KEYWORDS.map((kw) => (
        <span key={kw} className="inline-flex items-center">
          <span className="font-mono text-xs md:text-sm uppercase tracking-[0.2em] text-on-surface-variant whitespace-nowrap px-6">
            {kw}
          </span>
          <span className="text-primary text-sm" aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-outline-variant/15 dark:border-outline-variant/10 py-4 bg-surface-container-lowest/40">
      <div
        className={`flex w-max ${reduced ? "" : "animate-marquee"}`}
      >
        {row(false)}
        {row(true)}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
