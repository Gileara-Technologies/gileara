import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseStudiesClient from "./CaseStudiesClient";
import { caseStudies } from "./data";

export const metadata: Metadata = {
  title: "Case Studies | Gileara Technologies",
  description: "See how we've helped startups and SMEs build custom software, automate workflows, and scale their businesses.",
  alternates: { canonical: "/case-studies" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Case Studies | Gileara Technologies",
    description: "Real projects, real results from Gileara.",
    url: "/case-studies",
    siteName: "Gileara Technologies",
    type: "website",
    images: [{ url: "/assets/gileara/og-case-studies.svg", width: 1200, height: 630, alt: "Gileara case studies" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies | Gileara Technologies",
    description: "Real projects from Gileara.",
    images: ["/assets/gileara/og-case-studies.svg"],
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <Navbar />
      <main>
        <CaseStudiesClient />
      </main>
      <Footer />
    </>
  );
}
