import {
  Zap,
  Shield,
  Folder,
  Command,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { MeshGradientBg, DottedPatternBg } from '@/components/marketing/backgrounds';

/**
 * FeaturesGridSection — flat two-tone icon cards (v2 polish).
 *
 * Recolored to violet + amber instead of the typical red/blue/green mix
 * shown in SaaS reference screenshots — keeps Scripta's violet identity
 * consistent with the rest of the page.
 */

interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  /** "violet" or "amber" — the accent color for the icon + its tile */
  accent: 'violet' | 'amber';
}

const FEATURES: FeatureCard[] = [
  {
    icon: Zap,
    title: 'Streaming output',
    desc: 'Token-by-token generation via the Vercel AI SDK. Skeleton loaders, never spinners.',
    accent: 'violet',
  },
  {
    icon: Shield,
    title: 'Full NextAuth v5',
    desc: 'Email/password + Google + GitHub OAuth. Email verification, password reset, rate limiting.',
    accent: 'amber',
  },
  {
    icon: Folder,
    title: 'Documents + folders',
    desc: 'Every generation is savable. Organize with folders, filter by type, full-text search.',
    accent: 'violet',
  },
  {
    icon: Command,
    title: 'Cmd+K palette',
    desc: 'Quick-jump to any write mode or recent document. Polish most $49 templates skip.',
    accent: 'amber',
  },
  {
    icon: Sparkles,
    title: 'Glass-morphism UI',
    desc: 'Animated gradient borders, hover micro-interactions, dark mode — premium-tier polish throughout.',
    accent: 'violet',
  },
  {
    icon: Zap,
    title: 'Stripe, full lifecycle',
    desc: 'Webhook handler (4 event types), customer portal, monthly + annual plans, plan-gating.',
    accent: 'amber',
  },
];

const ACCENT_STYLES = {
  violet: {
    tile: 'bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-300',
    glow: 'rgba(122, 90, 248, 0.15)',
  },
  amber: {
    tile: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-300',
    glow: 'rgba(245, 166, 35, 0.15)',
  },
};

export function FeaturesGridSection() {
  return (
    <section
      id="features"
      className="relative py-20 md:py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <MeshGradientBg />
      <DottedPatternBg />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 dark:border-primary-500/30 bg-primary-50 dark:bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300">
            <Sparkles className="h-3 w-3" />
            Features
          </span>
          <h2
            className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]"
            style={{ fontWeight: 800 }}
          >
            Premium from{' '}
            <span className="bg-gradient-to-r from-primary-600 to-amber-500 bg-clip-text text-transparent">
              the first pixel
            </span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Every feature a $60-tier SaaS template should ship with — built
            end-to-end, not stubbed.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const styles = ACCENT_STYLES[feature.accent];
            return (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border/60 bg-card p-6 shadow-theme-sm card-lift overflow-hidden"
              >
                {/* Subtle glow that appears on hover */}
                <div
                  aria-hidden
                  className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"
                  style={{ background: styles.glow }}
                />
                {/* Icon tile */}
                <div
                  className={`relative grid h-11 w-11 place-items-center rounded-xl ${styles.tile} transition-transform group-hover:scale-110`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                {/* Title */}
                <h3 className="relative mt-4 text-base font-bold tracking-tight">
                  {feature.title}
                </h3>
                {/* Two-line description */}
                <p className="relative mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {feature.desc}
                </p>
                {/* Trailing arrow that appears on hover */}
                <div className="relative mt-3 flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-300 opacity-0 group-hover:opacity-100 transition">
                  Learn more
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
