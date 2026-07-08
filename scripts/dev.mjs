import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const processes = [
  ["backend", ["--workspace", "backend", "run", "dev"]],
  ["frontend", ["--workspace", "frontend", "run", "dev", "--", "--host", "127.0.0.1"]]
];

const children = [];

for (const [name, args] of processes) {
  const child = spawn(npmCommand, args, {
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
    env: { ...process.env, FORCE_COLOR: "1" }
  });

  children.push(child);
  child.stdout?.on("data", (chunk) => process.stdout.write(`[${name}] ${chunk}`));
  child.stderr?.on("data", (chunk) => process.stderr.write(`[${name}] ${chunk}`));

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      process.exitCode = code;
    }
  });
}

process.on("SIGINT", () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGINT");
    }
  }
  process.exit(0);
});
