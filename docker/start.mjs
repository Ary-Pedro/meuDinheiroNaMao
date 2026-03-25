import { spawn } from "node:child_process";

const port = process.env.PORT ?? "3000";
const publicUrl = process.env.APP_PUBLIC_URL?.trim();

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

  if (publicUrl && line.includes("- Network:")) {
    return `   - Rede:          ${publicUrl}`;
  }

  if (line.includes("- Local:")) {
    return line.replace("- Local:", "- Local:");
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
      target.write(`${rewriteLine(line)}\n`);
    }
  });

  stream.on("end", () => {
    if (buffer) {
      target.write(`${rewriteLine(buffer)}\n`);
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
