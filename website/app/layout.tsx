import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JP PUMP｜泵浦系統與工程服務",
  description: "從產品選型到工程支援，協助你找到合適的泵浦系統方向。",
  icons: {
    icon: "/jp-pump-logo.png",
    shortcut: "/jp-pump-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
