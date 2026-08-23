import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The generated Prisma client + pg driver stay external to the server bundle.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  // For Prisma Compute / Docker deploys, re-enable: output: "standalone".
};

export default nextConfig;
