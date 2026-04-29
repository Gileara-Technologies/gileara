"use client";

import { motion } from "framer-motion";

export default function ContactCTA() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card p-12 md:p-20 overflow-hidden relative bg-brand-surface/90 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-8">
            <span className="material-symbols-outlined text-3xl">rocket_launch</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-brand-text">
            Ready to accelerate your <span className="gradient-text">growth</span>?
          </h2>
          <p className="text-lg text-brand-muted mb-10 max-w-2xl">
            Skip the forms. Book a direct 30-minute discovery call with our lead architects to discuss your technical bottlenecks and scaling strategy.
          </p>
          
          <a 
            href="https://calendar.google.com/calendar/appointments/schedules/" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4 focus-visible:ring-4 focus-visible:ring-brand-primary focus:outline-none"
          >
            <span className="material-symbols-outlined">calendar_month</span>
            Schedule Discovery Call
          </a>
          
          <p className="mt-8 text-xs text-brand-muted uppercase tracking-widest font-bold">
            Or email us directly at <a href="mailto:hello@gileara.tech" className="text-brand-primary hover:underline focus-visible:ring-2 focus-visible:ring-brand-primary focus:outline-none rounded-sm">hello@gileara.tech</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
