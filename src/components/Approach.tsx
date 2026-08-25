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

  const steps = [
    {
      title: "Diagnose",
      desc: "We map how your business actually works — sales, stock, customers, cashflow.",
      icon: "troubleshoot"
    },
    {
      title: "Implement",
      desc: "We configure and build your package around your operations, not the other way round.",
      icon: "construction"
    },
    {
      title: "Run",
      desc: "Managed from day one: IT support, backups, security monitoring and SLA-backed response.",
      icon: "support_agent"
    },
    {
      title: "Grow",
      desc: "Quarterly reviews and package upgrades as your business scales to the next stage.",
      icon: "trending_up"
    }
  ];

  return (
    <section id="approach" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="mb-20 text-center">
          <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">Our Process</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-primary dark:text-on-background">How We Work With You</h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6 md:gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={item}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-3xl">{step.icon}</span>
              </div>
              <h3 className="font-display text-xl font-bold mb-2 text-primary dark:text-on-background">{step.title}</h3>
              <p className="text-on-surface-variant text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 max-w-3xl mx-auto text-center rounded-xl border border-secondary/25 dark:border-primary/20 bg-surface dark:bg-surface-container-high px-6 py-5 text-sm md:text-base text-on-surface-variant"
        >
          <span className="font-semibold text-primary dark:text-on-background">Every package includes managed services from day one</span> — IT
          support, software updates, backups, security monitoring (tier-based) and SLA support. No hidden costs.
        </motion.p>
      </div>
    </section>
  );
}

