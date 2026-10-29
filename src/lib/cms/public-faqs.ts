/**
 * Public FAQ read side: /faq fetches through this module so the page and
 * its FAQPage JSON-LD share one source of truth and one fallback rule.
 *
 * Same hybrid rule as src/lib/portal/public-roles.ts (decision Q5 there,
 * applied here for the CMS): read published FAQs from D1 first, fall back
 * to src/content/faqs.ts whenever D1 is empty or unreachable.
 * "Unreachable" is the normal state under plain `next dev` / `next build`
 * — the Cloudflare context only exists on the deployed worker.
 *
 * Long-term intent (docs/CMS-PLAN.md): once D1 is proven in production,
 * delete src/content/faqs.ts and this fallback branch. It exists only to
 * seed the initial migration and as a transitional safety net, not as a
 * permanent dual-source feature.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { listFaqs } from "@/lib/cms/db";
import type { D1Like } from "@/lib/portal/db";
import type { FaqRow } from "@/lib/cms/types";
import { faqs as fallbackFaqEntries, type Faq } from "@/content/faqs";

/** Minimal public shape: callers don't need status/timestamps/id. */
export interface PublicFaq {
  question: string;
  answer: string;
}

function toPublicFaq(row: FaqRow): PublicFaq {
  return { question: row.question, answer: row.answer };
}

/** The fallback list: every entry from src/content/faqs.ts, unchanged. */
export function fallbackFaqs(): PublicFaq[] {
  return fallbackFaqEntries.map((f: Faq) => ({ question: f.question, answer: f.answer }));
}

/** Fallback selection: use the D1 result when it has at least one row. */
export function selectPublicFaqs(rows: PublicFaq[] | null | undefined): PublicFaq[] {
  return rows && rows.length > 0 ? rows : fallbackFaqs();
}

/** Read published FAQs from D1. Throws when the context/binding is absent. */
async function readPublishedFaqsFromD1(): Promise<PublicFaq[]> {
  const { env } = getCloudflareContext();
  const db = (env as unknown as { gileara_careers_db?: D1Like }).gileara_careers_db;
  if (!db) {
    throw new Error("gileara_careers_db binding is missing from the Cloudflare env");
  }
  const rows = await listFaqs(db, "published");
  return rows.map(toPublicFaq);
}

/**
 * Published FAQs for the public /faq page. Tries D1 first; on any failure
 * (no Cloudflare context in dev/build, D1 error) or an empty result it
 * falls back to src/content/faqs.ts.
 */
export async function getPublicFaqs(): Promise<PublicFaq[]> {
  try {
    const rows = await readPublishedFaqsFromD1();
    if (rows.length === 0) {
      console.warn("[faq] D1 returned no published FAQs, falling back to src/content/faqs.ts.");
    }
    return selectPublicFaqs(rows);
  } catch (error) {
    console.warn("[faq] D1 unavailable, falling back to src/content/faqs.ts:", error);
    return fallbackFaqs();
  }
}
