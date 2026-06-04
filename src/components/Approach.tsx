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
      title: "Discovery",
      desc: "Deep dive into goals and bottlenecks.",
      icon: "search_insights"
    },
    {
      title: "Strategy",
      desc: "Map exact solution and scope.",
      icon: "architecture"
    },
    {
      title: "Build",
      desc: "Iterative, transparent delivery phases.",
      icon: "handyman"
    },
    {
      title: "Deploy",
      desc: "Launch and ongoing support.",
      icon: "rocket_launch"
    }
  ];

  return (
    <section id="approach" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="mb-20 text-center">
          <span className="font-mono text-xs text-secondary uppercase tracking-widest">Our Process</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-primary">How We Work With You</h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-3xl">{step.icon}</span>
              </div>
              <h4 className="font-display text-xl font-bold mb-2 text-primary">{step.title}</h4>
              <p className="text-on-surface-variant text-sm max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

