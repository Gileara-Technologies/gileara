"use client";

import { motion } from "framer-motion";

export default function Positioning() {
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
      title: "Outcomes over code",
      desc: "Every package ties technology to a business result — more revenue, lower costs, fewer hours lost to manual work. We advise on what your business needs, not the fanciest stack.",
      icon: "track_changes",
      bullets: ["Outcome-led packages", "Business-first advice"],
      highlight: true
    },
    {
      title: "Managed from day one",
      desc: "IT support, software updates, backups and security monitoring are built into your monthly plan — with SLA-backed response. Nothing bolted on later.",
      icon: "verified_user",
      bullets: ["SLA-backed support", "Backups & monitoring included"],
      highlight: false
    },
    {
      title: "Ghana-ready by default",
      desc: "WhatsApp integration, MTN MoMo payments and offline-tolerant builds come standard — because that's how Ghanaian businesses actually run.",
      icon: "smartphone",
      bullets: ["MTN MoMo & WhatsApp ready", "Built for low bandwidth"],
      highlight: false
    }
  ];

  return (
    <section id="positioning" className="py-24 bg-surface-container px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">Why Gileara?</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 text-primary dark:text-on-background leading-tight">
            Built for Ghanaian MSMEs.
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

        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <p className="font-display text-xl md:text-2xl font-semibold text-primary dark:text-on-background leading-relaxed">
            &ldquo;The technology partner that helps Ghanaian MSMEs become efficient, digital, and scalable
            businesses.&rdquo;
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
