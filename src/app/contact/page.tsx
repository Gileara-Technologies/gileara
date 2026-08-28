import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ContactStepper from "@/components/scheduling/ContactStepper";

import { FaWhatsapp } from "react-icons/fa6";
import { siteConfig } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Book a Free Consultation | Gileara Technologies",
  description:
    "Thirty minutes, free. Tell us about your business and we'll map your goals to the right transformation package — even if you don't buy.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Book a Free Consultation | Gileara Technologies",
    description: "Tell us about your business — we'll recommend the right package for your goals.",
    url: "/contact",
    siteName: "Gileara Technologies",
    type: "website",
    images: [{ url: "/assets/gileara/og-services.svg", width: 1200, height: 630, alt: "Gileara Technologies consultation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Free Consultation | Gileara Technologies",
    description: "Tell us about your business — we'll recommend the right package.",
    images: ["/assets/gileara/og-services.svg"],
  },
};

const phoneReady = !siteConfig.phone.includes("XX");
const whatsappReady = !siteConfig.whatsapp.includes("XX");

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="GET STARTED"
          headline={
            <>
              Let&apos;s talk about{" "}
              <span className="italic text-accent-cyan">your business.</span>
            </>
          }
          subtitle="Thirty minutes, free. We'll map your goals to the right package — even if you don't buy."
        />

        <section className="bg-background py-20 md:py-28 px-6 md:px-12 border-t border-on-background/10">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-12 gap-x-8 gap-y-16 items-start">
              {/* Left: contact rails */}
              <div className="col-span-12 lg:col-span-5">
                <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-6">
                  All times {siteConfig.timezone} · {siteConfig.location}
                </div>

                <div className="space-y-6">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-start gap-5 py-8 border-t border-on-background/10 group"
                  >
                    <span className="material-symbols-outlined text-2xl text-accent-bright shrink-0 mt-1">mail</span>
                    <div>
                      <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                        Send an Email
                      </div>
                      <span className="font-serif text-2xl text-on-background group-hover:text-accent-bright transition-colors">
                        {siteConfig.email}
                      </span>
                    </div>
                  </a>

                  {(phoneReady || whatsappReady) && (
                    <a
                      href={whatsappReady ? `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}` : `tel:${siteConfig.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-5 py-8 border-t border-on-background/10 group"
                    >
                      <FaWhatsapp className="w-6 h-6 text-accent-bright shrink-0 mt-1" />
                      <div>
                        <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                          Call or WhatsApp
                        </div>
                        <span className="font-serif text-2xl text-on-background group-hover:text-accent-bright transition-colors">
                          {whatsappReady ? siteConfig.whatsapp : siteConfig.phone}
                        </span>
                      </div>
                    </a>
                  )}

                  <div className="flex items-start gap-5 py-8 border-t border-b border-on-background/10">
                    <span className="material-symbols-outlined text-2xl text-accent-bright shrink-0 mt-1">schedule</span>
                    <div>
                      <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                        Response time
                      </div>
                      <span className="text-on-background text-lg">
                        Within 1 business day
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-12 text-on-surface-variant text-sm max-w-md">
                  Prefer email? Write to us any time — a real person (usually the founders) reads and replies.
                </p>
              </div>

              {/* Right: stepper */}
              <div className="col-span-12 lg:col-span-7 lg:col-start-7">
                <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-6">
                  Or pick a time
                </div>
                <ContactStepper />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
