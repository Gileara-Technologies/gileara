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
 * Hero — full-bleed background image carousel.
 *
 * The hero section is a full-screen-height (min-h-[88vh]) block with
 * a 6-image carousel as the background. Headline + CTAs + benefits
 * sit centered on top of a dark gradient overlay so the text stays
 * readable. Auto-rotates every 5s; manual dot navigation at the
 * bottom. Caption chip on each slide.
 */
export default function Hero() {
  const benefits = [
    "Spreadsheets → live data",
    "Chat threads → one inbox",
    "Lost leads → followed up",
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
    <section
      className="relative min-h-[88vh] flex items-center bg-background overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Background carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          {SLIDES.map(
            (slide, i) =>
              i === index && (
                <motion.div
                  key={slide.src}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  aria-hidden={i !== index}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                  {/* Dark gradient for text readability */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(8, 20, 32, 0.55) 0%, rgba(8, 20, 32, 0.75) 50%, rgba(8, 20, 32, 0.95) 100%)",
                    }}
                    aria-hidden="true"
                  />
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full pt-32 md:pt-40 pb-32 md:pb-40 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-4xl">
            <RevealText>
              <SectionLabel number="00" label="THE PROBLEM WE SEE" className="mb-8 md:mb-10" />
            </RevealText>

            <DisplayHeading size="xl" as="h1" className="mb-8 md:mb-10 text-on-background">
              We build the systems
              <br />
              your business{" "}
              <span className="italic text-accent-cyan">runs on.</span>
            </DisplayHeading>

            <RevealText delay={0.15}>
              <p className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-6 md:mb-8">
                Outcomes over code · Managed from day one · Built for how business actually runs
              </p>
            </RevealText>

            <RevealText delay={0.2}>
              <p className="text-body-lg md:text-2xl text-on-background/85 max-w-2xl leading-relaxed font-sans mb-10 md:mb-12">
                We see the same problem in small business everywhere: the work that should be invisible — stock, sales, customers, cashflow — is still eating your week. We build the systems that fix it, currently piloting in Ghana and built to scale with you.
              </p>
            </RevealText>

            <RevealText delay={0.35}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 mb-12 md:mb-16">
                <MagneticButton href="/contact" variant="primary" size="lg">
                  Book a Free Consultation
                </MagneticButton>
                <a
                  href="#packages"
                  className="text-on-background/85 hover:text-accent-bright font-medium transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  See Our Packages
                </a>
              </div>
            </RevealText>

            <RevealText delay={0.5}>
              <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm md:text-base font-sans text-on-background/85">
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
        </div>
      </div>

      {/* Carousel controls — bottom of viewport */}
      <div className="absolute bottom-8 left-0 right-0 z-10 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto flex items-end justify-between gap-6">
          {/* Current caption */}
          <AnimatePresence mode="wait">
            <motion.div
              key={SLIDES[index].caption}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-bright" />
              <span className="font-mono text-label uppercase tracking-[0.2em] text-on-background">
                {SLIDES[index].caption}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex items-center gap-2 ml-auto">
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
        </div>
      </div>
    </section>
  );
}
