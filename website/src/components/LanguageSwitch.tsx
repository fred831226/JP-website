"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const englishPaths = new Set(["", "/company", "/partners", "/products", "/contact"]);

export default function LanguageSwitch() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const suffix = pathname.replace(/^\/(?:en|zh-tw)/, "");
  const href = isEnglish
    ? `/zh-tw${suffix}`
    : englishPaths.has(suffix) ? `/en${suffix}` : "/en/products";

  return (
    <Link
      href={href}
      hrefLang={isEnglish ? "zh-TW" : "en"}
      lang={isEnglish ? "zh-Hant-TW" : "en"}
      className="inline-flex min-h-[44px] items-center px-3 text-sm font-[700] text-[var(--color-action)] underline underline-offset-4 focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
      aria-label={isEnglish ? "Switch to Traditional Chinese" : "切換至英文版"}
    >
      {isEnglish ? "繁體中文" : "English"}
    </Link>
  );
}
