import Link from "next/link";
import DisplayHeading from "@/components/DisplayHeading";
import { siteConfig } from "@/content/site-config";

interface CTABandProps {
  /** Pre-headline eyebrow, e.g. "READY?" or "HAVE A QUESTION?" */
  eyebrow?: string;
  /** Big H2 (italic accent words via <span>). */
  headline: React.ReactNode;
  /** Optional supporting copy */
  body?: string;
  /** Primary CTA label + href */
  ctaLabel?: string;
  ctaHref?: string;
  /** Secondary CTA label + href (e.g. WhatsApp) */
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Background elevation */
  bg?: "background" | "surface-container" | "surface-container-lowest";
}

/**
 * CTABand — full-bleed conversion band, used at the bottom of
 * every inner page (and the homepage ContactCTA). Oversized
 * DisplayHeading, two CTAs, ambient teal glow. The Andela
 * "climax" pattern: 224px top padding, parallax-ready H1.
 */
export default function CTABand({
  eyebrow = "Get in touch",
  headline,
  body,
  ctaLabel = "Book a Free Consultation",
  ctaHref = "/contact",
  secondaryLabel,
  secondaryHref,
  bg = "surface-container-lowest",
}: CTABandProps) {
  const bgClass: Record<NonNullable<CTABandProps["bg"]>, string> = {
    "background": "bg-background",
    "surface-container": "bg-surface-container",
    "surface-container-lowest": "bg-surface-container-lowest",
  };

  return (
    <section className={`relative ${bgClass[bg]} py-32 md:py-56 px-6 md:px-12 overflow-hidden`}>
      <div
        className="absolute inset-x-0 -top-40 h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center top, rgba(94, 234, 212, 0.18) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
          <div className="col-span-12 lg:col-span-10">
            <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-10">
              {eyebrow}
            </div>

            <DisplayHeading size="lg" as="h2" className="mb-12 max-w-5xl">
              {headline}
            </DisplayHeading>

            {body && (
              <p className="text-body-lg md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed mb-12">
                {body}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
              <Link
                href={ctaHref}
                className="group inline-flex items-center pl-8 pr-14 py-4 rounded-pill bg-accent-bright text-background font-medium text-lg hover:bg-accent-cyan transition-colors duration-300"
              >
                {ctaLabel}
                <span className="ml-6 material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1.5">
                  arrow_forward
                </span>
              </Link>
              {secondaryLabel && secondaryHref && (
                <a
                  href={secondaryHref}
                  className="text-on-surface-variant hover:text-accent-bright font-medium transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  {secondaryLabel}
                </a>
              )}
            </div>

            <div className="mt-20 pt-10 border-t border-on-background/10 flex flex-col sm:flex-row gap-4 sm:gap-12 text-sm text-on-surface-variant font-mono">
              <span>{siteConfig.location}</span>
              <span>{siteConfig.timezone}</span>
              <span>Replies within 1 business day</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
