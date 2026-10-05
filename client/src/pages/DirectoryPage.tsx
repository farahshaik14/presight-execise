import { useCallback, useState } from "react";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchFacets, fetchPeople } from "../api/people";
import { ActiveFilters } from "../components/ActiveFilters";
import { FacetPanel } from "../components/FacetPanel";
import { FilterDrawer } from "../components/FilterDrawer";
import { Icon } from "../components/Icon";
import { PeopleList } from "../components/PeopleList";
import { SearchBox } from "../components/SearchBox";
import { SortControls } from "../components/SortControls";
import { ListSkeleton, Message } from "../components/StatusViews";
import { useDirectoryParams } from "../hooks/useDirectoryParams";
import type { PeopleFilters } from "../types";

const PAGE_SIZE = 30;

export function DirectoryPage() {
  const params = useDirectoryParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const filters: PeopleFilters = {
    search: params.search.trim(),
    hobbies: params.hobbies,
    nationalities: params.nationalities,
  };
  const { sort, order } = params;

  const facets = useQuery({
    queryKey: ["facets", filters],
    queryFn: ({ signal }) => fetchFacets(filters, signal),
    placeholderData: keepPreviousData,
  });

  const people = useInfiniteQuery({
    queryKey: ["people", filters, sort, order],
    queryFn: ({ pageParam, signal }) =>
      fetchPeople({ ...filters, sort, order, page: pageParam, pageSize: PAGE_SIZE }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    placeholderData: keepPreviousData,
  });

  const rows = people.data?.pages.flatMap((page) => page.data) ?? [];
  const total = people.data?.pages[0]?.total ?? 0;
  const listKey = JSON.stringify([filters, sort, order]);
  const activeFilterCount = filters.hobbies.length + filters.nationalities.length;
  const hasAnyFilter = activeFilterCount > 0 || filters.search !== "";

  const facetPanel = (
    <FacetPanel
      facets={facets.data}
      isLoading={facets.isPending}
      isError={facets.isError}
      isRefreshing={facets.isPlaceholderData}
      onRetry={() => facets.refetch()}
      selectedHobbies={params.hobbies}
      selectedNationalities={params.nationalities}
      onToggleHobby={params.toggleHobby}
      onToggleNationality={params.toggleNationality}
    />
  );

  return (
    <div className="mx-auto flex h-full max-w-7xl gap-6 px-4 py-4 lg:px-6 lg:py-6">
      <aside className="hidden w-80 shrink-0 overflow-y-auto pb-6 pr-1 lg:block" aria-label="Filters">
        {facetPanel}
      </aside>

      <FilterDrawer open={drawerOpen} onClose={closeDrawer}>
        {facetPanel}
      </FilterDrawer>

      <section className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex gap-2">
          <SearchBox value={params.search} onChange={params.setSearch} />
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 text-sm font-medium shadow-sm lg:hidden"
          >
            <Icon name="filter" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm text-muted" aria-live="polite">
            {people.isPending ? (
              "Loading people…"
            ) : (
              <>
                <span className="bg-linear-to-r from-accent-ink to-fuchsia-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:to-fuchsia-300">
                  {total.toLocaleString()}
                </span>
                {total === 1 ? "person" : "people"}
              </>
            )}
            {people.isPlaceholderData && (
              <span className="size-3.5 animate-spin rounded-full border-2 border-accent/30 border-t-accent" aria-label="Updating" />
            )}
          </p>
          <SortControls sort={sort} order={order} onSortChange={params.setSort} onOrderChange={params.setOrder} />
        </div>

        <ActiveFilters
          search={params.search}
          hobbies={params.hobbies}
          nationalities={params.nationalities}
          onClearSearch={() => params.setSearch("")}
          onRemoveHobby={params.toggleHobby}
          onRemoveNationality={params.toggleNationality}
          onClearAll={params.clearFilters}
        />

        <div className={`min-h-0 flex-1 transition-opacity ${people.isPlaceholderData ? "opacity-60" : ""}`}>
          {people.isPending ? (
            <ListSkeleton />
          ) : people.isError && !people.data ? (
            <Message
              icon="alert"
              title="We couldn't load the directory"
              description={people.error.message}
              actionLabel="Try again"
              onAction={() => people.refetch()}
            />
          ) : rows.length === 0 ? (
            <Message
              icon="search"
              title="No people found"
              description="Try a different name or remove some filters."
              actionLabel={hasAnyFilter ? "Clear all filters" : undefined}
              onAction={params.clearFilters}
            />
          ) : (
            <PeopleList
              key={listKey}
              people={rows}
              hasNextPage={people.hasNextPage}
              isFetchingNextPage={people.isFetchingNextPage}
              isNextPageError={people.isFetchNextPageError}
              fetchNextPage={people.fetchNextPage}
            />
          )}
        </div>
      </section>
    </div>
  );
}
