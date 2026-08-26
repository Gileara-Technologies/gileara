import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

import { siteConfig } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Security & Reliability | Gileara Technologies",
  description:
    "What managed services cover at every Gileara tier — support, updates, backups, and monitoring — plus how to report vulnerabilities. Numeric SLA tables publish after readiness sign-off.",
  alternates: {
    canonical: "/security",
  },
  keywords: [
    "Gileara security",
    "managed services Ghana",
    "backup and monitoring",
    "vulnerability disclosure",
    "responsible disclosure",
  ],
  openGraph: {
    title: "Security & Reliability | Gileara Technologies",
    description:
      "Security is at the core of everything we build and manage. See what's covered at every tier.",
    url: "/security",
    siteName: "Gileara Technologies",
    type: "website",
    images: [
      {
        url: "/assets/gileara/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Gileara Technologies security and reliability",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Security & Reliability | Gileara Technologies",
    description:
      "Managed-services coverage, data protection, and vulnerability reporting at Gileara Technologies.",
    images: ["/assets/gileara/logo-full.png"],
  },
};

/** Qualitative managed-services coverage (D10) — no invented response times. */
const coverageRows: { capability: string; tiers: [string, string, string] }[] = [
  {
    capability: "IT support when things break",
    tiers: ["Included", "Included", "Included"],
  },
  {
    capability: "Software updates & patching",
    tiers: ["Included", "Included", "Included"],
  },
  {
    capability: "Regular scheduled backups",
    tiers: ["Included", "Included", "Included"],
  },
  {
    capability: "Security monitoring",
    tiers: ["Core coverage", "Extended coverage", "Extended coverage"],
  },
  {
    capability: "SLA-backed response",
    tiers: ["Standard queue", "Priority queue", "Priority queue"],
  },
  {
    capability: "Dedicated engineering attention",
    tiers: ["—", "—", "Included"],
  },
];

export default function SecurityPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://gileara.org/security/#webpage",
        name: "Security & Reliability | Gileara Technologies",
        description: metadata.description,
        url: "https://gileara.org/security",
        dateModified: "2026-09-01",
        publisher: {
          "@type": "Organization",
          name: "Gileara Technologies",
          url: "https://gileara.org",
          logo: "https://gileara.org/assets/gileara/logo-icon.png",
        },
        breadcrumb: { "@id": "https://gileara.org/security/#breadcrumb" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://gileara.org/security/#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://gileara.org" },
          { "@type": "ListItem", position: 2, name: "Security & Reliability", item: "https://gileara.org/security" },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar variant="legal" page="security" />
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-on-surface">Security &amp; Reliability</h1>
          <p className="text-lg text-on-surface-variant leading-relaxed max-w-3xl">
            Every Gileara package includes managed services from day one. This page explains what that covers at each
            tier, how we protect your data, and how to reach us when something matters.
          </p>

          {/* Tier coverage */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-on-surface mb-2">What managed services cover</h2>
            <p className="text-sm text-outline mb-6">
              Coverage by tier — the same matrix shown on each package.
            </p>
            <div className="overflow-x-auto rounded-xl border border-outline-variant/20 dark:border-outline-variant/10">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="bg-surface-container dark:bg-surface-container-high text-left">
                    <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-outline">Capability</th>
                    <th className="px-4 py-3 font-display font-bold text-on-surface">Basic</th>
                    <th className="px-4 py-3 font-display font-bold text-on-surface">Professional</th>
                    <th className="px-4 py-3 font-display font-bold text-on-surface">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {coverageRows.map((row) => (
                    <tr key={row.capability} className="border-t border-outline-variant/15 dark:border-outline-variant/10">
                      <td className="px-4 py-3 text-on-surface">{row.capability}</td>
                      {row.tiers.map((cell, i) => (
                        <td key={i} className="px-4 py-3">
                          {cell === "—" ? (
                            <span className="text-outline-variant/60" aria-label="Not included">—</span>
                          ) : cell === "Included" ? (
                            <span className="inline-flex items-center gap-1.5 text-on-surface">
                              <span className="material-symbols-outlined text-base text-secondary dark:text-primary" role="img" aria-label="Included">check</span>
                              Included
                            </span>
                          ) : (
                            <span className="text-on-surface">{cell}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Honest SLA note */}
          <section className="mt-8 p-5 rounded-xl border border-secondary/30 dark:border-primary/25 bg-surface-container dark:bg-surface-container-high">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              <span className="font-semibold text-primary dark:text-on-background">Numeric SLAs are coming — deliberately.</span>{" "}
              We publish specific response-time commitments only after our readiness review confirms we can meet them
              consistently. Until then, this page stays qualitative on purpose: we won&apos;t quote numbers we can&apos;t
              stand behind yet.
            </p>
          </section>

          {/* Data protection */}
          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-on-surface">How we protect your data</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Your business data lives in systems you own, backed up on a regular schedule so a bad day never becomes a
              lost year. Access is limited to the engineers who need it to keep your systems running, and we build on
              reputable infrastructure providers rather than hobbyist setups.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              We handle personal data in line with Ghana&apos;s Data Protection Act, 2012 (Act 843) — see the{" "}
              <Link href="/privacy#ghana-dpa" className="text-primary hover:underline">privacy policy</Link> for what
              that means for your rights.
            </p>
          </section>

          {/* Vulnerability reporting */}
          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-on-surface">Vulnerability reporting</h2>
            <p className="text-on-surface-variant leading-relaxed">
              If you believe you&apos;ve found a security vulnerability in our systems, report it to us before making it
              public and give us a reasonable window to respond. We take every report seriously, investigate promptly,
              and won&apos;t take legal action against good-faith researchers following these guidelines.
            </p>
            <p className="text-on-surface-variant">
              Send reports to{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-primary font-medium hover:underline">
                {siteConfig.email}
              </a>{" "}
              with the word <span className="font-mono text-on-surface">SECURITY</span> in the subject line.
            </p>
          </section>

          {/* CTA */}
          <div className="mt-14 p-8 rounded-2xl bg-surface-container dark:bg-surface-container-high border border-outline-variant/20 dark:border-outline-variant/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-xl font-bold text-on-surface">Want this backing your business?</h2>
              <p className="mt-1 text-on-surface-variant text-sm">
                Managed services are built into every package — no add-on pricing.
              </p>
            </div>
            <Link
              href="/services"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold teal-gradient-btn text-white dark:text-on-primary group"
            >
              Compare packages
              <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform duration-200" aria-hidden="true">check</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
