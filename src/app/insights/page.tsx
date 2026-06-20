import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Insights | Gileara Technologies",
  description:
    "Technical insights, engineering perspectives, and strategic thinking from the team at Gileara Technologies.",
  alternates: {
    canonical: "/insights",
  },
  openGraph: {
    title: "Insights | Gileara Technologies",
    description:
      "Technical insights, engineering perspectives, and strategic thinking from the team at Gileara.",
    url: "/insights",
    siteName: "Gileara Technologies",
    type: "website",
    images: [
      {
        url: "/assets/gileara/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Gileara Technologies insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights | Gileara Technologies",
    description: "Technical insights from the team at Gileara.",
    images: ["/assets/gileara/logo-full.png"],
  },
};

export default function InsightsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20 text-on-surface">
        <div className="max-w-4xl mx-auto px-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Insights
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-on-surface mb-6">
            Engineering perspectives for growing businesses.
          </h1>
          <p className="text-lg leading-8 text-on-surface-variant max-w-2xl">
            Technical deep-dives, architecture decisions, and strategy notes from the
            team building production systems for startups and SMEs.
          </p>
          <hr className="my-16 border-outline-variant/20" />
          <p className="text-on-surface-variant text-center py-16">
            Articles coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
