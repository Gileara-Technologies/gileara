"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";


const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Hydration-safe mount check without setState-in-effect.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl bg-surface border border-outline-variant"></div>;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 rounded-xl bg-surface border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <span className="material-symbols-outlined text-lg" aria-hidden="true">light_mode</span>
      ) : (
        <span className="material-symbols-outlined text-lg" aria-hidden="true">dark_mode</span>
      )}
    </button>
  );
}
