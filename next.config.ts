import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,

  // Logo is served from /public. No remote image hosts are used yet.
  images: {
    remotePatterns: [],
  },

  // Canonical is the apex domain (https://vyntexusa.com).
  // Redirect the www subdomain to the apex. DNS/Vercel should also enforce this,
  // but this guarantees correct behavior at the application layer.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.vyntexusa.com" }],
        destination: "https://vyntexusa.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default config;
