"use client";

import { motion } from "framer-motion";

export default function Approach() {
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

  const values = [
    {
      title: "Integrity",
      desc: "Uncompromising standards in every line of code.",
      icon: "verified_user",
      color: "text-brand-primary"
    },
    {
      title: "Velocity",
      desc: "Rapid deployment optimized for global scaling.",
      icon: "rocket_launch",
      color: "text-teal-500"
    },
    {
      title: "Excellence",
      desc: "Mastering the craft of digital engineering.",
      icon: "diamond",
      color: "text-sky-500"
    },
    {
      title: "Defense",
      desc: "Security-first mindset in all architecture.",
      icon: "admin_panel_settings",
      color: "text-indigo-500"
    }
  ];

  return (
    <section id="approach" className="py-32 bg-brand-surface/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-10">
          <div className="max-w-2xl">
            <h3 className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-4">The Gileara Way</h3>
            <h2 className="text-5xl font-bold text-brand-text leading-tight">A Symmetrical Approach to Excellence</h2>
          </div>
          <p className="text-brand-muted text-lg max-w-sm mb-2">Eliminating chaos through rigorous structure and architectural discipline.</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((value, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className="glass-card group p-8 flex flex-col items-center text-center hover:border-brand-primary/50 transition-colors duration-500"
            >
              <div className={`w-16 h-16 mb-8 rounded-2xl bg-brand-surface border border-brand-secondary/50 flex items-center justify-center ${value.color} group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                <span className="material-symbols-outlined text-4xl">{value.icon}</span>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-brand-text">{value.title}</h4>
              <p className="text-brand-muted text-sm leading-relaxed">{value.desc}</p>
              
              <div className="mt-8 w-12 h-0.5 bg-brand-secondary/30 group-hover:w-full group-hover:bg-brand-primary transition-all duration-700" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
