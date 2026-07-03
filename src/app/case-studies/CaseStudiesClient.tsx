"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { caseStudies } from "./data";

const container = {
  hidden: { opacity: 0 },
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CaseStudiesClient() {
  return (
    <>
      <section className="pt-36 pb-20 md:pb-28 px-4 md:px-10 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs text-secondary uppercase tracking-widest mb-4"
          >
            Our Work
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-on-surface mb-6"
          >
            Case Studies
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto"
          >
            Real projects, real results. Here&apos;s how we&apos;ve helped
            businesses solve problems with technology.
          </motion.p>
        </div>
      </section>

      <section className="pb-24 md:pb-32 px-4 md:px-10 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {caseStudies.map((study) => (
              <motion.div key={study.slug} variants={item}>
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="block bg-surface-container-low dark:bg-surface-container rounded-2xl border border-outline-variant/20 dark:border-outline-variant/10 p-6 md:p-8 hover:border-primary/30 dark:hover:border-primary/20 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-2xl">{study.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {study.industry}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                          {study.service}
                        </span>
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                        {study.title}
                      </h2>
                      <p className="text-sm text-on-surface-variant mt-1">
                        {study.subtitle}
                      </p>
                    </div>
                    <FaArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 hidden md:block" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
