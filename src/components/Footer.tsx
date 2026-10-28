"use client";

import Link from "next/link";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { motion } from "framer-motion";
import { siteConfig } from "@/content/site-config";
import NewsletterForm from "@/components/NewsletterForm";

/**
 * Footer — Terminal / Operator aesthetic.
 *
 * Vercel-style: clean link grid above a minimal legal strip.
 * The top section carries a large mono headline with a teal
 * accent word — the last thing a visitor reads before leaving.
 */
export default function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        { name: "Packages",       href: "/services" },
        { name: "How We Transform", href: "/how-we-transform" },
        { name: "Operations Audit", href: "/#audit" },
        { name: "Pricing",        href: "/services" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About",    href: "/about" },
        { name: "Careers",  href: "/careers" },
        { name: "Insights", href: "/insights" },
        { name: "Contact",  href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy",  href: "/privacy" },
        { name: "Terms",    href: "/terms" },
        { name: "Security", href: "/security" },
        { name: "FAQ",      href: "/faq" },
      ],
    },
  ];

  return (
    <footer className="relative bg-background border-t border-white/[0.06] overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden="true" />

      {/* ── Statement section — the strongest brand-gradient moment ───────── */}
      <div className="relative bg-brand border-b border-white/[0.06] px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto">
          <div className="font-mono text-[11px] text-accent-bright/50 tracking-widest uppercase mb-8">
            gileara.technologies
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-[clamp(2.5rem,6vw,7rem)] leading-[0.92] tracking-tight text-on-background mb-10 max-w-4xl"
          >
            Let&apos;s build
            <br />
            what&apos;s{" "}
            <span className="text-accent-bright">next.</span>
          </motion.h2>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white text-black text-sm font-sans font-medium hover:bg-white/90 transition-colors duration-150"
            >
              Book a Free Consultation
              <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
            </Link>
            <a
              href="https://www.linkedin.com/company/gileara"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/10 text-white/50 text-sm font-sans hover:border-white/20 hover:text-white/70 transition-colors duration-150"
            >
              <FaLinkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/10 text-white/50 text-sm font-sans hover:border-white/20 hover:text-white/70 transition-colors duration-150"
            >
              <FaWhatsapp className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Newsletter ─────────────────────────────────────────────────── */}
      <div className="relative border-b border-white/[0.06] px-6 md:px-12 py-10">
        <div className="max-w-[1200px] mx-auto max-w-lg">
          <NewsletterForm source="footer" variant="dark" />
        </div>
      </div>

      {/* ── Link grid ──────────────────────────────────────────────────── */}
      <div className="relative px-6 md:px-12 pt-12 pb-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand col */}
          <div>
            <div className="font-mono text-[11px] text-accent-bright/60 tracking-widest uppercase mb-4">
              Gileara
            </div>
            <p className="font-sans text-xs text-white/30 leading-relaxed mb-4">
              We build the operations, sales, customer, and reporting infrastructure small business can&apos;t build alone.
            </p>
            <p className="font-mono text-[11px] text-white/20">
              {siteConfig.location}<br />{siteConfig.timezone}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="font-mono text-[11px] text-white/25 tracking-widest uppercase mb-4">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-white/40 hover:text-white/70 transition-colors duration-150"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal strip */}
        <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-white/20">
            © {new Date().getFullYear()} Gileara Technologies. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-white/15">
            Piloting in Accra, Ghana · Building for global scale
          </p>
        </div>
      </div>
    </footer>
  );
}
