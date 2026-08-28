"use client";

import { motion } from "framer-motion";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import MagneticButton from "@/components/MagneticButton";
import RevealText from "@/components/RevealText";

/**
 * Hero — Andela-quality editorial layout.
 *
 * Structure (asymmetric, not centered):
 *   ┌─────────────────────────────────────────────┐
 *   │  [SECTION LABEL]                            │
 *   │                                             │
 *   │  WE BUILD                                   │
 *   │  THE DIGITAL                                │
 *   │  SYSTEMS BEHIND                             │
 *   │  YOUR BUSINESS.                             │
 *   │                                             │
 *   │  Subheading paragraph (1-2 lines)           │
 *   │                                             │
 *   │  [MagneticButton primary] [Text link]      │
 *   │                                             │
 *   │  ✓ ✓ ✓   three benefit checks              │
 *   └─────────────────────────────────────────────┘
 *
 * Typography: 120px serif H1, with italic accent on the key phrase.
 * No center-alignment. No gradient mesh. No 3D. Pure typography + spacing.
 */
export default function Hero() {
  const benefits = [
    "All-inclusive monthly packages",
    "WhatsApp + MTN MoMo ready",
    "Managed from day one",
  ];

  return (
    <section className="relative bg-background pt-32 md:pt-48 pb-24 md:pb-32 px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
          <div className="col-span-12 lg:col-span-10">
            <RevealText>
              <SectionLabel number="00" label="WHAT WE DO" className="mb-8 md:mb-12" />
            </RevealText>

            <DisplayHeading
              size="xl"
              as="h1"
              className="mb-8 md:mb-12"
            >
              We build the{" "}
              <span className="italic text-accent-cyan">digital systems</span>
              <br />
              behind your business.
            </DisplayHeading>

            <RevealText delay={0.2}>
              <p className="text-body-lg md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed font-sans mb-10 md:mb-12">
                All-inclusive monthly digital transformation packages for Ghanaian MSMEs — replacing spreadsheets, WhatsApp threads, and manual work with systems built for scale.
              </p>
            </RevealText>

            <RevealText delay={0.35}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 mb-12 md:mb-16">
                <MagneticButton href="/contact" variant="primary" size="lg">
                  Book a Free Consultation
                </MagneticButton>
                <a
                  href="#packages"
                  className="text-on-surface-variant hover:text-accent-bright font-medium transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  See Our Packages
                </a>
              </div>
            </RevealText>

            <RevealText delay={0.5}>
              <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm md:text-base font-sans text-on-surface-variant">
                {benefits.map((b, i) => (
                  <li key={b} className="flex items-center gap-2.5">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="text-accent-bright shrink-0"
                    >
                      <path
                        d="M10.2003 14.8518L18.4731 6.57812L19.7466 7.85073L10.2003 17.397L4.47266 11.6694L5.74526 10.3968L10.2003 14.8518Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </RevealText>
          </div>
        </div>
      </div>
    </section>
  );
}
