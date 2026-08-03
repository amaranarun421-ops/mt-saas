"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Theme toggle button.
 *
 * Hydration-safe: until `mounted` flips true on the client, we render a
 * STABLE button (Sun icon, fixed title "Toggle theme"). Only after mount do
 * we compute `isDark` from `resolvedTheme` and switch to the dynamic title
 * + correct icon. This guarantees the server-rendered HTML matches the
 * first client paint — no hydration mismatch on the `title` attribute
 * (classic next-themes gotcha).
 *
 * `suppressHydrationWarning` is added as a belt-and-suspenders safety net
 * for the icon swap on the very first tick after mount.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      title={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
      suppressHydrationWarning
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full driftframe-glass text-foreground/80 hover:text-foreground hover:bg-foreground/[0.06] transition-colors min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {!mounted ? (
        <Sun className="h-4 w-4" />
      ) : isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
