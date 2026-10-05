import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { normalizeText } from "../src/text.js";
import {
  fetchAllPeople,
  startTestServer,
  type PeopleFacets,
  type PeoplePage,
  type Person,
  type TestServer,
} from "./helpers.js";

let api: TestServer;
let everyone: Person[];

before(async () => {
  api = await startTestServer();
  everyone = await fetchAllPeople(api);
});

after(() => api.close());

interface Filters {
  q?: string;
  hobby?: string[];
  nationality?: string[];
}

function matches(person: Person, { q = "", hobby = [], nationality = [] }: Filters): boolean {
  const first = normalizeText(person.first_name);
  const last = normalizeText(person.last_name);
  const terms = normalizeText(q).split(/\s+/).filter(Boolean);
  return (
    terms.every((term) => first.includes(term) || last.includes(term)) &&
    (nationality.length === 0 || nationality.includes(person.nationality)) &&
    hobby.every((h) => person.hobbies.includes(h))
  );
}

function topCounts(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || (a.value < b.value ? -1 : 1))
    .slice(0, 20);
}

const ids = (people: Person[]) => people.map((p) => p.id).sort((a, b) => a - b);

describe("GET /api/health", () => {
  test("reports ok", async () => {
    const { status, body } = await api.get("/api/health");
    assert.equal(status, 200);
    assert.deepEqual(body, { status: "ok" });
  });
});

describe("GET /api/people", () => {
  test("returns the first page with pagination metadata", async () => {
    const { status, body } = await api.get<PeoplePage>("/api/people");
    assert.equal(status, 200);
    assert.equal(body.page, 1);
    assert.equal(body.pageSize, 30);
    assert.equal(body.data.length, 30);
    assert.equal(body.total, 1000);
    assert.equal(body.hasMore, true);

    const person = body.data[0];
    assert.deepEqual(Object.keys(person).sort(), [
      "age", "avatar", "first_name", "hobbies", "id", "last_name", "nationality",
    ]);
    assert.ok(person.hobbies.length <= 10);
  });

  test("reports no more results on the last page and past the end", async () => {
    const last = await api.get<PeoplePage>("/api/people", { page: 10, pageSize: 100 });
    assert.equal(last.body.data.length, 100);
    assert.equal(last.body.hasMore, false);

    const beyond = await api.get<PeoplePage>("/api/people", { page: 11, pageSize: 100 });
    assert.deepEqual(beyond.body.data, []);
    assert.equal(beyond.body.hasMore, false);
  });

  const sortKey = {
    first_name: (p: Person) => normalizeText(p.first_name),
    last_name: (p: Person) => normalizeText(p.last_name),
    age: (p: Person) => p.age,
    nationality: (p: Person) => p.nationality,
  };

  for (const sort of Object.keys(sortKey) as (keyof typeof sortKey)[]) {
    for (const order of ["asc", "desc"] as const) {
      test(`paginates by ${sort} ${order} without duplicates, gaps or ordering errors`, async () => {
        const people: Person[] = [];
        for (let page = 1; ; page++) {
          const { body } = await api.get<PeoplePage>("/api/people", { sort, order, page, pageSize: 37 });
          people.push(...body.data);
          if (!body.hasMore) break;
        }

        assert.equal(people.length, 1000);
        assert.equal(new Set(people.map((p) => p.id)).size, 1000);

        const sign = order === "asc" ? 1 : -1;
        for (let i = 1; i < people.length; i++) {
          const a = sortKey[sort](people[i - 1]);
          const b = sortKey[sort](people[i]);
          const cmp = a < b ? -1 : a > b ? 1 : people[i - 1].id - people[i].id;
          assert.ok(cmp * sign < 0, `rows ${i - 1} and ${i} are out of order`);
        }
      });
    }
  }

  test("multiple hobbies match people who have ALL of them", async () => {
    const filters = { hobby: ["Hiking", "Yoga"] };
    const result = await fetchAllPeople(api, filters);
    const expected = everyone.filter((p) => matches(p, filters));
    assert.ok(expected.length > 0);
    assert.deepEqual(ids(result), ids(expected));
  });

  test("multiple nationalities match people from ANY of them", async () => {
    const filters = { nationality: ["Emirati", "Indian"] };
    const result = await fetchAllPeople(api, filters);
    const expected = everyone.filter((p) => matches(p, filters));
    assert.deepEqual(ids(result), ids(expected));
    assert.deepEqual(new Set(result.map((p) => p.nationality)), new Set(["Emirati", "Indian"]));
  });

  test("text, hobby and nationality filters apply together", async () => {
    const filters = { q: "a", hobby: ["Reading"], nationality: ["Nigerian", "Kenyan", "British"] };
    const { body } = await api.get<PeoplePage>("/api/people", { ...filters, pageSize: 100 });
    const expected = everyone.filter((p) => matches(p, filters));
    assert.ok(expected.length > 0);
    assert.equal(body.total, expected.length);
    assert.deepEqual(ids(body.data), ids(expected));
  });

  test("search covers first and last name, ignoring case and accents", async () => {
    const accented = await fetchAllPeople(api, { q: "HERNANDEZ" });
    assert.ok(accented.length > 0);
    assert.ok(accented.every((p) => p.last_name === "Hernández"));

    const fullName = await fetchAllPeople(api, { q: "fatima al mansoori" });
    assert.ok(fullName.length > 0);
    assert.ok(fullName.every((p) => p.first_name === "Fatima" && p.last_name === "Al Mansoori"));
  });

  test("treats LIKE wildcards in the search text literally", async () => {
    const { body } = await api.get<PeoplePage>("/api/people", { q: "%" });
    assert.equal(body.total, 0);
    const underscore = await api.get<PeoplePage>("/api/people", { q: "_" });
    assert.equal(underscore.body.total, 0);
  });

  test("returns hobbies in their stored order", async () => {
    const { body } = await api.get<PeoplePage>("/api/people", { hobby: "Hiking", pageSize: 100 });
    const withMany = body.data.find((p) => p.hobbies.length > 2);
    assert.ok(withMany);
    const again = everyone.find((p) => p.id === withMany.id);
    assert.deepEqual(withMany.hobbies, again?.hobbies);
  });
});

describe("GET /api/people/facets", () => {
  const scenarios: [string, Filters][] = [
    ["no filters", {}],
    ["text filter", { q: "an" }],
    ["one nationality", { nationality: ["Emirati"] }],
    ["hobbies and nationalities", { hobby: ["Cooking", "Reading"], nationality: ["Nigerian", "Mexican"] }],
    ["everything", { q: "a", hobby: ["Gaming"], nationality: ["British", "German", "Kenyan"] }],
  ];

  for (const [name, filters] of scenarios) {
    test(`top 20 counts reflect the current filters: ${name}`, async () => {
      const { status, body } = await api.get<PeopleFacets>("/api/people/facets", { ...filters });
      assert.equal(status, 200);

      const results = everyone.filter((p) => matches(p, filters));
      const withoutNationality = everyone.filter((p) => matches(p, { ...filters, nationality: [] }));

      assert.equal(body.total, results.length);
      assert.deepEqual(body.hobbies, topCounts(results.flatMap((p) => p.hobbies)));
      assert.deepEqual(body.nationalities, topCounts(withoutNationality.map((p) => p.nationality)));
      assert.ok(body.hobbies.length <= 20 && body.nationalities.length <= 20);
    });
  }

  test("returns empty lists when nothing matches", async () => {
    const { body } = await api.get<PeopleFacets>("/api/people/facets", { q: "zzzzzz" });
    assert.deepEqual(body, { total: 0, hobbies: [], nationalities: [] });
  });
});

describe("validation and errors", () => {
  const invalid: [string, Record<string, string | string[]>][] = [
    ["unknown sort field", { sort: "email" }],
    ["unknown order", { order: "up" }],
    ["page below 1", { page: "0" }],
    ["non-numeric page", { page: "abc" }],
    ["page size above max", { pageSize: "101" }],
    ["page size of zero", { pageSize: "0" }],
    ["repeated page", { page: ["1", "2"] }],
    ["repeated search", { q: ["a", "b"] }],
    ["search text too long", { q: "a".repeat(101) }],
    ["too many hobbies", { hobby: Array.from({ length: 26 }, (_, i) => `h${i}`) }],
  ];

  for (const [name, query] of invalid) {
    test(`rejects ${name} with 400`, async () => {
      const { status, body } = await api.get<{ error: string }>("/api/people", query);
      assert.equal(status, 400);
      assert.equal(typeof body.error, "string");
    });
  }

  test("validates facet filters too", async () => {
    const { status } = await api.get("/api/people/facets", { q: "a".repeat(101) });
    assert.equal(status, 400);
  });

  test("responds with JSON 404 for unknown API routes", async () => {
    const { status, body } = await api.get("/api/nope");
    assert.equal(status, 404);
    assert.deepEqual(body, { error: "Not found" });
  });
});
