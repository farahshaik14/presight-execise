import { useState } from "react";
import type { Person } from "../types";

const VISIBLE_HOBBIES = 2;

export function PersonCard({ person }: { person: Person }) {
  const visible = person.hobbies.slice(0, VISIBLE_HOBBIES);
  const hidden = person.hobbies.slice(VISIBLE_HOBBIES);
  const fullName = `${person.first_name} ${person.last_name}`;

  return (
    <article className="group flex h-full gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10">
      <Avatar src={person.avatar} name={fullName} />

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate font-semibold tracking-tight text-ink" title={fullName}>
          {fullName}
        </h3>

        <div className="mt-0.5 flex items-baseline justify-between gap-2 text-sm text-muted">
          <span className="truncate">{person.nationality}</span>
          <span className="shrink-0">
            <span className="font-semibold text-ink">{person.age}</span> yrs
          </span>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {visible.map((hobby) => (
            <span
              key={hobby}
              className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-ink"
            >
              {hobby}
            </span>
          ))}
          {hidden.length > 0 && (
            <span
              title={hidden.join(", ")}
              className="cursor-default rounded-full border border-accent/30 px-2.5 py-0.5 text-xs font-semibold text-accent-ink"
            >
              +{hidden.length}
            </span>
          )}
          {person.hobbies.length === 0 && <span className="text-xs italic text-muted">No hobbies listed</span>}
        </div>
      </div>
    </article>
  );
}

function Avatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="size-[68px] shrink-0 rounded-full bg-linear-to-br from-accent to-fuchsia-300 p-[2px] transition group-hover:shadow-md group-hover:shadow-accent/30">
      {failed ? (
        <div className="flex size-full items-center justify-center rounded-full border-2 border-surface bg-accent-soft text-lg font-semibold text-accent-ink">
          {initials}
        </div>
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full rounded-full border-2 border-surface bg-surface-2 object-cover"
        />
      )}
    </div>
  );
}
