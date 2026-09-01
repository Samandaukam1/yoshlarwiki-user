import type { MetadataRoute } from "next";

import { getCategories, getPublishedSlugs } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [candidates, categories] = await Promise.all([
    getPublishedSlugs(),
    getCategories(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${siteConfig.url}/yoshlar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/kategoriyalar`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/ariza`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/biz-haqimizda`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  return [
    ...staticRoutes,
    ...categories.map((category) => ({
      url: `${siteConfig.url}/kategoriyalar/${category.slug}`,
      lastModified: new Date(category.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...candidates.map((candidate) => ({
      url: `${siteConfig.url}/yoshlar/${candidate.slug}`,
      lastModified: new Date(candidate.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
