import type { NextConfig } from "next";
import nextra from 'nextra';

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mastra/*"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-accordion'],
  },
};

const withNextra = nextra({
  defaultShowCopyCode: true,
  search: {
    codeblocks: true,
  },
});

export default withNextra(nextConfig);
