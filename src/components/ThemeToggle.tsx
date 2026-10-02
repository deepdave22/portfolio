"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

type Theme = "dark" | "light";

/**
 * Flips the `data-theme` attribute on <html> and remembers the choice.
 * The initial value is already applied by the inline script in layout.tsx,
 * so this only needs to sync React state to what the DOM already says.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) ?? "dark";
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage blocked — the toggle still works for this session */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        mounted
          ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
          : "Toggle colour theme"
      }
      aria-pressed={mounted ? theme === "light" : undefined}
      className="grid size-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
    >
      {/* Render both and swap with CSS-free conditional after mount to avoid
          a hydration mismatch against the pre-paint theme script. */}
      {mounted && theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
