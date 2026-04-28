"use client";

import { motion } from "framer-motion";

export default function TrustStrip() {
  return (
    <section className="py-12 border-y border-brand-secondary bg-brand-surface/50">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-brand-muted mb-8">
          Trusted by innovative teams at
        </p>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Placeholder Logos */}
          <div className="flex items-center space-x-2 font-black text-xl text-brand-text">
            <span className="material-symbols-outlined text-3xl">token</span>
            <span>AcmeCorp</span>
          </div>
          <div className="flex items-center space-x-2 font-black text-xl text-brand-text">
            <span className="material-symbols-outlined text-3xl">hexagon</span>
            <span>NexGen</span>
          </div>
          <div className="flex items-center space-x-2 font-black text-xl text-brand-text">
            <span className="material-symbols-outlined text-3xl">all_inclusive</span>
            <span>InfinityData</span>
          </div>
          <div className="flex items-center space-x-2 font-black text-xl text-brand-text">
            <span className="material-symbols-outlined text-3xl">blur_on</span>
            <span>CloudScale</span>
          </div>
        </div>
      </div>
    </section>
  );
}
