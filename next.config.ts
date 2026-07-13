import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,

  // Logo is served from /public. No remote image hosts are used yet.
  images: {
    remotePatterns: [],
  },

  
};

export default config;
