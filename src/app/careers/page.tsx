import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CareersHero from "@/components/careers/CareersHero";
import OpenRoles from "@/components/careers/OpenRoles";
import WhyJoinUs from "@/components/careers/WhyJoinUs";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { openRoles } from "@/content/roles";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Gileara | Careers in Technology and Innovation",
  description:
    "Explore careers, jobs, and growth-focused opportunities at Gileara. Join exceptional talent building innovative technology across remote and on-site roles.",
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
      "Discover remote and on-site opportunities at Gileara and help build the future with exceptional technology talent.",
    url: "/careers",
    siteName: "Gileara Technologies",
    type: "website",
    images: [
      {
        url: "/assets/gileara/og-careers.svg",
        width: 1200,
        height: 630,
        alt: "Careers at Gileara Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Gileara | Careers in Technology and Innovation",
    description:
      "Explore careers, jobs, and growth-focused opportunities with Gileara's technology and innovation teams.",
    images: ["/assets/gileara/og-careers.svg"],
  },
};

const currentDate = new Date().toISOString().split("T")[0];

const jobPostings = openRoles.map((role) => ({
  title: role.title,
  description: role.description,
  skills: role.requiredSkills.join(", "),
  employmentType: "FULL_TIME",
}));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://gileara.org/careers/#webpage",
      name: "Join Gileara | Careers in Technology and Innovation",
      description:
        "Explore careers, jobs, and growth-focused opportunities at Gileara. Join exceptional talent building innovative technology across remote and on-site roles.",
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
    ...jobPostings.map((job) => ({
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
      employmentType: job.employmentType,
      applicantLocationRequirements: {
        "@type": "Country",
        name: "GH",
      },
      skills: job.skills,
      directApply: true,
      url: `https://gileara.org/careers#${job.title.toLowerCase().replace(/\s+/g, "-")}`,
    })),
  ],
};

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar variant="careers" />
      <main>
        <CareersHero />
        <OpenRoles />
        <WhyJoinUs />
        <ApplicationForm />
      </main>
      <Footer />
    </>
  );
}
