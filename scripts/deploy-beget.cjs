/**
 * Полный деплой на Beget: сборка, tar, scp, ssh + restart.txt.
 * Переменные — из окружения или из файлов `.env.deploy` / `deploy.env` в корне проекта.
 *
 * Обязательно: DEPLOY_SSH (формат user@host)
 * Опционально: DEPLOY_REMOTE_DIR, DEPLOY_REMOTE_ARCHIVE, DEPLOY_ARCHIVE_NAME
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function parseEnvFile(filePath) {
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  const text = fs.readFileSync(filePath, "utf8");
  for (let line of text.split(/\r?\n/)) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

/** Приоритет: уже заданные в shell → deploy.env → .env.deploy */
const mergedDeployEnv = {
  ...parseEnvFile(path.join(root, ".env.deploy")),
  ...parseEnvFile(path.join(root, "deploy.env")),
};
for (const [key, val] of Object.entries(mergedDeployEnv)) {
  if (process.env[key] === undefined) process.env[key] = val;
}

const DEPLOY_SSH = process.env.DEPLOY_SSH?.trim();
const DEPLOY_REMOTE_DIR =
  process.env.DEPLOY_REMOTE_DIR?.trim() || "~/mantoos7.beget.tech/public_html";
const ARCHIVE_NAME = process.env.DEPLOY_ARCHIVE_NAME?.trim() || "gymacro-deploy.tgz";
const REMOTE_ARCHIVE =
  process.env.DEPLOY_REMOTE_ARCHIVE?.trim() || `~/${ARCHIVE_NAME}`;
const localArchivePath = path.join(root, ARCHIVE_NAME);

/** Устойчивее при долгой загрузке архива и нестабильной сети. */
const SSH_OPTS = [
  "-o",
  "ServerAliveInterval=30",
  "-o",
  "ServerAliveCountMax=12",
  "-o",
  "TCPKeepAlive=yes",
];

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    cwd: root,
    shell: opts.shell ?? false,
    env: process.env,
    ...opts,
  });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

if (!DEPLOY_SSH) {
  console.error(
    "[deploy-beget] Задайте DEPLOY_SSH (например mantoos7_1@mantoos7.beget.tech).\n" +
      "Скопируйте deploy.env.example → deploy.env или создайте .env.deploy и заполните переменные.",
  );
  process.exit(1);
}

console.log("[deploy-beget] Сборка…");
/** На Windows без shell иногда падает spawn npm.cmd — shell:true стабильнее */
run(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"], {
  shell: process.platform === "win32",
});

const need = ["server.js", "package.json", ".htaccess"];
for (const f of need) {
  if (!fs.existsSync(path.join(root, f))) {
    console.error(`[deploy-beget] Нет файла ${f} в корне проекта.`);
    process.exit(1);
  }
}
if (!fs.existsSync(path.join(root, ".next", "standalone"))) {
  console.error("[deploy-beget] Нет .next/standalone после сборки.");
  process.exit(1);
}

if (fs.existsSync(localArchivePath)) {
  fs.unlinkSync(localArchivePath);
}

console.log("[deploy-beget] Архив tar…");
const tarFiles = ["server.js", "package.json", ".htaccess", ".next/standalone"];
run("tar", ["-caf", ARCHIVE_NAME, ...tarFiles]);

console.log("[deploy-beget] Загрузка по scp…");
run("scp", [...SSH_OPTS, localArchivePath, `${DEPLOY_SSH}:${REMOTE_ARCHIVE}`]);

const remoteCmd = [
  `tar -xzf ${REMOTE_ARCHIVE} -C ${DEPLOY_REMOTE_DIR}`,
  `mkdir -p ${DEPLOY_REMOTE_DIR}/tmp`,
  `touch ${DEPLOY_REMOTE_DIR}/tmp/restart.txt`,
].join(" && ");

console.log("[deploy-beget] Распаковка и перезапуск Passenger…");
run("ssh", [...SSH_OPTS, DEPLOY_SSH, remoteCmd]);

console.log("[deploy-beget] Готово.");
