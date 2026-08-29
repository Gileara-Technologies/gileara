import { type ReactNode } from "react";
import Image from "next/image";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";

interface PageHeroProps {
  /** "01", "02", etc. — leave undefined for non-numbered pages (legal) */
  number?: string;
  /** UPPERCASE label above the H1: "ABOUT US", "SERVICES", etc. */
  eyebrow: string;
  /** The page's main headline. Use <span> with `italic text-accent-cyan` for accent words. */
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
   * Optional full-bleed background image. When provided, the hero
   * becomes a tall section (min-h-[60vh]) with the image as the
   * background and a dark gradient overlay for text readability.
   * The eyebrow/headline/subtitle/CTA sit on top in a constrained
   * max-w column.
   */
  backgroundImage?: { src: string; alt: string };
}

/**
 * PageHero — the reusable hero block for all inner pages.
 *
 * Two modes:
 *
 *  1. Default — surface-coloured hero with eyebrow + headline + optional
 *     subtitle and CTA. Used on /about, /careers, /insights,
 *     /how-we-transform, /faq, /contact, legal pages, and /services.
 *
 *  2. With `backgroundImage` — full-bleed hero with a single image as
 *     the background, dark gradient overlay, and the same text block
 *     on top. Used on `/services/[slug]` so the per-service image
 *     becomes a full background instead of a side decoration.
 */
export default function PageHero({
  number,
  eyebrow,
  headline,
  subtitle,
  cta,
  bg = "surface-container-lowest",
  glow = true,
  backgroundImage,
}: PageHeroProps) {
  const bgClass: Record<NonNullable<PageHeroProps["bg"]>, string> = {
    "background": "bg-background",
    "surface": "bg-surface",
    "surface-container": "bg-surface-container",
    "surface-container-lowest": "bg-surface-container-lowest",
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
          {/* Dark gradient overlay for text readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(8, 20, 32, 0.55) 0%, rgba(8, 20, 32, 0.8) 70%, rgba(8, 20, 32, 0.95) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="absolute inset-0 flex items-end pb-16 md:pb-20 px-6 md:px-12">
            <div className="max-w-[1440px] mx-auto w-full relative z-10">
              <div className="max-w-4xl">
                <div className="mb-8 md:mb-10">
                  <SectionLabel number={number} label={eyebrow} />
                </div>

                <DisplayHeading size="xl" as="h1" className="mb-8 md:mb-10 text-on-background">
                  {headline}
                </DisplayHeading>

                {subtitle && (
                  <p className="text-body-lg md:text-2xl text-on-background/85 max-w-2xl leading-relaxed mb-10 md:mb-12">
                    {subtitle}
                  </p>
                )}

                {cta}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Default mode (no background image) ──────────────────────────
  return (
    <section className={`relative ${bgClass[bg]} py-32 md:py-48 px-6 md:px-12 overflow-hidden`}>
      {glow && (
        <div
          className="absolute inset-x-0 -top-40 h-[600px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center top, rgba(94, 234, 212, 0.12) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />
      )}

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
          <div className="col-span-12 lg:col-span-7 xl:col-span-7">
            <div className="mb-10">
              <SectionLabel number={number} label={eyebrow} />
            </div>

            <DisplayHeading size="xl" as="h1" className="mb-10">
              {headline}
            </DisplayHeading>

            {subtitle && (
              <p className="text-body-lg md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed mb-12">
                {subtitle}
              </p>
            )}

            {cta}
          </div>
        </div>
      </div>
    </section>
  );
}
