import assert from "node:assert/strict";
import { test } from "node:test";
import { IN_MEMORY, isSeeded, openDatabase } from "../src/db/connection.js";
import { NATIONALITIES } from "../src/db/nationalities.js";
import { seedDatabase } from "../src/db/seed.js";

function snapshot() {
  const db = openDatabase(IN_MEMORY);
  seedDatabase(db);
  const people = db.prepare("SELECT * FROM people ORDER BY id").all();
  const links = db.prepare("SELECT * FROM person_hobbies ORDER BY person_id, position").all();
  db.close();
  return { people, links };
}

test("seeding is deterministic", () => {
  assert.deepEqual(snapshot(), snapshot());
});

test("seeded data respects the data model", () => {
  const db = openDatabase(IN_MEMORY);
  assert.equal(isSeeded(db), false);
  const count = seedDatabase(db);
  assert.equal(isSeeded(db), true);

  const people = db.prepare("SELECT * FROM people").all() as {
    id: number;
    avatar: string;
    first_name: string;
    nationality: string;
    age: number;
  }[];
  assert.equal(people.length, count);

  const known = new Map(NATIONALITIES.map((n) => [n.name, n]));
  for (const person of people) {
    const nationality = known.get(person.nationality);
    assert.ok(nationality, `unknown nationality ${person.nationality}`);
    assert.ok(
      [...nationality.male, ...nationality.female].includes(person.first_name),
      `${person.first_name} is not a ${person.nationality} name`
    );
    assert.match(person.avatar, /^https:\/\/cdn\.jsdelivr\.net\/.+\/(male|female)\/128\/\d+\.jpg$/);
    assert.ok(person.age >= 18 && person.age <= 100);
  }

  const hobbyCounts = db
    .prepare(
      `SELECT COUNT(ph.hobby_id) AS n FROM people p
       LEFT JOIN person_hobbies ph ON ph.person_id = p.id GROUP BY p.id`
    )
    .all() as { n: number }[];
  const counts = hobbyCounts.map((r) => r.n);
  assert.equal(Math.min(...counts), 0);
  assert.equal(Math.max(...counts), 10);

  db.close();
});
