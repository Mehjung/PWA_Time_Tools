/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/PWA_Time_Tools" : "",
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === "production" ? "/PWA_Time_Tools/" : "",
  trailingSlash: true,
  eslint: {
    // Warnungen während der Entwicklung anzeigen
    ignoreDuringBuilds: false,
    dirs: ["src"],
  },
};

export default nextConfig;
