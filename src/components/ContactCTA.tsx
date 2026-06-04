"use client";

import ContactStepper from "@/components/scheduling/ContactStepper";

export default function ContactCTA() {
  return (
    <section id="contact" className="py-24 bg-background px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
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
          </div>
          <div className="bg-surface-container-high p-8 md:p-10 rounded-2xl shadow-xl border border-outline-variant/10">
            <ContactStepper />
          </div>
        </div>
      </div>
    </section>
  );
}
