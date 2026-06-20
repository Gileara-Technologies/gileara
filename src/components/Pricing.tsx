"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import UnderMaintenance from "./UnderMaintenance";

export default function Pricing() {
  const isMaintenance = false;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  if (isMaintenance) {
    return (
      <section id="why-gileara" className="py-16 md:py-24 lg:py-32 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="text-center mb-20">
            <h3 className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4">Positioning</h3>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-on-surface">Why Gileara?</h2>
          </div>
          <UnderMaintenance fullPage={false} />
        </div>
      </section>
    );
  }

  return (
    <section id="why-gileara" className="py-16 md:py-24 lg:py-32 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h3 className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4">Positioning</h3>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-on-surface">Why Gileara?</h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">We don't just build apps. We build the technical foundation that allows your business to grow without friction.</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
        >
          <motion.div variants={item} className="glass-card p-8 md:p-12">
            <div className="w-12 h-12 mb-6 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">rocket_launch</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-on-surface">For Startups</h3>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              You have a vision but need the tech to make it real. We act as your external CTO and engineering team, building a scalable MVP that can grow into a market leader.
            </p>
            <ul className="space-y-4 mb-8 text-sm text-on-surface-variant font-medium">
              <li className="flex items-start"><span className="material-symbols-outlined mr-2 text-primary text-lg">check</span>Rapid MVP Development</li>
              <li className="flex items-start"><span className="material-symbols-outlined mr-2 text-primary text-lg">check</span>Scalable Architecture</li>
              <li className="flex items-start"><span className="material-symbols-outlined mr-2 text-primary text-lg">check</span>CTO-level Advisory</li>
            </ul>
          </motion.div>

          <motion.div variants={item} className="glass-card p-8 md:p-12 border-primary/40 dark:border-primary/30 relative overflow-hidden shadow-2xl shadow-primary/5 group bg-primary/[0.03] dark:bg-primary/5">
            <div className="w-12 h-12 mb-6 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl">corporate_fare</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-on-surface">For Growing SMEs</h3>
            <p className="text-on-surface/90 dark:text-on-surface/80 leading-relaxed mb-8">
              Your existing tools are slowing you down. We audit your workflows and build custom systems that automate manual work and connect your operations.
            </p>
            <ul className="space-y-4 mb-8 text-sm text-on-surface font-bold">
              <li className="flex items-start"><span className="material-symbols-outlined mr-2 text-teal-600 dark:text-teal-400 text-lg">verified</span>Workflow Automation</li>
              <li className="flex items-start"><span className="material-symbols-outlined mr-2 text-teal-600 dark:text-teal-400 text-lg">verified</span>Legacy System Upgrades</li>
              <li className="flex items-start"><span className="material-symbols-outlined mr-2 text-teal-600 dark:text-teal-400 text-lg">verified</span>Business Process Design</li>
            </ul>
          </motion.div>

          <motion.div variants={item} className="glass-card p-8 md:p-12">
            <div className="w-12 h-12 mb-6 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">all_inclusive</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-on-surface">For Everyone Else</h3>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              Whether you need a high-end web presence, a secure internal tool, or help with a specific technical challenge — we bring the same engineering rigor to every project.
            </p>
            <ul className="space-y-4 mb-8 text-sm text-on-surface-variant font-medium">
              <li className="flex items-start"><span className="material-symbols-outlined mr-2 text-primary text-lg">check</span>Custom Web Applications</li>
              <li className="flex items-start"><span className="material-symbols-outlined mr-2 text-primary text-lg">check</span>Security & Performance Audits</li>
              <li className="flex items-start"><span className="material-symbols-outlined mr-2 text-primary text-lg">check</span>Technical Support</li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="mt-20 text-center">
          <Link href="#contact" className="btn-primary">
            Start a Conversation
          </Link>
        </div>
      </div>
    </section>
  );
}
