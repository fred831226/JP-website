import type { NextConfig } from "next";
import governedRedirects from "./data/redirects.json";
import { SITE_ORIGIN } from "./src/lib/site-origin.mjs";

const productionHost = new URL(SITE_ORIGIN).hostname;

const developmentEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
const securityHeaders = [
  { key: "Content-Security-Policy", value: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'${developmentEval}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https: wss:; frame-src https://www.google.com; upgrade-insecure-requests` },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./catalog-current.json", "./releases/**/*"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${productionHost}` }],
        destination: `${SITE_ORIGIN}/:path*`,
        permanent: true,
      },
      {
        source: "/",
        destination: "/zh-tw",
        permanent: true,
      },
      ...governedRedirects,
    ];
  },
};

export default nextConfig;
