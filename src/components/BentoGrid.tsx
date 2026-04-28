"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function BentoGrid() {
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="services" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
        >
          <div>
            <h3 className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4">Core Expertise</h3>
            <h2 className="text-5xl font-bold text-brand-text">The Gileara Ecosystem</h2>
          </div>
          <p className="text-brand-muted max-w-sm mb-2">Integrated solutions where security and performance are baked into the core architecture.</p>
        </motion.div>
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="bento-grid"
        >
          {/* Security (Large) */}
          <motion.div variants={item} className="image-card lg:col-span-2 group overflow-hidden relative">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/assets/security.png')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent"></div>
            <div className="scanline"></div>
            <div className="relative z-10 p-10 h-full flex flex-col">
              <div className="w-16 h-16 mb-8 relative flex items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary group-hover:scale-110 transition-transform duration-500 backdrop-blur-md border border-brand-primary/20">
                <span className="material-symbols-outlined text-4xl">shield_lock</span>
              </div>
              <h4 className="text-3xl font-bold mb-6 text-brand-text">Embedded Cybersecurity</h4>
              <p className="text-brand-text/80 text-lg mb-8 max-w-md font-medium">Proactive defense-in-depth architecture that protects your digital assets from day one. We don't just secure apps; we secure the environment.</p>
              
              <div className="mt-auto flex flex-col sm:flex-row gap-4">
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-brand-surface/80 rounded-full text-xs font-bold text-brand-primary border border-brand-secondary backdrop-blur-sm">Zero Trust Architecture</span>
                  <span className="px-4 py-2 bg-brand-surface/80 rounded-full text-xs font-bold text-brand-primary border border-brand-secondary backdrop-blur-sm">Automated Threat Detection</span>
                </div>
                <Link href="#contact" className="px-6 py-2 bg-brand-primary/20 hover:bg-brand-primary/40 border border-brand-primary/30 rounded-full text-xs font-bold text-brand-primary transition-all flex items-center gap-2 group-hover:translate-x-2 w-fit">
                  Request Security Audit <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              
              <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[10px] font-mono text-brand-primary/40 uppercase tracking-[0.2em] hidden md:block">
                [ SYSTEM_SECURED_094 ]
              </div>
            </div>
          </motion.div>

          {/* Software */}
          <motion.div variants={item} className="image-card group relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/assets/software.png')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-[#0f172a]/40"></div>
            <div className="relative z-10 p-10 h-full flex flex-col">
              <div className="w-14 h-14 mb-8 flex items-center justify-center rounded-2xl bg-teal-500/10 text-teal-500 group-hover:rotate-6 transition-transform backdrop-blur-md border border-teal-500/20">
                <span className="material-symbols-outlined text-3xl">code_blocks</span>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-brand-text mt-auto">Scalable Software</h4>
              <p className="text-brand-text/80 text-sm leading-relaxed font-medium">High-performance applications built for extreme concurrency and global reach.</p>
            </div>
          </motion.div>

          {/* Infrastructure */}
          <motion.div variants={item} className="image-card group relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/assets/infrastructure.png')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-[#0f172a]/40"></div>
            <div className="relative z-10 p-10 h-full flex flex-col">
              <div className="w-14 h-14 mb-8 flex items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:-rotate-6 transition-transform backdrop-blur-md border border-indigo-500/20">
                <span className="material-symbols-outlined text-3xl">cloud_sync</span>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-brand-text mt-auto">Cloud Systems</h4>
              <p className="text-brand-text/80 text-sm leading-relaxed font-medium">Robust backbone infrastructure that handles your load without breaking a sweat.</p>
            </div>
          </motion.div>

          {/* Automation (Long) */}
          <motion.div variants={item} className="glass-premium p-10 lg:col-span-2 group flex items-center relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 w-full relative z-10">
              <div>
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <span className="material-symbols-outlined text-3xl">smart_toy</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-brand-text">Intelligent Automation</h4>
                <p className="text-brand-muted text-sm leading-relaxed max-w-sm">Eliminate operational friction with smart workflows that learn and adapt to your business needs.</p>
                <div className="mt-6 flex items-center space-x-2 text-[10px] font-mono text-brand-primary uppercase">
                  <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
                  <span>Model Training Active</span>
                </div>
              </div>
              <div className="w-32 h-32 shrink-0 bg-brand-primary/5 rounded-full border border-brand-primary/10 flex items-center justify-center relative">
                <div className="absolute inset-0 border-2 border-brand-primary/20 border-dashed rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="w-20 h-20 bg-brand-primary/20 rounded-full animate-pulse flex items-center justify-center text-brand-primary">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
