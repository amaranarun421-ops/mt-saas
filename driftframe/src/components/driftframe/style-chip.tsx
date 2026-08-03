"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface StyleChipProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
  /** Render as a square aspect-ratio selector instead of a pill. */
  asRatio?: boolean;
  disabled?: boolean;
}

/**
 * Selectable chip used for style presets and aspect ratios.
 *
 * v3: active state uses solid #7c3aed (not the gradient).
 */
export const StyleChip = React.forwardRef<HTMLButtonElement, StyleChipProps>(
  ({ label, selected, onSelect, className, asRatio = false, disabled }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onSelect}
        disabled={disabled}
        aria-pressed={selected}
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px]",
          asRatio ? "px-2 py-1.5" : "px-3.5 py-2",
          selected
            ? "bg-[#7c3aed] text-white shadow-[0_0_14px_rgba(124,58,237,0.22)]"
            : "driftframe-glass text-foreground/80 hover:text-foreground hover:bg-foreground/[0.06]",
          className,
        )}
      >
        {label}
      </button>
    );
  },
);
StyleChip.displayName = "StyleChip";
