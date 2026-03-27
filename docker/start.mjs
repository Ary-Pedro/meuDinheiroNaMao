import { spawn } from "node:child_process";

const port = process.env.PORT ?? "3000";
const localUrl = (process.env.APP_LOCAL_URL ?? `http://localhost:${port}`).trim();

const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", port],
  {
    stdio: ["inherit", "pipe", "pipe"],
    env: process.env,
  }
);

function rewriteLine(line) {
  if (!line) return line;

  if (line.includes("Next.js")) {
    return null;
  }

  if (line.includes("- Local:")) {
    return `[app] local:   ${localUrl}`;
  }

  if (line.includes("- Network:")) {
    return null;
  }

  if (line.includes("Ready in")) {
    return "[app] servidor: pronto";
  }

  return line;
}

function pipeStream(stream, target) {
  let buffer = "";

  stream.on("data", (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const rewritten = rewriteLine(line);
      if (rewritten !== null) {
        target.write(`${rewritten}\n`);
      }
    }
  });

  stream.on("end", () => {
    if (buffer) {
      const rewritten = rewriteLine(buffer);
      if (rewritten !== null) {
        target.write(`${rewritten}\n`);
      }
    }
  });
}

pipeStream(child.stdout, process.stdout);
pipeStream(child.stderr, process.stderr);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
