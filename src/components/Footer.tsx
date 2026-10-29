import Image from "next/image";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa6";
import { siteConfig } from "@/content/site-config";
import NewsletterForm from "@/components/NewsletterForm";

/**
 * Footer — Terminal / Operator aesthetic.
 *
 * Vercel-style: clean link grid above a minimal legal strip. No CTA
 * statement of its own — Footer is global chrome rendered on every page,
 * and most pages already place a page-tailored ContactBand immediately
 * above it, so a second "book a call" block here duplicated the one
 * visitors just saw. The handful of pages without a ContactBand (legal
 * pages, careers — which has its own apply-flow CTA) still reach contact
 * through the plain "Contact" link in the nav grid below.
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

      {/* ── Newsletter ─────────────────────────────────────────────────── */}
      <div className="relative border-b border-white/[0.06] px-6 md:px-12 py-12 md:py-14">
        <div className="max-w-[1200px] mx-auto max-w-lg">
          <NewsletterForm source="footer" variant="dark" />
        </div>
      </div>

      {/* ── Link grid ──────────────────────────────────────────────────── */}
      <div className="relative px-6 md:px-12 pt-12 pb-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand col */}
          <div>
            <Image
              src="/assets/gileara/logo-ui.png"
              alt="Gileara"
              width={664}
              height={246}
              sizes="180px"
              className="h-11 w-auto mb-5"
            />
            <p className="font-sans text-xs text-white/30 leading-relaxed mb-4">
              We build the operations, sales, customer, and reporting infrastructure small business can&apos;t build alone.
            </p>
            <p className="font-mono text-[11px] text-white/20 mb-4">
              {siteConfig.location}<br />{siteConfig.timezone}
            </p>
            <a
              href="https://www.linkedin.com/company/gileara"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/30 hover:text-accent-bright transition-colors duration-150"
            >
              <FaLinkedin className="w-4 h-4" />
              <span className="font-mono text-[11px]">LinkedIn</span>
            </a>
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
