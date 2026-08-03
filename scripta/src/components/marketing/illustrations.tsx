/**
 * Three distinct flat illustrations in the unDraw style, each recolored to
 * violet (#7a5af8 + #bdb4fe two-tone) so they sit naturally inside Scripta's
 * brand identity.
 *
 * Each illustration is a self-contained inline SVG — no external requests,
 * no attribution required (unDraw is royalty-free).
 *
 * Used in:
 *   - WritingAtDeskIllustration  → hero side
 *   - ContentCalendarIllustration → auth pages side panel
 *   - BlankDraftIllustration     → /dashboard/documents empty state
 *
 * All three accept a `className` for sizing and a `light` boolean so they
 * can be tinted darker for use on dark backgrounds.
 */

type IllustrationProps = {
  className?: string;
  /** When true, swaps the lighter tone for a darker one — use on dark backgrounds. */
  dark?: boolean;
};

// Palette — kept identical across all three so they feel cohesive
const VIOLET_PRIMARY = '#7a5af8';
const VIOLET_LIGHT = '#bdb4fe';
const VIOLET_DEEP = '#4a1fb8';
const VIOLET_PALE = '#ebe9fe';
const AMBER_ACCENT = '#f5a623';
const AMBER_PALE = '#fdd884';

/* ─────────────────────────────────────────────────────────────────────────────
 * 1. Person writing/typing at a desk scene
 *    Used as the hero side illustration.
 * ──────────────────────────────────────────────────────────────────────────── */
export function WritingAtDeskIllustration({ className, dark = false }: IllustrationProps) {
  const skin = '#f4d4b0';
  const hair = '#2a1a5e';
  const shirt = VIOLET_PRIMARY;
  const desk = dark ? '#1f1740' : '#2a1a5e';
  const laptopShell = dark ? '#2a2050' : '#4a1fb8';
  const laptopScreen = VIOLET_LIGHT;
  const paper = dark ? '#1f1740' : '#ffffff';
  const paperLines = VIOLET_PRIMARY;
  const plant = '#12b76a';
  const plantPot = AMBER_ACCENT;
  const coffee = AMBER_ACCENT;
  const coffeeLiquid = VIOLET_DEEP;

  return (
    <svg
      viewBox="0 0 600 480"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Illustration of a person writing at a desk"
      role="img"
    >
      {/* Background blob */}
      <ellipse cx="300" cy="430" rx="240" ry="28" fill={VIOLET_PALE} opacity={dark ? 0.08 : 0.6} />
      <circle cx="480" cy="120" r="48" fill={VIOLET_LIGHT} opacity={dark ? 0.18 : 0.4} />
      <circle cx="120" cy="180" r="32" fill={AMBER_PALE} opacity={dark ? 0.18 : 0.4} />

      {/* Floating sparkles */}
      <Sparkle x={460} y={70} size={10} color={AMBER_ACCENT} />
      <Sparkle x={140} y={100} size={8} color={VIOLET_PRIMARY} />
      <Sparkle x={520} y={300} size={12} color={VIOLET_LIGHT} />

      {/* Person — sitting at the desk */}
      {/* Chair back */}
      <rect x="200" y="280" width="80" height="120" rx="12" fill={VIOLET_DEEP} opacity={0.7} />
      {/* Body / shirt */}
      <path
        d="M210 290 Q 240 270, 270 290 L 285 360 Q 240 380, 195 360 Z"
        fill={shirt}
      />
      {/* Head */}
      <circle cx="240" cy="240" r="28" fill={skin} />
      {/* Hair */}
      <path d="M212 240 Q 215 215, 240 212 Q 265 215, 268 240 L 268 220 Q 250 200, 220 215 Q 210 225, 212 240 Z" fill={hair} />
      {/* Neck */}
      <rect x="232" y="262" width="16" height="14" fill={skin} />
      {/* Arms reaching to laptop */}
      <path d="M210 295 Q 195 320, 215 345" stroke={skin} strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M280 295 Q 305 320, 320 350" stroke={skin} strokeWidth="14" fill="none" strokeLinecap="round" />
      {/* Hands */}
      <circle cx="218" cy="345" r="8" fill={skin} />
      <circle cx="325" cy="352" r="8" fill={skin} />

      {/* Desk */}
      <rect x="100" y="355" width="400" height="14" rx="3" fill={desk} />
      {/* Desk legs */}
      <rect x="115" y="369" width="6" height="60" fill={desk} />
      <rect x="479" y="369" width="6" height="60" fill={desk} />

      {/* Laptop */}
      <rect x="200" y="318" width="140" height="38" rx="3" fill={laptopShell} />
      <rect x="208" y="322" width="124" height="30" rx="2" fill={laptopScreen} />
      {/* Code/content lines on screen */}
      <rect x="216" y="328" width="40" height="3" rx="1.5" fill={VIOLET_PRIMARY} />
      <rect x="216" y="336" width="60" height="3" rx="1.5" fill={VIOLET_PRIMARY} opacity={0.7} />
      <rect x="216" y="344" width="30" height="3" rx="1.5" fill={VIOLET_PRIMARY} opacity={0.5} />

      {/* Paper stack */}
      <rect x="365" y="324" width="60" height="32" rx="2" fill={paper} transform="rotate(-4 395 340)" />
      <rect x="370" y="322" width="60" height="32" rx="2" fill={paper} transform="rotate(2 400 338)" />
      <rect x="372" y="326" width="40" height="2.5" rx="1" fill={paperLines} transform="rotate(2 392 327)" />
      <rect x="372" y="332" width="50" height="2.5" rx="1" fill={paperLines} transform="rotate(2 397 333)" opacity={0.7} />
      <rect x="372" y="338" width="32" height="2.5" rx="1" fill={paperLines} transform="rotate(2 388 339)" opacity={0.5} />

      {/* Coffee mug */}
      <rect x="455" y="328" width="22" height="26" rx="3" fill={coffee} />
      <path d="M477 332 Q 488 332, 488 344 Q 488 354, 477 354" stroke={coffee} strokeWidth="3" fill="none" />
      <ellipse cx="466" cy="330" rx="11" ry="3" fill={coffeeLiquid} />

      {/* Plant */}
      <rect x="105" y="335" width="32" height="22" rx="3" fill={plantPot} />
      <path d="M121 335 Q 110 318, 112 305 Q 116 312, 121 318 Q 122 305, 130 300 Q 128 318, 128 325 Q 135 312, 142 312 Q 138 325, 132 335 Z" fill={plant} />
      <path d="M121 335 Q 132 320, 145 318" stroke={plant} strokeWidth="2" fill="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 2. Document / content-calendar scene
 *    Used on the auth pages side panel.
 * ──────────────────────────────────────────────────────────────────────────── */
export function ContentCalendarIllustration({ className, dark = false }: IllustrationProps) {
  const calendarBg = dark ? '#1f1740' : '#ffffff';
  const calendarHeader = VIOLET_PRIMARY;
  const dayCell = VIOLET_PALE;
  const activeCell = AMBER_ACCENT;
  const paper = dark ? '#1f1740' : '#ffffff';
  const paperLines = VIOLET_PRIMARY;
  const pencil = AMBER_ACCENT;
  const clip = VIOLET_DEEP;
  const tag = VIOLET_LIGHT;
  const tagDeep = VIOLET_DEEP;

  return (
    <svg
      viewBox="0 0 600 480"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Illustration of a content calendar and documents"
      role="img"
    >
      {/* Background blobs */}
      <ellipse cx="300" cy="430" rx="240" ry="28" fill={VIOLET_PALE} opacity={dark ? 0.08 : 0.6} />
      <circle cx="110" cy="100" r="48" fill={VIOLET_LIGHT} opacity={dark ? 0.18 : 0.4} />
      <circle cx="500" cy="200" r="32" fill={AMBER_PALE} opacity={dark ? 0.18 : 0.4} />

      {/* Floating sparkles */}
      <Sparkle x={520} y={120} size={10} color={AMBER_ACCENT} />
      <Sparkle x={80} y={260} size={8} color={VIOLET_PRIMARY} />

      {/* Calendar */}
      <rect x="120" y="120" width="260" height="220" rx="14" fill={calendarBg} stroke={VIOLET_PRIMARY} strokeWidth="2" />
      {/* Calendar header */}
      <rect x="120" y="120" width="260" height="44" rx="14" fill={calendarHeader} />
      <rect x="120" y="146" width="260" height="18" fill={calendarHeader} />
      {/* Calendar rings */}
      <rect x="170" y="110" width="8" height="22" rx="3" fill={VIOLET_DEEP} />
      <rect x="220" y="110" width="8" height="22" rx="3" fill={VIOLET_DEEP} />
      <rect x="280" y="110" width="8" height="22" rx="3" fill={VIOLET_DEEP} />
      <rect x="330" y="110" width="8" height="22" rx="3" fill={VIOLET_DEEP} />

      {/* Day labels */}
      <text x="160" y="190" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill={VIOLET_DEEP} textAnchor="middle">M</text>
      <text x="200" y="190" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill={VIOLET_DEEP} textAnchor="middle">T</text>
      <text x="240" y="190" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill={VIOLET_DEEP} textAnchor="middle">W</text>
      <text x="280" y="190" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill={VIOLET_DEEP} textAnchor="middle">T</text>
      <text x="320" y="190" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill={VIOLET_DEEP} textAnchor="middle">F</text>
      <text x="360" y="190" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill={VIOLET_DEEP} textAnchor="middle">S</text>

      {/* Day cells — sample week with one active (amber) cell */}
      <rect x="145" y="200" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="185" y="200" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="225" y="200" width="32" height="28" rx="4" fill={activeCell} />
      <rect x="265" y="200" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="305" y="200" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="345" y="200" width="32" height="28" rx="4" fill={dayCell} />

      <rect x="145" y="240" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="185" y="240" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="225" y="240" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="265" y="240" width="32" height="28" rx="4" fill={activeCell} opacity={0.6} />
      <rect x="305" y="240" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="345" y="240" width="32" height="28" rx="4" fill={dayCell} />

      <rect x="145" y="280" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="185" y="280" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="225" y="280" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="265" y="280" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="305" y="280" width="32" height="28" rx="4" fill={dayCell} />
      <rect x="345" y="280" width="32" height="28" rx="4" fill={dayCell} />

      {/* Floating paper with checklist — content plan */}
      <g transform="rotate(8 460 280)">
        <rect x="380" y="220" width="160" height="120" rx="10" fill={paper} stroke={VIOLET_PRIMARY} strokeWidth="1.5" />
        {/* Clip */}
        <rect x="455" y="214" width="10" height="14" rx="2" fill={clip} />
        {/* Title bar */}
        <rect x="395" y="234" width="80" height="6" rx="2" fill={paperLines} />
        {/* Checklist items */}
        <rect x="395" y="252" width="8" height="8" rx="2" fill={paperLines} />
        <rect x="408" y="254" width="80" height="4" rx="2" fill={paperLines} opacity={0.7} />
        <rect x="395" y="270" width="8" height="8" rx="2" fill={activeCell} />
        <rect x="408" y="272" width="100" height="4" rx="2" fill={paperLines} opacity={0.7} />
        <rect x="395" y="288" width="8" height="8" rx="2" fill={paperLines} opacity={0.5} />
        <rect x="408" y="290" width="60" height="4" rx="2" fill={paperLines} opacity={0.5} />
        <rect x="395" y="306" width="8" height="8" rx="2" fill={paperLines} opacity={0.5} />
        <rect x="408" y="308" width="90" height="4" rx="2" fill={paperLines} opacity={0.5} />
      </g>

      {/* Pencil */}
      <g transform="rotate(-30 470 360)">
        <rect x="450" y="355" width="60" height="10" rx="2" fill={pencil} />
        <polygon points="510,355 525,360 510,365" fill={VIOLET_DEEP} />
        <rect x="448" y="355" width="6" height="10" fill={VIOLET_DEEP} />
      </g>

      {/* Tags */}
      <rect x="380" y="370" width="50" height="14" rx="7" fill={tag} />
      <rect x="440" y="370" width="70" height="14" rx="7" fill={tagDeep} opacity={0.7} />

      {/* Small star icon top right of calendar */}
      <Sparkle x={350} y={130} size={8} color={AMBER_ACCENT} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 3. Blank page / drafting scene
 *    Used in /dashboard/documents empty state.
 * ──────────────────────────────────────────────────────────────────────────── */
export function BlankDraftIllustration({ className, dark = false }: IllustrationProps) {
  const paper = dark ? '#1f1740' : '#ffffff';
  const paperShadow = dark ? '#0f0a26' : '#d9d6fe';
  const paperLines = VIOLET_PRIMARY;
  const cursor = VIOLET_DEEP;
  const pencil = AMBER_ACCENT;
  const pencilTip = VIOLET_DEEP;
  const eraser = VIOLET_LIGHT;
  const desktop = VIOLET_PALE;
  const dot = VIOLET_PRIMARY;

  return (
    <svg
      viewBox="0 0 600 480"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Illustration of a blank page being drafted"
      role="img"
    >
      {/* Desktop backdrop */}
      <ellipse cx="300" cy="430" rx="240" ry="28" fill={desktop} opacity={dark ? 0.08 : 0.6} />
      <circle cx="100" cy="120" r="40" fill={VIOLET_LIGHT} opacity={dark ? 0.18 : 0.4} />
      <circle cx="500" cy="280" r="28" fill={AMBER_PALE} opacity={dark ? 0.18 : 0.4} />

      {/* Floating dots */}
      <circle cx="120" cy="280" r="4" fill={dot} opacity={0.5} />
      <circle cx="500" cy="120" r="4" fill={dot} opacity={0.5} />
      <circle cx="80" cy="350" r="3" fill={AMBER_ACCENT} opacity={0.7} />

      {/* Blank paper — large, centered, slightly tilted */}
      {/* Shadow */}
      <rect x="190" y="115" width="220" height="280" rx="8" fill={paperShadow} opacity={0.4} transform="rotate(-3 300 255)" />
      {/* Main paper */}
      <rect x="180" y="105" width="220" height="280" rx="8" fill={paper} stroke={VIOLET_PRIMARY} strokeWidth="1.5" transform="rotate(-3 290 245)" />
      {/* Top header bar (where the title would go) */}
      <rect x="200" y="125" width="100" height="8" rx="2" fill={paperLines} transform="rotate(-3 250 129)" />
      <rect x="200" y="140" width="60" height="4" rx="2" fill={paperLines} opacity={0.5} transform="rotate(-3 230 142)" />

      {/* Drafted content lines — fade out as they go down (suggesting a fresh start) */}
      <rect x="200" y="170" width="180" height="3" rx="1.5" fill={paperLines} transform="rotate(-3 290 171.5)" />
      <rect x="200" y="184" width="170" height="3" rx="1.5" fill={paperLines} opacity={0.85} transform="rotate(-3 285 185.5)" />
      <rect x="200" y="198" width="175" height="3" rx="1.5" fill={paperLines} opacity={0.75} transform="rotate(-3 287.5 199.5)" />
      <rect x="200" y="212" width="160" height="3" rx="1.5" fill={paperLines} opacity={0.65} transform="rotate(-3 280 213.5)" />
      <rect x="200" y="226" width="170" height="3" rx="1.5" fill={paperLines} opacity={0.55} transform="rotate(-3 285 227.5)" />
      <rect x="200" y="240" width="140" height="3" rx="1.5" fill={paperLines} opacity={0.45} transform="rotate(-3 270 241.5)" />
      <rect x="200" y="254" width="120" height="3" rx="1.5" fill={paperLines} opacity={0.35} transform="rotate(-3 260 255.5)" />
      <rect x="200" y="268" width="80" height="3" rx="1.5" fill={paperLines} opacity={0.25} transform="rotate(-3 240 269.5)" />

      {/* Blinking text-cursor — where the next word would be written */}
      <rect x="285" y="285" width="2" height="14" rx="1" fill={cursor} transform="rotate(-3 286 292)">
        <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite" />
      </rect>

      {/* Pencil — resting on the paper */}
      <g transform="rotate(28 460 250)">
        <rect x="370" y="245" width="80" height="12" rx="3" fill={pencil} />
        <rect x="370" y="245" width="14" height="12" rx="3" fill={eraser} />
        <polygon points="450,245 470,251 450,257" fill={pencilTip} />
        <rect x="365" y="245" width="6" height="12" fill={VIOLET_DEEP} />
        {/* Pencil band */}
        <rect x="430" y="245" width="3" height="12" fill={VIOLET_DEEP} opacity={0.5} />
      </g>

      {/* Sparkles around the cursor */}
      <Sparkle x={310} y={280} size={6} color={AMBER_ACCENT} />
      <Sparkle x={270} y={300} size={5} color={VIOLET_PRIMARY} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Tiny sparkle helper — used by all three illustrations
 * ──────────────────────────────────────────────────────────────────────────── */
function Sparkle({
  x,
  y,
  size,
  color,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
}) {
  return (
    <path
      d={`M${x},${y - size} L${x + size * 0.3},${y - size * 0.3} L${x + size},${y} L${x + size * 0.3},${y + size * 0.3} L${x},${y + size} L${x - size * 0.3},${y + size * 0.3} L${x - size},${y} L${x - size * 0.3},${y - size * 0.3} Z`}
      fill={color}
      opacity={0.7}
    />
  );
}
