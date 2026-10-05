import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { SORT_FIELDS, type SortField, type SortOrder } from "../types";

const DEFAULT_SORT: SortField = "first_name";
const DEFAULT_ORDER: SortOrder = "asc";

export interface DirectoryParams {
  search: string;
  hobbies: string[];
  nationalities: string[];
  sort: SortField;
  order: SortOrder;
}

function parse(params: URLSearchParams): DirectoryParams {
  const sort = params.get("sort");
  return {
    search: params.get("q") ?? "",
    hobbies: params.getAll("hobby"),
    nationalities: params.getAll("nationality"),
    sort: SORT_FIELDS.includes(sort as SortField) ? (sort as SortField) : DEFAULT_SORT,
    order: params.get("order") === "desc" ? "desc" : DEFAULT_ORDER,
  };
}

function serialize(state: DirectoryParams): URLSearchParams {
  const params = new URLSearchParams();
  if (state.search) params.set("q", state.search);
  state.hobbies.forEach((hobby) => params.append("hobby", hobby));
  state.nationalities.forEach((nationality) => params.append("nationality", nationality));
  if (state.sort !== DEFAULT_SORT) params.set("sort", state.sort);
  if (state.order !== DEFAULT_ORDER) params.set("order", state.order);
  return params;
}

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export function useDirectoryParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = useMemo(() => parse(searchParams), [searchParams]);

  const update = useCallback(
    (change: (current: DirectoryParams) => Partial<DirectoryParams>, options?: { replace?: boolean }) => {
      setSearchParams((prev) => {
        const current = parse(prev);
        return serialize({ ...current, ...change(current) });
      }, options);
    },
    [setSearchParams]
  );

  const actions = useMemo(
    () => ({
      setSearch: (search: string) => update(() => ({ search }), { replace: true }),
      toggleHobby: (hobby: string) => update((s) => ({ hobbies: toggle(s.hobbies, hobby) })),
      toggleNationality: (value: string) =>
        update((s) => ({ nationalities: toggle(s.nationalities, value) })),
      setSort: (sort: SortField) => update(() => ({ sort })),
      setOrder: (order: SortOrder) => update(() => ({ order })),
      clearFilters: () => update(() => ({ search: "", hobbies: [], nationalities: [] })),
    }),
    [update]
  );

  return { ...state, ...actions };
}
