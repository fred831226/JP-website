import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-origin.mjs";

type PageMetadataInput = {
  title?: string;
  description: string;
  pathname: string;
  image?: string | null;
};

export function createPageMetadata({
  title,
  description,
  pathname,
  image = "/media/jp-pump-logo-edited.png",
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(pathname);
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      siteName: "傑平有限公司 JP PUMP",
      url,
      title: title ? `${title} | 傑平有限公司 JP PUMP` : "傑平有限公司 JP PUMP | 泵浦專業供應與服務",
      description,
      images: [{ url: absoluteUrl(image ?? "/media/jp-pump-logo-edited.png"), alt: "JP PUMP" }],
    },
  };
}
