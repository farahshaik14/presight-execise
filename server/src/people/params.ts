export const SORT_FIELDS = ["first_name", "last_name", "age", "nationality"] as const;
export const SORT_ORDERS = ["asc", "desc"] as const;

export type SortField = (typeof SORT_FIELDS)[number];
export type SortOrder = (typeof SORT_ORDERS)[number];

export interface PeopleFilters {
  search: string;
  nationalities: string[];
  hobbies: string[];
}

export interface PeopleListParams extends PeopleFilters {
  sort: SortField;
  order: SortOrder;
  page: number;
  pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 30;
export const MAX_PAGE_SIZE = 100;
export const MAX_SEARCH_LENGTH = 100;
export const MAX_FILTER_VALUES = 25;

export class ValidationError extends Error {}

type QueryValue = unknown;

function toList(value: QueryValue, name: string): string[] {
  const values = Array.isArray(value) ? value : value === undefined ? [] : [value];
  const cleaned = values
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);
  const unique = [...new Set(cleaned)];
  if (unique.length > MAX_FILTER_VALUES) {
    throw new ValidationError(`"${name}" accepts at most ${MAX_FILTER_VALUES} values`);
  }
  return unique;
}

function toText(value: QueryValue, name: string): string {
  if (value === undefined) return "";
  if (typeof value !== "string") {
    throw new ValidationError(`"${name}" must be a single value`);
  }
  const text = value.trim();
  if (text.length > MAX_SEARCH_LENGTH) {
    throw new ValidationError(`"${name}" must be at most ${MAX_SEARCH_LENGTH} characters`);
  }
  return text;
}

function toInt(value: QueryValue, name: string, fallback: number, min: number, max: number): number {
  if (value === undefined || value === "") return fallback;
  const parsed = typeof value === "string" ? Number(value) : NaN;
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new ValidationError(`"${name}" must be an integer between ${min} and ${max}`);
  }
  return parsed;
}

function toEnum<T extends string>(value: QueryValue, name: string, allowed: readonly T[], fallback: T): T {
  if (value === undefined || value === "") return fallback;
  if (typeof value === "string" && (allowed as readonly string[]).includes(value)) return value as T;
  throw new ValidationError(`"${name}" must be one of: ${allowed.join(", ")}`);
}

export function parseFilters(query: Record<string, QueryValue>): PeopleFilters {
  return {
    search: toText(query.q, "q"),
    nationalities: toList(query.nationality, "nationality"),
    hobbies: toList(query.hobby, "hobby"),
  };
}

export function parseListParams(query: Record<string, QueryValue>): PeopleListParams {
  return {
    ...parseFilters(query),
    sort: toEnum(query.sort, "sort", SORT_FIELDS, "first_name"),
    order: toEnum(query.order, "order", SORT_ORDERS, "asc"),
    page: toInt(query.page, "page", 1, 1, Number.MAX_SAFE_INTEGER),
    pageSize: toInt(query.pageSize, "pageSize", DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE),
  };
}
