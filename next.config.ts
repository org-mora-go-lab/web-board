import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // E2E runs a second dev server with its own build directory so it never collides with `npm run dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
