import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { servicePackages } from "@/content/packages";
import { scenarios } from "@/content/scenarios";
import { posts } from "@/content/posts";

/**
 * Validates that the generated sitemap:
 *  - is non-empty
 *  - uses the canonical https://gileara.org origin (no localhost,
 *    no trailing slashes, no protocol-relative URLs)
 *  - includes the homepage + every static top-level page
 *  - includes one entry per dynamic route:
 *      /services/[slug], /how-we-transform/[slug], /insights/[slug]
 *  - uses real `lastModified` dates (not `undefined`)
 *  - has well-formed `priority` and `changeFrequency` values
 *
 * Run: npm test  (picks up tests/sitemap.test.ts automatically)
 */
describe("sitemap", () => {
  const base = "https://gileara.org";
  const entries = sitemap();

  it("is non-empty", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it("uses the canonical https://gileara.org origin on every entry", () => {
    for (const entry of entries) {
      expect(entry.url).toMatch(/^https:\/\/gileara\.org/);
      // No trailing slash unless it's the bare root
      expect(entry.url).toBe(entry.url.replace(/\/$/, "") || entry.url);
    }
  });

  it("includes the homepage as priority 1.0", () => {
    const home = entries.find((e) => e.url === base);
    expect(home).toBeDefined();
    expect(home?.priority).toBe(1.0);
    expect(home?.lastModified).toBeInstanceOf(Date);
  });

  it("includes every static top-level page", () => {
    const required = [
      `${base}/careers`,
      `${base}/about`,
      `${base}/services`,
      `${base}/how-we-transform`,
      `${base}/contact`,
      `${base}/faq`,
      `${base}/insights`,
      `${base}/privacy`,
      `${base}/terms`,
      `${base}/security`,
    ];
    for (const url of required) {
      expect(entries.find((e) => e.url === url), `missing ${url}`).toBeDefined();
    }
  });

  it("includes one entry per service package landing page", () => {
    for (const pkg of servicePackages) {
      const entry = entries.find((e) => e.url === `${base}/services/${pkg.slug}`);
      expect(entry, `missing /services/${pkg.slug}`).toBeDefined();
      expect(entry?.priority).toBeGreaterThanOrEqual(0.5);
      expect(entry?.priority).toBeLessThanOrEqual(1.0);
    }
  });

  it("includes one entry per transformation scenario playbook", () => {
    for (const s of scenarios) {
      const entry = entries.find((e) => e.url === `${base}/how-we-transform/${s.id}`);
      expect(entry, `missing /how-we-transform/${s.id}`).toBeDefined();
    }
  });

  it("includes one entry per insight post", () => {
    for (const p of posts) {
      const entry = entries.find((e) => e.url === `${base}/insights/${p.slug}`);
      expect(entry, `missing /insights/${p.slug}`).toBeDefined();
      expect(entry?.lastModified).toBeInstanceOf(Date);
    }
  });

  it("has no duplicate URLs", () => {
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("uses valid priority and changeFrequency values on every entry", () => {
    const validFrequencies = new Set([
      "always",
      "hourly",
      "daily",
      "weekly",
      "monthly",
      "yearly",
      "never",
    ]);
    for (const entry of entries) {
      expect(entry.priority, `${entry.url} priority`).toBeGreaterThanOrEqual(0);
      expect(entry.priority, `${entry.url} priority`).toBeLessThanOrEqual(1.0);
      if (entry.changeFrequency) {
        expect(
          validFrequencies.has(entry.changeFrequency),
          `${entry.url} changeFrequency=${entry.changeFrequency}`,
        ).toBe(true);
      }
    }
  });

  it("marks the /insights list with weekly changeFrequency", () => {
    const insightsList = entries.find((e) => e.url === `${base}/insights`);
    expect(insightsList?.changeFrequency).toBe("weekly");
  });

  it("marks legal pages with yearly changeFrequency", () => {
    for (const path of ["/privacy", "/terms", "/security"]) {
      const entry = entries.find((e) => e.url === `${base}${path}`);
      expect(entry?.changeFrequency, `${path} changeFrequency`).toBe("yearly");
    }
  });

  it("uses real `lastModified` dates (not undefined or invalid)", () => {
    for (const entry of entries) {
      expect(entry.lastModified, `${entry.url} lastModified`).toBeInstanceOf(Date);
    }
  });
});
