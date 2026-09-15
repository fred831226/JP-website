import type { MetadataRoute } from "next";
import { getPumpTypes, getSeriesList } from "@/lib/content/load-catalog";
import { SITE_ORIGIN } from "@/lib/site-origin.mjs";

export default function sitemap(): MetadataRoute.Sitemap {
  const types = getPumpTypes().map((t) => ({
    url: `${SITE_ORIGIN}/zh-tw/types/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const series = getSeriesList().map((s) => ({
    url: `${SITE_ORIGIN}/zh-tw/series/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [
    { url: `${SITE_ORIGIN}/zh-tw`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_ORIGIN}/zh-tw/company`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_ORIGIN}/zh-tw/partners`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_ORIGIN}/zh-tw/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_ORIGIN}/zh-tw/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_ORIGIN}/zh-tw/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...types,
    ...series,
  ];
}
