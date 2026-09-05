/**
 * The team behind Gileara — three groups on the /about page:
 *
 *  - Foundation: the 3 founding partners (Amos, Julian, Rodney)
 *  - Leaders:    3 department heads who report into Julian (COO)
 *  - Teams:      function specialists — engineering under Rodney,
 *                finance + operations under Julian
 *
 * Founders are duplicated from src/content/founders.ts (their portraits
 * are required). Leaders and team members only need name + role.
 *
 * To add a portrait later, drop the file at /public/assets/images/{slug}.jpg
 * (e.g. `jude_elorm.jpg`) and add an `image` field on the entry.
 */

export interface TeamMember {
  name: string;
  role: string;
}

/**
 * A team member that may have a portrait photo on /public. Optional for
 * everyone (drop the file at /public/assets/images/{slug}.jpg and add
 * the field later).
 */
export interface TeamMemberWithPhoto extends TeamMember {
  /** Optional portrait path under /public; omit to render initials. */
  image?: string;
}

export interface FoundationMember {
  name: string;
  role: string;
  /** Short quote rendered as a blockquote on the about page. */
  quote: string;
  /** Required portrait path under /public (founders all have photos). */
  image: string;
}

export interface TeamGroup {
  label: string;
  /** Free-form caption shown next to the group title (e.g. "Led by Julian Hagan, COO"). */
  lead: string;
  members: TeamMemberWithPhoto[];
}

export const foundation: readonly FoundationMember[] = [
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
] as const;

export const leaders: readonly TeamMemberWithPhoto[] = [
  {
    name: "Jude Elorm Agbesinyale",
    role: "Head of Marketing",
  },
  {
    name: "Daniel Akpabli",
    role: "Head of Communication & Executive Secretary",
  },
  {
    name: "Wisdom Segbedzi",
    role: "HR & People Operations Officer",
  },
] as const;

export const teamGroups: readonly TeamGroup[] = [
  {
    label: "Engineering",
    lead: "Led by Rodney Hagan, CTO",
    members: [
      { name: "Lawrence Adusu", role: "Full Stack Engineer" },
      { name: "Mekitonima Aliodi", role: "Full Stack Engineer" },
      { name: "Mohammed Murshid", role: "Cross-Platform Mobile App Developer" },
      { name: "Gyening Patrick Nyarko", role: "Frontend Developer" },
      { name: "Samuel Quansah", role: "Frontend Developer" },
    ],
  },
  {
    label: "Operations",
    lead: "Led by Julian Hagan, COO",
    members: [
      { name: "Theophilus Bruce", role: "Finance Secretary" },
      { name: "Akpabli Daniel", role: "Administrative Secretary" },
    ],
  },
] as const;
