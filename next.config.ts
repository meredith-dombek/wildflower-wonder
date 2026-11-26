import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 85], minimumCacheTTL: 60 },
  // CLAUDE.md carries the "read the bundled Next docs" rule; AGENTS.md is a symlink to it.
  agentRules: false,
};

export default nextConfig;
