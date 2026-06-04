"use client";

import { motion } from "framer-motion";

export default function ContactCTA() {
  return (
    <section id="contact" className="py-24 bg-background px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="font-mono text-xs text-secondary uppercase tracking-widest">Discovery</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-primary leading-tight">Let's Talk About Your Project</h2>
            <p className="mt-6 text-on-surface-variant text-lg mb-12">Whether you have a fully scoped project or just a problem that needs solving, we're here to help.</p>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-surface-container rounded-xl border border-outline-variant/10">
                <div className="bg-primary/10 p-3 rounded-lg"><span className="material-symbols-outlined text-primary">mail</span></div>
                <div>
                  <p className="font-mono text-xs text-outline uppercase tracking-wider">Send an Email</p>
                  <a className="text-xl font-semibold text-on-surface hover:text-primary transition-colors" href="mailto:tech.gileara@gmail.com">tech.gileara@gmail.com</a>
                </div>
              </div>
            </div>
            <div className="mt-8 p-8 bg-surface-container-high rounded-2xl border border-primary/20">
              <h4 className="font-display text-xl font-bold mb-2 text-on-surface">Book a Discovery Call</h4>
              <p className="text-on-surface-variant mb-6">Find a time that works for you in our calendar.</p>
              <button className="teal-gradient-btn w-full py-4 rounded-lg font-bold text-white dark:text-on-primary">Schedule Now</button>
            </div>
          </div>
          <div className="bg-surface-container-high p-10 rounded-2xl shadow-xl border border-outline-variant/10">
            <h3 className="font-display text-2xl font-bold mb-8 text-on-surface">The Mission Profile</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs text-on-surface-variant mb-2 uppercase">Your Name</label>
                  <input className="w-full bg-surface border border-outline-variant/20 rounded-lg p-3 text-on-surface focus:ring-primary focus:border-primary" type="text" />
                </div>
                <div>
                  <label className="block font-mono text-xs text-on-surface-variant mb-2 uppercase">Email Address</label>
                  <input className="w-full bg-surface border border-outline-variant/20 rounded-lg p-3 text-on-surface focus:ring-primary focus:border-primary" type="email" />
                </div>
              </div>
              <div>
                <label className="block font-mono text-xs text-on-surface-variant mb-2 uppercase">Objective</label>
                <select className="w-full bg-surface border border-outline-variant/20 rounded-lg p-3 text-on-surface focus:ring-primary focus:border-primary">
                  <option>Select your primary goal</option>
                  <option>Custom Software</option>
                  <option>E-Commerce</option>
                  <option>Workflow Automation</option>
                  <option>Strategy & Advisory</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs text-on-surface-variant mb-2 uppercase">Project Details</label>
                <textarea className="w-full bg-surface border border-outline-variant/20 rounded-lg p-3 text-on-surface focus:ring-primary focus:border-primary" rows={4}></textarea>
              </div>
              <button className="teal-gradient-btn w-full py-4 rounded-lg font-bold text-white dark:text-on-primary" type="submit">Submit Inquiry</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

