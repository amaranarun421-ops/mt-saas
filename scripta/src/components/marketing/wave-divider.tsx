/**
 * WaveDivider — a clean reusable sine-wave SVG that separates two sections.
 *
 * Usage: place it at the bottom of a section that should "melt" into the
 * next section. The wave takes its color from the section below by reading
 * the parent's `background` via the `fill` prop.
 *
 * Variant `top` paints a wave at the top of a section (useful when the
 * section below is dark and you want a wave separating them visually).
 */

type WaveDividerProps = {
  /** Color of the wave fill. Defaults to the page background. */
  fill?: string;
  /** Height of the SVG in px. Default 80. */
  height?: number;
  /** Extra classes on the wrapper. */
  className?: string;
  /** "top" = wave at the top of the section, "bottom" = wave at the bottom (default). */
  position?: 'top' | 'bottom';
  /** "sine" = smooth sine wave (default), "layered" = 3 stacked sines. */
  variant?: 'sine' | 'layered';
};

export function WaveDivider({
  fill = 'var(--background)',
  height = 80,
  className = '',
  position = 'bottom',
  variant = 'sine',
}: WaveDividerProps) {
  const flip = position === 'top' ? 'scaleY(-1)' : undefined;
  return (
    <div
      aria-hidden
      className={`pointer-events-none w-full overflow-hidden leading-[0] ${className}`}
      style={{ transform: flip }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        width="100%"
        height={height}
        fill="none"
      >
        {variant === 'layered' && (
          <>
            <path
              d="M0,32 C240,8 480,72 720,40 C960,8 1200,72 1440,32 L1440,80 L0,80 Z"
              fill={fill}
              opacity={0.35}
            />
            <path
              d="M0,48 C240,24 480,80 720,48 C960,16 1200,80 1440,48 L1440,80 L0,80 Z"
              fill={fill}
              opacity={0.6}
            />
          </>
        )}
        <path
          d="M0,40 C240,8 480,72 720,40 C960,8 1200,72 1440,40 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
