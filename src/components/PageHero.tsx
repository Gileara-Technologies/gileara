import { type ReactNode } from "react";
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
}

/**
 * PageHero — the reusable hero block for all inner pages.
 *
 * Andela-style: oversized section number on the left, large italic
 * serif H1 in the middle, optional subtitle and CTA below. Used on
 * /about, /services, /careers, /insights, /how-we-transform, /faq,
 * /contact, and the legal pages.
 *
 * The number is huge (display-sm, 56px) and low-opacity — a
 * navigational anchor, not a decoration.
 */
export default function PageHero({
  number,
  eyebrow,
  headline,
  subtitle,
  cta,
  bg = "surface-container-lowest",
  glow = true,
}: PageHeroProps) {
  const bgClass: Record<NonNullable<PageHeroProps["bg"]>, string> = {
    "background": "bg-background",
    "surface": "bg-surface",
    "surface-container": "bg-surface-container",
    "surface-container-lowest": "bg-surface-container-lowest",
  };

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
          <div className="col-span-12 lg:col-span-10">
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
