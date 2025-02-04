import withSerwistInit from "@serwist/next";
import million from "million/compiler";

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
const millionConfig = {
  auto: true, // if you're using RSC: auto: { rsc: true },
};

const exp = million.next(nextConfig, millionConfig);
export default withSerwist(exp);
