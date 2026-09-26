import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/revenue",
        destination: "/pricing",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
