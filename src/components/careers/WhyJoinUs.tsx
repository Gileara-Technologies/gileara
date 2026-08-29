"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";
import DisplayHeading from "@/components/DisplayHeading";

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
      icon: "trending_up",
    },
    {
      title: "Learning Opportunities",
      desc: "Dedicated time for R&D, tech talks, and access to learning resources to stay ahead of the curve.",
      icon: "school",
    },
    {
      title: "Collaborative Environment",
      desc: "A blameless culture where every voice matters and cross-functional teamwork is celebrated.",
      icon: "handshake",
    },
    {
      title: "Modern Technologies",
      desc: "Work with a cutting-edge stack including Next.js, Cloudflare Workers, and modern tooling.",
      icon: "code",
    },
    {
      title: "Flexible Work Culture",
      desc: "We focus on outcomes and deliverables, not micromanagement. Enjoy a healthy work-life balance.",
      icon: "schedule",
    },
    {
      title: "Meaningful Impact",
      desc: "Build systems that solve real problems for real businesses. See the direct result of your work.",
      icon: "lightbulb",
    },
  ];

  return (
    <section className="bg-background py-32 md:py-48 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20">
          <div className="col-span-12 lg:col-span-7">
            <RevealText>
              <SectionLabel number="03" label="PERKS & CULTURE" className="mb-8" />
            </RevealText>
            <DisplayHeading size="lg" as="h2" className="mb-8">
              Why build{" "}
              <span className="italic text-accent-cyan">with us?</span>
            </DisplayHeading>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
          {benefits.map((benefit, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={benefit.title}
                variants={item}
                className="border-t border-on-background/20 pt-6"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="material-symbols-outlined text-3xl text-accent-bright">
                    {benefit.icon}
                  </span>
                  <span className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant">
                    {num}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-on-background leading-tight tracking-[-0.02em] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {benefit.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
