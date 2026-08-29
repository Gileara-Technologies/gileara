import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowWeTransformClient from "./HowWeTransformClient";

export const metadata: Metadata = {
  title: "How We Transform | Gileara Technologies",
  description:
    "Vertical transformation playbooks for small and growing businesses — pharmacy, school, restaurant, retail, salon. Honest about what these are: scenarios we're ready to implement, not client claims. Currently informed by our Ghana pilot.",
  alternates: { canonical: "/how-we-transform" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "How We Transform | Gileara Technologies",
    description:
      "Transformation playbooks for small and growing businesses — honest about being playbooks.",
    url: "/how-we-transform",
    siteName: "Gileara Technologies",
    type: "website",
    images: [{ url: "/assets/gileara/og-case-studies.svg", width: 1200, height: 630, alt: "Gileara transformation playbooks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How We Transform | Gileara Technologies",
    description: "Transformation playbooks for small and growing businesses — currently informed by our Ghana pilot, applicable globally.",
    images: ["/assets/gileara/og-case-studies.svg"],
  },
};

export default function HowWeTransformPage() {
  return (
    <>
      <Navbar />
      <main>
        <HowWeTransformClient />
      </main>
      <Footer />
    </>
  );
}