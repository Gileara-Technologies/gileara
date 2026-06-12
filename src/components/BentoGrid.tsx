"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default function BentoGrid() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const services = [
    {
      title: "Custom Software",
      desc: "Web and mobile applications tailored to how your business actually operates — not off-the-shelf.",
      icon: "code_blocks",
      image: "/assets/gileara/software.png"
    },
    {
      title: "E-Commerce",
      desc: "From stores to booking systems and portals — we build the digital infrastructure for growth.",
      icon: "shopping_cart",
      image: "/assets/gileara/hero.png"
    },
    {
      title: "Workflow Automation",
      desc: "Replace manual, repetitive processes with smart systems — so your team spends time growing.",
      icon: "rebase_edit",
      image: "/assets/gileara/software.png"
    },
    {
      title: "Strategy & Advisory",
      desc: "Not sure where to start? We help you map the right technology path and manage the build start to finish.",
      icon: "insights",
      image: "/assets/gileara/security.png"
    }
  ];

  return (
    <section id="services" className="py-24 bg-background px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">What We Do</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-primary dark:text-on-background leading-tight">Solutions Built Around Your Business</h2>
            <p className="mt-6 text-on-surface-variant text-lg">We don't sell software packages. We build what your business actually needs.</p>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6 md:gap-8"
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              variants={item} 
              className="bg-surface-container-low dark:bg-surface-container p-2 rounded-2xl border border-outline-variant/30 dark:border-outline-variant/10 group hover:border-secondary dark:hover:border-primary/50 transition-colors overflow-hidden"
            >
              <img 
                alt={service.title} 
                className="w-full h-40 md:h-48 lg:h-56 object-cover rounded-xl mb-6 opacity-90 group-hover:opacity-100 transition-opacity" 
                src={service.image} 
              />
              <div className="px-6 pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-secondary dark:text-primary">{service.icon}</span>
                  <h3 className="font-display text-2xl font-semibold text-primary dark:text-on-surface">{service.title}</h3>
                </div>
                <p className="text-on-surface-variant mb-6 text-sm">
                  {service.desc}
                </p>
                <Link href="#contact" className="flex items-center gap-2 text-secondary dark:text-primary font-semibold hover:gap-4 transition-all group">
                  Discuss Project <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
