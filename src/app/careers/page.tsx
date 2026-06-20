import CareersNavbar from "@/components/careers/CareersNavbar";
import Footer from "@/components/Footer";
import CareersHero from "@/components/careers/CareersHero";
import OpenRoles from "@/components/careers/OpenRoles";
import WhyJoinUs from "@/components/careers/WhyJoinUs";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Gileara | Careers in Technology and Innovation",
  description:
    "Explore careers, jobs, and growth-focused opportunities at Gileara. Join exceptional talent building innovative technology across remote and on-site roles.",
  alternates: {
    canonical: "/careers",
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
        url: "/assets/gileara/logo-full.png",
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
    images: ["/assets/gileara/logo-full.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Join Gileara | Careers in Technology and Innovation",
  description:
    "Explore careers, jobs, and growth-focused opportunities at Gileara. Join exceptional talent building innovative technology across remote and on-site roles.",
  url: "https://gileara.org/careers",
  dateModified: new Date().toISOString().split("T")[0],
  publisher: {
    "@type": "Organization",
    name: "Gileara Technologies",
    url: "https://gileara.org",
    logo: "https://gileara.org/assets/gileara/logo-icon.png",
  },
};

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CareersNavbar />
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
