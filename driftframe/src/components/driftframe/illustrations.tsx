import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Flat-style illustrations used ONLY on:
 *   - auth pages (signin / signup / reset-password) side panel
 *   - /dashboard/history empty state
 *
 * These are hand-crafted SVG scenes in the spirit of unDraw, recolored to
 * the Driftframe accent (#7c3aed). To swap in real unDraw exports, replace
 * the JSX with the downloaded SVG markup and recolor via the `--accent`
 * fill.
 */

const ACCENT = "#7c3aed";
const ACCENT_SOFT = "#7c3aed";
const ACCENT_DEEP = "#5b21b6";
const SKIN = "#f4b8a8";
const HAIR = "#2b2b3a";

interface SceneProps {
  className?: string;
  title?: string;
}

/** Auth-scene illustration — person stepping through a framed doorway. */
export function UndrawAuth({ className, title = "Sign in" }: SceneProps) {
  return (
    <svg
      viewBox="0 0 400 320"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ua-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.25" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* glow */}
      <ellipse cx="200" cy="260" rx="170" ry="40" fill="url(#ua-glow)" />

      {/* floor line */}
      <line x1="20" y1="270" x2="380" y2="270" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />

      {/* doorway frame */}
      <rect x="120" y="80" width="160" height="190" rx="10" fill="none" stroke={ACCENT} strokeWidth="4" />
      <rect x="120" y="80" width="160" height="190" rx="10" fill={ACCENT} fillOpacity="0.08" />

      {/* door panel (open) */}
      <path d="M120 90 L120 270 L150 270 L150 90 Z" fill={ACCENT_DEEP} fillOpacity="0.5" />

      {/* person */}
      <g transform="translate(190 150)">
        {/* legs */}
        <rect x="-18" y="60" width="14" height="50" rx="6" fill={ACCENT_DEEP} />
        <rect x="4" y="60" width="14" height="50" rx="6" fill={ACCENT_DEEP} />
        {/* body */}
        <path d="M-26 10 Q0 -4 26 10 L20 64 Q0 70 -20 64 Z" fill={ACCENT} />
        {/* arm */}
        <path d="M22 18 Q40 30 36 56" stroke={ACCENT} strokeWidth="10" strokeLinecap="round" fill="none" />
        {/* head */}
        <circle cx="0" cy="-12" r="16" fill={SKIN} />
        {/* hair */}
        <path d="M-16 -16 Q0 -34 16 -16 Q14 -24 0 -26 Q-14 -24 -16 -16 Z" fill={HAIR} />
      </g>

      {/* sparkles */}
      <g fill={ACCENT}>
        <circle cx="80" cy="120" r="3" />
        <circle cx="320" cy="160" r="3" />
        <circle cx="60" cy="200" r="2" />
        <circle cx="340" cy="100" r="2" />
        <circle cx="300" cy="240" r="2.5" />
      </g>
    </svg>
  );
}

/** Empty-gallery illustration — blank framed canvas with a spark. */
export function UndrawEmpty({ className, title = "No generations yet" }: SceneProps) {
  return (
    <svg
      viewBox="0 0 400 320"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ue-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.25" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="200" cy="270" rx="160" ry="36" fill="url(#ue-glow)" />
      <line x1="20" y1="275" x2="380" y2="275" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />

      {/* picture frame */}
      <rect x="110" y="60" width="180" height="140" rx="8" fill="none" stroke={ACCENT} strokeWidth="4" />
      <rect x="110" y="60" width="180" height="140" rx="8" fill={ACCENT} fillOpacity="0.06" />
      {/* mountain placeholder inside frame */}
      <path d="M120 190 L160 130 L190 170 L230 110 L280 190 Z" fill={ACCENT} fillOpacity="0.35" />
      <circle cx="240" cy="100" r="10" fill={ACCENT} fillOpacity="0.5" />

      {/* easel legs */}
      <line x1="150" y1="200" x2="120" y2="270" stroke={ACCENT_DEEP} strokeWidth="5" strokeLinecap="round" />
      <line x1="250" y1="200" x2="280" y2="270" stroke={ACCENT_DEEP} strokeWidth="5" strokeLinecap="round" />
      <line x1="200" y1="200" x2="200" y2="270" stroke={ACCENT_DEEP} strokeWidth="5" strokeLinecap="round" />

      {/* sparkles */}
      <g fill={ACCENT}>
        <circle cx="80" cy="120" r="3" />
        <circle cx="330" cy="150" r="3" />
        <circle cx="60" cy="200" r="2" />
        <circle cx="340" cy="220" r="2" />
      </g>
    </svg>
  );
}
