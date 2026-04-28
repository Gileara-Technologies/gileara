import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import TechMarquee from "@/components/TechMarquee";
import About from "@/components/About";
import BentoGrid from "@/components/BentoGrid";
import Pricing from "@/components/Pricing";
import Deployments from "@/components/Deployments";
import Approach from "@/components/Approach";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <TechMarquee />
        <About />
        <BentoGrid />
        <Pricing />
        <Deployments />
        <Approach />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
