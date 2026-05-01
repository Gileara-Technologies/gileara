"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function CinematicStory() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const labelY = useTransform(scrollYProgress, [0, 0.4], [100, -20]);
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.6, 0.9], [0, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0.3, 0.6], [50, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[150vh] md:min-h-[180vh] bg-brand-background overflow-hidden"
    >
      {/* Background Parallax Image */}
      <motion.div 
        style={{ scale: imageScale }}
        className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none"
      >
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"
          alt="Abstract Digital Network"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Sticky Content Wrapper - Disabled on mobile for better scroll feel */}
      <div className="relative md:sticky top-0 min-h-screen w-full flex flex-col items-center justify-center py-24 md:py-0 overflow-hidden">
        
        {/* Layer 1: Label (Floating) */}
        <motion.div 
          style={{ y: typeof window !== 'undefined' && window.innerWidth > 768 ? labelY : 0 }}
          className="md:absolute md:top-20 w-full px-6 z-20 text-center mb-8 md:mb-0"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary">
            The Reality for Most Businesses
          </p>
        </motion.div>

        {/* Layer 3: Problem Text (Cinematic Reveal) */}
        <motion.div 
          style={{ 
            opacity: typeof window !== 'undefined' && window.innerWidth > 768 ? contentOpacity : 1, 
            y: typeof window !== 'undefined' && window.innerWidth > 768 ? contentY : 0 
          }}
          className="relative z-30 max-w-4xl px-6 text-center"
        >
          <h2 className="text-4xl md:text-7xl font-bold mb-8 md:mb-12 text-brand-text tracking-tight leading-tight md:leading-none">
            Great ideas stall <br/>
            <span className="text-brand-primary">without the right systems.</span>
          </h2>
          <p className="text-lg md:text-2xl text-brand-muted leading-relaxed font-light italic mb-12">
            "Most startups and growing businesses hit the same wall: manual processes that don't scale, outdated tools that slow the team down, and no clear path to building something better. We exist to remove that wall."
          </p>
          
          {/* Pain-point Pills */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <span className="px-4 md:px-6 py-2 rounded-full border border-brand-secondary/50 text-[10px] md:text-xs font-bold text-brand-muted uppercase tracking-widest bg-brand-surface/50 backdrop-blur-sm">
              No tech team?
            </span>
            <span className="px-4 md:px-6 py-2 rounded-full border border-brand-secondary/50 text-[10px] md:text-xs font-bold text-brand-muted uppercase tracking-widest bg-brand-surface/50 backdrop-blur-sm">
              Outgrown your tools?
            </span>
            <span className="px-4 md:px-6 py-2 rounded-full border border-brand-secondary/50 text-[10px] md:text-xs font-bold text-brand-muted uppercase tracking-widest bg-brand-surface/50 backdrop-blur-sm">
              Don't know where to start?
            </span>
          </div>
        </motion.div>

        {/* Decorative Design Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-primary/5 dark:bg-brand-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] rounded-full" />
        </div>
      </div>
    </section>
  );
}
