"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { RosterMember } from "@/content/team";

/** First + last initial, for members without a portrait yet. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

/**
 * Roster — a uniform grid of everyone who isn't a founder.
 *
 * Every card is the same shape regardless of department; the department
 * is a small tag on the card rather than a section heading, so visitors
 * see the whole group at a glance instead of scrolling through separate
 * department blocks.
 */
export default function Roster({ members }: { members: readonly RosterMember[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {members.map((m, i) => (
        <motion.div
          key={m.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="op-card rounded-lg p-5 flex items-center gap-4"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10 bg-surface-container-high flex items-center justify-center">
            {m.image ? (
              <Image src={m.image} alt={m.name} fill sizes="48px" className="object-cover grayscale opacity-85" />
            ) : (
              <span className="font-mono text-xs text-accent-bright/70">{initials(m.name)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-sans text-sm font-medium text-on-background truncate">
              {m.name}
            </div>
            <div className="font-sans text-xs text-white/40 truncate">{m.role}</div>
          </div>
          <span className="shrink-0 font-mono text-[9px] text-white/30 border border-white/10 rounded px-1.5 py-1 tracking-wider uppercase">
            {m.department}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
