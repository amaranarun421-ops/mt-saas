import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Show the wordmark next to the mark. */
  withWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { wrap: "h-7 w-7", text: "text-lg" },
  md: { wrap: "h-9 w-9", text: "text-xl" },
  lg: { wrap: "h-12 w-12", text: "text-2xl" },
};

/**
 * Driftframe logo.
 *
 * The mark is an ORIGINAL inline SVG: an abstract "drift frame" — two
 * overlapping offset rounded rectangles. The front one is filled with the
 * signature gradient (#ff3d81 → #7c3aed → #3b82f6), the back one is a thin
 * outline. The offset conveys motion / drift; the rectangles evoke a frame.
 * Recognizable at 24px, works on light and dark backgrounds, no Lucide icon.
 *
 * The wordmark uses Clash Display with tight tracking: `Drift` in the
 * foreground color + `frame` in gradient text (one of the sanctioned brand
 * usages).
 */
export function Logo({ className, withWordmark = true, size = "md" }: LogoProps) {
  const s = sizeMap[size];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center",
          s.wrap,
        )}
        aria-hidden
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="driftframe-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff3d81" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          {/* Back (outlined) frame — offset up-left to suggest drift */}
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          {/* Front (gradient-filled) frame — offset down-right */}
          <rect
            x="11"
            y="11"
            width="18"
            height="18"
            rx="4"
            fill="url(#driftframe-logo-grad)"
          />
          {/* Inner cutout to suggest a "frame" window */}
          <rect
            x="15"
            y="15"
            width="10"
            height="10"
            rx="2"
            fill="white"
            fillOpacity="0.92"
          />
          {/* Tiny motion lines (drift hint) */}
          <path
            d="M2 11 L0.5 11 M2 14 L0.5 14 M2 17 L0.5 17"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {withWordmark && (
        <span className={cn("font-display font-semibold tracking-tight", s.text)}>
          Drift<span className="driftframe-gradient-text">frame</span>
        </span>
      )}
    </span>
  );
}
