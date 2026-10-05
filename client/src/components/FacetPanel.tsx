import type { FacetCount, PeopleFacets } from "../types";
import { Icon } from "./Icon";

interface FacetPanelProps {
  facets?: PeopleFacets;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  onRetry: () => void;
  selectedHobbies: string[];
  selectedNationalities: string[];
  onToggleHobby: (value: string) => void;
  onToggleNationality: (value: string) => void;
}

export function FacetPanel({
  facets,
  isLoading,
  isError,
  isRefreshing,
  onRetry,
  selectedHobbies,
  selectedNationalities,
  onToggleHobby,
  onToggleNationality,
}: FacetPanelProps) {
  if (isError && !facets) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-6 text-center">
        <Icon name="alert" className="size-6 text-accent" />
        <p className="text-sm text-muted">Couldn't load filters.</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent-ink hover:bg-accent/20"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 transition-opacity ${isRefreshing ? "opacity-60" : ""}`}>
      <FacetGroup
        title="Top hobbies"
        hint="People who have all selected hobbies"
        items={facets?.hobbies}
        isLoading={isLoading}
        selected={selectedHobbies}
        onToggle={onToggleHobby}
      />
      <FacetGroup
        title="Top nationalities"
        hint="Pick one or more nationalities"
        items={facets?.nationalities}
        isLoading={isLoading}
        selected={selectedNationalities}
        onToggle={onToggleNationality}
      />
    </div>
  );
}

interface FacetGroupProps {
  title: string;
  hint: string;
  items?: FacetCount[];
  isLoading: boolean;
  selected: string[];
  onToggle: (value: string) => void;
}

function FacetGroup({ title, hint, items, isLoading, selected, onToggle }: FacetGroupProps) {
  const max = Math.max(1, ...(items ?? []).map((item) => item.count));

  return (
    <section className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <header className="mb-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-muted">{hint}</p>
      </header>

      {isLoading ? (
        <ul className="flex flex-col gap-2.5">
          {Array.from({ length: 8 }, (_, i) => (
            <li key={i} className="skeleton h-8 rounded-lg" />
          ))}
        </ul>
      ) : items?.length ? (
        <ul className="flex flex-col gap-0.5">
          {items.map(({ value, count }, index) => {
            const active = selected.includes(value);
            return (
              <li key={value}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggle(value)}
                  className={`group w-full rounded-lg px-2 py-1.5 text-left transition ${
                    active ? "bg-accent-soft" : "hover:bg-surface-2"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded border transition ${
                        active ? "border-accent bg-accent text-white" : "border-line group-hover:border-accent/60"
                      }`}
                    >
                      {active && <Icon name="check" className="size-3" />}
                    </span>
                    <span className="w-5 shrink-0 text-xs tabular-nums text-muted">{index + 1}</span>
                    <span className={`flex-1 truncate ${active ? "font-medium text-accent-ink" : ""}`}>{value}</span>
                    <span className="text-xs font-medium tabular-nums text-muted">{count.toLocaleString()}</span>
                  </div>
                  <div className="ml-11 mt-1 h-1 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-accent to-fuchsia-400 transition-[width] duration-500"
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="py-4 text-center text-sm text-muted">Nothing to show for this search.</p>
      )}
    </section>
  );
}
