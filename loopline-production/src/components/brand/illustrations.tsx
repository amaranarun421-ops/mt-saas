// Loopline original flat-style illustrations — single-color character art
// in the spirit of unDraw, recolored to the Loopline brand blue.
// Original artwork owned by the Loopline template project (no external
// asset dependencies, safe to bundle in a resold template).

import { cn } from "@/lib/utils";

interface IllustrationProps {
  className?: string;
  primary?: string; // override brand color
}

function Frame({
  className,
  children,
  primary = "#1a56db",
}: IllustrationProps & { children: React.ReactNode; primary?: string }) {
  return (
    <svg
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`lg-${primary.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={primary} stopOpacity="0.18" />
          <stop offset="100%" stopColor={primary} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {/* backdrop blob */}
      <ellipse cx="240" cy="320" rx="180" ry="22" fill={primary} fillOpacity="0.10" />
      <ellipse cx="240" cy="170" rx="160" ry="120" fill={`url(#lg-${primary.slice(1)})`} />
      {children}
    </svg>
  );
}

export function HeroIllustration({ className, primary = "#1a56db" }: IllustrationProps) {
  return (
    <Frame className={className} primary={primary}>
      {/* chat panel */}
      <g>
        <rect x="80" y="60" width="280" height="200" rx="20" fill="white" />
        <rect x="80" y="60" width="280" height="44" rx="20" fill={primary} />
        <rect x="80" y="84" width="280" height="20" fill={primary} />
        <circle cx="106" cy="82" r="8" fill="white" fillOpacity="0.9" />
        <circle cx="128" cy="82" r="8" fill="white" fillOpacity="0.7" />
        <circle cx="150" cy="82" r="8" fill="white" fillOpacity="0.5" />
        {/* incoming bubble */}
        <rect x="100" y="124" width="160" height="36" rx="14" fill={primary} fillOpacity="0.10" />
        <rect x="100" y="170" width="120" height="36" rx="14" fill={primary} fillOpacity="0.10" />
        {/* outgoing bubble */}
        <rect x="200" y="216" width="140" height="36" rx="14" fill={primary} />
        {/* typing dots */}
        <circle cx="116" cy="216" r="5" fill={primary} fillOpacity="0.4" />
        <circle cx="132" cy="216" r="5" fill={primary} fillOpacity="0.6" />
        <circle cx="148" cy="216" r="5" fill={primary} fillOpacity="0.8" />
      </g>
      {/* character — agent */}
      <g transform="translate(330,140)">
        <ellipse cx="40" cy="120" rx="50" ry="10" fill={primary} fillOpacity="0.10" />
        {/* body */}
        <path
          d="M10,120 Q10,70 40,70 Q70,70 70,120 Z"
          fill={primary}
        />
        {/* head */}
        <circle cx="40" cy="50" r="22" fill="#f4c89a" />
        {/* hair */}
        <path d="M18,46 Q20,28 40,28 Q60,28 62,46 L58,40 L48,36 L40,38 L32,36 L22,40 Z" fill="#1f2937" />
        {/* headset */}
        <path d="M16,46 Q16,28 40,28 Q64,28 64,46" fill="none" stroke={primary} strokeWidth="3" />
        <rect x="60" y="46" width="6" height="14" rx="2" fill={primary} />
        {/* mic */}
        <circle cx="62" cy="62" r="3" fill={primary} />
      </g>
      {/* floating chips */}
      <g>
        <rect x="40" y="40" width="60" height="22" rx="11" fill="white" />
        <circle cx="52" cy="51" r="5" fill="#22c55e" />
        <rect x="62" y="48" width="28" height="6" rx="3" fill={primary} fillOpacity="0.3" />
      </g>
      <g>
        <rect x="380" y="80" width="60" height="22" rx="11" fill="white" />
        <rect x="390" y="88" width="40" height="6" rx="3" fill={primary} fillOpacity="0.3" />
      </g>
    </Frame>
  );
}

export function EmptyBotsIllustration({ className, primary = "#1a56db" }: IllustrationProps) {
  return (
    <Frame className={className} primary={primary}>
      <g transform="translate(140,90)">
        <rect x="0" y="0" width="200" height="160" rx="16" fill="white" stroke={primary} strokeOpacity="0.15" />
        <rect x="20" y="24" width="80" height="10" rx="5" fill={primary} fillOpacity="0.2" />
        <rect x="20" y="48" width="160" height="8" rx="4" fill={primary} fillOpacity="0.1" />
        <rect x="20" y="64" width="140" height="8" rx="4" fill={primary} fillOpacity="0.1" />
        <rect x="20" y="100" width="60" height="36" rx="8" fill={primary} />
        {/* plus */}
        <rect x="46" y="114" width="8" height="8" rx="2" fill="white" />
        <rect x="100" y="100" width="80" height="36" rx="8" fill={primary} fillOpacity="0.1" />
      </g>
      {/* floating robot */}
      <g transform="translate(280,60)">
        <rect x="0" y="20" width="60" height="50" rx="14" fill={primary} />
        <circle cx="20" cy="42" r="6" fill="white" />
        <circle cx="40" cy="42" r="6" fill="white" />
        <rect x="22" y="6" width="16" height="14" rx="4" fill={primary} />
        <circle cx="30" cy="6" r="4" fill="#22c55e" />
        <rect x="-8" y="32" width="8" height="22" rx="4" fill={primary} />
        <rect x="60" y="32" width="8" height="22" rx="4" fill={primary} />
      </g>
    </Frame>
  );
}

export function EmptyInboxIllustration({ className, primary = "#1a56db" }: IllustrationProps) {
  return (
    <Frame className={className} primary={primary}>
      <g transform="translate(120,100)">
        {/* envelope */}
        <rect x="0" y="0" width="240" height="160" rx="16" fill="white" stroke={primary} strokeOpacity="0.15" />
        <path d="M0,20 L120,90 L240,20" fill="none" stroke={primary} strokeWidth="3" strokeOpacity="0.4" />
        {/* bell */}
        <g transform="translate(200,-20)">
          <path d="M20,40 Q20,16 36,16 Q52,16 52,40 L56,46 L16,46 Z" fill={primary} />
          <circle cx="36" cy="52" r="5" fill={primary} />
        </g>
      </g>
      {/* sparkles */}
      <g fill={primary}>
        <path d="M120,80 l4,8 l8,4 l-8,4 l-4,8 l-4,-8 l-8,-4 l8,-4 z" opacity="0.5" />
        <path d="M360,120 l3,6 l6,3 l-6,3 l-3,6 l-3,-6 l-6,-3 l6,-3 z" opacity="0.4" />
      </g>
    </Frame>
  );
}

export function SetupIllustration({ className, primary = "#1a56db" }: IllustrationProps) {
  return (
    <Frame className={className} primary={primary}>
      <g transform="translate(100,80)">
        {/* code editor */}
        <rect x="0" y="0" width="280" height="180" rx="14" fill="#0b0f1a" />
        <circle cx="20" cy="20" r="5" fill="#ef4444" />
        <circle cx="38" cy="20" r="5" fill="#f59e0b" />
        <circle cx="56" cy="20" r="5" fill="#22c55e" />
        <rect x="20" y="44" width="14" height="8" rx="2" fill={primary} />
        <rect x="40" y="44" width="80" height="8" rx="2" fill="white" fillOpacity="0.6" />
        <rect x="40" y="60" width="160" height="8" rx="2" fill="white" fillOpacity="0.3" />
        <rect x="40" y="76" width="120" height="8" rx="2" fill="white" fillOpacity="0.3" />
        <rect x="20" y="92" width="14" height="8" rx="2" fill={primary} />
        <rect x="40" y="92" width="100" height="8" rx="2" fill="white" fillOpacity="0.5" />
        <rect x="40" y="108" width="200" height="8" rx="2" fill="white" fillOpacity="0.3" />
        <rect x="40" y="124" width="60" height="8" rx="2" fill="white" fillOpacity="0.4" />
      </g>
      {/* gear */}
      <g transform="translate(340,80)" fill={primary}>
        <path d="M40,12 L46,12 L48,22 L54,24 L60,18 L66,24 L62,32 L66,38 L74,40 L74,46 L66,48 L62,54 L66,62 L60,68 L54,62 L48,64 L46,74 L40,74 L38,64 L32,62 L26,68 L20,62 L24,54 L20,48 L12,46 L12,40 L20,38 L24,32 L20,24 L26,18 L32,24 L38,22 Z M40,30 A12,12 0 1,0 40,54 A12,12 0 1,0 40,30 Z" />
      </g>
    </Frame>
  );
}
