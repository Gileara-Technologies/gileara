"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Tree, TreeNode } from "react-organizational-chart";

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  reports?: TeamMember[];
}

const palette = [
  "bg-primary", "bg-tertiary", "bg-secondary", "bg-error",
  "bg-[#0891b2]", "bg-[#7c3aed]", "bg-[#d97706]",
  "bg-[#059669]", "bg-[#db2777]", "bg-[#4f46e5]",
];

function hashColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function Avatar({ member, size = "md" }: { member: TeamMember; size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "w-28 h-28" : size === "sm" ? "w-14 h-14" : "w-20 h-20";

  if (member.image) {
    return (
      <div className={`${dims} rounded-full overflow-hidden ring-2 ring-white/10 shrink-0 relative`}>
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
    );
  }

  return (
    <div className={`${dims} rounded-full ${hashColor(member.name)} text-white flex items-center justify-center text-base md:text-lg font-bold ring-2 ring-white/10 shrink-0`}>
      {getInitials(member.name)}
    </div>
  );
}

function MemberLabel({ member, size = "md" }: { member: TeamMember; size?: "sm" | "md" | "lg" }) {
  return (
    <div className="flex flex-col items-center px-4 py-4 min-w-[130px]">
      <Avatar member={member} size={size} />
      <p className="mt-3 text-sm font-semibold text-on-surface text-center leading-tight">
        {member.name}
      </p>
      <p className="text-[11px] text-primary font-medium uppercase tracking-wider mt-1 text-center leading-tight">
        {member.role}
      </p>
    </div>
  );
}

function RecursiveNode({ member, depth = 0 }: { member: TeamMember; depth?: number }) {
  const hasChildren = member.reports && member.reports.length > 0;
  const size = depth === 0 ? "lg" : depth <= 2 ? "md" : "sm";

  if (!hasChildren) {
    return <TreeNode label={<MemberLabel member={member} size={size} />} />;
  }

  return (
    <TreeNode label={<MemberLabel member={member} size={size} />}>
      {member.reports!.map((child) => (
        <RecursiveNode key={child.name} member={child} depth={depth + 1} />
      ))}
    </TreeNode>
  );
}

const teamTree: TeamMember = {
  name: "Amos Frederick Hughes",
  role: "Founder & CEO",
  image: "/assets/images/amos.jpg",
  reports: [
    {
      name: "Julian Hagan",
      role: "Co-Founder & COO",
      image: "/assets/images/julian_hagan.jpg",
      reports: [
        {
          name: "Garnett Dussey",
          role: "Business Psychologist",
          reports: [
            { name: "Daniel Akpabli", role: "Creative Director" },
            { name: "Kelvin Ntow Agyemang", role: "Designer" },
          ],
        },
      ],
    },
    {
      name: "Rodney Hagan",
      role: "Co-Founder & CTO",
      image: "/assets/images/rodney_hagan.jpg",
      reports: [
        {
          name: "Mekitonima Aliodi",
          role: "Fullstack Developer",
          reports: [
            { name: "Samuel Quansah", role: "Frontend Developer" },
          ],
        },
        {
          name: "Mohammed Murshid",
          role: "Mobile App Developer",
          reports: [
            { name: "Gyening Patrick Nyarko", role: "Frontend Developer" },
          ],
        },
      ],
    },
  ],
};

export default function TeamOrgChart() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-10 bg-surface" id="team-org-chart">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-mono text-xs text-secondary uppercase tracking-widest mb-4">
            Our Team
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-4">
            Meet the People Behind Gileara
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            A lean, focused team of engineers, designers, and strategists
            building technology that moves businesses forward.
          </p>
        </motion.div>

        <div className="overflow-x-auto pb-8 pt-4 text-outline-variant/30">
          <div className="min-w-[600px] flex justify-center">
            <Tree
              label={<MemberLabel member={teamTree} size="lg" />}
              lineHeight="40px"
              lineWidth="2px"
              lineColor="currentColor"
              lineBorderRadius="10px"
              nodePadding="12px"
            >
              {teamTree.reports!.map((report) => (
                <RecursiveNode key={report.name} member={report} depth={1} />
              ))}
            </Tree>
          </div>
        </div>
      </div>
    </section>
  );
}
