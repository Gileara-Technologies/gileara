/**
 * Public How-We-Transform read side: /how-we-transform and
 * /how-we-transform/[slug] fetch through this module so every public
 * page shares one source of truth and one fallback rule. Same hybrid
 * rule as public-roles.ts / public-faqs.ts / public-posts.ts: read
 * published playbooks from D1 first, fall back to
 * src/content/scenarios.ts whenever D1 is empty or unreachable.
 *
 * db.ts's listScenarios/getScenario already return the parsed
 * (array-shaped) ParsedScenario -- this module's only job is mapping
 * that onto the exact TransformationScenario shape a fallback entry
 * already has, so scenarioPackages() and every renderer need zero
 * changes.
 *
 * Long-term intent (docs/CMS-PLAN.md): once D1 is proven in production,
 * delete src/content/scenarios.ts and this fallback branch.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { listScenarios } from "@/lib/cms/db";
import type { D1Like } from "@/lib/portal/db";
import type { ParsedScenario } from "@/lib/cms/types";
import { scenarios as fallbackScenarioEntries, type TransformationScenario } from "@/content/scenarios";

function toTransformationScenario(row: ParsedScenario): TransformationScenario {
  return {
    id: row.slug,
    vertical: row.vertical,
    icon: row.icon,
    headline: row.headline,
    painPoints: row.painPoints,
    packageIds: row.packageIds,
    implementation: row.implementation,
    targetOutcomes: row.targetOutcomes,
    ghanaContext: row.ghanaContext,
    status: row.scenarioStatus,
    image: row.image ?? undefined,
  };
}

/** The fallback list: every entry from src/content/scenarios.ts, unchanged. */
export function fallbackScenarios(): TransformationScenario[] {
  return [...fallbackScenarioEntries];
}

/** Fallback selection: use the D1 result when it has at least one row. */
export function selectPublicScenarios(
  rows: TransformationScenario[] | null | undefined,
): TransformationScenario[] {
  return rows && rows.length > 0 ? rows : fallbackScenarios();
}

/** Read published playbooks from D1. Throws when the context/binding is absent. */
async function readPublishedScenariosFromD1(): Promise<TransformationScenario[]> {
  const { env } = getCloudflareContext();
  const db = (env as unknown as { gileara_careers_db?: D1Like }).gileara_careers_db;
  if (!db) {
    throw new Error("gileara_careers_db binding is missing from the Cloudflare env");
  }
  const rows = await listScenarios(db, "published");
  return rows.map(toTransformationScenario);
}

/**
 * Published playbooks for the public pages. Tries D1 first; on any
 * failure (no Cloudflare context in dev/build, D1 error) or an empty
 * result it falls back to src/content/scenarios.ts.
 */
export async function getPublicScenarios(): Promise<TransformationScenario[]> {
  try {
    const rows = await readPublishedScenariosFromD1();
    if (rows.length === 0) {
      console.warn(
        "[how-we-transform] D1 returned no published playbooks, falling back to src/content/scenarios.ts.",
      );
    }
    return selectPublicScenarios(rows);
  } catch (error) {
    console.warn("[how-we-transform] D1 unavailable, falling back to src/content/scenarios.ts:", error);
    return fallbackScenarios();
  }
}

/** Single published playbook by slug (its `id`), or null (callers use notFound()). */
export async function getPublicScenario(slug: string): Promise<TransformationScenario | null> {
  const all = await getPublicScenarios();
  return all.find((s) => s.id === slug) ?? null;
}
