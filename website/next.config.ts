import type { NextConfig } from "next";
import governedRedirects from "./data/redirects.json";
import { getIndexingHeaders } from "./src/lib/deployment-environment";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./catalog-current.json", "./releases/**/*"],
  },
  async headers() {
    const headers = getIndexingHeaders();
    if (headers.length === 0) return [];
    return [
      {
        source: "/:path*",
        headers,
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
