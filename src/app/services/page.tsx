import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SceneBand from "@/components/three/SceneBand";
import Footer from "@/components/Footer";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  title: "Packages & Services | Gileara Technologies",
  description:
    "Five all-inclusive digital transformation packages for Ghanaian MSMEs — full tier pricing, feature matrices, and managed services included from day one.",
  alternates: { canonical: "/services" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Packages & Services | Gileara Technologies",
    description: "Five transformation packages with transparent USD tier pricing.",
    url: "/services",
    siteName: "Gileara Technologies",
    type: "website",
    images: [{ url: "/assets/gileara/og-services.svg", width: 1200, height: 630, alt: "Gileara Technologies services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Packages & Services | Gileara Technologies",
    description: "Five transformation packages with transparent USD tier pricing.",
    images: ["/assets/gileara/og-services.svg"],
  },
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <SceneBand />
        <ServicesPageClient />
      </main>
      <Footer />
    </>
  );
}
