export interface Person {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

export const SORT_FIELDS = ["first_name", "last_name", "age", "nationality"] as const;
export type SortField = (typeof SORT_FIELDS)[number];
export type SortOrder = "asc" | "desc";

export interface PeopleFilters {
  search: string;
  hobbies: string[];
  nationalities: string[];
}

export interface PeopleQuery extends PeopleFilters {
  sort: SortField;
  order: SortOrder;
  page: number;
  pageSize: number;
}

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
