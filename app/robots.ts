import { MetadataRoute } from "next";
import { getSEO } from "@/lib/db";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSEO();
  const baseUrl = seo.canonicalUrl || "https://abbaselkady.dev";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
