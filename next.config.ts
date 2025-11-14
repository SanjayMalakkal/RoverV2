import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
   basePath: "/rover-ebook",
  assetPrefix: "/rover-ebook/",
  /* config options here */
};

export default nextConfig;


// next.config.js

module.exports = {
  async rewrites() {
    return [
      {
        source: '/workflow.trigger/:slug', // Match the pattern in the URL
        destination: 'https://innov-dev.beta.injomo.com/workflow.trigger/:slug', // Proxy the request to the target URL
      },
    ];
  },
}; 