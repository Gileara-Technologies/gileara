"use client";

import { motion } from "framer-motion";

export default function CareersHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-secondary/[0.02]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium tracking-wide uppercase mb-6">
            Careers at Gileara
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-on-background tracking-tight mb-8">
            Join Our Team
          </h1>
          <p className="font-sans text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-12">
            Help us build innovative solutions that make a real impact. We are always looking for passionate individuals who want to grow, learn, and contribute to meaningful projects.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-surface-container-low dark:bg-surface-container p-8 md:p-12 rounded-3xl border border-outline-variant/20 shadow-sm text-left"
        >
          <h2 className="font-display text-2xl font-bold text-primary mb-4">Who We Are</h2>
          <p className="text-on-surface-variant leading-relaxed">
            Gileara Technologies is built on a foundation of innovation, collaboration, and continuous learning. We don't just write code; we design robust systems that power modern businesses. Our culture values excellence, creative problem-solving, and the drive to tackle complex technical challenges in a supportive environment.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
