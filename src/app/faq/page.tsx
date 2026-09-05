import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqClient from "./FaqClient";
import { faqs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "FAQ | Gileara Technologies",
  description:
    "Where we work, who we work with, how the engagement works, contracts and data ownership — straight answers about working with Gileara.",
  alternates: { canonical: "/faq" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "FAQ | Gileara Technologies",
    description: "Straight answers about working with Gileara.",
    url: "/faq",
    siteName: "Gileara Technologies",
    type: "website",
    // og:image is auto-injected by /opengraph-image.tsx (1200x630 PNG)
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Gileara Technologies",
    description: "Straight answers about working with Gileara.",
    // twitter:image is auto-injected by /opengraph-image.tsx
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