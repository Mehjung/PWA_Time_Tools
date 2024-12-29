/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  basePath: '/PWA_Time_Tools',
  images: {
    unoptimized: true,
  },
  assetPrefix: '/PWA_Time_Tools/',
  trailingSlash: true,
}

export default nextConfig;
