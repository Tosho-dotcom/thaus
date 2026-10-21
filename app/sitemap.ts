import type { MetadataRoute } from "next";
import { getLegalDoc, legalSlugs } from "@/lib/legal";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...legalSlugs.map((slug) => ({
      url: `${siteUrl}/${slug}`,
      lastModified: getLegalDoc(slug).updatedDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
