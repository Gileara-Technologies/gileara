"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";
import Link from "next/link";

const founders = [
  {
    name: "Amos Frederick Hughes",
    role: "Founder & CEO",
    quote: "We build what we wish existed when we were running our own businesses.",
    image: "/assets/images/amos.jpg",
  },
  {
    name: "Julian Hagan",
    role: "Co-Founder & COO",
    quote: "Every project is a promise. We keep ours.",
    image: "/assets/images/julian_hagan.jpg",
  },
  {
    name: "Rodney Hagan",
    role: "Co-Founder & CTO",
    quote: "Technology should disappear into the workflow, not demand attention.",
    image: "/assets/images/rodney_hagan.jpg",
  },
];

const teams = {
  engineering: {
    label: "Engineering",
    lead: "Led by Rodney Hagan, CTO",
    members: [
      { name: "Mekitonima Aliodi", role: "Full Stack Engineer" },
      { name: "Mohammed Murshid", role: "Cross-Platform Mobile App Developer" },
      { name: "Gyening Patrick Nyarko", role: "Frontend Developer" },
      { name: "Samuel Quansah", role: "Frontend Developer" },
    ],
  },
  operations: {
    label: "Operations",
    lead: "Led by Julian Hagan, COO",
    members: [
      { name: "Akpabli Daniel", role: "Administrative Secretary" },
      { name: "Garnett Dussey", role: "Business Psychologist" },
      { name: "Kelvin Ntow Agyemang", role: "Design Specialist" },
    ],
  },
};

const values = [
  {
    num: "01",
    title: "Innovation",
    desc: "We don't just follow industry standards; we define them. Our research-driven approach ensures your technical architecture remains ahead of the curve.",
  },
  {
    num: "02",
    title: "Reliability",
    desc: "99.9% uptime isn't just a metric; it's a promise. We build systems that endure the most demanding workloads.",
  },
  {
    num: "03",
    title: "Scale",
    desc: "From startup foundations to global enterprise infrastructure. Our architecture is designed to grow as rapidly as your ambitions, handling millions of concurrent users without breaking stride.",
  },
];

export default function AboutPageClient() {
  const [activeTeam, setActiveTeam] = useState<"engineering" | "operations">("engineering");

  return (
    <>
      {/* HERO */}
      <PageHero
        number="01"
        eyebrow="ABOUT US"
        headline={
          <>
            Engineering the future of{" "}
            <span className="italic text-accent-cyan">high-performance</span>{" "}
            digital ecosystems.
          </>
        }
        subtitle="At Gileara Technologies, we transform complex technical challenges into streamlined, scalable reality."
      />

      {/* VALUES */}
      <section className="bg-background py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20 md:mb-28">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel number="02" label="OUR CORE PHILOSOPHY" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                Three principles{" "}
                <span className="italic text-accent-cyan">guide everything.</span>
              </DisplayHeading>
              <RevealText delay={0.15}>
                <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                  Innovation, reliability, and scale — not as marketing words, but as engineering constraints.
                </p>
              </RevealText>
            </div>
          </div>

          <div className="space-y-12 md:space-y-20">
            {values.map((v, i) => (
              <motion.div
                key={v.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-12 gap-x-6 md:gap-x-8 items-start border-t border-on-background/10 pt-10"
              >
                <div className="col-span-2 md:col-span-1 font-serif text-display-sm text-on-background/[0.15] leading-none">
                  {v.num}
                </div>
                <div className="col-span-10 md:col-span-7">
                  <h3 className="font-serif text-3xl md:text-display-sm text-on-background leading-tight tracking-[-0.02em] mb-3">
                    {v.title}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <p className="text-on-surface-variant text-base leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="bg-surface-container py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20 md:mb-28">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel number="03" label="THE ARCHITECTS" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                Leadership, not{" "}
                <span className="italic text-accent-cyan">account managers.</span>
              </DisplayHeading>
              <RevealText delay={0.15}>
                <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                  When you work with Gileara, you work directly with the people building the systems. No hand-offs.
                </p>
              </RevealText>
            </div>
          </div>

          <div className="space-y-24 md:space-y-32">
            {founders.map((f, i) => {
              const portraitLeft = i % 2 === 0;
              return (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-8 items-center"
                >
                  <div className={`col-span-12 md:col-span-5 ${portraitLeft ? "md:order-1" : "md:order-2 md:col-start-8"}`}>
                    <div className="relative aspect-[4/5] bg-surface-container-high rounded-xl overflow-hidden group">
                      <Image
                        src={f.image}
                        alt={f.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 42vw"
                        className="object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      />
                    </div>
                  </div>
                  <div className={`col-span-12 md:col-span-7 ${portraitLeft ? "md:order-2 md:col-start-6" : "md:order-1"}`}>
                    <div className={`max-w-xl ${portraitLeft ? "md:ml-auto" : ""}`}>
                      <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                        0{i + 1}
                      </div>
                      <h3 className="font-serif text-display-sm text-on-background leading-tight tracking-[-0.02em] mb-3">
                        {f.name}
                      </h3>
                      <div className="font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-8">
                        {f.role}
                      </div>
                      <blockquote className="border-l-2 border-accent-bright pl-6">
                        <p className="font-serif text-xl md:text-2xl text-on-surface leading-snug italic">
                          &ldquo;{f.quote}&rdquo;
                        </p>
                      </blockquote>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-background py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-16">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel number="04" label="THE TEAM" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                Specialists, working in{" "}
                <span className="italic text-accent-cyan">synergy.</span>
              </DisplayHeading>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-12 border-b border-on-background/10 pb-6">
            <div className="flex gap-2">
              {(Object.keys(teams) as Array<keyof typeof teams>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTeam(key)}
                  className={`pl-6 pr-10 py-2.5 rounded-pill text-sm font-medium transition-colors duration-300 ${
                    activeTeam === key
                      ? "bg-accent-bright text-background"
                      : "border border-on-background/20 text-on-surface hover:border-accent-bright hover:text-accent-bright"
                  }`}
                >
                  {teams[key].label}
                </button>
              ))}
            </div>
            <span className="text-xs text-on-surface-variant font-mono">
              {teams[activeTeam].lead}
            </span>
          </div>

          <motion.div
            key={activeTeam}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {teams[activeTeam].members.map((m, idx) => (
              <div
                key={m.name}
                className="border-t border-on-background/10 pt-6"
              >
                <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                  0{idx + 1}
                </div>
                <h3 className="font-serif text-2xl text-on-background leading-tight tracking-[-0.02em] mb-2">
                  {m.name}
                </h3>
                <p className="text-on-surface-variant text-sm">{m.role}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTABand
        eyebrow="JOIN US"
        headline={
          <>
            Ready to build the{" "}
            <span className="italic text-accent-cyan">future?</span>
          </>
        }
        body="We're always looking for brilliant minds to join our mission. If you're passionate about engineering excellence, we want to hear from you."
        ctaLabel="Join the Mission"
        ctaHref="/careers"
        secondaryLabel="View Open Roles"
        secondaryHref="/careers#roles"
      />
    </>
  );
}
