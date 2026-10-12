import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreviewBanner from "@/components/PreviewBanner";
import PageTransition from "@/components/PageTransition";
import { classifyDeploymentEnvironment } from "@/lib/deployment-environment";
import { isSiteLocale, SITE_LOCALES } from "@/lib/locale";
import { SITE_ORIGIN } from "@/lib/site-origin.mjs";

export const dynamicParams = false;

export function generateStaticParams() {
  return SITE_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: locale === "en"
      ? { default: "JP PUMP | Pump supply and service", template: "%s | JP PUMP" }
      : { default: "傑平有限公司 JP PUMP | 泵浦專業供應與服務", template: "%s | 傑平有限公司 JP PUMP" },
    description: locale === "en"
      ? "JIEPING CO., LTD (JP PUMP) provides pump selection, quotations, installation and repair."
      : "傑平有限公司（JP PUMP）— 專業泵浦選型、供應、安裝、維修與顧問服務。提供經技術驗證的品牌、泵浦類型與型號規格資訊。",
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  const environment = classifyDeploymentEnvironment();

  return (
    <html lang={locale === "en" ? "en" : "zh-Hant-TW"} dir="ltr">
      <body className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text)] font-[family-name:var(--font-family-base)] antialiased">
        <PreviewBanner environment={environment} locale={locale} />
        <PageTransition header={<Header locale={locale} />} footer={<Footer locale={locale} />}>
          {children}
        </PageTransition>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: locale === "en" ? "JP PUMP" : "傑平泵浦",
                  alternateName: locale === "en" ? ["JIEPING CO., LTD"] : ["傑平", "傑平有限公司", "JP PUMP"],
                  url: SITE_ORIGIN,
                },
                {
                  "@type": "Organization",
                  name: locale === "en" ? "JIEPING CO., LTD" : "傑平有限公司",
                  alternateName: "JP PUMP",
                  url: SITE_ORIGIN,
                  telephone: "+886-2-2649-6338",
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+886-2-2649-6338",
                    email: "jie.ping@msa.hinet.net",
                    contactType: "sales",
                  },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
