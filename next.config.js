/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: false,
  basePath: "/PWA_Time_Tools",
  assetPrefix: "/PWA_Time_Tools/",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
