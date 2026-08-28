"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa6";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";

/**
 * The Team — editorial portraits + quotes.
 *
 * Andela's team treatment: alternating left/right layout per person,
 * big portrait, large name, italic quote. No centered card grid.
 *
 * Each founder: portrait on one side, name + role + quote on the
 * other. Alternating sides prevents the symmetric feel.
 */
export default function Founders() {
  const founders = [
    {
      name: "Amos Frederick Hughes",
      role: "Founder & CEO",
      cred: "Leads strategy and client success.",
      quote: "We build what we wish existed when we were running our own businesses.",
      image: "/assets/images/amos.jpg",
      linkedin: "https://linkedin.com/in/amos-frederick-hughes-01570b22a",
    },
    {
      name: "Julian Hagan",
      role: "Co-Founder & COO",
      cred: "Runs delivery and client operations.",
      quote: "Every project is a promise. We keep ours.",
      image: "/assets/images/julian_hagan.jpg",
      linkedin: "https://www.linkedin.com/in/julian-hagan/",
    },
    {
      name: "Rodney Hagan",
      role: "Co-Founder & CTO",
      cred: "Leads platform engineering — MoMo and WhatsApp integrations.",
      quote: "Technology should disappear into the workflow, not demand attention.",
      image: "/assets/images/rodney_hagan.jpg",
      linkedin: "https://www.linkedin.com/in/haganrodney/",
    },
  ];

  return (
    <section id="founders" className="relative bg-surface-container py-32 md:py-48 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20 md:mb-28">
          <div className="col-span-12 lg:col-span-7">
            <RevealText>
              <SectionLabel number="05" label="THE TEAM" className="mb-8" />
            </RevealText>
            <DisplayHeading size="lg" as="h2" className="mb-8">
              The team behind{" "}
              <span className="italic text-accent-cyan">the systems.</span>
            </DisplayHeading>
            <RevealText delay={0.15}>
              <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                When you work with Gileara, you work directly with the founders. No account managers. No hand-offs.
              </p>
            </RevealText>
          </div>
        </div>

        {/* Alternating founder rows */}
        <div className="space-y-24 md:space-y-32">
          {founders.map((f, i) => {
            const portraitLeft = i % 2 === 0; // alternate
            return (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-8 items-center"
              >
                {/* Portrait */}
                <div className={`col-span-12 md:col-span-5 ${portraitLeft ? "md:order-1" : "md:order-2 md:col-start-8"}`}>
                  <div className="relative aspect-[4/5] bg-surface-container-high rounded-xl overflow-hidden group">
                    <Image
                      src={f.image}
                      alt={f.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 42vw"
                      className="object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    />
                    <a
                      href={f.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${f.name} on LinkedIn`}
                      className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-accent-bright hover:text-background"
                    >
                      <FaLinkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Text */}
                <div className={`col-span-12 md:col-span-7 ${portraitLeft ? "md:order-2 md:col-start-6" : "md:order-1"}`}>
                  <div className={`max-w-xl ${portraitLeft ? "md:ml-auto" : ""}`}>
                    <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                      0{i + 1}
                    </div>
                    <h3 className="font-serif text-display-sm text-on-background leading-tight tracking-[-0.02em] mb-3">
                      {f.name}
                    </h3>
                    <div className="font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-8">
                      {f.role}
                    </div>
                    <blockquote className="border-l-2 border-accent-bright pl-6 mb-6">
                      <p className="font-serif text-xl md:text-2xl text-on-surface leading-snug italic">
                        &ldquo;{f.quote}&rdquo;
                      </p>
                    </blockquote>
                    <p className="text-on-surface-variant text-base">
                      {f.cred}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer link */}
        <div className="mt-24 pt-12 border-t border-on-background/10 flex justify-center">
          <Link
            href="/about"
            className="group inline-flex items-center gap-3 pl-8 pr-14 py-4 rounded-pill border border-on-background/20 text-on-background font-medium hover:border-accent-bright hover:text-accent-bright transition-colors duration-300"
          >
            Meet the Full Team
            <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1.5">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
