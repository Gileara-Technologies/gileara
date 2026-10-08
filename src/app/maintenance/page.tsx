import type { Metadata } from "next";
import UnderMaintenance from "@/components/UnderMaintenance";

export const metadata: Metadata = {
  title: "Under Maintenance | Gileara Technologies",
  description: "We're performing scheduled maintenance. Please check back soon.",
  // noindex but keep following links: crawlers should still reach live pages.
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/maintenance",
  },
  openGraph: {
    title: "Under Maintenance | Gileara Technologies",
    description: "We're performing scheduled maintenance. Please check back soon.",
    url: "/maintenance",
    siteName: "Gileara Technologies",
    type: "website",
    locale: "en_US",
    // og:image is auto-injected by /opengraph-image.tsx (1200x630 PNG)
  },
  twitter: {
    card: "summary_large_image",
    title: "Under Maintenance | Gileara Technologies",
    description: "We're performing scheduled maintenance. Please check back soon.",
    // twitter:image is auto-injected by /opengraph-image.tsx
  },
};

export default function MaintenancePage() {
  return <UnderMaintenance fullPage />;
}
