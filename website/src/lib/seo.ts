import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-origin.mjs";

type PageMetadataInput = {
  title?: string;
  description: string;
  pathname: string;
  image?: string | null;
  locale?: "zh-tw" | "en";
  alternatePathname?: string;
};

export function createPageMetadata({
  title,
  description,
  pathname,
  image = "/media/jp-pump-logo-edited.png",
  locale = "zh-tw",
  alternatePathname,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(pathname);
  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: url,
      ...(alternatePathname ? {
        languages: {
          "zh-TW": absoluteUrl(locale === "en" ? alternatePathname : pathname),
          en: absoluteUrl(locale === "en" ? pathname : alternatePathname),
        },
      } : {}),
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "zh_TW",
      siteName: locale === "en" ? "JP PUMP" : "傑平有限公司 JP PUMP",
      url,
      title: title ? `${title} | ${locale === "en" ? "JP PUMP" : "傑平有限公司 JP PUMP"}` : locale === "en" ? "JP PUMP | Pump supply and service" : "傑平有限公司 JP PUMP | 泵浦專業供應與服務",
      description,
      images: [{ url: absoluteUrl(image ?? "/media/jp-pump-logo-edited.png"), alt: "JP PUMP" }],
    },
  };
}
