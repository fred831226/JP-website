import type { Metadata, Viewport } from "next";
import "../globals.css";
import Header from "@/features/navigation/Header";
import Footer from "@/features/navigation/Footer";
import Script from "next/script";
import { getSitePage } from "@/lib/content/load-pages";

export function generateStaticParams() {
  return [{ locale: "zh-tw" }];
}

export const metadata: Metadata = {
  title: {
    default: "傑平有限公司 JP PUMP | 泵浦專業供應與服務",
    template: "%s | 傑平有限公司 JP PUMP",
  },
  description: "傑平有限公司（JP PUMP）— 專業泵浦選型、供應、安裝、維修與顧問服務。提供經技術驗證的品牌、泵浦類型、應用情境與型號規格資訊。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = getSitePage();

  return (
    <html lang="zh-Hant-TW" dir="ltr">
      <body className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text)] font-[family-name:var(--font-family-base)] antialiased">
        <Header site={site} />
        <main className="flex-1">{children}</main>
        <Footer site={site} />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: site.companyName,
              alternateName: site.brandName,
              url: "https://www.jp-pump.com.tw",
              telephone: site.contactInfo.phone,
              contactPoint: {
                "@type": "ContactPoint",
                telephone: site.contactInfo.phone,
                contactType: "sales",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
