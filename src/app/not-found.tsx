import type { Metadata } from "next";
import NotFoundComponent from "@/components/NotFound";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Gileara Technologies",
  description: "The page you're looking for doesn't exist. Let's get you back on track.",
  // No canonical on purpose: /404 is not a real route, and the response
  // already carries a 404 status. Belt-and-braces noindex for soft-404s.
  robots: { index: false, follow: true },
  openGraph: {
    title: "404 - Page Not Found | Gileara Technologies",
    description: "The page you're looking for doesn't exist. Let's get you back on track.",
    url: "/404",
    siteName: "Gileara Technologies",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/gileara/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Gileara Technologies - Page Not Found",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "404 - Page Not Found | Gileara Technologies",
    description: "The page you're looking for doesn't exist. Let's get you back on track.",
    images: ["/assets/gileara/logo-full.png"],
  },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <NotFoundComponent />
    </>
  );
}
