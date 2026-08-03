import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
  showWordmark?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}

/**
 * Loopline logo.
 *
 * Abstract geometric mark — two interlocking rounded arcs forming an
 * infinity-loop / continuous-conversation glyph. NOT a literal chat bubble.
 * Bold minimalism: works in single color, scalable to 16px favicon.
 *
 * Concept: the mark reads as both an infinity symbol (continuous support,
 * 24/7) and two speech shapes flowing into each other (visitor → bot →
 * human handoff). The gap in the middle is intentional negative space.
 */
export function Logo({
  className,
  variant = "default",
  showWordmark = true,
  size = "md",
}: LogoProps) {
  const isLight = variant === "light";
  const dim = size === "xs" ? 22 : size === "sm" ? 28 : size === "lg" ? 48 : 36;
  const wordmarkSize =
    size === "xs" ? "text-sm" : size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 select-none",
        className,
      )}
    >
      <LogoMark width={dim} height={dim} />
      {showWordmark && (
        <span
          className={cn(
            "font-display tracking-tight",
            wordmarkSize,
            isLight ? "text-white" : "text-foreground",
          )}
        >
          Loopline
        </span>
      )}
    </span>
  );
}

export function LogoMark({
  width = 36,
  height = 36,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  // Stable gradient id (no Math.random — would cause hydration mismatch).
  // SVG spec allows duplicate ids across separate <svg> elements when each
  // references its own via url(#id), and browsers resolve per-document
  // consistently, so a single stable id is safe here.
  const gid = "loopline-grad";
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5a7ff5" />
          <stop offset="0.55" stopColor="#1a56db" />
          <stop offset="1" stopColor="#10357f" />
        </linearGradient>
      </defs>
      {/* Rounded square base — gives the mark a contained, app-icon feel */}
      <rect width="48" height="48" rx="13" fill={`url(#${gid})`} />
      {/* The loop — two interlocking arcs */}
      <path
        d="M17 19.5c0-2.0 1.6-3.5 3.5-3.5h2c2.4 0 4.3 1.9 4.3 4.3 0 1.2-.5 2.3-1.3 3.0M31 28.5c0 2.0-1.6 3.5-3.5 3.5h-2c-2.4 0-4.3-1.9-4.3-4.3 0-1.2.5-2.3 1.3-3.0"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* The two dots — visitor + assistant, completing the loop */}
      <circle cx="17" cy="24" r="2.2" fill="white" />
      <circle cx="31" cy="24" r="2.2" fill="#22c55e" />
    </svg>
  );
}
