"use client";

import { motion } from "framer-motion";

export default function Approach() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  const gridItem = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
  };

  return (
    <section id="approach" className="py-32">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          <h3 className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4">The Gileara Way</h3>
          <h2 className="text-5xl font-bold mb-12 leading-tight text-brand-text">A Systematic Approach to Excellence</h2>
          
          <div className="space-y-12">
            <motion.div variants={item} className="flex gap-8 group">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">1</div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-brand-text">Deep Discovery</h4>
                <p className="text-brand-muted leading-relaxed">We don't just take orders. We map your entire operational landscape to find hidden efficiencies.</p>
              </div>
            </motion.div>
            <motion.div variants={item} className="flex gap-8 group">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">2</div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-brand-text">Architectural Blueprint</h4>
                <p className="text-brand-muted leading-relaxed">A clear, secure, and scalable design is drafted before a single line of code is written.</p>
              </div>
            </motion.div>
            <motion.div variants={item} className="flex gap-8 group">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">3</div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-brand-text">Precision Execution</h4>
                <p className="text-brand-muted leading-relaxed">Hardened development with security protocols integrated at every phase of the lifecycle.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="lg:pl-10"
        >
          <div className="grid grid-cols-2 gap-6">
            <motion.div variants={gridItem} className="glass-card p-8 aspect-square flex flex-col justify-between">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                <span className="material-symbols-outlined text-3xl">verified_user</span>
              </div>
              <div>
                <h5 className="font-bold mb-1 text-brand-text">Integrity</h5>
                <p className="text-xs text-brand-muted">Uncompromising standards in every build.</p>
              </div>
            </motion.div>
            <motion.div variants={gridItem} className="glass-card p-8 aspect-square flex flex-col justify-between mt-10">
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500">
                <span className="material-symbols-outlined text-3xl">rocket_launch</span>
              </div>
              <div>
                <h5 className="font-bold mb-1 text-brand-text">Velocity</h5>
                <p className="text-xs text-brand-muted">Rapid deployment without quality loss.</p>
              </div>
            </motion.div>
            <motion.div variants={gridItem} className="glass-card p-8 aspect-square flex flex-col justify-between -mt-10">
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500">
                <span className="material-symbols-outlined text-3xl">diamond</span>
              </div>
              <div>
                <h5 className="font-bold mb-1 text-brand-text">Excellence</h5>
                <p className="text-xs text-brand-muted">Masters of the digital craft.</p>
              </div>
            </motion.div>
            <motion.div variants={gridItem} className="glass-card p-8 aspect-square flex flex-col justify-between">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
              </div>
              <div>
                <h5 className="font-bold mb-1 text-brand-text">Defense</h5>
                <p className="text-xs text-brand-muted">Security-first mindset by default.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
