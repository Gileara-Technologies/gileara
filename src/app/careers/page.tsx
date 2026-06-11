import CareersNavbar from "@/components/careers/CareersNavbar";
import Footer from "@/components/Footer";
import CareersHero from "@/components/careers/CareersHero";
import OpenRoles from "@/components/careers/OpenRoles";
import WhyJoinUs from "@/components/careers/WhyJoinUs";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Gileara Technologies",
  description: "Join Gileara Technologies and help us build innovative solutions. Explore open roles in frontend, backend, QA, DevOps, and Design.",
};

export default function CareersPage() {
  return (
    <>
      <CareersNavbar />
      <main>
        <CareersHero />
        <OpenRoles />
        <WhyJoinUs />
        <ApplicationForm />
      </main>
      <Footer />
    </>
  );
}
