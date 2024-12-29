/** @type {import('next').NextConfig} */

const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  basePath: process.env.NODE_ENV === 'production' ? '/PWA_Time_Tools' : '',
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/PWA_Time_Tools/' : '',
  trailingSlash: true,
  eslint: {
    // Warnungen während der Entwicklung anzeigen
    ignoreDuringBuilds: false,
    dirs: ['src']
  },
}

export default nextConfig;
