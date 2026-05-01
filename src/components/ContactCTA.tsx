"use client";

import { motion } from "framer-motion";
import ContactStepper from "./scheduling/ContactStepper";

export default function ContactCTA() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden bg-brand-surface/30 dark:bg-brand-surface/20">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Column 1: Narrative & Links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <h3 className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4">Discovery</h3>
              <h2 className="text-4xl md:text-6xl font-bold text-brand-text mb-6">Let's Talk About Your Project</h2>
              <p className="text-brand-muted text-lg leading-relaxed">
                Whether you have a fully scoped project or just a problem that needs solving, we're here to help. Choose the way you want to start the conversation.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Email Link */}
              <a 
                href="mailto:tech.gileara@gmail.com" 
                className="glass-card p-6 flex items-center gap-6 group hover:border-brand-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-1">Send an Email</div>
                  <div className="text-lg font-bold text-brand-text">tech.gileara@gmail.com</div>
                </div>
              </a>

              {/* LinkedIn Link */}
              <a 
                href="https://www.linkedin.com/company/gileara" 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-card p-6 flex items-center gap-6 group hover:border-[#0077b5]/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0077b5]/10 flex items-center justify-center text-[#0077b5] group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-1">Connect on LinkedIn</div>
                  <div className="text-lg font-bold text-brand-text">Gileara Technologies</div>
                </div>
              </a>

              {/* WhatsApp Placeholder */}
              <div 
                className="glass-card p-6 flex items-center gap-6 group border-dashed opacity-60"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                  <span className="material-symbols-outlined text-2xl">chat</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-1">WhatsApp Chat</div>
                  <div className="text-lg font-bold text-brand-text">Coming Soon</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Booking Stepper */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 md:p-12 bg-brand-surface/90 shadow-2xl shadow-brand-primary/5"
          >
            <div className="text-center mb-10">
              <h3 className="text-xl font-bold text-brand-text mb-2">Book a Discovery Call</h3>
              <p className="text-sm text-brand-muted">Find a time that works for you in our calendar.</p>
            </div>
            <ContactStepper />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
