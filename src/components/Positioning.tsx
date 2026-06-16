"use client";

import { motion } from "framer-motion";
import UnderMaintenance from "./UnderMaintenance";

export default function Positioning() {
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const segments = [
    {
      title: "For Startups",
      desc: "Your external CTO and engineering team, building a scalable MVP that can grow into a market leader.",
      icon: "rocket_launch",
      bullets: ["Rapid MVP Development", "Scalable Architecture"],
      highlight: false
    },
    {
      title: "For Growing SMEs",
      desc: "We audit your workflows and build custom systems that automate manual work and connect operations.",
      icon: "corporate_fare",
      bullets: ["Workflow Automation", "Legacy Upgrades"],
      highlight: true
    },
    {
      title: "For Everyone Else",
      desc: "Whether you need a high-end web presence or help with technical challenges, we bring the same rigor.",
      icon: "all_inclusive",
      bullets: ["Web Applications", "Security Audits"],
      highlight: false
    }
  ];

  if (isMaintenance) {
    return (
      <section id="positioning" className="py-24 bg-surface-container px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">Why Gileara?</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 text-primary dark:text-on-background leading-tight">
              We build technical foundations, not just applications.
            </h2>
          </div>
          <UnderMaintenance fullPage={false} />
        </div>
      </section>
    );
  }

  return (
    <section id="positioning" className="py-24 bg-surface-container px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">Why Gileara?</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 text-primary dark:text-on-background leading-tight">
            We build technical foundations, not just applications.
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {segments.map((segment, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`p-6 md:p-10 rounded-2xl flex flex-col shadow-sm relative overflow-hidden border ${segment.highlight
                  ? "bg-surface dark:bg-surface-container-high border-secondary dark:border-primary/45 shadow-lg"
                  : "bg-surface dark:bg-surface-container-high border-outline-variant/30 dark:border-outline-variant/10"
                }`}
            >
              {segment.highlight && (
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              )}
              <span className="material-symbols-outlined text-secondary dark:text-primary text-5xl mb-6">
                {segment.icon}
              </span>
              <h3 className="font-display text-2xl font-semibold mb-4 text-primary dark:text-on-surface">
                {segment.title}
              </h3>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                {segment.desc}
              </p>
              <ul className="mt-auto space-y-4">
                {segment.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary dark:text-primary text-lg">
                      {segment.highlight ? "verified" : "check_circle"}
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
