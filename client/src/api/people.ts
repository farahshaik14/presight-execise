import type { PeopleFacets, PeopleFilters, PeoplePage, PeopleQuery } from "../types";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function filterParams({ search, hobbies, nationalities }: PeopleFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  hobbies.forEach((hobby) => params.append("hobby", hobby));
  nationalities.forEach((nationality) => params.append("nationality", nationality));
  return params;
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body?.error ?? `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export function fetchPeople(query: PeopleQuery, signal?: AbortSignal): Promise<PeoplePage> {
  const params = filterParams(query);
  params.set("sort", query.sort);
  params.set("order", query.order);
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));
  return getJson(`/api/people?${params}`, signal);
}

export function fetchFacets(filters: PeopleFilters, signal?: AbortSignal): Promise<PeopleFacets> {
  return getJson(`/api/people/facets?${filterParams(filters)}`, signal);
}
