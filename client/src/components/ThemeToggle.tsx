import { useTheme, type Theme } from "../hooks/useTheme";
import { Icon, type IconName } from "./Icon";

const OPTIONS: { value: Theme; icon: IconName; label: string }[] = [
  { value: "light", icon: "sun", label: "Light theme" },
  { value: "system", icon: "monitor", label: "System theme" },
  { value: "dark", icon: "moon", label: "Dark theme" },
];

export function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  return (
    <div role="radiogroup" aria-label="Theme" className="flex rounded-full border border-line bg-surface-2 p-0.5">
      {OPTIONS.map(({ value, icon, label }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={`flex size-8 items-center justify-center rounded-full transition ${
              active ? "bg-surface text-accent-ink shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            <Icon name={icon} />
          </button>
        );
      })}
    </div>
  );
}
