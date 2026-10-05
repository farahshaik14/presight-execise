import { loadConfig } from "./config.js";
import { openDatabase } from "./db/connection.js";
import { seedDatabase } from "./db/seed.js";

const { dbPath } = loadConfig();
const db = openDatabase(dbPath);
const count = seedDatabase(db);
db.close();

console.log(`Seeded ${count} people into ${dbPath}`);
