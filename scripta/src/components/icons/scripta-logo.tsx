/**
 * ScriptaLogo — a unique, modern SVG logo for the Scripta brand.
 *
 * Concept: a stylized "S" formed by an open quill + a parallel writing
 * stroke (the inner curve). The shape also reads as a speech bubble
 * rotated 45°, hinting at content / conversation.
 *
 * The mark uses the brand violet ramp (#7a5af8 → #5925dc) so it sits
 * naturally across the marketing site, auth pages, and dashboard.
 *
 * Usage:
 *   <ScriptaLogo className="h-8 w-8" />            // mark only
 *   <ScriptaLogo withWordmark />                    // mark + "Scripta" text
 *   <ScriptaLogo variant="light" />                 // for dark backgrounds
 */

type ScriptaLogoProps = {
  className?: string;
  /** Also render the "Scripta" wordmark next to the mark. */
  withWordmark?: boolean;
  /** "default" = gradient mark; "light" = solid white (for dark backgrounds); "mono" = currentColor */
  variant?: 'default' | 'light' | 'mono';
  /** Wordmark size — overrides the default tracking. */
  wordmarkClassName?: string;
};

export function ScriptaLogo({
  className = 'h-8 w-8',
  withWordmark = false,
  variant = 'default',
  wordmarkClassName = '',
}: ScriptaLogoProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        viewBox="0 0 40 40"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Scripta logo"
      >
        <defs>
          <linearGradient id="scripta-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9b8afb" />
            <stop offset="55%" stopColor="#7a5af8" />
            <stop offset="100%" stopColor="#5925dc" />
          </linearGradient>
        </defs>

        {/* Rounded square background tile — gives the logo presence on both
            light and dark backgrounds */}
        <rect
          x="0"
          y="0"
          width="40"
          height="40"
          rx="11"
          fill={variant === 'mono' ? 'currentColor' : 'url(#scripta-logo-grad)'}
        />

        {/* The "S" mark — a curved quill stroke. Built from two arcs:
            1. An outer stroke that arcs from top-right to bottom-left
            2. An inner stroke that mirrors it, leaving a slim gap in the
               middle (suggests the negative space of writing) */}
        <path
          d="M27 11 C 22 11, 14 12, 13 19 C 12 25, 18 28, 23 28 C 27 28, 29 26, 30 24"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={variant === 'light' ? 1 : 0.95}
        />
        {/* Inner stroke — the parallel "ink trail" */}
        <path
          d="M26 16 C 23 16, 19 17, 19 21 C 19 24, 22 24, 24 24"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={variant === 'light' ? 0.75 : 0.65}
        />

        {/* A small amber dot accent — subtle nod to the credit-pill color
            used inside the dashboard. Only on the default (gradient) variant. */}
        {variant === 'default' && (
          <circle cx="29.5" cy="11" r="1.8" fill="#f5a623" />
        )}
      </svg>

      {withWordmark && (
        <span
          className={`font-bold tracking-tight ${wordmarkClassName}`}
          style={{ fontFamily: 'var(--font-onest), system-ui, sans-serif' }}
        >
          Scripta
        </span>
      )}
    </span>
  );
}
