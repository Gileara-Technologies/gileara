"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import MagneticButton from "@/components/MagneticButton";
import RevealText from "@/components/RevealText";

const SLIDES = [
  {
    src: "/assets/imagery/carousel-fashion-boutique.jpg",
    alt: "Customers browsing a fashion boutique in Abuja",
    caption: "Retail",
  },
  {
    src: "/assets/imagery/carousel-flowers.jpg",
    alt: "Couple browsing flowers at a market",
    caption: "Hospitality",
  },
  {
    src: "/assets/imagery/carousel-sale-card.jpg",
    alt: "Smiling woman holding a sale card to inform customers",
    caption: "Sales",
  },
  {
    src: "/assets/imagery/carousel-crate.jpg",
    alt: "A man holding a crate of produce",
    caption: "Distribution",
  },
  {
    src: "/assets/imagery/carousel-apron-workshop.jpg",
    alt: "A man in an apron working in his workshop",
    caption: "Services",
  },
  {
    src: "/assets/imagery/carousel-barber.jpg",
    alt: "Barber shaving a young boy's hair",
    caption: "Personal services",
  },
];

const ROTATE_MS = 5000;

/**
 * Hero — Andela-quality editorial layout with photography.
 *
 * The portrait column is a 6-image carousel (rotates every 5s) showing
 * the different kinds of Ghanaian businesses Gileara serves: retail,
 * hospitality, sales, distribution, services, personal services.
 * Manual dot navigation + pause on hover/focus.
 */
export default function Hero() {
  const benefits = [
    "All-inclusive monthly packages",
    "WhatsApp + MTN MoMo ready",
    "Managed from day one",
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section className="relative bg-background pt-32 md:pt-40 pb-24 md:pb-32 px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-16">
          {/* Text — cols 1-7 */}
          <div className="col-span-12 lg:col-span-7">
            <RevealText>
              <SectionLabel number="00" label="WHAT WE DO" className="mb-8 md:mb-10" />
            </RevealText>

            <DisplayHeading
              size="xl"
              as="h1"
              className="mb-8 md:mb-10"
            >
              We build the{" "}
              <span className="italic text-accent-cyan">digital systems</span>
              <br />
              behind your business.
            </DisplayHeading>

            <RevealText delay={0.2}>
              <p className="text-body-lg md:text-2xl text-on-surface-variant max-w-xl leading-relaxed font-sans mb-10 md:mb-12">
                All-inclusive monthly digital transformation packages for Ghanaian MSMEs — replacing spreadsheets, WhatsApp threads, and manual work with systems built for scale.
              </p>
            </RevealText>

            <RevealText delay={0.35}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 mb-12 md:mb-16">
                <MagneticButton href="/contact" variant="primary" size="lg">
                  Book a Free Consultation
                </MagneticButton>
                <a
                  href="#packages"
                  className="text-on-surface-variant hover:text-accent-bright font-medium transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  See Our Packages
                </a>
              </div>
            </RevealText>

            <RevealText delay={0.5}>
              <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm md:text-base font-sans text-on-surface-variant">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2.5">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="text-accent-bright shrink-0"
                    >
                      <path
                        d="M10.2003 14.8518L18.4731 6.57812L19.7466 7.85073L10.2003 17.397L4.47266 11.6694L5.74526 10.3968L10.2003 14.8518Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </RevealText>
          </div>

          {/* Carousel — cols 8-12 */}
          <div
            className="col-span-12 lg:col-span-5 lg:col-start-8 relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-container"
            >
              <AnimatePresence mode="sync">
                {SLIDES.map(
                  (slide, i) =>
                    i === index && (
                      <motion.div
                        key={slide.src}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                        aria-hidden={i !== index}
                      >
                        <Image
                          src={slide.src}
                          alt={slide.alt}
                          fill
                          priority={i === 0}
                          sizes="(max-width: 1024px) 100vw, 42vw"
                          className="object-cover"
                        />
                        {/* Subtle gradient overlay */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: "linear-gradient(180deg, rgba(8, 20, 32, 0.1) 0%, rgba(8, 20, 32, 0.4) 100%)",
                          }}
                          aria-hidden="true"
                        />
                        {/* Caption chip */}
                        <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-on-background/15">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-bright" />
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-background">
                            {slide.caption}
                          </span>
                        </div>
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </motion.div>

            {/* Dot navigation */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {SLIDES.map((slide, i) => (
                <button
                  key={slide.src}
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${slide.caption} slide`}
                  aria-current={i === index}
                  className="group p-1.5"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      i === index
                        ? "w-8 h-1.5 bg-accent-bright"
                        : "w-1.5 h-1.5 bg-on-background/30 group-hover:bg-on-background/60"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Floating outcome caption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -bottom-16 left-6 right-6 md:left-12 md:right-12 bg-surface-container-lowest/95 backdrop-blur-md border border-on-background/15 rounded-xl px-6 py-5"
            >
              <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-1">
                Outcome
              </div>
              <p className="text-on-background text-sm leading-snug">
                Hours back every week. Errors caught before they cost you. A single view of your business.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
