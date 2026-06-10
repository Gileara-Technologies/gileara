import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CinematicStory from "@/components/CinematicStory";
import BentoGrid from "@/components/BentoGrid";
import Positioning from "@/components/Positioning";
import Approach from "@/components/Approach";
import Founders from "@/components/Founders";
import CareersCTA from "@/components/CareersCTA";
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
        <Positioning />
        <Approach />
        <Founders />
        <CareersCTA />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}

