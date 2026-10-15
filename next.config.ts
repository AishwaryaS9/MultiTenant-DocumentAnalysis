import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["officeparser", "word-extractor", "@e965/xlsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
