"use client";

import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";

export default function CareersHero() {
  return (
    <>
      <PageHero
        number="01"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Careers", href: "/careers" }]}
        eyebrow="CAREERS AT GILEARA"
        headline={
          <>
            Join the team building{" "}
            <span className="italic text-accent-cyan">what&apos;s next.</span>
          </>
        }
        subtitle="Help us build innovative solutions that make a real impact. We are always looking for passionate individuals who want to grow, learn, and contribute to meaningful projects."
      />

      <section className="bg-background py-16 md:py-24 px-6 md:px-12 border-t border-on-background/10">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-6">
              Who we are
            </div>
            <h2 className="font-serif text-2xl md:text-display-sm text-on-background leading-tight tracking-[-0.02em] mb-6">
              Built on{" "}
              <span className="italic text-accent-cyan">innovation, collaboration,</span> and continuous learning.
            </h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              Gileara Technologies is built on a foundation of innovation, collaboration, and continuous learning. We don&apos;t just write code; we design robust systems that power modern businesses. Our culture values excellence, creative problem-solving, and the drive to tackle complex technical challenges in a supportive environment.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
