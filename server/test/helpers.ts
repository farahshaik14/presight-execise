import type { AddressInfo } from "node:net";
import { createApp } from "../src/app.js";
import { IN_MEMORY, openDatabase } from "../src/db/connection.js";
import { seedDatabase } from "../src/db/seed.js";
import type { PeopleFacets, PeoplePage } from "../src/people/repository.js";
import type { Person } from "../src/types.js";

export interface TestServer {
  get<T = unknown>(path: string, query?: Query): Promise<{ status: number; body: T }>;
  close(): Promise<void>;
}

export type Query = Record<string, string | number | string[] | undefined>;

export async function startTestServer(): Promise<TestServer> {
  const db = openDatabase(IN_MEMORY);
  seedDatabase(db);
  const server = createApp({ db }).listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const { port } = server.address() as AddressInfo;

  return {
    async get(path, query = {}) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined) continue;
        for (const item of Array.isArray(value) ? value : [value]) params.append(key, String(item));
      }
      const response = await fetch(`http://127.0.0.1:${port}${path}?${params}`);
      return { status: response.status, body: await response.json() };
    },
    close: () =>
      new Promise((resolve) =>
        server.close(() => {
          db.close();
          resolve();
        })
      ),
  };
}

export async function fetchAllPeople(api: TestServer, query: Query = {}): Promise<Person[]> {
  const people: Person[] = [];
  for (let page = 1; ; page++) {
    const { body } = await api.get<PeoplePage>("/api/people", { ...query, page, pageSize: 100 });
    people.push(...body.data);
    if (!body.hasMore) return people;
  }
}

export type { PeopleFacets, PeoplePage, Person };
