import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const localUrl = (process.env.APP_LOCAL_URL?.trim() || "http://localhost:3000").replace(/\/$/, "");
const localFinanceUrl = `${localUrl}/finance`;
const precleanArgs = ["compose", "--profile", "public", "down", "--remove-orphans"];
const upArgs = ["compose", "--profile", "public", "up", "--build", "-d"];
const logArgs = ["compose", "logs", "tunnel", "--no-color", "--since", "10m"];
const quickTunnelRegex = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/gi;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runDocker(args) {
  return execFileAsync("docker", args, {
    cwd: process.cwd(),
    windowsHide: true,
    maxBuffer: 1024 * 1024 * 10,
  });
}

async function isLocalReady() {
  try {
    const response = await fetch(localUrl);
    return response.ok;
  } catch {
    return false;
  }
}

async function readQuickTunnelUrl() {
  try {
    const { stdout, stderr } = await runDocker(logArgs);
    const combined = `${stdout}\n${stderr}`;
    const matches = combined.match(quickTunnelRegex);
    return matches?.at(-1) ?? null;
  } catch {
    return null;
  }
}

function printSummary(publicUrl) {
  const publicFinanceUrl = publicUrl ? `${publicUrl}/finance` : null;

  console.log("");
  console.log("========================================");
  console.log("Carteira pronta");
  console.log(`Local:            ${localUrl}`);
  console.log(`Local /finance:   ${localFinanceUrl}`);
  console.log(`Cloudflare:       ${publicUrl ?? "ainda nao encontrado"}`);
  if (publicFinanceUrl) {
    console.log(`Cloudflare/fin.:  ${publicFinanceUrl}`);
  }
  console.log("========================================");
  console.log("");
}

async function main() {
  console.log("Subindo app com Quick Tunnel generico do Cloudflare...");
  await runDocker(precleanArgs).catch(() => null);
  await runDocker(upArgs);

  let localReady = false;
  let publicUrl = null;
  const deadline = Date.now() + 120_000;

  while (Date.now() < deadline) {
    if (!localReady) {
      localReady = await isLocalReady();
    }

    if (!publicUrl) {
      publicUrl = await readQuickTunnelUrl();
    }

    if (localReady && publicUrl) {
      printSummary(publicUrl);
      console.log(
        "Observacao: a URL trycloudflare.com e generica, aleatoria e pode mudar na proxima subida."
      );
      return;
    }

    await sleep(2_000);
  }

  printSummary(publicUrl);
  console.log(
    "A app pode ainda estar iniciando. Para acompanhar em tempo real, rode: docker compose logs -f app tunnel"
  );
  process.exitCode = 1;
}

main().catch((error) => {
  console.error("Falha ao subir o ambiente publico:", error.message);
  if (error.stdout) {
    console.error(error.stdout);
  }
  if (error.stderr) {
    console.error(error.stderr);
  }
  process.exit(1);
});
