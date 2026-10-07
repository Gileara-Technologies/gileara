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
            <span className="italic text-accent-cyan">what small businesses run on.</span>
          </>
        }
        subtitle="We're always looking for engineers and designers who want to grow with the team. Four roles are open now: full-stack (two seats), UI/UX, DevOps, and project management."
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
              Ghana first,{" "}
              <span className="italic text-accent-cyan">global by design.</span>
            </h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              Gileara Technologies builds the systems small businesses run on, from Next.js interfaces to Postgres schemas and Cloudflare Workers deploys. We pilot in Ghana and design for global scale. The team is small, so hard technical problems get solved together and everyone gets time to keep learning.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
