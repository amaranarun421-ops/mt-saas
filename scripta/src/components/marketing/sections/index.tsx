import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  FileText,
  MessageSquare,
  Mail,
  Package,
  Zap,
  Shield,
  Folder,
  Command,
  Check,
  ArrowRight,
  ArrowDown,
  Star,
  Wand2,
  Repeat,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NextjsIcon,
  ReactIcon,
  TypeScriptIcon,
  TailwindIcon,
  PrismaIcon,
  StripeIcon,
  OpenaiIcon,
  ResendIcon,
  VercelIcon,
  DrizzleIcon,
  ShadcnIcon,
  LucideIcon,
} from '@/components/icons/brand-icons';
import {
  GridLinesBg,
  GlowOrbsBg,
  DottedPatternBg,
  MeshGradientBg,
  NoiseTextureBg,
  AuroraWavesBg,
  DiagonalLinesBg,
  GlowRingBg,
} from '@/components/marketing/backgrounds';
import { HeroSection as HeroSectionV2 } from './hero-section';
import { FeaturesGridSection as FeaturesGridSectionV2 } from './features-grid-section';

// Re-export the v2 hero + features so the page can import them from here.
export { HeroSectionV2 as HeroSection, FeaturesGridSectionV2 as FeaturesGridSection };

// =================================================================
// SHARED LAYOUT — every section uses this for consistent padding
// =================================================================
function Section({
  id,
  children,
  className = '',
  bg,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  bg?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative py-20 md:py-28 px-6 md:px-12 lg:px-20 overflow-hidden ${className}`}
    >
      {bg}
      <div className="max-w-7xl mx-auto relative">{children}</div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'center' | 'left';
}) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 dark:bg-primary-500/10 dark:border-primary-500/20 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300">
          <Sparkles className="h-3 w-3" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// =================================================================
// 1. HERO — implemented in ./hero-section.tsx (v2 polish pass)
//    Re-exported above as `HeroSection`. The original v1 hero + its
//    ProductMockup helper have been removed in favor of the dark
//    plum/violet variant with wave divider + side illustration.
// =================================================================

// =================================================================
// 2. STACK / TRUSTED BY — real brand icons
// =================================================================
export function StackSection() {
  const stack = [
    { name: 'Next.js 16', Icon: NextjsIcon },
    { name: 'React 19', Icon: ReactIcon },
    { name: 'TypeScript', Icon: TypeScriptIcon },
    { name: 'Tailwind v4', Icon: TailwindIcon },
    { name: 'shadcn/ui', Icon: ShadcnIcon },
    { name: 'Prisma', Icon: PrismaIcon },
    { name: 'Stripe', Icon: StripeIcon },
    { name: 'OpenAI', Icon: OpenaiIcon },
    { name: 'Resend', Icon: ResendIcon },
    { name: 'Vercel', Icon: VercelIcon },
    { name: 'lucide-react', Icon: LucideIcon },
    { name: 'Drizzle', Icon: DrizzleIcon },
  ];
  return (
    <Section className="py-12 md:py-16 border-y border-border/40 bg-muted/20">
      <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Built on the best of the modern stack
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {stack.map(({ name, Icon }) => (
          <div
            key={name}
            className="group flex flex-col items-center gap-2 text-muted-foreground/60 hover:text-foreground transition"
            title={name}
          >
            <Icon className="h-7 w-7 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-medium">{name}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// =================================================================
// 3. STATS — big numbers with mesh bg
// =================================================================
export function StatsSection() {
  const stats = [
    { value: '4', label: 'AI write modes', sub: 'Blog, social, email, product' },
    { value: '<1s', label: 'Time to first token', sub: 'Streaming via Vercel AI SDK' },
    { value: '0', label: 'Config to ship', sub: 'Just add your brand & OpenAI key' },
    { value: '100%', label: 'TypeScript', sub: 'Strict, zero any' },
  ];
  return (
    <Section className="py-16 md:py-20" bg={<><MeshGradientBg /><NoiseTextureBg /></>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              {s.value}
            </div>
            <div className="mt-2 text-sm font-semibold">{s.label}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// =================================================================
// 4. WRITE MODES — 4 cards with unique gradients + decorative SVG
// =================================================================
export function WriteModesSection() {
  const modes = [
    {
      icon: FileText,
      id: 'blog',
      title: 'Blog Post',
      desc: 'Structured posts with H1, H2 sections, intro, and conclusion. Pick tone, length, and keywords.',
      gradient: 'from-violet-500 via-purple-500 to-indigo-600',
      glow: 'rgba(122, 90, 248, 0.4)',
      feature: 'Markdown output',
    },
    {
      icon: MessageSquare,
      id: 'social',
      title: 'Social Caption',
      desc: 'Three variations per generation, plus hashtags. Choose Instagram, LinkedIn, or X.',
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      glow: 'rgba(236, 72, 153, 0.4)',
      feature: '3 variations + hashtags',
    },
    {
      icon: Mail,
      id: 'email',
      title: 'Email Copy',
      desc: 'Welcome, promo, follow-up, or announcement emails. Subject line + preview + body, all in markdown.',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      glow: 'rgba(59, 130, 246, 0.4)',
      feature: 'Pro mode',
      pro: true,
    },
    {
      icon: Package,
      id: 'product',
      title: 'Product Description',
      desc: 'Short + long benefits-led descriptions in one shot. List features, pick tone — get PDP-ready copy.',
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      glow: 'rgba(245, 166, 35, 0.4)',
      feature: 'Pro mode',
      pro: true,
    },
  ];

  return (
    <Section id="modes" bg={<><DottedPatternBg /><GlowOrbsBg variant="amber" /></>}>
      <SectionHeader
        eyebrow="Four write modes"
        title={<>One workflow, <span className="text-primary-500">four content types</span></>}
        subtitle="Each mode ships its own input schema, system prompt, and streaming output. Switch between them from a single dashboard."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {modes.map((mode) => (
          <Link
            key={mode.id}
            href={`/dashboard/write/${mode.id}`}
            className="group relative rounded-2xl border border-border/60 bg-card p-6 shadow-theme-sm card-lift overflow-hidden"
          >
            {/* Decorative glow that appears on hover */}
            <div
              aria-hidden
              className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"
              style={{ background: mode.glow }}
            />
            <div className={`relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${mode.gradient} text-white shadow-theme-sm`}>
              <mode.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{mode.title}</h3>
              {mode.pro && (
                <span className="rounded-full bg-amber-100 dark:bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                  Pro
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{mode.desc}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {mode.feature}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition">
              Open
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

// =================================================================
// 5. BENTO GRID — modern premium pattern (6 cells, mixed sizes)
// =================================================================
export function BentoSection() {
  return (
    <Section id="features" bg={<MeshGradientBg />}>
      <SectionHeader
        eyebrow="Bento of features"
        title={<>Premium from <span className="text-primary-500">the first pixel</span></>}
        subtitle="Glass-morphism cards, animated gradient borders, hover micro-interactions, dark mode, and skeleton loaders everywhere — the kind of polish that justifies a $60 price tag."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-[auto_auto_auto]">
        {/* Streaming output (wide) */}
        <BentoCell className="md:col-span-2 md:row-span-1">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg button-bg text-white">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Streaming output, no waiting</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Powered by the Vercel AI SDK — every generation streams
                token-by-token into your editor with skeleton loading states
                instead of spinners.
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-border/60 bg-muted/30 p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-500" />
              </span>
              Streaming…
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="h-2 w-3/4 rounded skeleton-shimmer" />
              <div className="h-2 w-11/12 rounded skeleton-shimmer" />
              <div className="h-2 w-9/12 rounded skeleton-shimmer" />
            </div>
          </div>
        </BentoCell>

        {/* Full NextAuth flow (tall) */}
        <BentoCell className="md:row-span-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <Shield className="h-4 w-4" />
          </div>
          <h3 className="mt-4 font-semibold text-base">Full NextAuth v5 flow</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Email/password + Google + GitHub OAuth. Email verification,
            password reset, rate limiting — all wired end-to-end with a
            Prisma adapter.
          </p>
          <ul className="mt-4 space-y-1.5">
            {['Email + password', 'Google OAuth', 'GitHub OAuth', 'Email verification', 'Forgot/reset password', 'Rate limiting'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs">
                <Check className="h-3 w-3 text-primary-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </BentoCell>

        {/* Saved documents */}
        <BentoCell>
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <Folder className="h-4 w-4" />
          </div>
          <h3 className="mt-4 font-semibold text-base">Saved documents + folders</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Every generation is savable. Organize with folders, filter by
            type, search by title or content.
          </p>
        </BentoCell>

        {/* Command palette */}
        <BentoCell>
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <Command className="h-4 w-4" />
          </div>
          <h3 className="mt-4 font-semibold text-base">Cmd+K command palette</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Quick-jump to any write mode or recent document. The kind of
            polish most $49-tier templates skip.
          </p>
        </BentoCell>

        {/* Stripe (wide) */}
        <BentoCell className="md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Stripe, full lifecycle</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Real webhook handler (4 event types), customer portal,
                monthly + annual plans, plan-gating — not just a checkout button.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {['checkout.session.completed', 'customer.subscription.updated', 'customer.subscription.deleted', 'invoice.payment_failed'].map((event) => (
              <code key={event} className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                {event}
              </code>
            ))}
          </div>
        </BentoCell>
      </div>
    </Section>
  );
}

function BentoCell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl border border-border/60 bg-card p-5 shadow-theme-sm card-lift ${className}`}
    >
      {children}
    </div>
  );
}

// =================================================================
// 6. HOW IT WORKS — 3-step flow
// =================================================================
export function HowItWorksSection() {
  const steps = [
    {
      icon: Wand2,
      step: '01',
      title: 'Pick a write mode',
      desc: 'Choose from Blog Post, Social Caption, Email Copy, or Product Description. Each has its own input schema.',
    },
    {
      icon: Sparkles,
      step: '02',
      title: 'Stream tokens in',
      desc: 'Hit Generate. The AI streams output token-by-token into a split-view editor with a skeleton-to-content transition.',
    },
    {
      icon: Repeat,
      step: '03',
      title: 'Refine & save',
      desc: 'Regenerate with instructions, edit inline, save to a folder. Pick up where you left off from any device.',
    },
  ];
  return (
    <Section bg={<DiagonalLinesBg />}>
      <SectionHeader
        eyebrow="How it works"
        title={<>Three steps from <span className="text-primary-500">prompt to publish</span></>}
        subtitle="No prompt engineering, no copy-paste between tabs. Scripta is the shortest path from idea to ready-to-publish content."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3 relative">
        {/* Connecting line */}
        <div
          aria-hidden
          className="hidden md:block absolute top-12 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(122,90,248,0.3) 20%, rgba(245,166,35,0.3) 50%, rgba(122,90,248,0.3) 80%, transparent)',
          }}
        />
        {steps.map((s) => (
          <div key={s.step} className="relative">
            <div className="relative z-10 mx-auto grid h-24 w-24 place-items-center rounded-2xl border border-border/60 bg-card shadow-theme-sm card-lift">
              <s.icon className="h-8 w-8 text-primary-500" />
              <span className="absolute -top-2 -right-2 grid h-7 w-7 place-items-center rounded-full button-bg text-[10px] font-bold text-white">
                {s.step}
              </span>
            </div>
            <h3 className="mt-5 text-center text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// =================================================================
// 7. PRICING (compact — full version lives on /pricing)
// =================================================================
export function PricingPreviewSection({ isAuthed }: { isAuthed: boolean }) {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      description: 'For trying out Scripta',
      features: [
        '10 monthly credits',
        'Blog + Social modes',
        'All saved documents',
        'Email verification flow',
      ],
      cta: 'Start free',
      href: '/signup',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/mo',
      description: 'For serious content creators',
      features: [
        'Unlimited generations',
        'All 4 write modes',
        'Folders + tags + search',
        'Stripe customer portal',
      ],
      cta: 'Upgrade to Pro',
      href: '/dashboard/billing',
      highlight: true,
      annualNote: '$180/yr — save $48',
    },
  ];

  return (
    <Section id="pricing" bg={<><GlowOrbsBg /><NoiseTextureBg /></>}>
      <SectionHeader
        eyebrow="Pricing"
        title={<>Simple, <span className="text-primary-500">transparent</span> pricing</>}
        subtitle="Two plans, real Stripe integration. Free is genuinely usable; Pro unlocks everything."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-8 shadow-theme-sm card-lift ${
              plan.highlight
                ? 'border-primary-500 bg-card gradient-border-active'
                : 'border-border/60 bg-card'
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full button-bg px-3 py-1 text-xs font-semibold text-white">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            {plan.highlight && plan.annualNote && (
              <p className="mt-1 text-xs text-amber-600 font-medium">{plan.annualNote}</p>
            )}
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 text-primary-500 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={`mt-6 w-full btn-press h-11 ${
                plan.highlight ? 'button-bg text-white' : ''
              }`}
              variant={plan.highlight ? 'default' : 'outline'}
            >
              <Link href={isAuthed ? plan.href : plan.name === 'Free' ? '/signup' : '/signin'}>
                {plan.cta}
              </Link>
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button asChild variant="link" className="text-muted-foreground">
          <Link href="/pricing">
            Compare all features
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}

// =================================================================
// 8. COMPARISON TABLE — Free vs Pro
// =================================================================
export function ComparisonSection() {
  const rows: Array<{ feature: string; free: boolean | string; pro: boolean | string }> = [
    { feature: 'AI write modes', free: 'Blog + Social', pro: 'All 4 modes' },
    { feature: 'Monthly credits', free: '10', pro: 'Unlimited' },
    { feature: 'Streaming output', free: true, pro: true },
    { feature: 'Saved documents + folders', free: true, pro: true },
    { feature: 'Email Copy generator', free: false, pro: true },
    { feature: 'Product Description generator', free: false, pro: true },
    { feature: 'Tags + search', free: true, pro: true },
    { feature: 'Stripe customer portal', free: false, pro: true },
    { feature: 'Cmd+K command palette', free: true, pro: true },
    { feature: 'Dark mode', free: true, pro: true },
    { feature: 'Resend transactional email', free: true, pro: true },
    { feature: 'Google + GitHub OAuth', free: true, pro: true },
  ];

  return (
    <Section className="bg-muted/20 border-y border-border/40" bg={<DottedPatternBg />}>
      <SectionHeader
        eyebrow="Compare"
        title={<>Free vs <span className="text-primary-500">Pro</span></>}
        subtitle="Every feature in the template, side-by-side. No hidden gotchas."
      />
      <div className="mt-10 overflow-x-auto">
        <table className="w-full max-w-3xl mx-auto border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Feature</th>
              <th className="p-4 text-center">
                <div className="text-sm font-semibold">Free</div>
                <div className="text-xs text-muted-foreground">$0/mo</div>
              </th>
              <th className="p-4 text-center bg-primary-50/50 dark:bg-primary-500/5 rounded-t-lg">
                <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Pro
                </div>
                <div className="text-xs text-muted-foreground">$19/mo</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.feature}
                className={`border-t border-border/40 ${i === rows.length - 1 ? 'border-b' : ''}`}
              >
                <td className="p-4 text-sm">{row.feature}</td>
                <td className="p-4 text-center text-sm">
                  <CompareCell value={row.free} />
                </td>
                <td className="p-4 text-center text-sm bg-primary-50/30 dark:bg-primary-500/5">
                  <CompareCell value={row.pro} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function CompareCell({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-xs font-medium text-foreground/80">{value}</span>;
  }
  return value ? (
    <Check className="mx-auto h-4 w-4 text-primary-500" />
  ) : (
    <span className="text-muted-foreground/30">—</span>
  );
}

// =================================================================
// 9. TESTIMONIALS — masonry layout with aurora bg
// =================================================================
export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Mira Shah',
      role: 'Founder, Lumen Content',
      quote: 'I shipped my SaaS in a weekend. The streaming blog generator alone saved me a week of building.',
      avatar: '/images/users/user-1.png',
      big: false,
    },
    {
      name: 'Carlos Reyes',
      role: 'Indie hacker',
      quote: 'The command palette and glass sidebar made the dashboard feel like Linear, not a starter template. Worth every cent of the $60.',
      avatar: '/images/users/user-2.png',
      big: true,
    },
    {
      name: 'Aiko Tanaka',
      role: 'Marketing lead, Foli',
      quote: 'Email + social modes cut our launch copywriting from days to hours. Folders keep everything tidy.',
      avatar: '/images/users/user-3.png',
      big: false,
    },
    {
      name: 'Daniel Okoro',
      role: 'Solo founder',
      quote: 'Auth, billing, AI streaming — done. I focused 100% on copy and shipped in 4 days.',
      avatar: '/images/users/user-4.png',
      big: false,
    },
    {
      name: 'Lena Park',
      role: 'Designer, Northwind',
      quote: 'Glass-morphism sidebar, animated borders, skeleton loaders — the polish is what sold me. Most boilerplates look like demos; this looks like a real product.',
      avatar: '/images/users/image.png',
      big: true,
    },
  ];

  return (
    <Section bg={<><AuroraWavesBg /><NoiseTextureBg /></>}>
      <SectionHeader
        eyebrow="Testimonials"
        title={<>Loved by <span className="text-primary-500">content teams</span></>}
        subtitle="Built for the people who actually write — and the founders who ship."
      />
      <div className="mt-12 columns-1 md:columns-2 lg:columns-3 gap-6 [&>*]:mb-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className={`break-inside-avoid rounded-2xl border border-border/60 bg-card p-6 shadow-theme-sm card-lift ${t.big ? 'md:p-8' : ''}`}
          >
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className={`mt-4 text-foreground/90 leading-relaxed ${t.big ? 'text-base md:text-lg' : 'text-sm'}`}>
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border/60">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// =================================================================
// 10. FAQ — accordion with diagonal bg
// =================================================================
export function FaqPreviewSection() {
  const faqs = [
    {
      q: 'What exactly do I get?',
      a: 'A complete Next.js 16 SaaS template — 4 streaming AI write modes, full NextAuth v5 flow, Stripe subscription lifecycle with webhook + portal, Prisma schema, premium dashboard UI with glass sidebar + Cmd+K palette, README + .env.example + CREDITS.md. Just add your OpenAI + Stripe keys and ship.',
    },
    {
      q: 'Can I resell this on Gumroad?',
      a: 'Yes — that\'s the point. The base kit is MIT-licensed; Scripta ships with the MIT LICENSE intact. You can sell it as your own template, modify it, and ship client projects on top of it.',
    },
    {
      q: 'Does the AI generation actually work?',
      a: 'Yes. Drop your OpenAI API key into .env, sign in, pick a write mode, fill the form, hit Generate. Output streams token-by-token into the editor. The default model is gpt-4o-mini; swap to any provider the Vercel AI SDK supports.',
    },
    {
      q: 'Is the Stripe integration real?',
      a: 'Yes. Webhook handler covers checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed. Customer portal link on the billing page. Plan-gating enforces Free = blog+social, Pro = all 4 modes.',
    },
    {
      q: 'How do I deploy?',
      a: 'Push to GitHub, import in Vercel, set the env vars, swap the SQLite DB for Postgres (one line in prisma/schema.prisma), run db:push once. The webhook endpoint is /api/webhooks/stripe.',
    },
    {
      q: 'What about support?',
      a: 'Email hello@scripta.app — I reply within 24 hours. Found a bug? Open an issue on the GitHub repo. Want a new write mode added? Suggestions welcome.',
    },
  ];
  return (
    <Section id="faq" bg={<DiagonalLinesBg />}>
      <SectionHeader
        eyebrow="FAQ"
        title={<>Questions, <span className="text-primary-500">answered</span></>}
        subtitle="Everything a potential buyer might ask before paying $60."
      />
      <div className="mt-10 max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl border border-border/60 bg-card p-5 hover:border-primary-300 transition cursor-pointer"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-semibold text-sm pr-4">{faq.q}</span>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground group-open:bg-primary-500 group-open:text-white transition">
                <ArrowDown className="h-3 w-3 group-open:rotate-180 transition-transform" />
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}

// =================================================================
// 11. CTA — bold gradient with glow ring
// =================================================================
export function CtaSection({ isAuthed }: { isAuthed: boolean }) {
  return (
    <Section className="py-24 md:py-32" bg={<><GlowRingBg /><NoiseTextureBg /></>}>
      <div className="relative rounded-3xl border border-primary-500/40 bg-gradient-to-br from-primary-500/10 via-card to-amber-500/10 p-10 md:p-16 text-center shadow-theme-md overflow-hidden">
        {/* Decorative floating shapes */}
        <div aria-hidden className="absolute -top-10 -left-10 h-32 w-32 rounded-full button-bg opacity-20 blur-2xl" />
        <div aria-hidden className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-amber-400 opacity-20 blur-2xl" />

        <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 dark:border-primary-500/30 bg-background/60 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300 backdrop-blur">
          <Sparkles className="h-3 w-3" />
          <span>Ready to ship?</span>
        </div>
        <h2 className="mt-5 text-3xl md:text-title-lg font-bold tracking-tight">
          Ship your SaaS
          <span className="block bg-gradient-to-r from-primary-600 via-violet-500 to-amber-500 bg-clip-text text-transparent">
            this week
          </span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Scripta gives you the complete blueprint: auth, billing, AI streaming,
          dashboard. Just add your brand and ship.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="button-bg btn-press text-white h-12 px-8 text-base"
          >
            <Link href={isAuthed ? '/dashboard' : '/signin'}>
              <Zap className="mr-2 h-4 w-4" />
              {isAuthed ? 'Open dashboard' : 'Try the demo'}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
