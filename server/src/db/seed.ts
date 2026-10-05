import { faker } from "@faker-js/faker";
import { readFileSync } from "node:fs";
import type { DatabaseSync } from "node:sqlite";
import { normalizeText } from "../text.js";
import { HOBBIES, NATIONALITIES } from "./nationalities.js";
import { PORTRAITS, type Portrait } from "./portraits.js";

const PEOPLE_COUNT = 1000;
const SEED = 42;
const AVATAR_BASE = "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait";

type Sex = Portrait["sex"];

class PortraitPool {
  private pools = new Map<string, Portrait[]>();
  private cursors = new Map<string, number>();

  constructor(portraits: Portrait[]) {
    for (const portrait of faker.helpers.shuffle([...portraits])) {
      const key = `${portrait.region}:${portrait.sex}`;
      this.pools.set(key, [...(this.pools.get(key) ?? []), portrait]);
    }
  }

  size(region: string, sex: Sex) {
    return this.pools.get(`${region}:${sex}`)?.length ?? 0;
  }

  next(region: string, sex: Sex): Portrait {
    const key = `${region}:${sex}`;
    const pool = this.pools.get(key);
    if (!pool?.length) throw new Error(`No portraits for ${key}`);
    const cursor = this.cursors.get(key) ?? 0;
    this.cursors.set(key, cursor + 1);
    return pool[cursor % pool.length];
  }
}

const hobbyWeights = HOBBIES.map((value, index) => ({ value, weight: HOBBIES.length - index }));
const nationalityWeights = NATIONALITIES.map((value) => ({ value, weight: value.weight }));

function pickHobbies(): string[] {
  const count = faker.number.int({ min: 0, max: 10 });
  const picked = new Set<string>();
  while (picked.size < count) {
    picked.add(faker.helpers.weightedArrayElement(hobbyWeights));
  }
  return [...picked];
}

export function seedDatabase(db: DatabaseSync): number {
  faker.seed(SEED);

  const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
  db.exec(schema);

  const portraits = new PortraitPool(PORTRAITS);

  const insertHobby = db.prepare("INSERT INTO hobbies (name) VALUES (?)");
  const insertPerson = db.prepare(
    `INSERT INTO people (avatar, first_name, last_name, first_name_norm, last_name_norm, age, nationality)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const insertPersonHobby = db.prepare(
    "INSERT INTO person_hobbies (person_id, hobby_id, position) VALUES (?, ?, ?)"
  );

  db.exec("BEGIN");
  try {
    const hobbyIds = new Map<string, number>();
    for (const name of HOBBIES) {
      const { lastInsertRowid } = insertHobby.run(name);
      hobbyIds.set(name, Number(lastInsertRowid));
    }

    for (let i = 0; i < PEOPLE_COUNT; i++) {
      const nationality = faker.helpers.weightedArrayElement(nationalityWeights);
      const sex = faker.helpers.weightedArrayElement<Sex>([
        { value: "male", weight: portraits.size(nationality.region, "male") },
        { value: "female", weight: portraits.size(nationality.region, "female") },
      ]);
      const portrait = portraits.next(nationality.region, sex);
      const firstName = faker.helpers.arrayElement(nationality[sex]);
      const lastName = faker.helpers.arrayElement(nationality.last);

      const { lastInsertRowid } = insertPerson.run(
        `${AVATAR_BASE}/${sex}/128/${portrait.index}.jpg`,
        firstName,
        lastName,
        normalizeText(firstName),
        normalizeText(lastName),
        portrait.age,
        nationality.name
      );

      pickHobbies().forEach((hobby, position) => {
        insertPersonHobby.run(lastInsertRowid, hobbyIds.get(hobby)!, position);
      });
    }

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return PEOPLE_COUNT;
}
