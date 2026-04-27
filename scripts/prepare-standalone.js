/**
 * Копирует `public` и `.next/static` в `.next/standalone` (требование Next.js standalone).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(standalone)) {
  console.warn("[prepare-standalone] Пропуск: нет .next/standalone (сначала next build).");
  process.exit(0);
}

function resolvePublicSource() {
  const lower = path.join(root, "public");
  const upper = path.join(root, "Public");
  if (fs.existsSync(lower)) return lower;
  if (fs.existsSync(upper)) return upper;
  return null;
}

const publicSrc = resolvePublicSource();
if (publicSrc) {
  const publicDest = path.join(standalone, "public");
  fs.cpSync(publicSrc, publicDest, { recursive: true });
}

const staticSrc = path.join(root, ".next", "static");
const staticDest = path.join(standalone, ".next", "static");
if (fs.existsSync(staticSrc)) {
  fs.mkdirSync(path.dirname(staticDest), { recursive: true });
  fs.cpSync(staticSrc, staticDest, { recursive: true });
}

console.log("[prepare-standalone] Готово: public и .next/static скопированы в standalone.");
