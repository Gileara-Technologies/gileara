"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import ContactBand from "@/components/ContactBand";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";
import { foundation, leaders, teamGroups } from "@/content/team";

/**
 * /about page structure:
 *   01 — Hero
 *   02 — Scripture & Name Origin (Jeremiah 8:22, the Gilead reference)
 *   03 — Our values (four principles, professional + faith-rooted)
 *   04 — Foundation: the 3 founding partners
 *   05 — Leaders: department heads who report into Julian
 *   06 — Teams: function specialists, tabbed Engineering / Operations
 *   07 — Join us contact band
 */
const values = [
  {
    num: "01",
    title: "Stewardship",
    desc: "We treat every client's business, data, and trust as something we have been entrusted with — not something we have earned. The work belongs to the people who will use it long after we leave.",
  },
  {
    num: "02",
    title: "Practical excellence",
    desc: "We build systems that work first and look beautiful second. Beauty follows reliability. Every decision is weighed by what it will do for the business owner on a Tuesday afternoon, not what it scores on a slide deck.",
  },
  {
    num: "03",
    title: "Help in the critical moment",
    desc: "We exist for the small business owner who has run out of answers and cannot afford another bad guess. When the books are confused, the customers are drifting, the technology is failing — that is when we are most useful.",
  },
  {
    num: "04",
    title: "Honesty over comfort",
    desc: "We will tell a client when their plan will not work. We will not promise a result we cannot deliver. We will not bill for hours we did not earn. The relationship is worth more than any single engagement.",
  },
];

export default function AboutPageClient() {
  const [activeTeam, setActiveTeam] = useState<(typeof teamGroups)[number]["label"]>(
    teamGroups[0].label,
  );
  const activeGroup = teamGroups.find((g) => g.label === activeTeam) ?? teamGroups[0];

  return (
    <>
      {/* 01 — HERO */}
      <PageHero
        number="01"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]}
        eyebrow="ABOUT GILEARA"
        headline={
          <>
            A small team, called to a specific{" "}
            <span className="italic text-accent-cyan">work.</span>
          </>
        }
        subtitle="We build the systems your business runs on. The work began with a question, and the question came from a scripture. This page is the story of how the two are connected."
      />

      {/* 02 — SCRIPTURE & NAME ORIGIN */}
      <section className="bg-surface-container-lowest py-32 md:py-48 px-6 md:px-12 relative overflow-hidden">
        {/* Ambient teal glow on the left, like the other dark sections */}
        <div
          className="absolute inset-x-0 -top-40 h-[600px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 30%, rgba(94, 234, 212, 0.10) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-16 md:mb-20">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel number="02" label="WHERE THE NAME COMES FROM" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                A name carried out of{" "}
                <span className="italic text-accent-cyan">Gilead.</span>
              </DisplayHeading>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-12 lg:col-span-7"
            >
              <blockquote className="border-l-2 border-accent-bright pl-6 md:pl-8">
                <p className="font-serif text-2xl md:text-3xl text-on-background leading-snug italic mb-6">
                  &ldquo;Is there no balm in Gilead; is there no physician there? why then is not the health of the daughter of my people recovered?&rdquo;
                </p>
                <footer className="font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                  Jeremiah 8:22 (KJV)
                </footer>
              </blockquote>
            </motion.div>

            <div className="col-span-12 lg:col-span-5">
              <RevealText delay={0.1}>
                <p className="text-body-lg text-on-surface-variant leading-relaxed mb-6">
                  Gileara is from the name <em className="text-on-surface not-italic">Gilead</em>.
                </p>
                <p className="text-on-surface-variant leading-relaxed mb-6">
                  In the old scripture, Gilead was the place where healing balm came from — and the prophet&apos;s question was sharp: the medicine exists, the healer exists, so why is the people still in pain?
                </p>
                <p className="text-on-surface-variant leading-relaxed mb-6">
                  That question is the reason this company exists. We see the same situation in the small business world around us every day. The work that should be invisible — stock, sales, customers, cashflow — is still eating the week. The owners have run out of answers. The technology is there, the help is there, and yet the business is not getting better.
                </p>
                <p className="text-on-surface-variant leading-relaxed">
                  We are not the balm. We are the physician who sits down with the business owner, diagnoses what is actually wrong, and builds the system that makes the recovery visible. Gileara is rooted in Christ and in the conviction that honest, practical work in this area is a calling, not a commodity.
                </p>
              </RevealText>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — VALUES */}
      <section className="bg-background py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20 md:mb-28">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel number="03" label="WHAT WE BELIEVE" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                Four principles,{" "}
                <span className="italic text-accent-cyan">lived out.</span>
              </DisplayHeading>
              <RevealText delay={0.15}>
                <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                  Not slogans we put on a slide. Working standards we hold ourselves to when the easy thing and the right thing are not the same.
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

      {/* 04 — FOUNDATION (the 3 founding partners) */}
      <section className="bg-surface-container py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20 md:mb-28">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel number="04" label="THE FOUNDATION" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                The three who{" "}
                <span className="italic text-accent-cyan">started this.</span>
              </DisplayHeading>
              <RevealText delay={0.15}>
                <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                  When you work with Gileara, you work with the people who decided the company should exist in the first place. No hand-offs, no account managers between you and the founders.
                </p>
              </RevealText>
            </div>
          </div>

          <div className="space-y-24 md:space-y-32">
            {foundation.map((f, i) => {
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

      {/* 05 — LEADERS (department heads, report into Julian) */}
      <section className="bg-background py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20 md:mb-28">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel number="05" label="THE LEADERS" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                The people running{" "}
                <span className="italic text-accent-cyan">the day-to-day.</span>
              </DisplayHeading>
              <RevealText delay={0.15}>
                <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                  Three department heads who report into the COO and own marketing, communication, and people operations across every engagement.
                </p>
              </RevealText>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {leaders.map((m, idx) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-on-background/10 pt-8"
              >
                <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-on-background leading-tight tracking-[-0.02em] mb-3">
                  {m.name}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {m.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — TEAMS (function specialists, tabbed) */}
      <section className="bg-surface-container py-32 md:py-48 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-16">
            <div className="col-span-12 lg:col-span-7">
              <RevealText>
                <SectionLabel number="06" label="THE TEAMS" className="mb-8" />
              </RevealText>
              <DisplayHeading size="lg" as="h2" className="mb-8">
                The people who{" "}
                <span className="italic text-accent-cyan">do the work.</span>
              </DisplayHeading>
              <RevealText delay={0.15}>
                <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                  Engineers, finance, and operations. The teams that ship the systems and keep the books honest.
                </p>
              </RevealText>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-12 border-b border-on-background/10 pb-6">
            <div className="flex gap-2">
              {teamGroups.map((g) => (
                <button
                  key={g.label}
                  onClick={() => setActiveTeam(g.label)}
                  className={`pl-6 pr-10 py-2.5 rounded-pill text-sm font-medium transition-colors duration-300 ${
                    activeTeam === g.label
                      ? "bg-accent-bright text-background"
                      : "border border-on-background/20 text-on-surface hover:border-accent-bright hover:text-accent-bright"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-on-surface-variant font-mono">
              {activeGroup.lead}
            </span>
          </div>

          <motion.div
            key={activeTeam}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {activeGroup.members.map((m, idx) => (
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

      {/* 07 — In-page contact band — placed just above the footer. */}
      <ContactBand
        eyebrow="JOIN US"
        headline={
          <>
            Ready to build the{" "}
            <span className="italic text-accent-cyan">future?</span>
          </>
        }
        body="We're always looking for brilliant minds to join our mission. If you're passionate about engineering excellence, we want to hear from you."
      />
    </>
  );
}
