import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactBand from "@/components/ContactBand";

import { scenarios, scenarioPackages } from "@/content/scenarios";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return scenarios.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = scenarios.find((s) => s.id === slug);
  if (!scenario) return {};
  return {
    title: `${scenario.vertical} Playbook | How We Transform | Gileara Technologies`,
    description: `${scenario.headline} — a transformation playbook for ${scenario.vertical.toLowerCase()} businesses. Goals stated honestly as goals. Currently informed by our Ghana pilot.`,
    alternates: { canonical: `/how-we-transform/${scenario.id}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${scenario.vertical} Playbook | Gileara Technologies`,
      description: scenario.headline,
      url: `/how-we-transform/${scenario.id}`,
      siteName: "Gileara Technologies",
      type: "article",
    },
  };
}

const base = "https://gileara.org";

export default async function ScenarioPage({ params }: PageProps) {
  const { slug } = await params;
  const scenario = scenarios.find((s) => s.id === slug);
  if (!scenario) notFound();

  const pkgs = scenarioPackages(scenario);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${base}/how-we-transform/${scenario.id}/#playbook`,
        headline: scenario.headline,
        name: `${scenario.vertical} Playbook`,
        description: scenario.ghanaContext,
        articleSection: scenario.vertical,
        about: scenario.painPoints[0],
        inLanguage: "en",
        author: { "@id": `${base}/#organization` },
        publisher: { "@id": `${base}/#organization` },
        isPartOf: { "@id": `${base}/how-we-transform/#playbook-list` },
        url: `${base}/how-we-transform/${scenario.id}`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${base}/how-we-transform/${scenario.id}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: base },
          { "@type": "ListItem", position: 2, name: "How we solve it", item: `${base}/how-we-transform` },
          { "@type": "ListItem", position: 3, name: `${scenario.vertical} Playbook`, item: `${base}/how-we-transform/${scenario.id}` },
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
      <Navbar />
      <main className="bg-background pt-36 pb-24 px-4 md:px-10">
        <div className="max-w-3xl mx-auto">
          <Link href="/how-we-transform" className="font-mono text-xs uppercase tracking-widest text-outline hover:text-primary transition-colors">
            ← All playbooks
          </Link>

          {/* Header */}
          <div className="mt-8 flex items-start justify-between gap-4 flex-wrap">
            <span className="material-symbols-outlined text-secondary dark:text-primary text-5xl" aria-hidden>
              {scenario.icon}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-surface-container-high text-on-surface-variant">
              {scenario.status}
            </span>
          </div>
          <p className="mt-6 font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">{scenario.vertical}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-primary dark:text-on-background leading-tight">
            {scenario.headline}
          </h1>

          {/* Goals banner — persistent honesty contract */}
          <div className="mt-8 p-5 rounded-2xl border border-secondary/30 dark:border-primary/25 bg-surface-container dark:bg-surface-container-high">
            <p className="text-sm text-on-surface-variant">
              <span className="font-semibold text-primary dark:text-on-background">This is a playbook, not a case study.</span>{" "}
              No client yet — the outcomes below are goals we work toward with you, not results we&apos;re claiming.
            </p>
          </div>

          {/* Pains */}
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-widest text-outline mb-4">Where businesses like this hurt</h2>
            <ul className="space-y-3">
              {scenario.painPoints.map((pain) => (
                <li key={pain} className="flex items-start gap-3 text-on-surface leading-relaxed">
                  <span aria-hidden className="mt-2 w-1.5 h-1.5 rounded-full bg-secondary dark:bg-primary shrink-0" />
                  {pain}
                </li>
              ))}
            </ul>
          </section>

          {/* Implementation */}
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-widest text-outline mb-4">How we&apos;d implement it</h2>
            <ol className="space-y-0">
              {scenario.implementation.map((step, i) => (
                <li key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 rounded-full bg-secondary/10 dark:bg-primary/20 text-secondary dark:text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {i < scenario.implementation.length - 1 && (
                      <span aria-hidden className="w-px flex-1 bg-outline-variant/30 dark:bg-outline-variant/15 mt-1" />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className="font-display font-bold text-on-surface">{step.phase}</p>
                    <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Packages used */}
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-widest text-outline mb-4">Built on these packages</h2>
            <div className="flex flex-wrap gap-3">
              {pkgs.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/services#${pkg.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container dark:bg-surface-container-high border border-outline-variant/20 dark:border-outline-variant/10 hover:border-primary/40 transition-colors"
                >
                  <span className="font-semibold text-sm text-on-surface">{pkg.name}</span>
                  <span className="font-mono text-xs text-outline">from ${pkg.tiers[0].monthlyFeeUsd}/mo</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Target outcomes — explicitly goals */}
          <section className="mt-12 p-6 md:p-8 rounded-2xl bg-surface-container dark:bg-surface-container-high border border-outline-variant/20 dark:border-outline-variant/10">
            <h2 className="font-display text-xl font-bold text-primary dark:text-on-background mb-4">Target outcomes</h2>
            <p className="font-mono text-[11px] uppercase tracking-widest text-outline mb-4">Goals we aim for together — not promised numbers</p>
            <ul className="space-y-3">
              {scenario.targetOutcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-3 text-on-surface leading-relaxed">
                  <span className="material-symbols-outlined text-base mt-1 text-secondary dark:text-primary shrink-0" aria-hidden="true">check</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </section>

          {/* Local-context pull-quote */}
          <section className="mt-8 border-l-4 border-secondary/50 dark:border-primary/40 pl-5 py-1">
            <p className="text-sm md:text-base text-on-surface-variant italic leading-relaxed">{scenario.ghanaContext}</p>
          </section>
        </div>
      </main>

      {/* In-page contact band — placed just above the footer.
         Founding-client positioning lives inside the playbook card above. */}
      <ContactBand
        eyebrow="YOUR BUSINESS COULD BE THE REAL STORY"
        headline={
          <>
            Be the founding client for your{" "}
            <span className="italic text-accent-cyan">{scenario.vertical.toLowerCase()}</span>.
          </>
        }
        body={`Founding clients get priority onboarding and a documented ${scenario.vertical.toLowerCase()} transformation story — published with your approval, when the results are real.`}
      />
      <Footer />
    </>
  );
}
