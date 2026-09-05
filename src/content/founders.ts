/**
 * The Gileara founders — used by:
 *  - <Founders /> team section (rendered on the homepage)
 *  - JSON-LD Person schema (rendered on /, /about, and any page
 *    that wants to attribute content to a real person)
 *  - Authors referenced by /insights/[slug] posts
 *
 * The portrait paths live under /public/assets/images/; LinkedIn
 * URLs are real and public.
 */
export interface Founder {
  /** Full display name (first, middle, last) */
  name: string;
  /** Title used in JSON-LD jobTitle, also rendered in the UI */
  role: "Founder & CEO" | "Co-Founder & COO" | "Co-Founder & CTO";
  /** One-line credential (used in the UI and as Person.description) */
  cred: string;
  /**
   * Personal quote (rendered in the <Founders /> team section as
   * a blockquote). Editorial voice, not marketing copy.
   */
  quote: string;
  /** Portrait photo (under /public) — local, never a CDN */
  image: string;
  /** Public LinkedIn profile URL */
  linkedin: string;
}

export const founders: readonly Founder[] = [
  {
    name: "Amos Frederick Hughes",
    role: "Founder & CEO",
    cred: "Leads strategy and client success.",
    quote: "We build what we wish existed when we were running our own businesses.",
    image: "/assets/images/amos.jpg",
    linkedin: "https://linkedin.com/in/amos-frederick-hughes-01570b22a",
  },
  {
    name: "Julian Hagan",
    role: "Co-Founder & COO",
    cred: "Runs delivery and client operations.",
    quote: "Every project is a promise. We keep ours.",
    image: "/assets/images/julian_hagan.jpg",
    linkedin: "https://www.linkedin.com/in/julian-hagan/",
  },
  {
    name: "Rodney Hagan",
    role: "Co-Founder & CTO",
    cred: "Leads platform engineering — payments, chat-based ordering, and offline-tolerant builds.",
    quote: "Technology should disappear into the workflow, not demand attention.",
    image: "/assets/images/rodney_hagan.jpg",
    linkedin: "https://www.linkedin.com/in/haganrodney/",
  },
] as const;

/** Build a stable Person-schema @id from a LinkedIn URL. */
export function personId(linkedin: string): string {
  return linkedin;
}

/** Find a founder by full name (used for matching insight post authors). */
export function founderByName(name: string): Founder | undefined {
  return founders.find((f) => f.name === name);
}
