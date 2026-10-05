import { Icon } from "./Icon";

interface ActiveFiltersProps {
  search: string;
  hobbies: string[];
  nationalities: string[];
  onClearSearch: () => void;
  onRemoveHobby: (value: string) => void;
  onRemoveNationality: (value: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  search,
  hobbies,
  nationalities,
  onClearSearch,
  onRemoveHobby,
  onRemoveNationality,
  onClearAll,
}: ActiveFiltersProps) {
  const trimmed = search.trim();
  if (!trimmed && !hobbies.length && !nationalities.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {trimmed && <Chip label={`“${trimmed}”`} onRemove={onClearSearch} />}
      {nationalities.map((value) => (
        <Chip key={`n-${value}`} label={value} kind="Nationality" onRemove={() => onRemoveNationality(value)} />
      ))}
      {hobbies.map((value) => (
        <Chip key={`h-${value}`} label={value} kind="Hobby" onRemove={() => onRemoveHobby(value)} />
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="px-1 text-sm font-medium text-accent-ink underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

function Chip({ label, kind, onRemove }: { label: string; kind?: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent-soft py-0.5 pl-3 pr-1 text-sm text-accent-ink">
      {kind && <span className="text-xs opacity-70">{kind}:</span>}
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${kind ? `${kind.toLowerCase()} ` : "search "}${label}`}
        className="flex size-5 items-center justify-center rounded-full transition hover:bg-accent/20"
      >
        <Icon name="close" className="size-3" />
      </button>
    </span>
  );
}
