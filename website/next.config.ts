import type { NextConfig } from "next";
import governedRedirects from "./data/redirects.json";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./catalog-current.json", "./releases/**/*"],
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
