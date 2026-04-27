/**
 * Точка входа Node.js для хостинга (Beget и др.) при сборке `output: "standalone"`.
 *
 * После `npm run build` скрипт prepare-standalone копирует `public` и `.next/static`
 * внутрь `.next/standalone`. Запуск: `node server.js` (или `npm start`).
 *
 * Переменные окружения: PORT (по умолчанию 3000), HOSTNAME (по умолчанию 0.0.0.0).
 */

const fs = require("fs");
const path = require("path");

// Beget + Passenger: слушать localhost, если не задано (без PassengerEnvVar в .htaccess)
if (!process.env.HOSTNAME) {
  process.env.HOSTNAME = "127.0.0.1";
}

const standaloneBase = path.join(__dirname, ".next", "standalone");

function resolveStandaloneDir() {
  const flat = path.join(standaloneBase, "server.js");
  if (fs.existsSync(flat)) {
    return standaloneBase;
  }
  if (!fs.existsSync(standaloneBase)) {
    return null;
  }
  for (const entry of fs.readdirSync(standaloneBase, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const nested = path.join(standaloneBase, entry.name);
    if (fs.existsSync(path.join(nested, "server.js"))) {
      return nested;
    }
  }
  return null;
}

const standaloneDir = resolveStandaloneDir();
if (!standaloneDir) {
  console.error(
    "[server.js] Не найден .next/standalone/.../server.js. Выполните: npm run build (из папки gymacro-site)",
  );
  process.exit(1);
}

process.chdir(standaloneDir);
require(path.join(standaloneDir, "server.js"));
