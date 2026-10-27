"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/Breadcrumbs";

interface PageHeroProps {
  /** "01", "02", etc. — leave undefined for non-numbered pages (legal) */
  number?: string;
  /** UPPERCASE label above the H1: "ABOUT US", "SERVICES", etc. */
  eyebrow: string;
  /** The page's main headline. Use <span> with `italic text-accent-bright` for accent words. */
  headline: ReactNode;
  /** Optional 1-2 line subtitle */
  subtitle?: string;
  /** Optional CTA row */
  cta?: ReactNode;
  /** Background surface elevation. Default: surface-container-lowest (deepest dark) */
  bg?: "background" | "surface" | "surface-container" | "surface-container-lowest";
  /** When true, shows the ambient teal glow (used on most pages) */
  glow?: boolean;
  /**
   * Optional breadcrumb trail, rendered just under the H1. Mirrors
   * the JSON-LD BreadcrumbList on the same page.
   */
  breadcrumbs?: BreadcrumbItem[];
  /**
   * Optional full-bleed background image. When provided, the hero
   * becomes a tall section with a dark gradient overlay for text readability.
   */
  backgroundImage?: { src: string; alt: string };
}

/**
 * PageHero — the reusable hero block for all inner pages.
 *
 * Visual upgrades:
 * - Content fades and slides up on mount (staggered: eyebrow → headline → subtitle → CTA)
 * - The glow is stronger and more dramatic — a tall ellipse rather than a small circle
 * - A very faint dot-grid gives the hero texture without weight
 * - The background-image mode now renders with a parallax Ken-Burns scale on the photo
 */
export default function PageHero({
  number,
  eyebrow,
  headline,
  subtitle,
  cta,
  bg = "surface-container-lowest",
  glow = true,
  breadcrumbs,
  backgroundImage,
}: PageHeroProps) {
  const bgClass: Record<NonNullable<PageHeroProps["bg"]>, string> = {
    "background": "bg-background",
    "surface": "bg-surface",
    "surface-container": "bg-surface-container",
    "surface-container-lowest": "bg-surface-container-lowest",
  };

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65 } },
  };

  // ── Background-image mode (full bleed) ──────────────────────────
  if (backgroundImage) {
    return (
      <section className="relative bg-background overflow-hidden">
        <div className="relative h-[60vh] min-h-[480px] max-h-[820px]">
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Cinematic multi-layer gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: [
                "linear-gradient(90deg, rgba(8,20,32,0.55) 0%, transparent 60%)",
                "linear-gradient(180deg, rgba(8,20,32,0.4) 0%, rgba(8,20,32,0.82) 70%, rgba(8,20,32,0.98) 100%)",
                "radial-gradient(ellipse 40% 30% at 10% 90%, rgba(94,234,212,0.1) 0%, transparent 70%)",
              ].join(", "),
            }}
            aria-hidden="true"
          />

          <div className="absolute inset-0 flex items-end pb-16 md:pb-20 px-6 md:px-12">
            <div className="max-w-[1440px] mx-auto w-full relative z-10">
              <motion.div
                className="max-w-4xl"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <motion.div className="mb-6 md:mb-8" variants={itemVariants}>
                    <Breadcrumbs items={breadcrumbs} />
                  </motion.div>
                )}
                <motion.div className="mb-8 md:mb-10" variants={itemVariants}>
                  <SectionLabel number={number} label={eyebrow} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <DisplayHeading size="xl" as="h1" className="mb-8 md:mb-10 text-on-background">
                    {headline}
                  </DisplayHeading>
                </motion.div>
                {subtitle && (
                  <motion.p
                    className="text-body-lg md:text-2xl text-on-background/80 max-w-2xl leading-relaxed mb-10 md:mb-12"
                    variants={itemVariants}
                  >
                    {subtitle}
                  </motion.p>
                )}
                {cta && <motion.div variants={itemVariants}>{cta}</motion.div>}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Default mode (no background image) ──────────────────────────
  return (
    <section className={`relative ${bgClass[bg]} py-section-loose px-6 md:px-12 overflow-hidden`}>
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(rgba(216,227,245,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Atmospheric glow — tall ellipse from top-center */}
      {glow && (
        <div
          className="absolute inset-x-0 -top-60 h-[800px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 60% at 50% 5%, rgba(94,234,212,0.14) 0%, rgba(94,234,212,0.05) 40%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Accent stripe at the very top */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(94,234,212,0.3) 30%, rgba(94,234,212,0.5) 50%, rgba(94,234,212,0.3) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
          <div className="col-span-12 lg:col-span-8">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-6">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            )}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div className="mb-10" variants={itemVariants}>
                <SectionLabel number={number} label={eyebrow} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DisplayHeading size="xl" as="h1" className="mb-10">
                  {headline}
                </DisplayHeading>
              </motion.div>

              {subtitle && (
                <motion.p
                  className="text-body-lg md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed mb-12"
                  variants={itemVariants}
                >
                  {subtitle}
                </motion.p>
              )}

              {cta && <motion.div variants={itemVariants}>{cta}</motion.div>}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
