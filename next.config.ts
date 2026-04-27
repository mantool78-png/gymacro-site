import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** Иначе при лишнем package-lock.json в родительской папке Next кладёт standalone в .next/standalone/<имя-папки>/ */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  /** Dev: разрешить открытие с локального IP (WSL, Docker и т.п.), иначе Next может резать запросы к /_next. */
  allowedDevOrigins: ["172.19.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gymacro.ru",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "gymacro.ru",
        pathname: "/cms/wp-content/**",
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
