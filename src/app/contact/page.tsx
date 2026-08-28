import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    description:
      "Tell us about your business — we'll recommend the right package for your goals.",
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

// Placeholder rails ("+233 XX …") are not rendered as live contacts until real numbers land in site-config.
const phoneReady = !siteConfig.phone.includes("XX");
const whatsappReady = !siteConfig.whatsapp.includes("XX");

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section id="contact" className="py-24 bg-background px-4 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div>
                <span className="font-mono text-xs text-primary uppercase tracking-widest">Get Started</span>
                <h1 className="font-display text-4xl md:text-5xl font-bold mt-4 text-on-background leading-tight">
                  Let&apos;s talk about your business
                </h1>
                <p className="mt-6 text-on-surface-variant text-lg mb-4">
                  Thirty minutes, free. We&apos;ll map your goals to the right package — even if you don&apos;t buy.
                </p>
                <p className="text-on-surface-variant text-sm mb-12">
                  All times are {siteConfig.timezone} · {siteConfig.location}
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 bg-white dark:bg-surface-container rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-colors group">
                    <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors"><span className="material-symbols-outlined text-lg text-primary" aria-hidden="true">mail</span></div>
                    <div>
                      <p className="font-mono text-xs text-outline uppercase tracking-wider">Send an Email</p>
                      <a className="text-xl font-semibold text-on-surface hover:text-primary transition-colors" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                    </div>
                  </div>

                  {(phoneReady || whatsappReady) && (
                    <div className="flex items-start gap-4 p-6 bg-white dark:bg-surface-container rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-colors group">
                      <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors"><FaWhatsapp className="w-5 h-5 text-primary" /></div>
                      <div>
                        <p className="font-mono text-xs text-outline uppercase tracking-wider">Call or WhatsApp</p>
                        <span className="text-xl font-semibold text-on-surface">{whatsappReady ? siteConfig.whatsapp : siteConfig.phone}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-on-surface-variant">
                    <span>Prefer email? Write to us any time — we reply within one business day.</span>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-surface-container-high p-8 md:p-10 rounded-xl shadow-xl border border-outline-variant/10">
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