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

  const trustY = useTransform(scrollYProgress, [0, 0.5], [100, -50]);
  const aboutOpacity = useTransform(scrollYProgress, [0.3, 0.6, 0.9], [0, 1, 0]);
  const aboutY = useTransform(scrollYProgress, [0.3, 0.6], [50, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[180vh] bg-brand-background overflow-hidden"
    >
      {/* Background Parallax Image */}
      <motion.div 
        style={{ scale: imageScale }}
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
      >
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"
          alt="Abstract Digital Network"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Sticky Content Wrapper */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Layer 1: Trust Logos (Floating) */}
        <motion.div 
          style={{ y: trustY }}
          className="absolute top-20 w-full px-6 z-20"
        >
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary mb-12">
            Trusted by global innovators
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center opacity-40 grayscale pointer-events-none">
            <LogoItem icon="token" label="AcmeCorp" />
            <LogoItem icon="hexagon" label="NexGen" />
            <LogoItem icon="all_inclusive" label="InfinityData" />
            <LogoItem icon="blur_on" label="CloudScale" />
          </div>
        </motion.div>

        {/* Layer 3: About Text (Cinematic Reveal) */}
        <motion.div 
          style={{ opacity: aboutOpacity, y: aboutY }}
          className="relative z-30 max-w-4xl px-6 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-12 text-brand-text tracking-tight leading-none">
            Beyond builds. <br/>
            <span className="text-brand-primary">Living Systems.</span>
          </h2>
          <p className="text-xl md:text-2xl text-brand-muted leading-relaxed font-light italic">
            "Traditional software is static. Gileara systems are dynamic—designed to evolve, secure themselves, and scale as your vision grows."
          </p>
        </motion.div>

        {/* Decorative Design Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
        </div>
      </div>
    </section>
  );
}

function LogoItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center space-x-2 font-black text-xl text-brand-text">
      <span className="material-symbols-outlined text-3xl">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
