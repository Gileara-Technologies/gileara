import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQ | Gileara Technologies",
  description: "Frequently asked questions about Gileara's services, process, pricing, and how we work with startups and SMEs.",
  alternates: { canonical: "/faq" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "FAQ | Gileara Technologies",
    description: "Common questions about working with Gileara.",
    url: "/faq",
    siteName: "Gileara Technologies",
    type: "website",
    images: [{ url: "/assets/gileara/og-faq.svg", width: 1200, height: 630, alt: "Gileara FAQ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Gileara Technologies",
    description: "Common questions about working with Gileara.",
    images: ["/assets/gileara/og-faq.svg"],
  },
};

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main>
        <FaqClient />
      </main>
      <Footer />
    </>
  );
}
