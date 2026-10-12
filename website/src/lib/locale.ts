export type SiteLocale = "zh-tw" | "en";

export const SITE_LOCALES: SiteLocale[] = ["zh-tw", "en"];

export function isSiteLocale(value: string): value is SiteLocale {
  return value === "zh-tw" || value === "en";
}

export function localePath(locale: SiteLocale, path = ""): string {
  return `/${locale}${path}`;
}
