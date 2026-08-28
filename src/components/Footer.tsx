import Link from "next/link";
import { FaLinkedin } from "react-icons/fa6";
import { siteConfig } from "@/content/site-config";

/**
 * Footer — typographic statement, not a sitemap.
 *
 * The footer is the last thing a visitor sees. Andela treats it as a
 * design object: huge "Let's build what's next" + CTA, then a thin
 * column-based link group, then a small legal line. We do the same.
 *
 * Padding: 200px top (Andela-scale breathing room).
 * Typography: 96–120px serif for the statement.
 */
export default function Footer() {
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
    <footer className="bg-background pt-40 md:pt-56 pb-12 px-6 md:px-12 text-on-background overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        {/* Top: typographic statement */}
        <div className="mb-32 md:mb-48">
          <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-8">
            Get in touch
          </div>
          <h2 className="font-serif text-display-lg md:text-display-xl leading-[0.9] tracking-[-0.03em] mb-12 max-w-5xl">
            Let&apos;s build
            <br />
            <span className="italic text-accent-cyan">what&apos;s next.</span>
          </h2>
          <Link
            href="/contact"
            className="group inline-flex items-center pl-8 pr-14 py-4 rounded-pill bg-accent-bright text-background font-medium text-lg hover:bg-accent-cyan transition-colors duration-300"
          >
            Start a conversation
            <span className="ml-6 material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1.5">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Middle: link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-20 border-t border-on-background/10 pt-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
              Gileara
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
              All-inclusive monthly digital transformation packages for Ghanaian MSMEs — WhatsApp-ready, MTN MoMo-integrated, managed from day one.
            </p>
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
                        className="text-on-surface hover:text-accent-bright transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-on-surface hover:text-accent-bright transition-colors duration-200"
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

        {/* Bottom: legal + socials */}
        <div className="pt-8 border-t border-on-background/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-on-surface-variant text-sm">
            © {new Date().getFullYear()} Gileara Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-on-surface-variant hover:text-accent-bright transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-on-surface-variant hover:text-accent-bright transition-colors">
              Terms
            </Link>
            <Link href="/security" className="text-on-surface-variant hover:text-accent-bright transition-colors">
              Security
            </Link>
            <a
              href="https://www.linkedin.com/company/gileara"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gileara on LinkedIn"
              className="text-on-surface-variant hover:text-accent-bright transition-colors"
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
