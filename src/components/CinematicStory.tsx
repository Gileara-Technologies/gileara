"use client";

import { motion } from "framer-motion";
import Link from "next/link";


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
      title: "Stock in notebooks?",
      desc: "Sales, expenses and inventory scattered across paper and spreadsheets — no single view of your day.",
      icon: "inventory_2",
      fix: "Business Operations"
    },
    {
      title: "Orders lost in WhatsApp?",
      desc: "Customer chats buried between personal messages — enquiries and follow-ups slip through.",
      icon: "forum",
      fix: "Customer Growth"
    },
    {
      title: "Reconciling by hand?",
      desc: "MoMo statements matched against your books line by line, night after night.",
      icon: "receipt_long",
      fix: "Automation & Efficiency"
    },
    {
      title: "Flying blind?",
      desc: "No dashboard telling you what sold, what's owed, and what's actually profitable.",
      icon: "monitoring",
      fix: "Business Intelligence"
    }
  ];

  return (
    <section className="py-20 bg-surface-container px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">
            The Daily Reality
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 text-primary dark:text-on-background">
            Great businesses are running on manual work.
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
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
              <h3 className="font-display text-lg font-bold mb-2 text-primary dark:text-on-surface">
                {card.title}
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {card.desc}
              </p>
              <Link
                href="/#packages"
                className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-secondary dark:text-primary hover:underline"
              >
                Fixed by {card.fix}
                <span className="material-symbols-outlined text-xs" aria-hidden="true">arrow_forward</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
