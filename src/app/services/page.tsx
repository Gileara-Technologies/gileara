import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  title: "Packages & Services | Gileara Technologies",
  description:
    "The five problems we see most in small business, and the systems we build to solve each one — with full pricing, feature matrices, and what's included. Currently piloting in Ghana, built to scale globally.",
  alternates: { canonical: "/services" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "What we build | Gileara Technologies",
    description: "The five problems we see most in small business, and the systems we build to solve each one. With full pricing and feature matrices.",
    url: "/services",
    siteName: "Gileara Technologies",
    type: "website",
    images: [{ url: "/assets/gileara/og-services.svg", width: 1200, height: 630, alt: "Gileara Technologies services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What we build | Gileara Technologies",
    description: "The five problems we see most in small business, and the systems we build to solve each one.",
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