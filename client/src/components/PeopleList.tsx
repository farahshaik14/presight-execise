import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useElementWidth } from "../hooks/useElementWidth";
import type { Person } from "../types";
import { PersonCard } from "./PersonCard";

const ROW_HEIGHT = 128;
const GAP = 12;
const TWO_COLUMN_MIN_WIDTH = 720;

interface PeopleListProps {
  people: Person[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isNextPageError: boolean;
  fetchNextPage: () => void;
}

export function PeopleList({
  people,
  hasNextPage,
  isFetchingNextPage,
  isNextPageError,
  fetchNextPage,
}: PeopleListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(scrollRef);
  const lanes = width >= TWO_COLUMN_MIN_WIDTH ? 2 : 1;

  const virtualizer = useVirtualizer({
    count: hasNextPage ? people.length + 1 : people.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,
    lanes,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [lanes, virtualizer]);

  const items = virtualizer.getVirtualItems();
  const lastIndex = items.at(-1)?.index ?? -1;

  useEffect(() => {
    if (lastIndex >= people.length - 1 && hasNextPage && !isFetchingNextPage && !isNextPageError) {
      fetchNextPage();
    }
  }, [lastIndex, people.length, hasNextPage, isFetchingNextPage, isNextPageError, fetchNextPage]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain px-1 pb-6 pt-1">
      <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
        {items.map((item) => {
          const person = people[item.index];
          return (
            <div
              key={item.key}
              className="absolute top-0"
              style={{
                left: `calc(${(item.lane * 100) / lanes}% + ${item.lane ? GAP / 2 : 0}px)`,
                width: `calc(${100 / lanes}% - ${lanes > 1 ? GAP / 2 : 0}px)`,
                height: item.size - GAP,
                transform: `translateY(${item.start}px)`,
              }}
            >
              {person ? (
                <PersonCard person={person} />
              ) : (
                <LoaderRow isError={isNextPageError} onRetry={fetchNextPage} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoaderRow({ isError, onRetry }: { isError: boolean; onRetry: () => void }) {
  return (
    <div className="flex h-full items-center justify-center gap-3 rounded-2xl border border-dashed border-line text-sm text-muted">
      {isError ? (
        <>
          Couldn't load more people.
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-accent-soft px-3 py-1 font-medium text-accent-ink hover:bg-accent/20"
          >
            Retry
          </button>
        </>
      ) : (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
          Loading more people…
        </>
      )}
    </div>
  );
}
