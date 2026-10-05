import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const serverRoot = resolve(fileURLToPath(import.meta.url), "../..");

function readPort(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid PORT "${value}"`);
  }
  return port;
}

export interface Config {
  port: number;
  dbPath: string;
  clientDist?: string;
  logRequests: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return {
    port: readPort(env.PORT, 4000),
    dbPath: env.DB_PATH ? resolve(env.DB_PATH) : resolve(serverRoot, "data/presight.db"),
    clientDist: env.CLIENT_DIST ? resolve(env.CLIENT_DIST) : undefined,
    logRequests: env.NODE_ENV !== "test",
  };
}
