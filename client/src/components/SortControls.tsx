import type { SortField, SortOrder } from "../types";
import { Icon } from "./Icon";

const LABELS: Record<SortField, string> = {
  first_name: "First name",
  last_name: "Last name",
  age: "Age",
  nationality: "Nationality",
};

interface SortControlsProps {
  sort: SortField;
  order: SortOrder;
  onSortChange: (sort: SortField) => void;
  onOrderChange: (order: SortOrder) => void;
}

export function SortControls({ sort, order, onSortChange, onOrderChange }: SortControlsProps) {
  const ascending = order === "asc";

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-field" className="text-sm text-muted">
        Sort by
      </label>
      <div className="relative">
        <select
          id="sort-field"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortField)}
          className="h-9 appearance-none rounded-lg border border-line bg-surface pl-3 pr-8 text-sm font-medium text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
        >
          {Object.entries(LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
      </div>
      <button
        type="button"
        onClick={() => onOrderChange(ascending ? "desc" : "asc")}
        aria-label={`Sort direction: ${ascending ? "ascending" : "descending"}. Click to reverse.`}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink transition hover:border-accent/50 hover:text-accent-ink focus:outline-none focus:ring-4 focus:ring-accent/15"
      >
        <Icon name={ascending ? "arrowUp" : "arrowDown"} />
        {ascending ? "Asc" : "Desc"}
      </button>
    </div>
  );
}
