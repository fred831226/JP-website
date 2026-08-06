import type { MetadataRoute } from "next";
import { getPumpTypes, getSeriesList } from "@/lib/content/load-catalog";

const BASE = "https://www.jp-pump.com.tw";

export default function sitemap(): MetadataRoute.Sitemap {
  const types = getPumpTypes().map((t) => ({
    url: `${BASE}/zh-tw/types/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const series = getSeriesList().map((s) => ({
    url: `${BASE}/zh-tw/series/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [
    { url: `${BASE}/zh-tw`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/zh-tw/company`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/zh-tw/partners`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/zh-tw/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/zh-tw/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/zh-tw/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...types,
    ...series,
  ];
}
