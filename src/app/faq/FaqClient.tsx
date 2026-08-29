"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/content/faqs";
import PageHero from "@/components/PageHero";
import ContactBand from "@/components/ContactBand";

export default function FaqClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <PageHero
        number="01"
        eyebrow="QUESTIONS?"
        headline={
          <>
            Frequently asked{" "}
            <span className="italic text-accent-cyan">questions.</span>
          </>
        }
        subtitle="Everything you need to know about working with Gileara — who we work with, how the engagement works, contracts, data ownership."
      />

      <section className="bg-background py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-0 border-t border-on-background/10">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              const num = String(i + 1).padStart(2, "0");
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="border-b border-on-background/10"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-6 py-8 text-left group"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-6 flex-1">
                      <span className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant pt-1 shrink-0 w-10">
                        {num}
                      </span>
                      <span className="font-serif text-xl md:text-2xl text-on-background leading-snug group-hover:text-accent-bright transition-colors duration-300">
                        {faq.question}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-2xl text-on-surface-variant shrink-0 mt-1 transition-transform duration-300 group-hover:text-accent-bright">
                      {isOpen ? "remove" : "add"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pl-16 pr-12 pb-8 text-on-surface-variant text-base leading-relaxed max-w-2xl">
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

      <ContactBand
        eyebrow="STILL CURIOUS?"
        headline={
          <>
            Have a question{" "}
            <span className="italic text-accent-cyan">we missed?</span>
          </>
        }
        body="We're happy to answer it on a free 30-minute call. No pitch — just straight answers."
      />
    </>
  );
}
