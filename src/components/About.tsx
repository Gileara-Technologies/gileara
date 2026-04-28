"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-32 border-y border-brand-secondary bg-brand-surface/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-6 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-brand-text">
          Beyond basic builds. We create <span className="text-brand-primary">Living Systems</span>.
        </h2>
        <p className="text-2xl text-brand-muted leading-relaxed font-light italic">
          "Traditional software is static. Gileara systems are dynamic—designed to evolve, secure themselves, and scale as your vision grows."
        </p>
      </motion.div>
    </section>
  );
}
