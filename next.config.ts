import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/PWA_Time_Tools',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
