"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import DisplayHeading from "@/components/DisplayHeading";
import { siteConfig } from "@/content/site-config";

interface ContactBandProps {
  /**
   * Optional pre-headline eyebrow. Rendered only when passed; the
   * homepage omits it to keep its three-label budget.
   */
  eyebrow?: string;
  headline: React.ReactNode;
  body?: string;
  align?: "start" | "center";
  bg?: "background" | "surface-container" | "surface-container-lowest";
  showChannels?: boolean;
  secondaryLink?: { href: string; label: string };
}

const phoneReady = !siteConfig.phone.includes("XX");
const whatsappReady = !siteConfig.whatsapp.includes("XX");

/**
 * ContactBand — the in-page contact section.
 *
 * Visual upgrades:
 * - Kinetic teal radial glow that shifts from above as the section enters
 * - Parallax: the headline drifts up as the visitor scrolls into the band
 * - The three channel pills are spaced more openly on a thin divider
 * - A very faint dot-grid pattern in the background for texture
 */
export default function ContactBand({
  eyebrow,
  headline,
  body = "Thirty minutes, free. Tell us what's hard about running your business today and we'll help you think through it, even if the answer turns out to be something we don't do.",
  align = "start",
  bg = "surface-container-lowest",
  showChannels = true,
  secondaryLink,
}: ContactBandProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const bgClass: Record<NonNullable<ContactBandProps["bg"]>, string> = {
    "background": "bg-background",
    "surface-container": "bg-surface-container",
    "surface-container-lowest": "bg-surface-container-lowest",
  };

  const isCentered = align === "center";
  const headingClass = isCentered ? "max-w-3xl mx-auto text-center" : "max-w-4xl";
  const bodyClass = isCentered
    ? "text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-10 text-center"
    : "text-body-lg md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed mb-10";
  const actionsClass = isCentered
    ? "flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
    : "flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-wrap";

  return (
    <section
      ref={ref}
      className={`relative ${bgClass[bg]} py-32 md:py-40 px-6 md:px-12 overflow-hidden border-t border-on-background/10`}
    >
      {/* Ambient teal glow from above — larger and more dramatic than before */}
      <div
        className="absolute inset-x-0 -top-60 h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 10%, rgba(94,234,212,0.14) 0%, rgba(94,234,212,0.04) 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(rgba(216,227,245,1) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <motion.div
        style={{ y, opacity }}
        className="max-w-[1440px] mx-auto relative z-10"
      >
        <div className={isCentered ? "text-center" : "grid grid-cols-12 gap-x-6 md:gap-x-8"}>
          <div className={isCentered ? "" : "col-span-12 lg:col-span-10"}>
            {/* Eyebrow */}
            {eyebrow && (
              <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-10">
                {eyebrow}
              </div>
            )}

            {/* Headline */}
            <DisplayHeading size="lg" as="h2" className={`mb-10 ${headingClass}`}>
              {headline}
            </DisplayHeading>

            {/* Body */}
            {body && <p className={bodyClass}>{body}</p>}

            {/* Thin divider before actions */}
            <div className="w-16 h-px bg-on-background/15 mb-10" />

            {/* Three channels */}
            <div className={actionsClass}>
              {/* Primary CTA */}
              <Link
                href="/contact"
                className="group inline-flex items-center pl-6 pr-12 py-4 rounded-pill bg-accent-bright text-background font-medium text-base hover:bg-accent-bright/90 transition-all duration-300 shadow-[0_0_40px_rgba(94,234,212,0.2)] hover:shadow-[0_0_60px_rgba(94,234,212,0.35)]"
              >
                Book a Free Consultation
                <span className="ml-6 material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                  arrow_forward
                </span>
              </Link>

              {/* Optional secondary link */}
              {secondaryLink && (
                <Link
                  href={secondaryLink.href}
                  className="group inline-flex items-center px-5 py-4 rounded-pill border border-on-background/20 hover:border-accent-bright text-on-background font-medium text-base transition-colors duration-300"
                >
                  <span className="material-symbols-outlined text-lg mr-2.5 text-accent-bright">
                    work
                  </span>
                  {secondaryLink.label}
                </Link>
              )}

              {showChannels && (
                <>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="group inline-flex items-center px-5 py-4 rounded-pill border border-on-background/20 hover:border-accent-bright text-on-background font-medium text-base transition-colors duration-300"
                  >
                    <span className="material-symbols-outlined text-lg mr-2.5 text-accent-bright">
                      mail
                    </span>
                    Email us
                  </a>

                  {(phoneReady || whatsappReady) && (
                    <a
                      href={
                        whatsappReady
                          ? `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`
                          : `tel:${siteConfig.phone}`
                      }
                      target={whatsappReady ? "_blank" : undefined}
                      rel={whatsappReady ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center px-5 py-4 rounded-pill border border-on-background/20 hover:border-accent-bright text-on-background font-medium text-base transition-colors duration-300"
                    >
                      {whatsappReady ? (
                        <FaWhatsapp className="w-4 h-4 mr-2.5 text-accent-bright" />
                      ) : (
                        <span className="material-symbols-outlined text-lg mr-2.5 text-accent-bright">
                          call
                        </span>
                      )}
                      {whatsappReady ? "WhatsApp us" : "Call us"}
                    </a>
                  )}
                </>
              )}
            </div>

            {/* Meta strip */}
            <div className={`mt-10 text-sm text-on-surface-variant font-mono flex flex-col sm:flex-row gap-3 sm:gap-10 ${isCentered ? "justify-center" : ""}`}>
              <span>{siteConfig.location}</span>
              <span>{siteConfig.timezone}</span>
              <span>Replies within 1 business day</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
