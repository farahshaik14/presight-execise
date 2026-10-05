import type { DatabaseSync, SQLInputValue, StatementSync } from "node:sqlite";
import { normalizeText } from "../text.js";
import type { Person } from "../types.js";
import type { PeopleFilters, PeopleListParams, SortField } from "./params.js";

export interface PeoplePage {
  data: Person[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface FacetCount {
  value: string;
  count: number;
}

export interface PeopleFacets {
  total: number;
  hobbies: FacetCount[];
  nationalities: FacetCount[];
}

const TOP_FACETS = 20;

const SORT_COLUMNS: Record<SortField, string> = {
  first_name: "p.first_name_norm",
  last_name: "p.last_name_norm",
  age: "p.age",
  nationality: "p.nationality",
};

interface WhereClause {
  sql: string;
  params: SQLInputValue[];
}

const placeholders = (count: number) => Array(count).fill("?").join(", ");

const statementCache = new WeakMap<DatabaseSync, Map<string, StatementSync>>();

function prepare(db: DatabaseSync, sql: string): StatementSync {
  let cache = statementCache.get(db);
  if (!cache) {
    cache = new Map();
    statementCache.set(db, cache);
  }
  let statement = cache.get(sql);
  if (!statement) {
    statement = db.prepare(sql);
    cache.set(sql, statement);
  }
  return statement;
}

const escapeLike = (value: string) => value.replace(/[\\%_]/g, (char) => `\\${char}`);

function buildWhere(filters: PeopleFilters, options: { skipNationality?: boolean } = {}): WhereClause {
  const conditions: string[] = [];
  const params: SQLInputValue[] = [];

  const terms = normalizeText(filters.search).split(/\s+/).filter(Boolean);
  for (const term of terms) {
    const pattern = `%${escapeLike(term)}%`;
    conditions.push(
      `(p.first_name_norm LIKE ? ESCAPE '\\' OR p.last_name_norm LIKE ? ESCAPE '\\')`
    );
    params.push(pattern, pattern);
  }

  if (filters.nationalities.length && !options.skipNationality) {
    conditions.push(`p.nationality IN (${placeholders(filters.nationalities.length)})`);
    params.push(...filters.nationalities);
  }

  if (filters.hobbies.length) {
    conditions.push(
      `p.id IN (
        SELECT ph.person_id
        FROM person_hobbies ph
        JOIN hobbies h ON h.id = ph.hobby_id
        WHERE h.name IN (${placeholders(filters.hobbies.length)})
        GROUP BY ph.person_id
        HAVING COUNT(*) = ?
      )`
    );
    params.push(...filters.hobbies, filters.hobbies.length);
  }

  return {
    sql: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
}

interface PersonRow extends Omit<Person, "hobbies"> {
  hobbies: string;
}

function countPeople(db: DatabaseSync, where: WhereClause): number {
  const sql = `SELECT COUNT(*) AS total FROM people p ${where.sql}`;
  const row = prepare(db, sql).get(...where.params) as { total: number };
  return row.total;
}

export function listPeople(db: DatabaseSync, params: PeopleListParams): PeoplePage {
  const where = buildWhere(params);
  const direction = params.order === "desc" ? "DESC" : "ASC";
  const offset = (params.page - 1) * params.pageSize;

  const total = countPeople(db, where);

  const sql = `
    SELECT p.id, p.avatar, p.first_name, p.last_name, p.age, p.nationality,
      (
        SELECT json_group_array(h.name ORDER BY ph.position)
        FROM person_hobbies ph
        JOIN hobbies h ON h.id = ph.hobby_id
        WHERE ph.person_id = p.id
      ) AS hobbies
    FROM people p
    ${where.sql}
    ORDER BY ${SORT_COLUMNS[params.sort]} ${direction}, p.id ${direction}
    LIMIT ? OFFSET ?`;
  const rows = prepare(db, sql).all(...where.params, params.pageSize, offset) as unknown as PersonRow[];

  return {
    data: rows.map((row) => ({ ...row, hobbies: JSON.parse(row.hobbies) as string[] })),
    page: params.page,
    pageSize: params.pageSize,
    total,
    hasMore: offset + rows.length < total,
  };
}

export function getFacets(db: DatabaseSync, filters: PeopleFilters): PeopleFacets {
  const all = buildWhere(filters);
  const withoutNationality = buildWhere(filters, { skipNationality: true });

  const hobbiesSql = `
    SELECT h.name AS value, COUNT(*) AS count
    FROM person_hobbies ph
    JOIN hobbies h ON h.id = ph.hobby_id
    WHERE ph.person_id IN (SELECT p.id FROM people p ${all.sql})
    GROUP BY h.id
    ORDER BY count DESC, value ASC
    LIMIT ?`;

  const nationalitiesSql = `
    SELECT p.nationality AS value, COUNT(*) AS count
    FROM people p
    ${withoutNationality.sql}
    GROUP BY p.nationality
    ORDER BY count DESC, value ASC
    LIMIT ?`;

  return {
    total: countPeople(db, all),
    hobbies: prepare(db, hobbiesSql).all(...all.params, TOP_FACETS) as unknown as FacetCount[],
    nationalities: prepare(db, nationalitiesSql).all(
      ...withoutNationality.params,
      TOP_FACETS
    ) as unknown as FacetCount[],
  };
}
