import type { Metadata } from "next";
import UnderMaintenance from "@/components/UnderMaintenance";

export const metadata: Metadata = {
  title: "Under Maintenance | Gileara Technologies",
  description: "We're performing scheduled maintenance. Please check back soon.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/maintenance",
  },
};

export default function MaintenancePage() {
  return <UnderMaintenance fullPage />;
}
