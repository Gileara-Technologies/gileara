"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/content/faqs";

export default function FaqClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="pt-36 pb-24 md:pb-32 px-4 md:px-10 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="font-mono text-xs text-secondary uppercase tracking-widest mb-4">
            Questions?
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-on-surface-variant text-lg">
            Everything you need to know about working with Gileara.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-surface-container-low dark:bg-surface-container rounded-xl border border-outline-variant/20 dark:border-outline-variant/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm md:text-base font-semibold text-on-surface">
                    {faq.question}
                  </span>
                  <span className={`w-5 h-5 shrink-0 text-on-surface-variant transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <span className="material-symbols-outlined text-xl">expand_more</span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-on-surface-variant leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
