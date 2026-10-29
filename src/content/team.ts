/**
 * The team behind Gileara — rendered on the /about page as two things:
 *
 *  - foundation: the 3 founding partners (Amos, Julian, Rodney), full
 *    portrait + quote treatment.
 *  - roster:     one flat, uniform list of everyone who isn't a founder,
 *    each tagged with a department instead of being grouped under a
 *    department heading. This replaces the old leaders/memberGroups
 *    split — see docs/CHANGELOG or git history for that shape.
 *
 * Founders are duplicated from src/content/founders.ts (their portraits
 * and quotes are required there for JSON-LD/homepage use).
 *
 * To add a portrait later, drop the file at /public/assets/images/{slug}.jpg
 * and add an `image` field on the roster entry.
 */

export interface FoundationMember {
  name: string;
  role: string;
  /** Short quote rendered as a blockquote on the about page. */
  quote: string;
  /** Required portrait path under /public (founders all have photos). */
  image: string;
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
    image: "/assets/images/Julian.jpg",
  },
  {
    name: "Rodney Hagan",
    role: "Co-Founder & CTO",
    quote: "Technology should disappear into the workflow, not demand attention.",
    image: "/assets/images/rodney.jpg",
  },
] as const;

export type Department = "Marketing" | "Communication" | "Finance" | "Engineering" | "Creative";

export interface RosterMember {
  name: string;
  role: string;
  department: Department;
  /** Optional portrait path under /public; omitted entries render initials. */
  image?: string;
}

/**
 * One flat roster — everyone who isn't a founder, in reporting order
 * (COO's reports, then CTO's reports). Rendered as a single uniform
 * grid on /about; the department is a tag on the card, not a section.
 */
export const roster: readonly RosterMember[] = [
  { name: "Jude Elorm Agbesinyale", role: "Head of Marketing", department: "Marketing", image: "/assets/images/elorm.jpg" },
  { name: "Owusu Joe", role: "Creative Director", department: "Creative" },
  { name: "Daniel Akpabli", role: "Head of Communication & Executive Secretary", department: "Communication", image: "/assets/images/Daniel.jpg" },
  { name: "Theophilus Bruce", role: "Finance Secretary", department: "Finance" },
  { name: "Mekitonima Aliodi", role: "Full Stack Engineer", department: "Engineering" },
  { name: "Mohammed Murshid", role: "Cross-Platform Mobile App Developer", department: "Engineering" },
  { name: "Gyening Patrick Nyarko", role: "Frontend Developer", department: "Engineering" },
  { name: "Samuel Quansah", role: "Frontend Developer", department: "Engineering" },
] as const;
