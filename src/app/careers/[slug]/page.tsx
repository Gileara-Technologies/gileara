import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { getPublicRole } from "@/lib/portal/public-roles";
import type { ParsedRole } from "@/lib/portal/types";

// Dynamic on purpose: the role comes from D1 per request (with the
// src/content/roles.ts fallback), so this route is never prerendered
// and deliberately has no generateStaticParams.
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

const base = "https://gileara.org";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const role = await getPublicRole(slug);
  if (!role) return {};
  return {
    title: `${role.title} | Careers | Gileara Technologies`,
    description: role.description,
    alternates: {
      canonical: `/careers/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${role.title} | Gileara Technologies`,
      description: role.description,
      url: `/careers/${slug}`,
      siteName: "Gileara Technologies",
      type: "website",
      locale: "en_US",
      // og:image is auto-injected by /careers/[slug]/opengraph-image.tsx
    },
    twitter: {
      card: "summary_large_image",
      title: `${role.title} | Careers | Gileara Technologies`,
      description: role.description,
      // twitter:image is auto-injected by /careers/[slug]/opengraph-image.tsx
    },
  };
}

function buildJsonLd(role: ParsedRole, slug: string, currentDate: string) {
  const url = `${base}/careers/${slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        name: role.title,
        description: role.description,
        url,
        dateModified: currentDate,
        publisher: {
          "@type": "Organization",
          name: "Gileara Technologies",
          url: base,
          logo: `${base}/assets/gileara/logo-icon.png`,
        },
        breadcrumb: { "@id": `${url}/#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: base },
          { "@type": "ListItem", position: 2, name: "Careers", item: `${base}/careers` },
          { "@type": "ListItem", position: 3, name: role.title, item: url },
        ],
      },
      {
        "@type": "JobPosting",
        title: role.title,
        description: role.description,
        datePosted: role.createdAt ? role.createdAt.slice(0, 10) : currentDate,
        hiringOrganization: {
          "@type": "Organization",
          name: "Gileara Technologies",
          sameAs: "https://www.linkedin.com/company/gileara",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "GH",
            addressLocality: "Accra",
          },
        },
        employmentType: "FULL_TIME",
        applicantLocationRequirements: {
          "@type": "Country",
          name: "GH",
        },
        skills: role.requiredSkills.join(", "),
        directApply: true,
        url,
      },
    ],
  };
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-on-surface text-sm leading-relaxed">
          <span className="material-symbols-outlined text-accent-bright text-base shrink-0 mt-0.5">
            arrow_right
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function SkillChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <span
          key={idx}
          className="px-3 py-1.5 bg-background/60 border border-on-background/20 rounded-pill text-xs text-on-background font-medium"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default async function CareerRolePage({ params }: Props) {
  const { slug } = await params;
  const role = await getPublicRole(slug);
  if (!role) notFound();

  const currentDate = new Date().toISOString().split("T")[0];
  const jsonLd = buildJsonLd(role, slug, currentDate);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar variant="careers" />
      <main>
        <PageHero
          eyebrow="OPEN ROLE"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Careers", href: "/careers" },
            { label: role.title, href: `/careers/${slug}` },
          ]}
          headline={role.title}
          subtitle={role.description}
        />

        <section className="bg-background py-16 md:py-24 px-6 md:px-12 border-t border-on-background/10">
          <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12">
            {/* Icon + role facts */}
            <div className="col-span-12 md:col-span-3 lg:col-span-2">
              <span className="material-symbols-outlined text-4xl text-accent-bright" aria-hidden="true">
                {role.icon}
              </span>
              <dl className="mt-8 space-y-6">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                    Location
                  </dt>
                  <dd className="flex items-start gap-2 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-base text-accent-bright shrink-0" aria-hidden="true">
                      location_on
                    </span>
                    {role.location}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                    Openings
                  </dt>
                  <dd className="flex items-start gap-2 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-base text-accent-bright shrink-0" aria-hidden="true">
                      group
                    </span>
                    {role.openings} {role.openings === 1 ? "opening" : "openings"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* What the role involves */}
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                <div>
                  <h2 className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                    Key Responsibilities
                  </h2>
                  <BulletList items={role.responsibilities} />
                </div>

                <div>
                  <h2 className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                    Required Skills
                  </h2>
                  <SkillChips items={role.requiredSkills} />

                  {role.niceToHave.length > 0 && (
                    <>
                      <h2 className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4 mt-10">
                        Nice to Have
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {role.niceToHave.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 border border-on-background/10 rounded-pill text-xs text-on-surface-variant"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ApplicationForm position={role.title} roleId={role.id} />
      </main>
      <Footer />
    </>
  );
}
