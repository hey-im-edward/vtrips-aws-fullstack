import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Database } from "./types.js";
import { seedDatabase } from "./seed.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, "../data/runtime-db.json");

let cache: Database | null = null;

async function persist(db: Database): Promise<void> {
  await mkdir(dirname(dbPath), { recursive: true });
  await writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

export async function readDb(): Promise<Database> {
  if (cache) {
    return cache;
  }

  try {
    cache = JSON.parse(await readFile(dbPath, "utf8")) as Database;
  } catch {
    cache = structuredClone(seedDatabase);
    await persist(cache);
  }

  return cache;
}

export async function writeDb(updater: (db: Database) => void): Promise<Database> {
  const db = await readDb();
  updater(db);
  await persist(db);
  return db;
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
