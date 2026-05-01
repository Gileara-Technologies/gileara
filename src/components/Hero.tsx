"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Technology Partners for Growing Businesses
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-extrabold leading-tight text-brand-text tracking-tight"
          >
            We Build the <span className="gradient-text">Systems</span> Your Business Runs On
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-brand-muted max-w-xl leading-relaxed"
          >
            From custom software to digital strategy — we design and build technology solutions that help startups and growing businesses operate smarter, move faster, and scale with confidence.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 items-center"
          >
            <Link href="#services" className="btn-primary text-center w-full sm:w-auto">
              See Our Services
            </Link>
            <Link href="#founders" className="btn-outline text-center w-full sm:w-auto">
              Meet the Team
            </Link>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-10 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted"
          >
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
              <span>3 Founders</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
              <span>Serving Ghana & Beyond</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
              <span>Built for Business</span>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 animate-float">
            <div className="glass-card p-2 border-brand-secondary overflow-hidden group">
              <Image
                src="/assets/hero.png"
                alt="Digital System Visualization"
                width={800}
                height={600}
                priority
                className="rounded-2xl w-full h-auto grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
