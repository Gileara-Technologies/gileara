"use client";

import { motion } from "framer-motion";
import { FaGraduationCap, FaHandshakeAngle, FaLaptopCode, FaChartLine, FaGlobe, FaLightbulb } from "react-icons/fa6";

export default function WhyJoinUs() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const benefits = [
    {
      title: "Career Growth",
      desc: "Clear progression paths and mentorship from industry veterans to help you level up your skills.",
      icon: <FaChartLine className="w-6 h-6" />
    },
    {
      title: "Learning Opportunities",
      desc: "Dedicated time for R&D, tech talks, and access to learning resources to stay ahead of the curve.",
      icon: <FaGraduationCap className="w-6 h-6" />
    },
    {
      title: "Collaborative Environment",
      desc: "A blameless culture where every voice matters and cross-functional teamwork is celebrated.",
      icon: <FaHandshakeAngle className="w-6 h-6" />
    },
    {
      title: "Modern Technologies",
      desc: "Work with a cutting-edge stack including Next.js, Cloudflare Workers, and modern tooling.",
      icon: <FaLaptopCode className="w-6 h-6" />
    },
    {
      title: "Flexible Work Culture",
      desc: "We focus on outcomes and deliverables, not micromanagement. Enjoy a healthy work-life balance.",
      icon: <FaGlobe className="w-6 h-6" />
    },
    {
      title: "Meaningful Impact",
      desc: "Build systems that solve real problems for real businesses. See the direct result of your work.",
      icon: <FaLightbulb className="w-6 h-6" />
    }
  ];

  return (
    <section className="py-24 bg-surface-container px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">
            Perks & Culture
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 text-primary dark:text-on-background">
            Why Build With Us?
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-surface dark:bg-surface-container-high p-8 rounded-2xl border border-outline-variant/20 hover:border-primary/50 transition-colors shadow-sm group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white dark:group-hover:text-on-primary transition-all duration-300">
                {benefit.icon}
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-on-surface">
                {benefit.title}
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
