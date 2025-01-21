/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: false,
  basePath: "",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
