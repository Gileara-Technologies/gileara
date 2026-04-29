"use client";

import { motion } from "framer-motion";
import ContactStepper from "./scheduling/ContactStepper";

export default function ContactCTA() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 md:p-16 overflow-hidden relative bg-brand-surface/90 flex flex-col items-center"
        >
          <ContactStepper />
          
          <p className="mt-12 text-xs text-brand-muted uppercase tracking-widest font-bold">
            Direct secure line: <a href="mailto:hello@gileara.tech" className="text-brand-primary hover:underline focus-visible:ring-2 focus-visible:ring-brand-primary focus:outline-none rounded-sm">hello@gileara.tech</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
