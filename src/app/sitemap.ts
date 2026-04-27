import type { MetadataRoute } from "next";
import { disciplines, topics } from "@/lib/mock-data";
import { getSiteUrl } from "@/lib/site";
import { getAllPublishedPostEntriesForSitemap } from "@/lib/wp";

const STATIC_PATHS = ["/", "/contact", "/privacy", "/terms"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "/" ? base : `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));

  const disciplineEntries: MetadataRoute.Sitemap = disciplines.map((d) => ({
    url: `${base}${d.href}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const topicEntries: MetadataRoute.Sitemap = topics.map((t) => ({
    url: `${base}${t.href}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPublishedPostEntriesForSitemap();
    postEntries = posts.map((p) => ({
      url: `${base}/posts/${p.slug}`,
      lastModified: new Date(p.modified),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    postEntries = [];
  }

  return [...staticEntries, ...disciplineEntries, ...topicEntries, ...postEntries];
}
