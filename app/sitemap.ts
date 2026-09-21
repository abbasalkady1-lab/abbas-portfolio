import { MetadataRoute } from "next";
import { getProjects, getSEO } from "@/lib/db";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSEO();
  const baseUrl = getSiteUrl(seo.canonicalUrl);
  const projects = await getProjects();
  const now = new Date();

  const projectRoutes = projects
    .filter((p) => p.published)
    .map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...projectRoutes,
  ];
}
