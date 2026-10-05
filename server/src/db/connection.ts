import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export const IN_MEMORY = ":memory:";

export function openDatabase(path: string): DatabaseSync {
  if (path !== IN_MEMORY) {
    mkdirSync(dirname(path), { recursive: true });
  }
  const db = new DatabaseSync(path);
  db.exec("PRAGMA foreign_keys = ON;");
  if (path !== IN_MEMORY) {
    db.exec("PRAGMA journal_mode = WAL;");
  }
  return db;
}

export function isSeeded(db: DatabaseSync): boolean {
  const table = db
    .prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'people'")
    .get();
  if (!table) return false;
  const row = db.prepare("SELECT EXISTS (SELECT 1 FROM people) AS seeded").get() as { seeded: number };
  return row.seeded === 1;
}
