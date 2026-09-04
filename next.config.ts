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
  /** www → основной домен (дубли и GSC «вариант с canonical»). На Beget также дублируется в .htaccess. */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.gymacro.ru" }],
        destination: "https://gymacro.ru/:path*",
        permanent: true,
      },
      {
        source:
          "/posts/роль-средней-в-спортивной-акробатике",
        destination:
          "/posts/rol-srednej-v-sportivnoj-akrobatike-nezametnyj-geroj-trojki",
        permanent: true,
      },
    ];
  },
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
