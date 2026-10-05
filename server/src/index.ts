import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { isSeeded, openDatabase } from "./db/connection.js";
import { seedDatabase } from "./db/seed.js";

const config = loadConfig();
const db = openDatabase(config.dbPath);

if (!isSeeded(db)) {
  console.log(`Database is empty, seeded ${seedDatabase(db)} people into ${config.dbPath}`);
}

const app = createApp({ db, clientDist: config.clientDist, logRequests: config.logRequests });

const server = app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});

function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
