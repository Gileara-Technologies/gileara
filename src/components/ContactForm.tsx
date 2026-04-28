"use client";

import { motion } from "framer-motion";

export default function ContactForm() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card p-12 md:p-20 overflow-hidden relative bg-brand-surface/90"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-8 leading-tight text-brand-text">Ready to architect your <span className="gradient-text">future</span>?</h2>
              <p className="text-lg text-brand-muted mb-12 max-w-md">Join the ranks of market leaders who trust Gileara to power their digital core. Let's build something extraordinary together.</p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted uppercase font-bold tracking-widest">Email Us</p>
                    <p className="font-bold text-brand-text">hello@gileara.tech</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted uppercase font-bold tracking-widest">Visit Us</p>
                    <p className="font-bold text-brand-text">Innovation Hub, Tech City</p>
                  </div>
                </div>
              </div>
            </div>
            
            <form className="space-y-6" action="/api/contact" method="POST">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 text-brand-muted">Full Name</label>
                  <input type="text" name="name" required className="w-full bg-brand-background border border-brand-secondary text-brand-text rounded-xl px-5 py-4 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none placeholder-brand-muted/50" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 text-brand-muted">Work Email</label>
                  <input type="email" name="email" required className="w-full bg-brand-background border border-brand-secondary text-brand-text rounded-xl px-5 py-4 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none placeholder-brand-muted/50" placeholder="john@company.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-brand-muted">Project Goal</label>
                <select name="goal" className="w-full bg-brand-background border border-brand-secondary text-brand-text rounded-xl px-5 py-4 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none">
                  <option>Custom Software Development</option>
                  <option>Cybersecurity Hardening</option>
                  <option>Cloud Infrastructure Scaling</option>
                  <option>Full Digital Transformation</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-brand-muted">Message</label>
                <textarea name="message" required className="w-full bg-brand-background border border-brand-secondary text-brand-text rounded-xl px-5 py-4 h-32 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none placeholder-brand-muted/50" placeholder="Tell us about your vision..."></textarea>
              </div>
              <button type="submit" className="w-full btn-primary flex justify-center items-center gap-2">
                Send Inquiry <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
