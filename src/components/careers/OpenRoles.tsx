"use client";

import { motion } from "framer-motion";
import { openRoles } from "@/content/roles";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";

export default function OpenRoles() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="roles" className="bg-surface-container py-32 md:py-48 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 mb-20">
          <div className="col-span-12 lg:col-span-7">
            <RevealText>
              <SectionLabel number="02" label="CURRENT OPENINGS" className="mb-8" />
            </RevealText>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-0 border-t border-on-background/10"
        >
          {openRoles.map((role, i) => (
            <motion.div
              key={role.id}
              variants={item}
              className="border-b border-on-background/10 py-12"
            >
              <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-6">
                {/* Number + icon */}
                <div className="col-span-12 md:col-span-2">
                  <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-3">
                    0{i + 1}
                  </div>
                  <span className="material-symbols-outlined text-3xl text-accent-bright">
                    {role.icon}
                  </span>
                </div>

                {/* Title + meta */}
                <div className="col-span-12 md:col-span-10">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
                    <h3 className="font-serif text-3xl md:text-display-sm text-on-background leading-tight tracking-[-0.02em]">
                      {role.title}
                    </h3>
                    {role.openings > 1 && (
                      <span className="px-3 py-1 rounded-full border border-accent-bright text-accent-bright text-xs font-mono uppercase tracking-wider">
                        {role.openings} openings
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {role.location}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-lg leading-relaxed mb-8 max-w-3xl">
                    {role.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    <div>
                      <h4 className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                        Key Responsibilities
                      </h4>
                      <ul className="space-y-3">
                        {role.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-on-surface text-sm leading-relaxed">
                            <span className="material-symbols-outlined text-accent-bright text-base shrink-0 mt-0.5">
                              arrow_right
                            </span>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {role.requiredSkills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-background/60 border border-on-background/20 rounded-pill text-xs text-on-background font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <h4 className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-4">
                        Nice to Have
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {role.niceToHave.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 border border-on-background/10 rounded-pill text-xs text-on-surface-variant">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
