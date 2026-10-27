"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { siteConfig } from "@/content/site-config";
import NewsletterForm from "@/components/NewsletterForm";

/**
 * Footer — cinematic typographic statement.
 *
 * The top half is a full-bleed editorial moment: a massive serif headline
 * "Let's build what's next" with a teal accent word, a subtle parallax
 * offset as the visitor scrolls into it, and an ambient radial glow.
 *
 * The bottom half is a tight, clean link grid with the legal strip.
 */
export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  // Parallax: the headline drifts up slightly as it enters
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  const columns = [
    {
      title: "Solutions",
      links: [
        { name: "Operations", href: "/services" },
        { name: "Customer Engagement", href: "/services" },
        { name: "Commerce", href: "/services" },
        { name: "Growth", href: "/services" },
        { name: "Bespoke", href: "/services" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "How We Transform", href: "/how-we-transform" },
        { name: "Careers", href: "/careers" },
        { name: "Insights", href: "/insights" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Connect",
      links: [
        { name: "LinkedIn", href: "https://www.linkedin.com/company/gileara", external: true },
        { name: "WhatsApp", href: `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`, external: true },
        { name: "Email", href: `mailto:${siteConfig.email}` },
        { name: "FAQ", href: "/faq" },
      ],
    },
  ];

  return (
    <footer ref={ref} className="relative bg-surface-container-lowest overflow-hidden border-t border-on-background/10">
      {/* ── Cinematic statement ───────────────────────────────────────────── */}
      <div className="relative min-h-[70vh] flex flex-col justify-center px-6 md:px-12 py-32 overflow-hidden border-b border-on-background/10">
        {/* Ambient glow — teal radial, top-center */}
        <div
          className="absolute inset-x-0 top-0 h-[700px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(94,234,212,0.22) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />
        {/* Faint grid lines for depth */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(216,227,245,1) 1px, transparent 1px), linear-gradient(90deg, rgba(216,227,245,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
          aria-hidden="true"
        />

        <motion.div
          style={{ y, opacity }}
          className="max-w-[1440px] mx-auto w-full relative z-10"
        >
          <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-10">
            Gileara Technologies · {siteConfig.location}
          </div>

          {/* Massive editorial headline */}
          <h2 className="font-serif text-[clamp(3rem,8vw,9rem)] leading-[0.9] tracking-[-0.04em] text-on-background mb-12 max-w-5xl">
            Let&apos;s build{" "}
            <br />
            what&apos;s{" "}
            <span className="italic text-accent-bright relative">
              next.
              {/* Underline accent */}
              <span
                className="absolute -bottom-1 left-0 w-full h-[2px] rounded-full"
                style={{
                  background: "linear-gradient(90deg, #5EEAD4 0%, transparent 100%)",
                }}
                aria-hidden="true"
              />
            </span>
          </h2>

          {/* Sub-line + CTA row */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
            <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
              Small businesses everywhere run on manual work. We build the systems that fix it — starting in Ghana, scaling globally.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center pl-7 pr-14 py-4 rounded-pill bg-accent-bright text-background font-medium text-base hover:bg-accent-bright/90 transition-all duration-300 shrink-0"
            >
              Book a Free Consultation
              <span className="ml-6 material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                arrow_forward
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Newsletter strip ──────────────────────────────────────────────── */}
      <div className="px-6 md:px-12 py-12 border-b border-on-background/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-xl">
            <NewsletterForm source="footer" />
          </div>
        </div>
      </div>

      {/* ── Link grid ─────────────────────────────────────────────────────── */}
      <div className="px-6 md:px-12 pt-16 pb-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-16">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                Gileara
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
                We build the operations, sales, customer, and reporting infrastructure small business can&apos;t build alone. Piloting in Ghana, designed to scale worldwide.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="https://www.linkedin.com/company/gileara"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Gileara on LinkedIn"
                  className="w-9 h-9 rounded-full border border-on-background/15 flex items-center justify-center text-on-surface-variant hover:border-accent-bright hover:text-accent-bright transition-colors duration-200"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="w-9 h-9 rounded-full border border-on-background/15 flex items-center justify-center text-on-surface-variant hover:border-accent-bright hover:text-accent-bright transition-colors duration-200"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </a>
              </div>
              <p className="text-on-surface-variant text-xs font-mono mt-6">
                {siteConfig.location} · {siteConfig.timezone}
              </p>
            </div>

            {columns.map((col) => (
              <div key={col.title}>
                <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-5">
                  {col.title}
                </div>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      {"external" in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="animated-underline text-on-surface hover:text-accent-bright transition-colors duration-200 inline-block"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="animated-underline text-on-surface hover:text-accent-bright transition-colors duration-200 inline-block"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Legal strip */}
          <div className="pt-8 border-t border-on-background/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-on-surface-variant text-xs font-mono">
              © {new Date().getFullYear()} Gileara Technologies. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs font-mono">
              <Link href="/privacy" className="text-on-surface-variant hover:text-accent-bright transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-on-surface-variant hover:text-accent-bright transition-colors">
                Terms
              </Link>
              <Link href="/security" className="text-on-surface-variant hover:text-accent-bright transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
