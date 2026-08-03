import Link from "next/link";
import {
  Sparkles,
  Layers,
  CreditCard,
  LayoutGrid,
  Globe2,
  ArrowRight,
  Wand2,
  Image as ImageIcon,
  Download,
  ShieldCheck,
  Check,
  Star,
} from "lucide-react";
import { GradientLink } from "@/components/driftframe/gradient-button";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { HeroMasonry } from "@/components/driftframe/hero-masonry";
import { FaqAccordion } from "@/components/driftframe/faq-accordion";
import {
  CREDIT_PACKS,
  SUBSCRIPTION_PLAN,
} from "@/lib/constants";
import { db } from "@/lib/db";
import type { ImageCardData } from "@/components/driftframe/image-card";
import { generateSvgArt } from "@/lib/ai/image-model";
import { ShowcaseGallery } from "@/components/driftframe/showcase-gallery";

const FEATURES = [
  {
    icon: Layers,
    title: "Batch-of-4 generation",
    body: "Every prompt returns four variations in seconds. Pick a favourite, regenerate, or keep them all.",
    span: "lg:col-span-2",
  },
  {
    icon: CreditCard,
    title: "Credit packs, not lock-in",
    body: "Buy exactly what you need. Credits never expire. No recurring charge unless you want one.",
    span: "",
  },
  {
    icon: LayoutGrid,
    title: "Masonry gallery",
    body: "Your work lives in a Pinterest-style grid with blur-to-sharp progressive reveal.",
    span: "",
  },
  {
    icon: Globe2,
    title: "Public showcase",
    body: "Flag any image public to feature it in the community gallery. Private by default.",
    span: "",
  },
  {
    icon: Wand2,
    title: "Five style presets",
    body: "Photographic, anime, 3D render, painting, sketch — switch the entire aesthetic in one click.",
    span: "lg:col-span-2",
  },
];

const STATS = [
  { value: "50K+", label: "Images generated" },
  { value: "4", label: "Variations per request" },
  { value: "5", label: "Art styles" },
  { value: "$9", label: "Starting pack" },
];

const STEPS = [
  {
    n: "01",
    icon: Wand2,
    title: "Write your prompt",
    body: "Describe the image. Pick a style preset and an aspect ratio. Add a negative prompt if you want to exclude anything.",
  },
  {
    n: "02",
    icon: Layers,
    title: "Generate 4 variations",
    body: "Driftframe runs your prompt through the model and returns four distinct takes. Watch the progress ring fill as they render.",
  },
  {
    n: "03",
    icon: Download,
    title: "Download & share",
    body: "Favorite, download, or generate a variation. Toggle public to feature your work in the community gallery.",
  },
];

const TESTIMONIALS = [
  {
    initials: "AR",
    name: "Ava R.",
    role: "Indie art director",
    quote:
      "Driftframe replaced three of my stock subscriptions. Four variations per prompt is the sweet spot — I always end up using at least one.",
  },
  {
    initials: "MK",
    name: "Marcus K.",
    role: "Indie game developer",
    quote:
      "The masonry gallery + progressive reveal feels like a real product, not a demo. My players keep asking where I get my concept art.",
  },
  {
    initials: "SP",
    name: "Sofia P.",
    role: "Brand designer",
    quote:
      "Credit packs instead of a $20/mo subscription I forget to use? Yes please. I bought 50 credits three months ago and still have half.",
  },
];

const COMPARISON_ROWS = [
  { feature: "Credit packs (no subscription)", us: true, them: false, stock: false },
  { feature: "Batch-of-4 generation", us: true, them: true, stock: false },
  { feature: "Public showcase gallery", us: true, them: false, stock: false },
  { feature: "Style presets", us: true, them: true, stock: false },
  { feature: "No subscription required", us: true, them: false, stock: true },
  { feature: "Commercial license", us: true, them: true, stock: true },
] as const;

const LOGO_CLOUD = [
  "Nebula",
  "Quanta",
  "Foldspace",
  "Aperture",
  "Monolith",
  "Verge",
];

export default async function LandingPage() {
  // Pull 8 public images for the showcase section; fall back to seeded
  // demo SVG art if the gallery is empty so the section is never blank.
  const rows = await db.image.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      url: true,
      width: true,
      height: true,
      isFavorite: true,
      isPublic: true,
      generation: {
        select: { prompt: true, style: true, aspectRatio: true },
      },
    },
  });

  let showcase: ImageCardData[];
  if (rows.length > 0) {
    showcase = rows.map((img) => ({
      id: img.id,
      url: img.url,
      width: img.width,
      height: img.height,
      isFavorite: img.isFavorite,
      isPublic: img.isPublic,
      prompt: img.generation.prompt,
      style: img.generation.style,
      aspectRatio: img.generation.aspectRatio,
    }));
  } else {
    const fallbackPrompts = [
      { prompt: "Bioluminescent jellyfish over a neon skyline", style: "photographic", seed: 7101 },
      { prompt: "Ancient forest cathedral, god rays through mist", style: "painting", seed: 7102 },
      { prompt: "Cyberpunk samurai in the rain", style: "anime", seed: 7103 },
      { prompt: "Desert oasis mirage, floating ruins", style: "3d-render", seed: 7104 },
      { prompt: "Coral city inhabited by translucent fish", style: "painting", seed: 7105 },
      { prompt: "Volcanic glass palace on a floating island", style: "3d-render", seed: 7106 },
      { prompt: "Aurora over a mirror lake, lone cabin", style: "photographic", seed: 7107 },
      { prompt: "Retro-futuristic diner on Mars", style: "sketch", seed: 7108 },
    ];
    showcase = fallbackPrompts.map((p, i) => ({
      id: `fallback-${i}`,
      url: generateSvgArt({
        prompt: p.prompt,
        style: p.style,
        seed: p.seed,
        width: 600,
        height: 600,
      }),
      width: 600,
      height: 600,
      isFavorite: false,
      isPublic: true,
      prompt: p.prompt,
      style: p.style,
      aspectRatio: "1:1",
    }));
  }

  return (
    <div className="flex flex-col">
      {/* ───────── 1. Hero ───────── */}
      <section className="bg-radial-spotlight relative overflow-hidden">
        <div className="driftframe-container pb-12 pt-16 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="driftframe-pill">
              <Sparkles className="h-3 w-3" />
              AI image generation studio
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Generate images that{" "}
              <span className="text-[#7c3aed]">drift between</span>{" "}
              imagination and reality.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Driftframe turns a single prompt into four stunning variations.
              Credit packs, no subscriptions required. Your work, in a
              gallery-worthy masonry.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <GradientLink href="/signup" leftIcon={<Sparkles className="h-4 w-4" />}>
                Start creating — free
              </GradientLink>
              <GradientLink href="/gallery" variant="outline" leftIcon={<ImageIcon className="h-4 w-4" />}>
                View gallery
              </GradientLink>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              10 free credits on signup. No card required.
            </p>
          </div>

          {/* Product mockup — browser-frame with a fake dashboard screenshot */}
          <div className="mx-auto mt-14 max-w-5xl">
            <BrowserMockup />
          </div>
        </div>
      </section>

      {/* ───────── 2. Logo cloud ───────── */}
      <section className="border-y border-border bg-background/50">
        <div className="driftframe-container py-10">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
            Trusted by teams at
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70">
            {LOGO_CLOUD.map((name) => (
              <span
                key={name}
                className="font-display text-xl font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 3. Features bento ───────── */}
      <section className="bg-dot-grid">
        <div className="driftframe-container py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for creators who ship.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to go from prompt to publish — none of the
              bloat you don&apos;t.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <GlassPanel
                key={f.title}
                className={`driftframe-card-hover flex flex-col ${f.span}`}
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#7c3aed] text-white shadow-[0_0_14px_rgba(124,58,237,0.22)]">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 4. Stats band ───────── */}
      <section className="bg-grid-lines">
        <div className="driftframe-container py-20 md:py-24">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-5xl font-semibold tracking-tight text-[#7c3aed] sm:text-6xl">
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 5. How it works ───────── */}
      <section>
        <div className="driftframe-container py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              From prompt to publish in three steps.
            </h2>
            <p className="mt-3 text-muted-foreground">
              No tutorials, no manual. The studio does the heavy lifting.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <GlassPanel
                key={step.n}
                className="driftframe-card-hover relative flex flex-col"
              >
                <span className="font-display text-5xl font-semibold text-foreground/10">
                  {step.n}
                </span>
                <div className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#7c3aed] text-white">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      <div className="driftframe-divider" />

      {/* ───────── 6. Showcase gallery ───────── */}
      <section>
        <div className="driftframe-container py-20 md:py-28">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                See what creators are making.
              </h2>
              <p className="mt-3 text-muted-foreground">
                A live feed of public generations. Click any tile to view it
                full-size in the lightbox.
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
            >
              View full gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10">
            <ShowcaseGallery images={showcase} />
          </div>
        </div>
      </section>

      {/* ───────── 7. Testimonials ───────── */}
      <section className="border-t border-border bg-background/40">
        <div className="driftframe-container py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Loved by makers.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Real stories from designers, devs, and creators using Driftframe
              to ship faster.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <GlassPanel key={t.name} className="driftframe-card-hover flex flex-col">
                <div className="flex items-center gap-1 text-[#f59e0b]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#7c3aed] text-sm font-semibold text-white">
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {t.role}
                    </span>
                  </span>
                </figcaption>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 8. Pricing preview ───────── */}
      <section className="bg-radial-spotlight">
        <div className="driftframe-container py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Simple, honest pricing.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Buy a pack. Use it forever. Or subscribe for monthly auto-refill.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CREDIT_PACKS.map((pack) => (
              <GlassPanel
                key={pack.id}
                className={`relative text-center ${pack.highlight ? "ring-2 ring-[#7c3aed]" : ""}`}
              >
                {pack.highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#7c3aed] inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    <Sparkles className="h-2.5 w-2.5" /> Most popular
                  </span>
                )}
                <p className="text-sm text-muted-foreground">
                  {pack.credits} credits
                </p>
                <p className="mt-1 font-display text-4xl font-semibold">
                  {pack.priceLabel}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{pack.perCredit}</p>
              </GlassPanel>
            ))}
            <GlassPanel className="text-center ring-1 ring-[#ff3d81]/30">
              <p className="text-sm text-muted-foreground">Pro subscription</p>
              <p className="mt-1 font-display text-4xl font-semibold">
                {SUBSCRIPTION_PLAN.priceLabel}
                <span className="text-base font-normal text-muted-foreground">
                  /mo
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                300 credits / month
              </p>
            </GlassPanel>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
            >
              Compare plans in detail <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── 9. Comparison table ───────── */}
      <section>
        <div className="driftframe-container py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Why Driftframe vs the rest.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Credit packs you actually own. A gallery that actually feels like
              a product. No subscription lock-in.
            </p>
          </div>
          <div className="mt-12 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-4 font-medium sm:px-6">Feature</th>
                  <th className="px-4 py-4 text-center font-medium sm:px-6">
                    Driftframe
                  </th>
                  <th className="px-4 py-4 text-center font-medium sm:px-6">
                    Typical AI tool
                  </th>
                  <th className="px-4 py-4 text-center font-medium sm:px-6">
                    Stock photo site
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="hover:bg-muted/30">
                    <td className="px-4 py-4 font-medium sm:px-6">
                      {row.feature}
                    </td>
                    <td className="px-4 py-4 text-center sm:px-6">
                      <CompareCell ok={row.us} highlight />
                    </td>
                    <td className="px-4 py-4 text-center sm:px-6">
                      <CompareCell ok={row.them} />
                    </td>
                    <td className="px-4 py-4 text-center sm:px-6">
                      <CompareCell ok={row.stock} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ───────── 10. FAQ ───────── */}
      <section className="bg-dot-grid">
        <div className="driftframe-container py-20 md:py-28">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-center sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-8">
              <FaqAccordion />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 11. CTA banner ───────── */}
      <section className="relative overflow-hidden bg-[#7c3aed]">
        {/* Subtle dot-grid overlay at low opacity */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />
        <div className="driftframe-container relative py-20 text-center md:py-28">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Start creating in 60 seconds.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/80">
            10 free credits on signup. No card. No subscription. Just open the
            studio and prompt.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-[#7c3aed] shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent min-h-[48px]"
            >
              <Sparkles className="h-4 w-4" />
              Get 10 free credits
            </Link>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/70">
            <ShieldCheck className="h-3.5 w-3.5" />
            No credit card · Cancel anytime · Credits never expire
          </p>
        </div>
      </section>
    </div>
  );
}

/* ───── Comparison cell ───── */

function CompareCell({ ok, highlight }: { ok: boolean; highlight?: boolean }) {
  if (ok) {
    return (
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
          highlight
            ? "bg-[#7c3aed] text-white"
            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        }`}
      >
        <Check className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
      —
    </span>
  );
}

/* ───── Browser mockup (hero product shot) ───── */

function BrowserMockup() {
  // Pre-generate 4 small SVG art tiles for the mockup's masonry preview.
  const mockTiles = [
    { prompt: "Neon koi swimming through circuitry", style: "anime", seed: 8001 },
    { prompt: "Snowy mountain peak at golden hour", style: "photographic", seed: 8002 },
    { prompt: "Floating crystal garden on a pastel sky", style: "3d-render", seed: 8003 },
    { prompt: "Ink wash dragon coiled around a pagoda", style: "painting", seed: 8004 },
  ];
  const tiles = mockTiles.map((t) =>
    generateSvgArt({
      prompt: t.prompt,
      style: t.style,
      seed: t.seed,
      width: 320,
      height: 320,
    }),
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <div className="ml-4 hidden flex-1 items-center gap-2 rounded-md bg-background/60 px-3 py-1 text-xs text-muted-foreground sm:flex">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          driftframe.app/dashboard
        </div>
      </div>
      {/* Body — fake dashboard layout */}
      <div className="grid grid-cols-1 gap-4 bg-background/40 p-4 lg:grid-cols-[260px_1fr]">
        {/* Prompt sidebar */}
        <div className="driftframe-glass hidden flex-col gap-3 rounded-xl p-4 lg:flex">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Prompt</p>
            <div className="mt-1 rounded-lg bg-background/60 p-2 text-xs text-foreground/80">
              A bioluminescent jellyfish drifting through a neon city skyline at
              dusk, cinematic…
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Style</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span className="bg-[#7c3aed] inline-flex items-center rounded-md px-2 py-1 text-[10px] font-medium text-white">
                Photographic
              </span>
              <span className="driftframe-glass inline-flex items-center rounded-md px-2 py-1 text-[10px] text-muted-foreground">
                Anime
              </span>
              <span className="driftframe-glass inline-flex items-center rounded-md px-2 py-1 text-[10px] text-muted-foreground">
                3D
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Aspect</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span className="bg-[#7c3aed] inline-flex items-center rounded-md px-2 py-1 text-[10px] font-medium text-white">
                1:1
              </span>
              <span className="driftframe-glass inline-flex items-center rounded-md px-2 py-1 text-[10px] text-muted-foreground">
                16:9
              </span>
            </div>
          </div>
          <div className="bg-[#7c3aed] mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white">
            <Wand2 className="h-3.5 w-3.5" /> Generate 4 images
          </div>
          <p className="text-center text-[10px] text-muted-foreground">
            Costs 4 credits · you have 96
          </p>
        </div>
        {/* Masonry preview */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {tiles.map((url, i) => (
            <div
              key={i}
              className="driftframe-card-hover overflow-hidden rounded-xl border border-border"
              style={{ aspectRatio: "1 / 1" }}
            >
              <img
                src={url}
                alt={`Generated variation ${i + 1}`}
                width={320}
                height={320}
                loading="lazy"
                className="driftframe-img h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
