import type { Metadata } from "next";
import NotFoundComponent from "@/components/NotFound";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Gileara Technologies",
  description: "The page you're looking for doesn't exist. Let's get you back on track.",
  alternates: {
    canonical: "/404",
  },
  openGraph: {
    title: "404 - Page Not Found | Gileara Technologies",
    description: "The page you're looking for doesn't exist. Let's get you back on track.",
    url: "/404",
    siteName: "Gileara Technologies",
    type: "website",
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
