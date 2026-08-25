"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What types of businesses does Gileara work with?",
    a: "We work with startups needing scalable MVPs, growing SMEs needing workflow automation and custom systems, and any organization with technical challenges that require expert software engineering.",
  },
  {
    q: "What is Gileara's development process?",
    a: "Our process follows four phases: Discovery (deep dive into goals and bottlenecks), Strategy (map exact solution and scope), Build (iterative, transparent delivery phases), and Deploy (launch and ongoing support). We keep you involved at every stage.",
  },
  {
    q: "Do you build MVPs for startups?",
    a: "Yes. We act as your external CTO and engineering team, building scalable MVPs that can grow into market-leading products with solid technical foundations. We've helped startups go from concept to launch in as little as 12 weeks.",
  },
  {
    q: "Can Gileara help automate our business workflows?",
    a: "Yes. We audit your existing workflows and build custom systems that replace manual, repetitive processes with smart automation, so your team can focus on growth. A typical automation project pays for itself within months.",
  },
  {
    q: "Do you provide ongoing support after launch?",
    a: "Yes. The Deploy phase includes ongoing support to ensure your system runs smoothly, with iterative improvements as your business evolves. We offer maintenance, monitoring, and on-call support options.",
  },
  {
    q: "What technologies does Gileara use?",
    a: "We are technology-agnostic and choose the best stack for each project. Our core expertise includes TypeScript, React, Next.js, Node.js, Python, PostgreSQL, cloud platforms (AWS, Cloudflare), and modern DevOps practices.",
  },
  {
    q: "How long does a typical project take?",
    a: "Timelines vary by scope. A focused MVP can take 8–12 weeks. A full custom platform or automation system typically ranges from 3–6 months. We'll give you a realistic timeline during the Strategy phase, before any build work begins.",
  },
  {
    q: "How does Gileara handle communication during a project?",
    a: "We use weekly sprint reviews, a shared project dashboard, and direct chat with your dedicated project lead. You'll never wonder where things stand — transparency is built into our process.",
  },
  {
    q: "Do you work with businesses outside Ghana?",
    a: "Yes. We work with clients globally. Our team is distributed and we're experienced in remote collaboration across time zones. All communication, code, and deliverables are managed through digital collaboration tools.",
  },
  {
    q: "How do I get started?",
    a: "Contact us through the form on this site or email us directly at tech.gileara@gmail.com. We'll schedule a free discovery call to understand your needs and see if we're a good fit before any commitment.",
  },
];

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
                    {faq.q}
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
                        {faq.a}
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
