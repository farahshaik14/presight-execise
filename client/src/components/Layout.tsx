import { Outlet } from "react-router";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";

export function Layout() {
  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-accent to-fuchsia-400 text-white shadow-md shadow-accent/30">
              <Icon name="users" className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-semibold tracking-tight">People Directory</p>
              <p className="hidden text-xs text-muted sm:block">Browse, search and filter</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="min-h-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
