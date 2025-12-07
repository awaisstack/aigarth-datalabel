import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@noble/hashes', '@noble/ed25519'],
};

export default nextConfig;
