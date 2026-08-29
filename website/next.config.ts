import type { NextConfig } from "next";
import governedRedirects from "./data/redirects.json";

const isProduction = process.env.VERCEL_ENV === "production";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./catalog-current.json", "./releases/**/*"],
  },
  async headers() {
    if (isProduction) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    return [
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
