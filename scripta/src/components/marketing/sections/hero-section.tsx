import Link from 'next/link';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WaveDivider } from '@/components/marketing/wave-divider';
import { WritingAtDeskIllustration } from '@/components/marketing/illustrations';
import { GlowOrbsBg, NoiseTextureBg, GridLinesBg } from '@/components/marketing/backgrounds';

/**
 * HeroSection — dark plum/violet (#2a1a5e) variant.
 *
 * The dark hero melts into the light content below via the WaveDivider
 * at the bottom. This is the v2 polish pass — bold display headline
 * (Onest 800-900 weight), two-button CTA pattern (solid violet +
 * outlined), and a flat illustration on the right.
 */

const PLUM_DARK = '#2a1a5e';

export function HeroSection({ isAuthed }: { isAuthed: boolean }) {
  return (
    <>
      <section
        className="relative overflow-hidden"
        style={{ background: PLUM_DARK }}
      >
        {/* Background layers — adapted for dark hero */}
        <div aria-hidden className="absolute inset-0 -z-10">
          {/* Grid lines (lighter on dark bg) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage:
                'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%)',
            }}
          />
          {/* Glow orbs */}
          <div className="absolute -top-40 -left-20 h-[40rem] w-[40rem] rounded-full blur-3xl opacity-40" style={{ background: 'radial-gradient(circle, rgba(122, 90, 248, 0.6) 0%, transparent 70%)' }} />
          <div className="absolute -top-20 -right-20 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, rgba(245, 166, 35, 0.5) 0%, transparent 70%)' }} />
          {/* Noise */}
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' /></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
              backgroundSize: '200px 200px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-300/40 bg-primary-500/15 px-3 py-1 text-xs font-medium text-primary-200 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-300 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-300" />
                </span>
                <span>New — 4 streaming AI write modes, full Stripe lifecycle</span>
              </div>

              <h1
                className="mt-6 text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-white"
                style={{ fontWeight: 800, fontFamily: 'var(--font-onest), system-ui, sans-serif' }}
              >
                Write blogs, captions,
                <span className="block mt-1 bg-gradient-to-r from-violet-300 via-amber-200 to-violet-300 bg-clip-text text-transparent">
                  emails & product copy
                </span>
                <span className="block mt-1 text-white/95">with streaming AI</span>
              </h1>

              <p className="mt-6 text-base md:text-lg text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Scripta is a complete, production-ready SaaS starter — four
                streaming AI write modes, full NextAuth flow, Stripe
                subscriptions, saved documents with folders, and a premium
                dashboard UI.
              </p>

              {/* Two-button CTA pattern */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Button
                  asChild
                  size="lg"
                  className="button-bg btn-press text-white h-12 px-7 text-base shadow-theme-md"
                >
                  <Link href={isAuthed ? '/dashboard' : '/signin'}>
                    <Zap className="mr-2 h-4 w-4" />
                    {isAuthed ? 'Open dashboard' : 'Try demo — no signup'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 text-base bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/pricing">See pricing</Link>
                </Button>
              </div>

              {/* Social proof row */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-white/60 text-xs">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1.5">Loved by content teams</span>
                </div>
                <span className="hidden sm:inline-block h-3 w-px bg-white/20" />
                <span>No credit card required · Free plan = 10 monthly credits</span>
              </div>
            </div>

            {/* Right: illustration */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 -z-10 opacity-50 blur-2xl"
                style={{
                  background:
                    'radial-gradient(60% 60% at 50% 50%, rgba(122, 90, 248, 0.4) 0%, transparent 70%)',
                }}
              />
              <WritingAtDeskIllustration className="w-full h-auto max-w-lg mx-auto" dark />
            </div>
          </div>
        </div>

        {/* Wave divider melting into the light content below */}
        <WaveDivider fill="var(--background)" height={80} variant="layered" />
      </section>
    </>
  );
}
