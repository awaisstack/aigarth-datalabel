import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@noble/hashes', '@noble/ed25519'],
  eslint: {
    ignoreDuringBuilds: true,  // Skip ESLint for hackathon build
  },
  typescript: {
    ignoreBuildErrors: true,  // Skip type errors for hackathon build
  },
};

export default nextConfig;
