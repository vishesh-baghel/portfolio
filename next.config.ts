import type { NextConfig } from "next";
import createMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mastra/*"],
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
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
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
