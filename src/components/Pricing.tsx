"use client";

import { motion } from "framer-motion";

export default function Pricing() {
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

  return (
    <section id="solutions" className="py-32 bg-brand-secondary/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold mb-6 text-brand-text">Choose Your Growth Path</h2>
          <p className="text-brand-muted text-lg">Scalable investment tiers for every stage of your digital journey.</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid lg:grid-cols-3 gap-10"
        >
          {/* Tier 1 */}
          <motion.div variants={item} className="glass-card p-12">
            <h3 className="text-2xl font-bold mb-2 text-brand-text">Foundation</h3>
            <p className="text-brand-primary text-sm font-bold uppercase mb-8">Early-Stage Launch</p>
            <ul className="space-y-5 mb-12 text-brand-muted">
              <li className="flex items-center"><span className="material-symbols-outlined mr-3 text-brand-primary text-xl">check_circle</span>Core Platform Build</li>
              <li className="flex items-center"><span className="material-symbols-outlined mr-3 text-brand-primary text-xl">check_circle</span>Standard Security Layer</li>
              <li className="flex items-center"><span className="material-symbols-outlined mr-3 text-brand-primary text-xl">check_circle</span>Strategic Roadmap</li>
            </ul>
            <button className="w-full py-4 bg-brand-surface border border-brand-secondary hover:bg-brand-secondary text-brand-text rounded-xl font-bold transition-all shadow-sm">Start Foundation</button>
          </motion.div>

          {/* Tier 2 (Highlighted) */}
          <motion.div variants={item} className="glass-card p-12 bg-brand-primary/5 border-brand-primary/30 relative overflow-hidden shadow-xl shadow-brand-primary/5 group">
            <div className="absolute top-6 right-6 px-3 py-1 bg-brand-primary text-white rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">Seed / Series A</div>
            <h3 className="text-2xl font-bold mb-2 text-brand-text">Growth System</h3>
            <p className="text-teal-600 dark:text-teal-400 text-sm font-bold uppercase mb-8">Startup Recommended</p>
            <ul className="space-y-5 mb-12 text-brand-text">
              <li className="flex items-center"><span className="material-symbols-outlined mr-3 text-teal-500 text-xl">verified</span>Custom Software Ecosystem</li>
              <li className="flex items-center"><span className="material-symbols-outlined mr-3 text-teal-500 text-xl">verified</span>Advanced Cybersecurity</li>
              <li className="flex items-center"><span className="material-symbols-outlined mr-3 text-teal-500 text-xl">verified</span>Full Cloud Automation</li>
            </ul>
            <button className="w-full py-4 bg-gradient-to-r from-teal-500 to-sky-500 text-white rounded-xl font-bold shadow-lg shadow-sky-500/30 hover:scale-105 transition-all active:scale-95">Accelerate Now</button>
          </motion.div>

          {/* Tier 3 */}
          <motion.div variants={item} className="glass-card p-12">
            <h3 className="text-2xl font-bold mb-2 text-brand-text">Ecosystem</h3>
            <p className="text-brand-primary text-sm font-bold uppercase mb-8">Market Leaders</p>
            <ul className="space-y-5 mb-12 text-brand-muted">
              <li className="flex items-center"><span className="material-symbols-outlined mr-3 text-brand-primary text-xl">check_circle</span>Full-Stack Enterprise Hub</li>
              <li className="flex items-center"><span className="material-symbols-outlined mr-3 text-brand-primary text-xl">check_circle</span>24/7 Managed Security</li>
              <li className="flex items-center"><span className="material-symbols-outlined mr-3 text-brand-primary text-xl">check_circle</span>Infinite Scaling Engine</li>
            </ul>
            <button className="w-full py-4 bg-brand-surface border border-brand-secondary hover:bg-brand-secondary text-brand-text rounded-xl font-bold transition-all shadow-sm">Contact Enterprise</button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
