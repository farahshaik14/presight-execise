import { Icon, type IconName } from "./Icon";

export function ListSkeleton() {
  return (
    <div className="grid gap-3 px-1 pt-1 md:grid-cols-2" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex h-[116px] gap-4 rounded-2xl border border-line bg-surface p-4">
          <div className="skeleton size-[68px] shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <div className="skeleton h-4 w-2/3 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
            <div className="mt-auto flex gap-2">
              <div className="skeleton h-5 w-16 rounded-full" />
              <div className="skeleton h-5 w-14 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface MessageProps {
  icon: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function Message({ icon, title, description, actionLabel, onAction }: MessageProps) {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-surface/60 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
        <Icon name={icon} className="size-6" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white shadow-md shadow-accent/30 transition hover:bg-accent-strong dark:text-canvas"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
