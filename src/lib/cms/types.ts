/**
 * Row and domain shapes for the CMS data layer. Content types so far:
 * FAQs (migrations/0004_create-cms-faqs.sql), Insight posts
 * (migrations/0005_create-cms-posts.sql), playbooks
 * (migrations/0006_create-cms-scenarios.sql), and people
 * (migrations/0007_create-cms-people.sql).
 */

import type { PostTag } from "@/content/posts";
import type { ImplementationStep, ScenarioStatus } from "@/content/scenarios";
import type { Department } from "@/content/team";

export type ContentStatus = "draft" | "published";

/** Raw `cms_faqs` row as stored in D1. */
export interface FaqRow {
  id: number;
  question: string;
  answer: string;
  display_order: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

/** Input for createFaq. `displayOrder` defaults to 0 (top) when omitted. */
export interface CreateFaqInput {
  question: string;
  answer: string;
  displayOrder?: number;
}

/** Partial update for updateFaq. `id` itself is not patchable. */
export interface FaqPatch {
  question?: string;
  answer?: string;
  displayOrder?: number;
}

/** Raw `cms_posts` row as stored in D1. `body` is the markdown-subset
 *  source (src/lib/cms/markdown.ts), parsed at read time -- never stored
 *  pre-parsed, so editing shows back exactly what was written. */
export interface PostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  post_date: string;
  author: string;
  tag: PostTag;
  image: string | null;
  body: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

/** Input for createPost. `slug` is resolved via uniqueSlug against
 *  existing slugs when omitted, same convention as CreateRoleInput. */
export interface CreatePostInput {
  slug?: string;
  title: string;
  excerpt: string;
  postDate: string;
  author: string;
  tag: PostTag;
  image?: string;
  body: string;
}

/** Partial update for updatePost. `slug` is fixed after creation, same
 *  convention as roles -- it's a stable URL, not editable. */
export interface PostPatch {
  title?: string;
  excerpt?: string;
  postDate?: string;
  author?: string;
  tag?: PostTag;
  image?: string;
  body?: string;
}

/** Raw `cms_scenarios` row as stored in D1. The four list fields are
 *  serialized JSON (same convention as roles.responsibilities etc.);
 *  `implementation` is a JSON array of {phase, detail} objects, not a
 *  flat string array. `status` (draft/published, the CMS's own
 *  visibility workflow) is distinct from `scenario_status`
 *  (scenario/pilot/case-study, the honesty-contract label). */
export interface ScenarioRow {
  id: number;
  slug: string;
  vertical: string;
  icon: string;
  headline: string;
  pain_points: string;
  package_ids: string;
  implementation: string;
  target_outcomes: string;
  ghana_context: string;
  image: string | null;
  scenario_status: ScenarioStatus;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

/** `ScenarioRow` with the JSON columns parsed to their real shapes --
 *  the form/domain shape, mirroring ParsedRole vs RoleRow. */
export interface ParsedScenario {
  id: number;
  slug: string;
  vertical: string;
  icon: string;
  headline: string;
  painPoints: string[];
  packageIds: string[];
  implementation: ImplementationStep[];
  targetOutcomes: string[];
  ghanaContext: string;
  image: string | null;
  scenarioStatus: ScenarioStatus;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
}

/** Input for createScenario. `slug` is resolved via uniqueSlug against
 *  existing slugs (from `vertical`) when omitted, same convention as
 *  CreateRoleInput/CreatePostInput. */
export interface CreateScenarioInput {
  slug?: string;
  vertical: string;
  icon: string;
  headline: string;
  painPoints: string[];
  packageIds: string[];
  implementation: ImplementationStep[];
  targetOutcomes: string[];
  ghanaContext: string;
  image?: string;
  scenarioStatus?: ScenarioStatus;
}

/** Partial update for updateScenario. `slug` is fixed after creation. */
export interface ScenarioPatch {
  vertical?: string;
  icon?: string;
  headline?: string;
  painPoints?: string[];
  packageIds?: string[];
  implementation?: ImplementationStep[];
  targetOutcomes?: string[];
  ghanaContext?: string;
  image?: string;
  scenarioStatus?: ScenarioStatus;
}

// ---------------------------------------------------------------------------
// People (migrations/0007_create-cms-people.sql)
// ---------------------------------------------------------------------------

/** Which /about section a person renders in. Foundation gets a full
 *  portrait + quote treatment; Roster gets a uniform department-tagged
 *  grid card. A rendering choice, not two different kinds of record. */
export type PersonGroup = "foundation" | "roster";

/** Raw `cms_people` row as stored in D1. `department` and `quote` are
 *  free TEXT at the schema level (see migration comment) -- `department`
 *  is form-constrained to Department via the admin UI's <select>, and
 *  `quote` is only ever populated for the foundation group today. */
export interface PersonRow {
  id: number;
  person_group: PersonGroup;
  name: string;
  role: string;
  department: Department | null;
  quote: string | null;
  image: string | null;
  display_order: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

/** Input for createPerson. `image` is required by form validation (not
 *  the schema) when personGroup is "foundation" -- every founder has
 *  always had a photo; a roster member without one renders initials. */
export interface CreatePersonInput {
  personGroup: PersonGroup;
  name: string;
  role: string;
  department?: Department;
  quote?: string;
  image?: string;
  displayOrder?: number;
}

/** Partial update for updatePerson. */
export interface PersonPatch {
  personGroup?: PersonGroup;
  name?: string;
  role?: string;
  department?: Department;
  quote?: string;
  image?: string;
  displayOrder?: number;
}
