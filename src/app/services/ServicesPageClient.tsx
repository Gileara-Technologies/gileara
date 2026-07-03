"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

const services = [
  {
    title: "Custom Software Development",
    desc: "Web and mobile applications tailored to how your business actually operates — not off-the-shelf. We design and build full-stack applications, internal tools, and APIs that integrate with your existing workflows.",
    icon: "code_blocks",
    features: [
      "Full-stack web applications",
      "Mobile apps (iOS & Android)",
      "REST & GraphQL APIs",
      "Legacy system modernization",
      "Database architecture & optimization",
    ],
  },
  {
    title: "E-Commerce Development",
    desc: "From digital storefronts to booking systems and client portals — we build the digital infrastructure that drives revenue and scales with your growth.",
    icon: "shopping_cart",
    features: [
      "Custom storefronts & marketplaces",
      "Booking & reservation systems",
      "Payment gateway integration",
      "Inventory & order management",
      "Subscription & membership portals",
    ],
  },
  {
    title: "Workflow Automation",
    desc: "Replace manual, repetitive processes with smart systems. We audit your operations, identify bottlenecks, and build automation that frees your team to focus on growth.",
    icon: "rebase_edit",
    features: [
      "Business process audits",
      "Automated reporting & dashboards",
      "Document & approval workflows",
      "CRM & ERP integrations",
      "Data migration & synchronization",
    ],
  },
  {
    title: "Strategy & Advisory",
    desc: "Not sure where to start? We help you map the right technology path, evaluate build-vs-buy decisions, and manage the entire delivery from concept to launch.",
    icon: "insights",
    features: [
      "Technology roadmap planning",
      "Architecture & stack selection",
      "Security & performance audits",
      "MVP scoping for startups",
      "Fractional CTO advisory",
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ServicesPageClient() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-20 md:pb-28 px-4 md:px-10 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs text-secondary uppercase tracking-widest mb-4"
          >
            What We Do
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-on-surface mb-6"
          >
            Solutions Built Around Your Business
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
          >
            We don&apos;t sell software packages. We understand your business,
            identify the real bottlenecks, and build exactly what you need.
          </motion.p>
        </div>
      </section>

      {/* Services */}
      <section className="pb-24 md:pb-32 px-4 md:px-10 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-10"
          >
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                variants={item}
                className="bg-surface-container-low dark:bg-surface-container rounded-2xl border border-outline-variant/20 dark:border-outline-variant/10 p-8 md:p-12 md:flex md:gap-16"
              >
                <div className="md:w-2/5 mb-8 md:mb-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                    <span className="material-symbols-outlined text-2xl">{service.icon}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-3">
                    {service.title}
                  </h2>
                  <p className="text-on-surface-variant leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                <div className="md:w-3/5">
                  <h3 className="text-xs font-mono text-primary uppercase tracking-widest font-semibold mb-4">
                    What this includes
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 md:pb-32 px-4 md:px-10 bg-background">
        <div className="max-w-3xl mx-auto text-center bg-surface-container-low dark:bg-surface-container rounded-3xl border border-outline-variant/20 dark:border-outline-variant/10 p-12 md:p-16">
          <span className="material-symbols-outlined text-4xl text-primary mb-4 block">handshake</span>
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
            Not sure what you need?
          </h2>
          <p className="text-on-surface-variant text-lg mb-8">
            We&apos;ll start with a free discovery call to understand your business
            and recommend the right approach.
          </p>
          <Link
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold teal-gradient-btn group"
          >
            Book a Free Consultation
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
