import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  basePath: "/PWA_Time_Tools",
  assetPrefix: "/PWA_Time_Tools/",
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default withSerwist(nextConfig);
