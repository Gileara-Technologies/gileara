"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-background overflow-hidden">
      {/* Logo watermark — always visible, light-on-dark treatment */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/assets/gileara/logo-icon.png"
          alt=""
          width={800}
          height={800}
          priority
          sizes="(max-width: 768px) 90vw, 700px"
          className="w-[60%] sm:w-[70%] md:w-[700px] h-auto opacity-25 filter dark:brightness-0 dark:invert"
        />
      </div>

      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-secondary/[0.02]" />


      <div className="relative z-10 w-full">
        <div className="max-w-4xl mx-auto px-4 md:px-10 pt-32 pb-20 md:pt-48 md:pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium tracking-wide uppercase">
              DIGITAL TRANSFORMATION FOR GHANAIAN MSMEs
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-4xl md:text-7xl font-bold leading-tight text-on-background tracking-tight"
            >
              We Build the Systems Your Business Runs On
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-sans text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
            >
              All-inclusive monthly packages that replace spreadsheets and manual work with systems built for Ghana — WhatsApp-ready, MTN MoMo-ready, managed from day one.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"
            >
              <Link href="/#packages" className="teal-gradient-btn px-8 py-4 rounded-lg text-center font-semibold shadow-lg text-white dark:text-on-primary inline-flex items-center justify-center gap-2 group">
                Explore Packages
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link href="/#contact" className="border border-outline-variant px-8 py-4 rounded-lg text-center font-semibold text-primary dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors inline-flex items-center justify-center gap-2 group">
                Book a Free Consultation
                <FaArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="pt-8 flex items-center justify-center gap-4 sm:gap-8 md:gap-16 text-on-surface-variant font-mono text-xs uppercase"
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-primary font-display">5</span>
                TRANSFORMATION PACKAGES
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-primary font-display">Day 1</span>
                MANAGED SERVICES INCLUDED
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-primary font-display">GH</span>
                BUILT FOR MSMEs
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
