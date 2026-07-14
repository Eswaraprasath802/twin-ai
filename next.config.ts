import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Avoid "static generation" for pages that call APIs at build time */
  output: undefined,
  typescript: {
    /* We run tsc separately; don't block build */
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
