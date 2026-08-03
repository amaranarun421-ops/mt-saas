import * as React from "react";
import { cn } from "@/lib/utils";

interface MasonryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Override the column count breakpoint behaviour. Defaults to 2/3/4. */
  columns?: "2" | "3" | "4" | "auto";
}

/**
 * Pure-CSS masonry grid (Pinterest-style variable-height columns).
 *
 * Uses `columns` + `break-inside: avoid` — no JS masonry library, so it
 * reflows cleanly on resize and during progressive image load.
 */
export function MasonryGrid({
  className,
  children,
  columns = "auto",
  ...props
}: MasonryGridProps) {
  return (
    <div
      className={cn(
        columns === "auto" ? "driftframe-masonry" : undefined,
        className,
      )}
      style={
        columns !== "auto"
          ? ({
              columnGap: "1rem",
              columnCount: Number(columns),
            } as React.CSSProperties)
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
}

/** Wrapper for a single masonry item — applies `break-inside: avoid`. */
export function MasonryItem({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("break-inside-avoid mb-4", className)} {...props}>
      {children}
    </div>
  );
}
