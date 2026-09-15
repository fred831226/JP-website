export const SITE_ORIGIN = "https://jp-pump.com";

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, `${SITE_ORIGIN}/`).toString();
}
