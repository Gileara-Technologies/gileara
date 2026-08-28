"use client";

import { motion } from "framer-motion";
import { openRoles } from "@/content/roles";

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
    <section id="roles" className="py-24 bg-background px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">
            Current Openings
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 text-on-background">
            Join the Mission
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-8"
        >
          {openRoles.map((role) => (
            <motion.div
              key={role.id}
              variants={item}
            >
              <div className="bg-white dark:bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200">
              <div className="p-6 md:p-8 md:flex gap-8 items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 mb-6 md:mb-0">
                  <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                    {role.icon}
                  </span>
                </div>

                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                    <h3 className="font-display text-2xl font-bold text-on-surface">
                      {role.title}
                    </h3>
                    {role.openings > 1 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold">
                        {role.openings} openings
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-outline">
                      <span className="material-symbols-outlined text-sm" aria-hidden="true">
                        location_on
                      </span>
                      {role.location}
                    </span>
                  </div>
                  <p className="text-on-surface-variant mb-6 text-sm md:text-base leading-relaxed">
                    {role.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-3 text-sm uppercase tracking-wider font-mono">
                        Key Responsibilities
                      </h4>
                      <ul className="space-y-2">
                        {role.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start text-sm text-on-surface-variant">
                            <span className="text-primary mr-2">•</span>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-3 text-sm uppercase tracking-wider font-mono">
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {role.requiredSkills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-surface-container-low border border-outline-variant/20 rounded-full text-xs text-on-surface font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <h4 className="font-semibold text-primary mb-3 mt-4 text-sm uppercase tracking-wider font-mono">
                        Nice to Have
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {role.niceToHave.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-surface-container-low border border-outline-variant/10 rounded-full text-xs text-on-surface-variant">
                            {skill}
                          </span>
                        ))}
                      </div>
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
