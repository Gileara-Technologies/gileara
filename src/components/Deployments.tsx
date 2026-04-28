"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Deployments() {
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section id="deployments" className="py-32 bg-brand-surface/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
        >
          <div>
            <h3 className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4">Market Impact</h3>
            <h2 className="text-5xl font-bold text-brand-text">Featured Deployments</h2>
          </div>
          <p className="text-brand-muted max-w-sm mb-2">Real-world applications of the Gileara Core in mission-critical environments.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Case Study 1: FinTech */}
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="glass-premium group"
          >
            <div className="aspect-video overflow-hidden">
              <Image
                src="/home/thehiddendeveloper/.gemini/antigravity/brain/fe076052-87f1-445f-88ef-d3bbb29beec3/fintech_dashboard_preview_1777038228786.png"
                alt="FinTech Dashboard"
                width={600}
                height={337}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-2xl font-bold text-brand-text mb-2">Quanta Financial</h4>
                  <p className="text-brand-primary text-xs font-black uppercase tracking-widest">High-Frequency Trading Core</p>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold border border-green-500/20">LIVE</div>
              </div>
              <p className="text-brand-muted mb-8 text-sm leading-relaxed">Architected a distributed ledger system capable of processing 100k+ transactions per second with sub-millisecond latency and integrated fraud detection.</p>
              <div className="flex items-center justify-between pt-6 border-t border-brand-secondary/50">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-surface"><span className="text-[10px] font-bold">R</span></div>
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center border border-brand-surface"><span className="text-[10px] font-bold">G</span></div>
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-brand-surface"><span className="text-[10px] font-bold">K</span></div>
                </div>
                <button className="text-brand-text text-sm font-bold flex items-center gap-2 group/btn">
                  View Architecture <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Case Study 2: HealthTech */}
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
            className="glass-premium group"
          >
            <div className="aspect-video overflow-hidden">
              <Image
                src="/home/thehiddendeveloper/.gemini/antigravity/brain/fe076052-87f1-445f-88ef-d3bbb29beec3/healthtech_security_grid_1777038389138.png"
                alt="HealthTech Security"
                width={600}
                height={337}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-2xl font-bold text-brand-text mb-2">BioSecure Systems</h4>
                  <p className="text-brand-primary text-xs font-black uppercase tracking-widest">Encrypted Patient Data Network</p>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold border border-green-500/20">LIVE</div>
              </div>
              <p className="text-brand-muted mb-8 text-sm leading-relaxed">Deployed a Zero Trust infrastructure for genomic data management, ensuring HIPAA compliance while enabling real-time collaborative research across 12 global nodes.</p>
              <div className="flex items-center justify-between pt-6 border-t border-brand-secondary/50">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-brand-surface"><span className="text-[10px] font-bold">P</span></div>
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center border border-brand-surface"><span className="text-[10px] font-bold">N</span></div>
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-surface"><span className="text-[10px] font-bold">D</span></div>
                </div>
                <button className="text-brand-text text-sm font-bold flex items-center gap-2 group/btn">
                  View Architecture <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
