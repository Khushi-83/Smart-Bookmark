import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  experimental: {
    turbopack: {
      root: '.',
    },
  },
} as any;

export default nextConfig;
