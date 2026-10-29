import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqClient from "./FaqClient";
import { getPublicFaqs } from "@/lib/cms/public-faqs";

// D1 is read per request (D1 first, src/content/faqs.ts fallback -- same
// hybrid rule as the careers portal), so this route is not prerenderable.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ | Gileara Technologies",
  description:
    "Where we work, who we work with, how the engagement works, contracts, and data ownership: straight answers about working with Gileara.",
  alternates: { canonical: "/faq" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "FAQ | Gileara Technologies",
    description: "Straight answers about working with Gileara.",
    url: "/faq",
    siteName: "Gileara Technologies",
    type: "website",
    locale: "en_US",
    // og:image is auto-injected by /faq/opengraph-image.tsx (1200x630 PNG)
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Gileara Technologies",
    description: "Straight answers about working with Gileara.",
    // twitter:image is auto-injected by /faq/opengraph-image.tsx
  },
};

export default async function FaqPage() {
  const faqs = await getPublicFaqs();

  // Schema generated from the exact same list the accordion renders —
  // always in sync, same as before the D1 move.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main>
        <FaqClient faqs={faqs} />
      </main>
      <Footer />
    </>
  );
}