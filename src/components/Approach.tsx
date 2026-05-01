"use client";

import { motion } from "framer-motion";

export default function Approach() {
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

  const steps = [
    {
      step: "01",
      title: "Discovery",
      desc: "We start with a deep dive into your business goals, current bottlenecks, and technical needs.",
      icon: "search_insights",
      color: "text-brand-primary"
    },
    {
      step: "02",
      title: "Strategy & Scope",
      desc: "We map out the exact solution, timeline, and budget. No hidden costs, no vague promises.",
      icon: "architecture",
      color: "text-teal-500"
    },
    {
      step: "03",
      title: "Iterative Build",
      desc: "We build in transparent phases, giving you regular updates and working software to review.",
      icon: "handyman",
      color: "text-sky-500"
    },
    {
      step: "04",
      title: "Delivery & Support",
      desc: "We deploy your system and stay close to ensure it performs perfectly as your team starts using it.",
      icon: "rocket_launch",
      color: "text-indigo-500"
    }
  ];

  return (
    <section id="approach" className="py-32 bg-brand-surface/20 dark:bg-brand-surface/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-10">
          <div className="max-w-2xl">
            <h3 className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-4">Our Process</h3>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-text leading-tight">How We Work With You</h2>
          </div>
          <p className="text-brand-muted text-lg max-w-sm mb-2">A clear, transparent path from your initial idea to a high-performance system.</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className="glass-card group p-8 flex flex-col items-start hover:border-brand-primary/50 transition-colors duration-500 bg-brand-surface/40 dark:bg-brand-surface/20"
            >
              <div className="flex justify-between items-start w-full mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-brand-background border border-brand-secondary/50 flex items-center justify-center ${step.color} group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                  <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                </div>
                <span className="text-4xl font-black text-brand-secondary/40 dark:text-brand-secondary/20 group-hover:text-brand-primary/20 transition-colors duration-500">
                  {step.step}
                </span>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-brand-text">{step.title}</h4>
              <p className="text-brand-muted text-sm leading-relaxed">{step.desc}</p>
              
              <div className="mt-8 w-12 h-0.5 bg-brand-secondary/30 group-hover:w-full group-hover:bg-brand-primary transition-all duration-700" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
