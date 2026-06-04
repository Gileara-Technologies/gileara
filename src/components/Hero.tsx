"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-10 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium tracking-wide uppercase"
          >
            TECHNOLOGY PARTNERS FOR GROWTH
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-4xl md:text-6xl font-bold leading-tight text-on-background tracking-tight"
          >
            We Build the Systems Your Business Runs On
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-sans text-lg text-on-surface-variant max-w-xl leading-relaxed"
          >
            From custom software to digital strategy — we design and build technology solutions that help startups and growing businesses operate smarter, move faster, and scale with confidence.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link href="#services" className="teal-gradient-btn px-8 py-4 rounded-lg text-center font-semibold shadow-lg text-white dark:text-on-primary">
              See Our Services
            </Link>
            <Link href="#founders" className="border border-outline-variant px-8 py-4 rounded-lg text-center font-semibold text-primary dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors">
              Meet the Team
            </Link>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-8 flex items-center gap-8 text-on-surface-variant font-mono text-xs uppercase"
          >
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary font-display">3</span>
              FOUNDERS
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary font-display">GH</span>
              NATIONWIDE
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary font-display">PRO</span>
              BUILT FOR BUSINESS
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-3xl opacity-60"></div>
          <div className="relative z-10">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5au7EekU0tyV5bzY8IE3YlVCuIELWElUCvfYU1N47Vg0qwhlJRWsreomdq-lAYlA19D2acw4Fwgt8T-yp8Cr1Qy89RNzLCC9NmqMGP1c_6FrBBB9uf7IpksXkIog2gbEDk7RJhk75F2vy16xwI-eRlJRCa8fLTD6HOWaEVKzTeQp5ZBqtZv8HIRMiXxIQZVB0k9xt-NyF-MQHI9A4UqEreXFDMYBNkrnhrn_eNU6vcexu7yuek4mYrzbioMIfgEdDoGts-_UXoS4"
              alt="Professional office setting with modern technology"
              width={800}
              height={600}
              priority
              unoptimized
              className="rounded-2xl w-full h-auto shadow-2xl border border-outline-variant/10"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

