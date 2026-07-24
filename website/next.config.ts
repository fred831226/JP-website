import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/zh-tw",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
