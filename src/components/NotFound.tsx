"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

export default function NotFound() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "loop" as const,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.03]" />

        {/* Floating geometric shapes */}
        <motion.div
          variants={floatingVariants}
          animate="float"
          className="absolute top-1/4 left-10 w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-primary/[0.15] opacity-50"
        />
        <motion.div
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 0.5, duration: 8 }}
          className="absolute bottom-1/4 right-10 w-40 h-40 md:w-56 md:h-56 rounded-full border-2 border-secondary/[0.15] opacity-50"
        />
        <motion.div
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 1, duration: 10 }}
          className="absolute top-1/2 right-1/4 w-24 h-24 md:w-32 md:h-32 rounded-lg border-2 border-primary/[0.1] opacity-30"
          style={{ transform: "rotate(45deg)" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full px-4 md:px-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          {/* 404 Number */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="inline-block"
            >
              <span className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                404
              </span>
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-3xl md:text-5xl font-bold leading-tight text-on-background tracking-tight"
          >
            Page Not Found
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-lg md:text-xl text-on-surface-variant max-w-xl mx-auto leading-relaxed"
          >
            The page you're looking for doesn't exist, may have been moved, or the URL may be incorrect. Let's get you back on track.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"
          >
            {/* Primary Button - Back to Home */}
            <Link
              href="/"
              className="teal-gradient-btn px-8 py-4 rounded-lg text-center font-semibold shadow-lg text-white dark:text-on-primary inline-flex items-center justify-center gap-2 group"
            >
              <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Link>

            {/* Secondary Button - View Careers */}
            <Link
              href="/careers"
              className="border border-outline-variant px-8 py-4 rounded-lg text-center font-semibold text-primary dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors inline-flex items-center justify-center gap-2 group"
            >
              View Careers
              <FaArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </Link>
          </motion.div>

          {/* Optional: Go Back Button */}
          <motion.div variants={itemVariants} className="pt-8">
            <button
              onClick={() => router.back()}
              className="text-on-surface-variant hover:text-primary transition-colors font-semibold inline-flex items-center gap-2 group"
              aria-label="Go back to previous page"
            >
              <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Or go back to the previous page
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
