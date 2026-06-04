"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-background overflow-hidden">
      {/* Logo watermark — always visible, light-on-dark treatment */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/assets/logo-icon.png"
          alt=""
          width={800}
          height={800}
          priority
          className="w-[90%] md:w-[700px] h-auto opacity-25 filter dark:brightness-0 dark:invert"
        />
      </div>

      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-secondary/[0.02]" />

      {/* Mobile: hero image behind the content */}
      <div className="md:hidden absolute inset-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5au7EekU0tyV5bzY8IE3YlVCuIELWElUCvfYU1N47Vg0qwhlJRWsreomdq-lAYlA19D2acw4Fwgt8T-yp8Cr1Qy89RNzLCC9NmqMGP1c_6FrBBB9uf7IpksXkIog2gbED7kRJhk75F2vy16xwI-eRlJRCa8fLTD6HOWaEVKzTeQp5ZBqtZv8HIRMiXxIQZVB0k9xt-NyF-MQHI9A4UqEreXFDMYBNkrnhrn_eNU6vcexu7yuek4mYrzbioMIfgEdDoGts-_UXoS4"
          alt=""
          fill
          className="object-cover opacity-25"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/90" />
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-4xl mx-auto px-4 md:px-10 pt-32 pb-20 md:pt-48 md:pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium tracking-wide uppercase">
              TECHNOLOGY PARTNERS FOR GROWTH
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
              From custom software to digital strategy — we design and build technology solutions that help startups and growing businesses operate smarter, move faster, and scale with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"
            >
              <Link href="#services" className="teal-gradient-btn px-8 py-4 rounded-lg text-center font-semibold shadow-lg text-white dark:text-on-primary">
                See Our Services
              </Link>
              <Link href="#founders" className="border border-outline-variant px-8 py-4 rounded-lg text-center font-semibold text-primary dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors">
                Meet the Team
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="pt-8 flex items-center justify-center gap-8 md:gap-16 text-on-surface-variant font-mono text-xs uppercase"
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-primary font-display">3</span>
                FOUNDERS
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-primary font-display">GH</span>
                NATIONWIDE
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-primary font-display">PRO</span>
                BUILT FOR BUSINESS
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
