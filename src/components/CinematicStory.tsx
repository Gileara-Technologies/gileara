"use client";

import { motion } from "framer-motion";

export default function CinematicStory() {
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

  const items = [
    {
      title: "No tech team?",
      desc: "We provide the technical expertise you lack to execute your vision.",
      icon: "group_off"
    },
    {
      title: "Outgrown tools?",
      desc: "Replace manual processes with systems built to scale with your growth.",
      icon: "trending_down"
    },
    {
      title: "Where to start?",
      desc: "Our strategic advisory maps the right technology path for your goals.",
      icon: "map"
    }
  ];

  return (
    <section className="py-20 bg-surface-container px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">
            The Reality for Most Businesses
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 text-primary dark:text-on-background">
            Great ideas stall without the right systems.
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8"
        >
          {items.map((card, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-surface dark:bg-surface-container-high p-8 rounded-xl border border-outline-variant/30 dark:border-outline-variant/10 flex flex-col items-center text-center shadow-sm"
            >
              <span className="material-symbols-outlined text-secondary dark:text-primary text-4xl mb-4">
                {card.icon}
              </span>
              <h4 className="font-display text-lg font-bold mb-2 text-primary dark:text-on-surface">
                {card.title}
              </h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
