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
 * Portrait-forward cards: the photo (or an initials fallback the same
 * size and shape) is the dominant element, full color, filling the top
 * of the card — not a small desaturated circle squeezed into a text row,
 * which read as barely-there at a glance. Department is a small badge
 * overlaid on the photo rather than a section heading, so visitors see
 * the whole group at once instead of scrolling through department blocks.
 */
export default function Roster({ members }: { members: readonly RosterMember[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {members.map((m, i) => (
        <motion.div
          key={m.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="op-card rounded-lg overflow-hidden flex flex-col"
        >
          <div className="relative aspect-[4/5] w-full bg-surface-container-high">
            {m.image ? (
              <Image
                src={m.image}
                alt={m.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-3xl text-accent-bright/50">
                  {initials(m.name)}
                </span>
              </div>
            )}
            <span className="absolute top-2.5 left-2.5 font-mono text-[9px] uppercase tracking-wider text-white/85 bg-black/55 backdrop-blur-sm rounded px-1.5 py-1 border border-white/10">
              {m.department}
            </span>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-center">
            <div className="font-sans text-sm font-medium text-on-background truncate">
              {m.name}
            </div>
            <div className="font-sans text-xs text-white/40 truncate mt-0.5">{m.role}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
