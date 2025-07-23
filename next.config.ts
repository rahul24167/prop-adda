import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://storage.googleapis.com/plency-store/images/**')],
  },
};

export default nextConfig;
