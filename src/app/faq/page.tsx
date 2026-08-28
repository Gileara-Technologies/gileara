import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqClient from "./FaqClient";
import { faqs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "FAQ | Gileara Technologies",
  description:
    "Pricing, MTN MoMo billing, managed services, contracts and data ownership, spreadsheet migration — straight answers about Gileara's transformation packages.",
  alternates: { canonical: "/faq" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "FAQ | Gileara Technologies",
    description: "Straight answers about working with Gileara.",
    url: "/faq",
    siteName: "Gileara Technologies",
    type: "website",
    images: [{ url: "/assets/gileara/og-faq.svg", width: 1200, height: 630, alt: "Gileara FAQ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Gileara Technologies",
    description: "Straight answers about working with Gileara.",
    images: ["/assets/gileara/og-faq.svg"],
  },
};

// Schema generated from the same module the accordion renders — always in sync.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main>
        <FaqClient />
      </main>
      <Footer />
    </>
  );
}