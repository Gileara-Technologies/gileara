"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";
import UnderMaintenance from "./UnderMaintenance";

export default function CareersCTA() {
  const isMaintenance = false;

  if (isMaintenance) {
    return (
      <section className="py-24 bg-surface-container px-4 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">Careers</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-6 text-primary dark:text-on-background">
            Join Our Team
          </h2>
          <UnderMaintenance fullPage={false} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-surface-container px-4 md:px-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-surface dark:bg-surface-container-high rounded-3xl p-10 md:p-16 border border-outline-variant/30 dark:border-outline-variant/10 shadow-lg relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">Careers</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-6 text-primary dark:text-on-background">
              Join Our Team
            </h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-10">
              We are looking for talented individuals who are passionate about building innovative solutions. If you want to grow, learn, and make a real impact, we want to hear from you.
            </p>
            <Link
              href="/careers"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-bold teal-gradient-btn group"
            >
              View Open Roles
              <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
