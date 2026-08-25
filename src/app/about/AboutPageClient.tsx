"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const founders = [
  {
    name: "Amos Frederick Hughes",
    role: "Founder & CEO",
    badge: "CEO",
    badgeBg: "bg-primary text-on-primary",
    image: "/assets/images/amos.jpg",
    desc: "Leading our strategic direction and long-term expansion into emerging global markets.",
  },
  {
    name: "Julian Hagan",
    role: "Co-Founder & COO",
    badge: "COO",
    badgeBg: "bg-secondary-container text-on-secondary-container",
    image: "/assets/images/julian_hagan.jpg",
    desc: "Driving operational excellence and ensuring our engineering teams deliver at peak efficiency.",
  },
  {
    name: "Rodney Hagan",
    role: "Co-Founder & CTO",
    badge: "CTO",
    badgeBg: "bg-tertiary-container text-on-tertiary-container",
    image: "/assets/images/rodney_hagan.jpg",
    desc: "The engineering heart of Gileara, overseeing system architecture and technical innovation.",
  },
];

const teams = {
  engineering: {
    label: "Engineering Team",
    members: [
      { name: "Mekitonima Aliodi", role: "Full Stack Engineer", gradient: "from-violet-600 to-indigo-900" },
      { name: "Mohammed Murshid", role: "Cross-Platform Mobile App Developer", gradient: "from-emerald-600 to-teal-900" },
      { name: "Gyening Patrick Nyarko", role: "Frontend Developer", gradient: "from-blue-600 to-cyan-900" },
      { name: "Samuel Quansah", role: "Frontend Developer", gradient: "from-amber-600 to-orange-900" },
    ],
  },
  operations: {
    label: "Operations & Admin",
    members: [
      { name: "Akpabli Daniel", role: "Administrative Secretary", gradient: "from-purple-600 to-fuchsia-900" },
      { name: "Garnett Dussey", role: "Business Psychologist", gradient: "from-green-600 to-lime-900" },
      { name: "Kelvin Ntow Agyemang", role: "Design Specialist", gradient: "from-yellow-600 to-amber-900" },
    ],
  },
};

export default function AboutPageClient() {
  const [activeTeam, setActiveTeam] = useState<"engineering" | "operations">("engineering");

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[500px] md:min-h-[614px] flex items-center justify-center px-4 md:px-10 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-2"
          >
            Since 2024
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold font-display mb-6 leading-tight text-on-surface"
          >
            Engineering the future of{" "}
            <span className="text-primary">high-performance</span> digital
            ecosystems.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-on-surface-variant max-w-2xl mx-auto"
          >
            At Gileara Technologies, we transform complex technical challenges
            into streamlined, scalable reality.
          </motion.p>
        </div>
      </section>

      {/* MISSION & VALUES (BENTO) */}
      <section className="py-20 px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-2 text-on-surface">
            Our Core Philosophy
          </h2>
          <div className="h-1 w-24 bg-primary rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Innovation */}
          <div className="md:col-span-8 bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 group hover:border-primary/50 transition-all duration-300">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary">lightbulb</span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold font-display mb-4 text-on-surface">
                  Innovation
                </h3>
                <p className="text-base text-on-surface-variant max-w-md">
                  We don&apos;t just follow industry standards; we define them.
                  Our research-driven approach ensures your technical
                  architecture remains ahead of the curve.
                </p>
              </div>
              <div className="mt-8 h-48 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-surface-container-high to-surface-container" />
              </div>
            </div>
          </div>

          {/* Reliability */}
          <div className="md:col-span-4 bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-6 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold font-display mb-4 text-on-surface">
              Reliability
            </h3>
            <p className="text-base text-on-surface-variant">
              99.9% uptime isn&apos;t just a metric; it&apos;s a promise. We
              build systems that endure the most demanding workloads.
            </p>
          </div>

          {/* Scale */}
          <div className="md:col-span-12 bg-surface-container p-8 rounded-xl border border-outline-variant/30 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold font-display mb-4 text-on-surface">
                  Scale
                </h3>
                <p className="text-base text-on-surface-variant max-w-2xl">
                  From startup foundations to global enterprise infrastructure.
                  Our architecture is designed to grow as rapidly as your
                  ambitions, handling millions of concurrent users without
                  breaking stride.
                </p>
              </div>
              <div className="flex-shrink-0 grid grid-cols-3 gap-2">
                <div className="w-16 h-24 bg-primary/10 rounded-lg animate-pulse" />
                <div className="w-16 h-32 bg-primary/20 rounded-lg animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-16 h-40 bg-primary/30 rounded-lg animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="py-20 bg-surface-container-lowest">
        <div className="px-4 md:px-10 max-w-[1440px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-2 text-on-surface">
              The Architects
            </h2>
            <p className="text-base text-on-surface-variant">
              The visionary leadership steering Gileara&apos;s technological
              dominance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {founders.map((person) => (
              <div key={person.name} className="group">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 border border-outline-variant/20 group-hover:border-primary/40 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent z-10" />
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span
                      className={`text-[10px] uppercase font-bold px-3 py-1 rounded ${person.badgeBg}`}
                    >
                      {person.badge}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold font-display mb-1 text-on-surface">
                  {person.name}
                </h3>
                <p className="text-primary text-sm font-semibold mb-3">
                  {person.role}
                </p>
                <p className="text-base text-on-surface-variant">
                  {person.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR TEAM */}
      <section className="py-20 px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-2 text-on-surface">
              Our Team
            </h2>
            <p className="text-base text-on-surface-variant">
              Specialists across disciplines, working in synergy to build the
              impossible.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-10">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTeam("engineering")}
              className={`px-6 py-3 rounded-full text-sm font-semibold border transition-all ${
                activeTeam === "engineering"
                  ? "bg-primary text-on-primary border-primary"
                  : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {teams.engineering.label}
            </button>
            <button
              onClick={() => setActiveTeam("operations")}
              className={`px-6 py-3 rounded-full text-sm font-semibold border transition-all ${
                activeTeam === "operations"
                  ? "bg-primary text-on-primary border-primary"
                  : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {teams.operations.label}
            </button>
          </div>
          <span className="text-xs text-on-surface-variant font-semibold ml-1">
            {activeTeam === "engineering"
              ? "Led by Rodney Hagan, CTO"
              : "Led by Julian Hagan, COO"}
          </span>
        </div>

        <motion.div
          key={activeTeam}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {teams[activeTeam].members.map((m) => (
            <div
              key={m.name}
              className="bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden group hover:border-primary/40 transition-all"
            >
              <div
                className={`h-48 bg-gradient-to-br ${m.gradient} flex items-end p-4 relative`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {m.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold font-display text-on-surface mb-1">
                  {m.name}
                </h3>
                <p className="text-sm text-primary font-semibold">{m.role}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <p className="text-center text-sm text-on-surface-variant mt-8">
          {teams[activeTeam].members.length} team members
        </p>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 md:px-10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto bg-surface-container-low/60 backdrop-blur-md border border-primary/20 p-12 md:p-16 rounded-2xl relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6 text-on-surface">
            Ready to build the future?
          </h2>
          <p className="text-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for brilliant minds to join our mission.
            If you&apos;re passionate about engineering excellence, we will
            hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/careers"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold teal-gradient-btn"
            >
              Join the Mission
            </Link>
            <Link
              href="/careers"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-xl md:text-2xl font-semibold font-display border border-outline-variant text-on-surface hover:bg-surface-variant transition-colors"
            >
              View Openings
            </Link>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      </section>
    </>
  );
}
