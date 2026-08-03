/**
 * Reusable decorative backgrounds for marketing sections.
 * Each one is unique so adjacent sections don't look alike.
 *
 * All are pure SVG / CSS, no external assets, and they inherit the
 * primary color tokens so they theme correctly in dark mode.
 */

import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────────────────────
 * GridLines — subtle grid pattern (used in hero)
 * ──────────────────────────────────────────────────────────────────────────── */
export function GridLinesBg({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 -z-10', className)}
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(122,90,248,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(122,90,248,0.06) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage:
          'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%)',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * DottedPattern — small dots (used in features section)
 * ──────────────────────────────────────────────────────────────────────────── */
export function DottedPatternBg({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 -z-10', className)}
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(122,90,248,0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        maskImage:
          'linear-gradient(to bottom, black 0%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, black 0%, transparent 100%)',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * GlowOrbs — 2 large blurred radial blobs (used in hero + CTA)
 * ──────────────────────────────────────────────────────────────────────────── */
export function GlowOrbsBg({
  className,
  variant = 'default',
}: {
  className?: string;
  variant?: 'default' | 'amber' | 'pink';
}) {
  const color =
    variant === 'amber'
      ? '245, 166, 35'
      : variant === 'pink'
      ? '255, 88, 213'
      : '122, 90, 248';
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
      <div
        className="absolute -top-40 -left-20 h-[40rem] w-[40rem] rounded-full blur-3xl opacity-20 dark:opacity-30"
        style={{ background: `radial-gradient(circle, rgba(${color}, 0.5) 0%, transparent 70%)` }}
      />
      <div
        className="absolute -top-20 -right-20 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-20 dark:opacity-30"
        style={{
          background: `radial-gradient(circle, rgba(155, 138, 251, 0.5) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * MeshGradient — multi-stop mesh (used in features + write modes)
 * ──────────────────────────────────────────────────────────────────────────── */
export function MeshGradientBg({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
      <div
        className="absolute top-0 left-1/4 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(122, 90, 248, 0.4) 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/3 right-1/4 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(245, 166, 35, 0.25) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full blur-3xl opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(255, 88, 213, 0.25) 0%, transparent 70%)' }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * NoiseTexture — SVG fractal noise overlay (adds the premium grain)
 * ──────────────────────────────────────────────────────────────────────────── */
export function NoiseTextureBg({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay', className)}
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' /></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        backgroundSize: '200px 200px',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * AuroraWaves — wavy SVG bands (used in testimonials)
 * ──────────────────────────────────────────────────────────────────────────── */
export function AuroraWavesBg({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        fill="none"
      >
        <path
          d="M0 200 Q 360 100, 720 200 T 1440 200 L 1440 600 L 0 600 Z"
          fill="rgba(122, 90, 248, 0.06)"
        />
        <path
          d="M0 280 Q 360 380, 720 280 T 1440 280 L 1440 600 L 0 600 Z"
          fill="rgba(245, 166, 35, 0.04)"
        />
        <path
          d="M0 360 Q 360 260, 720 360 T 1440 360 L 1440 600 L 0 600 Z"
          fill="rgba(155, 138, 251, 0.05)"
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * DiagonalLines — thin diagonal stripes (used in FAQ)
 * ──────────────────────────────────────────────────────────────────────────── */
export function DiagonalLinesBg({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 -z-10 opacity-30', className)}
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(122,90,248,0.06) 0px, rgba(122,90,248,0.06) 1px, transparent 1px, transparent 12px)',
        maskImage:
          'radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 80%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 80%)',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * GlowRing — single concentric ring glow (used in CTA)
 * ──────────────────────────────────────────────────────────────────────────── */
export function GlowRingBg({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 grid place-items-center overflow-hidden', className)}>
      <div
        className="h-[42rem] w-[42rem] rounded-full opacity-30 dark:opacity-40"
        style={{
          background:
            'conic-gradient(from 0deg at 50% 50%, rgba(122, 90, 248, 0.4), rgba(245, 166, 35, 0.3), rgba(255, 88, 213, 0.3), rgba(122, 90, 248, 0.4))',
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
}
