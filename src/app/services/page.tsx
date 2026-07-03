import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  title: "Services | Gileara Technologies",
  description:
    "Custom software development, e-commerce platforms, workflow automation, and technology strategy for startups and SMEs.",
  alternates: { canonical: "/services" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Services | Gileara Technologies",
    description: "Solutions built around your business — not off-the-shelf.",
    url: "/services",
    siteName: "Gileara Technologies",
    type: "website",
    images: [{ url: "/assets/gileara/og-services.svg", width: 1200, height: 630, alt: "Gileara Technologies services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Gileara Technologies",
    description: "Solutions built around your business.",
    images: ["/assets/gileara/og-services.svg"],
  },
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <ServicesPageClient />
      </main>
      <Footer />
    </>
  );
}
