import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CareersHero from "@/components/careers/CareersHero";
import OpenRoles from "@/components/careers/OpenRoles";
import WhyJoinUs from "@/components/careers/WhyJoinUs";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { getPublicRoles } from "@/lib/portal/public-roles";
import { Metadata } from "next";

// D1 is read per request (D1 first, src/content/roles.ts fallback —
// decision Q5 in docs/PORTAL-PLAN.md), so this page is never prerendered.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Join Gileara | Careers in Technology and Innovation",
  description:
    "Open roles at Gileara Technologies: full-stack engineering (two seats), UI/UX design, DevOps, and project management. Accra hybrid and remote.",
  alternates: {
    canonical: "/careers",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Gileara careers",
    "Join Gileara",
    "technology jobs",
    "innovation careers",
    "remote technology opportunities",
    "on-site technology roles",
    "software engineering jobs",
    "product design jobs",
    "growth-focused culture",
    "Gileara Technologies jobs",
  ],
  openGraph: {
    title: "Join Gileara | Careers in Technology and Innovation",
    description:
      "Build the systems small businesses run on. Four roles open now: full-stack (two seats), UI/UX, DevOps, and project management.",
    url: "/careers",
    siteName: "Gileara Technologies",
    type: "website",
    locale: "en_US",
    // og:image is auto-injected by /careers/opengraph-image.tsx (1200x630 PNG)
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Gileara | Careers in Technology and Innovation",
    description:
      "Four roles open at Gileara: full-stack (two seats), UI/UX, DevOps, and project management. Accra hybrid and remote.",
    // twitter:image is auto-injected by /careers/opengraph-image.tsx
  },
};

const jobPostingUrl = (title: string) =>
  `https://gileara.org/careers#${title.toLowerCase().replace(/\s+/g, "-")}`;

/** JobPosting JSON-LD for the fetched open roles (fallback keeps the current behavior). */
function buildJsonLd(roles: { title: string; description: string; requiredSkills: string[] }[], currentDate: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://gileara.org/careers/#webpage",
        name: "Join Gileara | Careers in Technology and Innovation",
        description:
          "Open roles at Gileara Technologies: full-stack engineering (two seats), UI/UX design, DevOps, and project management. Accra hybrid and remote.",
        url: "https://gileara.org/careers",
        dateModified: currentDate,
        publisher: {
          "@type": "Organization",
          name: "Gileara Technologies",
          url: "https://gileara.org",
          logo: "https://gileara.org/assets/gileara/logo-icon.png",
        },
        breadcrumb: { "@id": "https://gileara.org/careers/#breadcrumb" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://gileara.org/careers/#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://gileara.org" },
          { "@type": "ListItem", position: 2, name: "Careers", item: "https://gileara.org/careers" },
        ],
      },
      ...roles.map((job) => ({
        "@type": "JobPosting",
        title: job.title,
        description: job.description,
        datePosted: currentDate,
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
        skills: job.requiredSkills.join(", "),
        directApply: true,
        url: jobPostingUrl(job.title),
      })),
    ],
  };
}

export default async function CareersPage() {
  const roles = await getPublicRoles();
  const currentDate = new Date().toISOString().split("T")[0];
  const jsonLd = buildJsonLd(roles, currentDate);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar variant="careers" />
      <main>
        <CareersHero />
        <OpenRoles roles={roles} />
        <WhyJoinUs />
        <ApplicationForm positionOptions={roles.map((role) => role.title)} />
      </main>
      <Footer />
    </>
  );
}
