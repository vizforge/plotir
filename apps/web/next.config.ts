import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@plotir/core", "@plotir/vegalite", "@plotir/tableau"],
  webpack(config) {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
    };
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
