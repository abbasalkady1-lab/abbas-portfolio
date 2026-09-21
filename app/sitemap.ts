import { MetadataRoute } from "next";
import { getProjects, getSEO } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSEO();
  const baseUrl = seo.canonicalUrl || "https://abbaselkady.dev";
  const projects = await getProjects();

  const projectRoutes = projects
    .filter((p) => p.published)
    .map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...projectRoutes,
  ];
}
