import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CinematicStory from "@/components/CinematicStory";
import BentoGrid from "@/components/BentoGrid";
import Pricing from "@/components/Pricing";
import Approach from "@/components/Approach";
import Founders from "@/components/Founders";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CinematicStory />
        <BentoGrid />
        <Pricing />
        <Approach />
        <Founders />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
