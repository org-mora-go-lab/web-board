import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // E2E runs a second dev server with its own build directory so it never collides with `npm run dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // sql.js loads its WASM binary from node_modules at runtime, so keep it out of the server bundle.
  serverExternalPackages: ["sql.js"],
};

export default nextConfig;
