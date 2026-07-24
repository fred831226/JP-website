import type { Metadata, Viewport } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

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
  return (
    <html lang="zh-Hant-TW" dir="ltr">
      <body className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text)] font-[family-name:var(--font-family-base)] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "傑平有限公司",
              alternateName: "JP PUMP",
              url: "https://www.jp-pump.com.tw",
              telephone: "+886-2-1234-5678",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+886-2-1234-5678",
                contactType: "sales",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
