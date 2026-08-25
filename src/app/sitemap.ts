import type { MetadataRoute } from "next";
import { scenarios } from "@/content/scenarios";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gileara.org";

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${base}/careers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date("2026-06-12"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date("2026-06-12"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${base}/security`,
      lastModified: new Date("2026-05-01"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/how-we-transform`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...scenarios.map((s) => ({
      url: `${base}/how-we-transform/${s.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/insights`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/insights/building-scalable-mvps`,
      lastModified: new Date("2026-06-15"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/insights/automating-sme-workflows`,
      lastModified: new Date("2026-05-28"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/insights/choosing-tech-stack`,
      lastModified: new Date("2026-04-10"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
