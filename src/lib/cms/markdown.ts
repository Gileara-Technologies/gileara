/**
 * A deliberately small markdown-subset parser for CMS-authored Insight
 * posts — not CommonMark, not a wrapper around a markdown library. It
 * exists so an editor can write an article as one plain-text block (a
 * single textarea) using three constructs, and have it come out as the
 * exact same PostBlock[] shape src/content/posts.ts entries already use
 * and InsightsPostClient.tsx already renders unchanged:
 *
 *   A paragraph is any chunk of text.
 *
 *   ## A heading
 *
 *   ::: cta
 *   The pitch sentence for the button.
 *   href: /services
 *   label: See the packages
 *   :::
 *
 * Chunks are separated by one or more blank lines. There is no inline
 * formatting (bold/italic/links) — every existing seed post is plain
 * prose at the paragraph level, so this covers real usage without the
 * risk of touching InsightsPostClient's renderer, which still expects
 * block.text as flat strings.
 */

import type { PostBlock } from "@/content/posts";

const HEADING_PATTERN = /^##\s+(.+)$/;
const CTA_FENCE_PATTERN = /^:::\s*cta\s*\n([\s\S]*?)\n:::\s*$/i;

function parseCtaChunk(inner: string): PostBlock | null {
  const lines = inner.split("\n");
  const textLines: string[] = [];
  let href = "";
  let label = "";
  for (const rawLine of lines) {
    const line = rawLine.trim();
    const hrefMatch = /^href:\s*(.+)$/i.exec(line);
    const labelMatch = /^label:\s*(.+)$/i.exec(line);
    if (hrefMatch) {
      href = hrefMatch[1].trim();
    } else if (labelMatch) {
      label = labelMatch[1].trim();
    } else if (line) {
      textLines.push(line);
    }
  }
  const text = textLines.join(" ").trim();
  if (!text || !href || !label) {
    return null;
  }
  return { type: "cta", text, href, label };
}

/** One chunk (already trimmed, blank-line-separated) -> one PostBlock. */
function parseChunk(chunk: string): PostBlock | null {
  const headingMatch = chunk.split("\n").length === 1 ? HEADING_PATTERN.exec(chunk) : null;
  if (headingMatch) {
    const text = headingMatch[1].trim();
    return text ? { type: "heading", text } : null;
  }

  const ctaMatch = CTA_FENCE_PATTERN.exec(chunk);
  if (ctaMatch) {
    return parseCtaChunk(ctaMatch[1]);
  }

  // Paragraph: collapse internal line breaks to spaces (the renderer puts
  // the whole thing in one <p>, same as a hand-authored posts.ts entry).
  const text = chunk.split("\n").map((line) => line.trim()).join(" ").trim();
  return text ? { type: "paragraph", text } : null;
}

/**
 * Parse a post body written in the subset above into the PostBlock[]
 * shape the existing renderer expects. Blank chunks (extra blank lines,
 * a malformed CTA fence missing href/label) are silently dropped rather
 * than failing the whole post — an editor missing one field shouldn't
 * lose everything else they wrote.
 */
export function parsePostBody(body: string): PostBlock[] {
  const normalized = body.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [];
  }
  const chunks = normalized.split(/\n{2,}/).map((c) => c.trim()).filter(Boolean);
  const blocks: PostBlock[] = [];
  for (const chunk of chunks) {
    const block = parseChunk(chunk);
    if (block) {
      blocks.push(block);
    }
  }
  return blocks;
}

/** Rough word count across every block's text, for read-time estimates
 *  on a raw body string before it's parsed (or as a cheap double-check
 *  against the parsed result — both should agree). */
export function countWords(body: string): number {
  const stripped = body
    .replace(/^##\s+/gm, "")
    .replace(/:::\s*cta/gi, "")
    .replace(/^(href|label):.*$/gim, "")
    .replace(/:::/g, "")
    .trim();
  if (!stripped) {
    return 0;
  }
  return stripped.split(/\s+/).filter(Boolean).length;
}
