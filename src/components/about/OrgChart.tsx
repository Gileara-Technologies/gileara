"use client";

import { motion } from "framer-motion";
import type { OrgNode } from "@/content/team";

/**
 * OrgChart — the reporting structure, rendered as a tree.
 *
 * Mobile-first: on small screens, every level is a vertically-indented
 * list with a left-border "trunk" (the `.org-branch` utility in
 * globals.css). At the md breakpoint, branches switch to sitting
 * side by side with a top-border connector fanning down from the node
 * above — a conventional horizontal org chart.
 *
 * This assumes exactly two levels below the root (branches, then their
 * direct reports), which matches the real structure (CEO → COO/CTO →
 * their reports) — it isn't a general N-level tree renderer, because
 * the org doesn't need one.
 */
export default function OrgChart({ root }: { root: OrgNode }) {
  const branches = root.children ?? [];

  return (
    <div className="w-full">
      {/* Root — the CEO */}
      <div className="flex justify-center mb-2">
        <OrgCard name={root.name} role={root.role} emphasis="root" />
      </div>

      {/* Stub connecting root to the branch row */}
      {branches.length > 0 && (
        <div className="flex justify-center">
          <div className="w-px h-8 bg-accent-bright/25" aria-hidden="true" />
        </div>
      )}

      {/* Branches: COO / CTO, each with their own reports nested below */}
      <div className="flex flex-col md:flex-row md:justify-center gap-10 md:gap-6">
        {branches.map((branch, i) => (
          <div key={branch.name} className="org-branch md:flex-1 md:max-w-sm">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex md:justify-center mb-6"
            >
              <OrgCard name={branch.name} role={branch.role} emphasis="branch" />
            </motion.div>

            {branch.children && branch.children.length > 0 && (
              <div className="org-branch">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {branch.children.map((leaf, j) => (
                    <motion.div
                      key={leaf.name}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.1 + j * 0.06 }}
                    >
                      <OrgCard name={leaf.name} role={leaf.role} emphasis="leaf" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OrgCard({
  name,
  role,
  emphasis,
}: {
  name: string;
  role: string;
  emphasis: "root" | "branch" | "leaf";
}) {
  const sizing =
    emphasis === "root"
      ? "px-6 py-4"
      : emphasis === "branch"
        ? "px-5 py-3.5 w-full md:w-auto"
        : "px-4 py-3 w-full";
  const nameClass =
    emphasis === "root"
      ? "font-display text-lg text-on-background"
      : emphasis === "branch"
        ? "font-display text-base text-on-background"
        : "font-sans text-sm font-medium text-on-background";

  return (
    <div className={`op-card rounded-lg ${sizing}`}>
      <div className={nameClass}>{name}</div>
      <div className="font-mono text-[10px] text-accent-bright/70 tracking-wider uppercase mt-1">
        {role}
      </div>
    </div>
  );
}
