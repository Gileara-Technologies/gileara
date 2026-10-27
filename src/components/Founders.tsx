"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaLinkedin } from "react-icons/fa6";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";
import { founders } from "@/content/founders";

/**
 * The Team — editorial portraits + quotes.
 *
 * Visual upgrades:
 * - Each portrait row has a subtle parallax on the image (drifts at 60% the
 *   scroll rate of the surrounding text so portraits feel pinned in space)
 * - Founder names are significantly larger — at the "display-sm" scale so
 *   they feel editorial and authoritative
 * - The portrait on hover shifts from grayscale to colour AND gets a teal
 *   inner glow ring at the border, making the interaction feel considered
 * - The LinkedIn icon now sits on a pill badge rather than a plain circle
 */
function FounderRow({ f, i }: { f: (typeof founders)[number]; index: number; i: number }) {
  const portraitLeft = i % 2 === 0;
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-10 items-center"
    >
      {/* Portrait */}
      <div
        className={`col-span-12 md:col-span-5 ${
          portraitLeft ? "md:order-1" : "md:order-2 md:col-start-8"
        }`}
      >
        <div className="relative aspect-[4/5] bg-surface-container-high rounded-2xl overflow-hidden group">
          {/* Parallax image */}
          <motion.div className="absolute inset-0" style={{ y: imgY }}>
            <Image
              src={f.image}
              alt={f.name}
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-[1.08]"
            />
          </motion.div>

          {/* Dark vignette — portrait specific */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700"
            style={{
              background:
                "linear-gradient(180deg, transparent 50%, rgba(8,20,32,0.6) 100%)",
            }}
            aria-hidden="true"
          />

          {/* Teal glow ring on hover */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              boxShadow: "inset 0 0 0 1.5px rgba(94,234,212,0.4)",
            }}
            aria-hidden="true"
          />

          {/* LinkedIn badge */}
          <a
            href={f.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${f.name} on LinkedIn`}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-pill bg-background/80 backdrop-blur-sm text-on-background text-xs font-mono opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent-bright hover:text-background"
          >
            <FaLinkedin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
        </div>
      </div>

      {/* Text */}
      <div
        className={`col-span-12 md:col-span-7 ${
          portraitLeft ? "md:order-2 md:col-start-6" : "md:order-1"
        }`}
      >
        <div className={`max-w-xl ${portraitLeft ? "md:ml-auto" : ""}`}>
          <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
            0{i + 1}
          </div>
          <h3 className="font-serif text-display-sm text-on-background leading-tight tracking-[-0.03em] mb-2">
            {f.name}
          </h3>
          <div className="font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-10">
            {f.role}
          </div>

          {/* Quote — larger, more prominent */}
          <blockquote className="mb-8 pl-5 border-l-2 border-accent-bright/40">
            <p className="font-serif text-xl md:text-2xl text-on-surface leading-relaxed italic">
              &ldquo;{f.quote}&rdquo;
            </p>
          </blockquote>

          <p className="text-on-surface-variant text-base leading-relaxed max-w-[55ch]">
            {f.cred}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Founders() {
  return (
    <section id="founders" className="relative bg-surface-container py-section px-6 md:px-12 overflow-hidden">
      {/* Decorative: very faint teal arc in the top-right corner */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(94,234,212,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Header */}
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20 md:mb-28">
          <div className="col-span-12 lg:col-span-7">
            <RevealText>
              <SectionLabel label="THE TEAM" className="mb-8" />
            </RevealText>
            <DisplayHeading size="lg" as="h2" className="mb-8">
              The team behind{" "}
              <span className="italic text-accent-bright">the systems.</span>
            </DisplayHeading>
            <RevealText delay={0.15}>
              <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                When you work with Gileara, you work directly with the founders. There are no account managers and no hand-offs.
              </p>
            </RevealText>
          </div>
        </div>

        {/* Alternating founder rows */}
        <div className="space-y-28 md:space-y-36">
          {founders.map((f, i) => (
            <FounderRow key={f.name} f={f} i={i} index={i} />
          ))}
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
