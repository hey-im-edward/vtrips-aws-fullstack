import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const processes = [
  ["backend", ["--workspace", "backend", "run", "dev"]],
  ["frontend", ["--workspace", "frontend", "run", "dev", "--", "--host", "127.0.0.1"]]
];

for (const [name, args] of processes) {
  const child = spawn(npmCommand, args, {
    stdio: "inherit",
    shell: false,
    env: { ...process.env, FORCE_COLOR: "1" }
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      process.exitCode = code;
    }
  });
}

process.on("SIGINT", () => {
  process.exit(0);
});
