"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { siteConfig } from "@/content/site-config";

interface ContactBandProps {
  eyebrow?: string;
  headline: React.ReactNode;
  body?: string;
  align?: "start" | "center";
  /** Background token — retained for API compat, visual is always black in this theme */
  bg?: "background" | "surface-container" | "surface-container-lowest";
  showChannels?: boolean;
  secondaryLink?: { href: string; label: string };
}

const phoneReady = !siteConfig.phone.includes("XX");
const whatsappReady = !siteConfig.whatsapp.includes("XX");

/**
 * ContactBand — Terminal / Operator aesthetic.
 *
 * Vercel-style CTA section: pure black, centered radial glow,
 * white fill on primary button. Clean, no decorative noise.
 */
export default function ContactBand({
  eyebrow,
  headline,
  body = "Thirty minutes, free. Tell us what's hard about running your business today and we'll help you think through it.",
  align = "start",
  bg: _bg = "surface-container-lowest",
  showChannels = true,
  secondaryLink,
}: ContactBandProps) {
  const isCentered = align === "center";

  return (
    <section className="relative bg-black border-t border-white/[0.06] py-section px-6 md:px-12 overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" aria-hidden="true" />

      {/* Radial glow */}
      <div
        className="absolute inset-x-0 -top-40 h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 5%, rgba(94,234,212,0.1) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className={isCentered ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
          {/* Eyebrow */}
          {eyebrow && (
            <div className="font-mono text-[11px] text-accent-bright tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="text-accent-bright/40">▸</span>
              {eyebrow}
            </div>
          )}

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-display-md text-white mb-5"
          >
            {headline}
          </motion.h2>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`font-sans text-body-lg text-white/40 leading-relaxed mb-10 ${isCentered ? "mx-auto" : ""}`}
          >
            {body}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`flex flex-col sm:flex-row gap-3 ${isCentered ? "justify-center" : ""} mb-10 flex-wrap`}
          >
            {/* Primary — white fill */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white text-black text-sm font-sans font-medium hover:bg-white/90 transition-colors duration-150"
            >
              Book a Free Consultation
              <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
            </Link>

            {secondaryLink && (
              <Link
                href={secondaryLink.href}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/10 text-white/60 text-sm font-sans hover:border-white/25 hover:text-white/90 transition-colors duration-150"
              >
                {secondaryLink.label}
              </Link>
            )}

            {showChannels && (
              <>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/10 text-white/50 text-sm font-sans hover:border-white/20 hover:text-white/70 transition-colors duration-150"
                >
                  <span className="material-symbols-outlined text-base text-accent-bright/60" aria-hidden="true">mail</span>
                  Email us
                </a>

                {(phoneReady || whatsappReady) && (
                  <a
                    href={whatsappReady ? `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}` : `tel:${siteConfig.phone}`}
                    target={whatsappReady ? "_blank" : undefined}
                    rel={whatsappReady ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/10 text-white/50 text-sm font-sans hover:border-white/20 hover:text-white/70 transition-colors duration-150"
                  >
                    {whatsappReady
                      ? <FaWhatsapp className="w-4 h-4 text-accent-bright/60" />
                      : <span className="material-symbols-outlined text-base text-accent-bright/60" aria-hidden="true">call</span>
                    }
                    {whatsappReady ? "WhatsApp us" : "Call us"}
                  </a>
                )}
              </>
            )}
          </motion.div>

          {/* Meta */}
          <div className={`font-mono text-[11px] text-white/20 flex flex-col sm:flex-row gap-4 sm:gap-8 ${isCentered ? "justify-center" : ""}`}>
            <span>{siteConfig.location}</span>
            <span>{siteConfig.timezone}</span>
            <span>Replies within 1 business day</span>
          </div>
        </div>
      </div>
    </section>
  );
}
