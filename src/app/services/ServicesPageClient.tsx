"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

const serviceSections = [
  {
    id: "custom-software",
    title: "Custom Software Development",
    tag: "Engineering Excellence",
    icon: "code",
    desc: "Architecting robust backends and fluid frontends that endure heavy usage and rapid scaling. We design and build full-stack web applications, mobile apps, internal tools, and APIs that integrate with your existing workflows.",
    features: [
      "Scalable Microservices Architecture",
      "Cloud-Native Deployment",
      "Legacy System Modernization",
      "Full-stack Web Applications",
      "REST & GraphQL APIs",
    ],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    alt: "Developer writing code on dual monitors",
  },
  {
    id: "ecommerce",
    title: "E-Commerce & Business Platforms",
    tag: "Growth Engines",
    icon: "shopping_cart",
    desc: "Custom digital storefronts designed for high conversion and seamless global logistics. From booking systems to client portals, we build the digital infrastructure that drives revenue and scales with your growth.",
    features: [
      "Custom Storefronts & Marketplaces",
      "Booking & Reservation Systems",
      "Payment Gateway Integration",
      "Inventory & Order Management",
      "Subscription & Membership Portals",
    ],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    alt: "E-commerce shopping on mobile device",
  },
  {
    id: "crm-automation",
    title: "CRM & Workflow Automation",
    tag: "Operational Logic",
    icon: "hub",
    desc: "Eliminate friction with intelligent workflows and deep API integrations between your core tools. We audit your operations, identify bottlenecks, and build automation that frees your team to focus on growth.",
    features: [
      "Business Process Audits",
      "Automated Reporting & Dashboards",
      "Document & Approval Workflows",
      "CRM & ERP Integrations",
      "Data Migration & Synchronization",
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    alt: "Data dashboard and analytics charts",
  },
  {
    id: "strategy-advisory",
    title: "Digital Strategy & Advisory",
    tag: "Visionary Guidance",
    icon: "insights",
    desc: "Navigating the complex tech landscape with data-driven roadmaps and architectural audits. Not sure where to start? We help you map the right technology path, evaluate build-vs-buy decisions, and manage the entire delivery from concept to launch.",
    features: [
      "Technology Roadmap Planning",
      "Architecture & Stack Selection",
      "Security & Performance Audits",
      "MVP Scoping for Startups",
      "Fractional CTO Advisory",
    ],
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
    alt: "Business team discussing strategy",
  },
];

const partners = [
  "AWS Cloud", "Google Cloud", "Microsoft Azure",
  "Stripe Payments", "Salesforce CRM", "Shopify Plus",
];

export default function ServicesPageClient() {
  return (
    <>
      {/* HERO */}
      <section className="py-20 md:py-28 flex flex-col items-center text-center px-4 md:px-10 bg-background">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 text-on-surface">
          Technological Precision for{" "}
          <span className="text-primary">Power Users</span>
        </h1>
        <p className="max-w-2xl text-on-surface-variant text-lg">
          We engineer high-performance digital ecosystems. From microservices to
          market-disrupting platforms, Gileara delivers speed, security, and
          scalability.
        </p>
      </section>

      {/* SERVICE SECTIONS */}
      {serviceSections.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={`py-16 md:py-24 px-4 md:px-10 ${
            i % 2 === 0 ? "bg-background" : "bg-surface-container-lowest"
          }`}
        >
          <div className="max-w-[1200px] mx-auto">
            <div className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 items-center`}>
              <div className="w-full md:w-1/2">
                <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                  <img
                    src={s.image}
                    alt={s.alt}
                    className="w-full h-full object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <span className="material-symbols-outlined">{s.icon}</span>
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    {s.tag}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-on-surface">
                  {s.title}
                </h2>
                <p className="text-on-surface-variant text-base mb-6 leading-relaxed">
                  {s.desc}
                </p>
                <ul className="space-y-3 mb-8">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-sm text-on-surface-variant">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 border border-outline-variant px-6 py-3 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition-all"
                >
                  Discuss This Service
                  <FaArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* INTEGRATION MARQUEE */}
      <section className="py-20 border-t border-outline-variant/20 overflow-hidden bg-background">
        <p className="text-center text-sm font-semibold text-on-surface-variant mb-8 uppercase tracking-[0.2em]">
          Seamlessly Integrated Ecosystems
        </p>
        <div className="flex gap-10 justify-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500 overflow-x-auto pb-4 flex-wrap">
          {partners.map((p) => (
            <span key={p} className="font-bold whitespace-nowrap text-on-surface text-lg">
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 md:px-10 relative overflow-hidden bg-surface-container-lowest">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="material-symbols-outlined text-5xl text-primary mb-4 block">handshake</span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-on-surface mb-4">
            Not sure what you need?
          </h2>
          <p className="text-on-surface-variant text-lg mb-8 max-w-xl mx-auto">
            We&apos;ll start with a free discovery call to understand your business
            and recommend the right approach.
          </p>
          <Link
            href="/#contact"
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
