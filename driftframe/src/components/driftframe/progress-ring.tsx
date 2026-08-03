"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  /** 0..100 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

/**
 * Circular SVG progress indicator with the signature gradient stroke.
 * (One of the four sanctioned gradient usages.)
 *
 * Uses an SVG `linearGradient` def + `stroke-dasharray` to animate the arc.
 */
export function ProgressRing({
  progress,
  size = 56,
  strokeWidth = 4,
  className,
  label,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const id = React.useId();

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "generating"}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3d81" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#ring-${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 250ms ease" }}
        />
      </svg>
      {label !== undefined && (
        <span className="absolute text-[10px] font-medium tabular-nums text-foreground/70">
          {label}
        </span>
      )}
    </div>
  );
}
