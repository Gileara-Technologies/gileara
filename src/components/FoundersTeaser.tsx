"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { founders } from "@/content/founders";

/**
 * FoundersTeaser — condensed homepage founder strip.
 *
 * The full editorial team treatment (portraits, quotes, org chart,
 * company roster) now lives entirely on /about. The homepage only
 * needs to establish "you'll work with the founders directly" and
 * point to the full page — keeping the homepage from repeating what
 * /about already does in more depth.
 */
export default function FoundersTeaser() {
  return (
    <section className="relative bg-brand-soft-alt border-t border-white/[0.06] py-section-tight px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
          <div>
            <div className="font-mono text-[11px] text-accent-bright tracking-widest uppercase mb-5 flex items-center gap-2">
              <span className="text-accent-bright/40">▸</span>
              the team
            </div>
            <h2 className="font-display text-display-md text-on-background mb-4 max-w-xl">
              The founders behind the systems.
            </h2>
            <p className="font-sans text-body-lg text-white/40 max-w-md leading-relaxed">
              No account managers, no hand-offs. You work directly with the three people who decided this company should exist.
            </p>
          </div>

          <Link
            href="/about"
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/10 text-white/60 text-sm font-sans shrink-0 hover:border-white/25 hover:text-white/90 transition-colors duration-150"
          >
            Meet the full team
            <span className="material-symbols-outlined text-base transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {founders.map((f, i) => (
            <motion.a
              key={f.name}
              href={f.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group op-card rounded-lg p-5 flex items-center gap-4"
            >
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-white/10">
                <Image
                  src={f.image}
                  alt={f.name}
                  fill
                  sizes="56px"
                  className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
              <div className="min-w-0">
                <div className="font-sans text-sm font-medium text-on-background truncate group-hover:text-accent-bright transition-colors duration-200">
                  {f.name}
                </div>
                <div className="font-mono text-[11px] text-white/30 truncate">
                  {f.role}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
