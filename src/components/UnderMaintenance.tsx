"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { FiTool } from "react-icons/fi";

interface UnderMaintenanceProps {
  fullPage?: boolean;
}

export default function UnderMaintenance({ fullPage = true }: UnderMaintenanceProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const spinTransition = {
    repeat: Infinity,
    ease: "linear" as const,
    duration: 3,
  };

  const content = (
    <div className={`relative flex items-center justify-center overflow-hidden w-full ${fullPage ? 'min-h-[80vh]' : 'min-h-[400px] py-16 rounded-2xl bg-surface-container-low dark:bg-surface-container-lowest border border-outline-variant/20'}`}>
      {/* Animated background elements (only in full page mode) */}
      {fullPage && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-secondary/[0.02]" />
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/[0.03] blur-3xl"
          />
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 w-full px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl mx-auto text-center space-y-6"
        >
          {/* Icon */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="relative w-20 h-20 flex items-center justify-center bg-surface-container-high dark:bg-surface-container rounded-full shadow-sm border border-outline-variant/20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={spinTransition}
                className="text-primary dark:text-on-surface"
              >
                <FiTool className="w-8 h-8" />
              </motion.div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="font-display text-2xl md:text-4xl font-bold leading-tight text-on-background tracking-tight"
          >
            Under Maintenance
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-base md:text-lg text-on-surface-variant max-w-md mx-auto leading-relaxed"
          >
            This section is currently being updated. Please check back soon.
          </motion.p>

          {/* Action Buttons */}
          {fullPage && (
            <motion.div
              variants={itemVariants}
              className="pt-6 flex justify-center"
            >
              <Link
                href="/"
                className="px-6 py-3 rounded-lg text-center font-medium shadow-sm bg-primary text-white hover:bg-primary/90 dark:bg-on-surface dark:text-surface hover:dark:bg-on-surface/90 transition-colors inline-flex items-center justify-center gap-2 group"
              >
                <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Home
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <section className="bg-background min-h-screen pt-24 pb-12">
        {content}
      </section>
    );
  }

  return content;
}
