"use client";

import { WaveDivider } from "@/components/brand/wave-divider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Code2,
  Gauge,
  MessagesSquare,
  Shield,
  Sparkles,
  Users,
  Zap,
  Headset,
  Palette,
  BarChart3,
  Globe,
  Lock,
  CheckCircle2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Bot,
    title: "Multi-bot workspaces",
    desc: "Run separate bots for each product or client site from one workspace. Perfect for agencies.",
  },
  {
    icon: MessagesSquare,
    title: "Streaming AI replies",
    desc: "Token-by-token streaming via SSE. Visitors get answers in real time, not after a 10-second wait.",
  },
  {
    icon: Code2,
    title: "One-line embed",
    desc: "Drop a single <script> tag onto any page. No build step, no framework lock-in for the host site.",
  },
  {
    icon: Users,
    title: "Human handoff inbox",
    desc: "Visitors can escalate to a human. Live two-pane inbox with unread badges and full thread context.",
  },
  {
    icon: Gauge,
    title: "Per-bot analytics",
    desc: "Conversation volume, top questions, resolution rate. Know what your bot is actually doing.",
  },
  {
    icon: Shield,
    title: "Stripe-billed at workspace",
    desc: "Free, Pro, and Agency tiers. Usage gating, customer portal, soft warnings at 80% of limit.",
  },
];

const BENTO = [
  {
    icon: MessagesSquare,
    title: "Streaming AI that feels instant",
    desc: "Server-Sent Events push tokens to the widget as the model generates them. Visitors see the answer forming in real time — no more staring at a spinner.",
    span: "lg:col-span-3",
    accent: "brand",
  },
  {
    icon: Palette,
    title: "Per-bot theming",
    desc: "Each bot carries its own color, avatar, and welcome message. Updates propagate to live widgets instantly.",
    span: "lg:col-span-3",
    accent: "violet",
  },
  {
    icon: Headset,
    title: "Human handoff",
    desc: "One tap escalates to a human. The inbox badge updates live; your reply breaks the thread out of AI mode.",
    span: "lg:col-span-2",
    accent: "mint",
  },
  {
    icon: BarChart3,
    title: "Real analytics",
    desc: "14-day volume charts, top questions, resolution rate. Not vanity metrics — actionable ones.",
    span: "lg:col-span-2",
    accent: "amber",
  },
  {
    icon: Globe,
    title: "Works on any site",
    desc: "WordPress, Webflow, plain HTML, Next.js, Rails — if it can paste a script tag, it can run Loopline.",
    span: "lg:col-span-2",
    accent: "brand",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Create a bot",
    desc: "Name it, pick a color, write a welcome message. Per-bot theming flows straight into the widget.",
  },
  {
    n: "02",
    title: "Upload your knowledge base",
    desc: "Paste FAQs, docs, or markdown. Loopline chunks and retrieves them to ground AI responses.",
  },
  {
    n: "03",
    title: "Paste the snippet",
    desc: "Copy the <script> tag onto your site. The widget loads instantly, themed to your brand.",
  },
];

const STATS = [
  { value: 72, suffix: "ms", label: "Median first-token latency", color: "brand" },
  { value: 73, suffix: "%", label: "Tickets resolved without human", color: "mint" },
  { value: 1200, suffix: "+", label: "Conversations resolved daily", color: "violet" },
  { value: 24, suffix: "/7", label: "AI never sleeps", color: "amber" },
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-loopline-rays">
      <div className="absolute inset-0 bg-loopline-navy-grid opacity-60" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />

      <div className="container-loopline relative pb-24 pt-16 sm:pt-20 lg:pb-32 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left: copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-100 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-mint-400" />
              <span>Now with streaming AI + human handoff</span>
            </div>

            <h1 className="mt-6 font-display text-[44px] leading-[1.02] text-white sm:text-[56px] lg:text-[72px]">
              <span className="text-gradient-loopline">Resolve support</span>
              <br />
              tickets while you sleep.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Loopline is the embeddable AI support chatbot for SaaS. Drop one
              script tag onto your site, point it at your docs, and watch your
              support load melt — with a clean human-handoff path when it matters.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" variant="default" asChild withArrow>
                <Link href="/signup" className="group">
                  Start free — no card required
                </Link>
              </Button>
              <Button size="lg" variant="outlineLight" asChild>
                <Link href="/docs">Read the docs</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-500" />
                </span>
                1,200+ conversations resolved today
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-300" />
                72ms median first-token
              </div>
            </div>
          </div>

          {/* Right: realistic product UI (inbox preview) */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-brand-500/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-[var(--shadow-pop)]">
                {/* window chrome */}
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <span className="h-3 w-3 rounded-full bg-green-400/80" />
                  <span className="ml-3 font-mono text-xs text-slate-400">loopline.app/dashboard/inbox</span>
                </div>
                {/* fake inbox two-pane */}
                <div className="grid grid-cols-[140px_1fr] gap-0 bg-navy-900">
                  {/* list */}
                  <div className="border-r border-white/10 p-2 space-y-1">
                    {[
                      { n: "Sarah C.", m: "How do I reset…", active: true, badge: false },
                      { n: "Marcus P.", m: "Charged twice", active: false, badge: true },
                      { n: "Elena R.", m: "Cancel anytime?", active: false, badge: false },
                      { n: "Anonymous", m: "API access?", active: false, badge: false },
                    ].map((c, i) => (
                      <div
                        key={i}
                        className={`rounded-lg px-2 py-1.5 text-[10px] ${
                          c.active ? "bg-brand-500/20" : "hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{c.n}</span>
                          {c.badge && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                        </div>
                        <p className="truncate text-slate-500">{c.m}</p>
                      </div>
                    ))}
                  </div>
                  {/* transcript */}
                  <div className="space-y-2 p-3">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-500 px-2.5 py-1.5 text-[11px] text-white">
                        How do I reset my password?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/10 px-2.5 py-1.5 text-[11px] text-slate-100">
                        Go to Settings → Security → Reset Password. You&apos;ll get an email with a link valid for 30 minutes.
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-500 px-2.5 py-1.5 text-[11px] text-white">
                        That worked, thanks!
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pt-1">
                      <span className="loopline-typing-dot h-1.5 w-1.5 rounded-full bg-slate-500" style={{ animationDelay: "0ms" }} />
                      <span className="loopline-typing-dot h-1.5 w-1.5 rounded-full bg-slate-500" style={{ animationDelay: "150ms" }} />
                      <span className="loopline-typing-dot h-1.5 w-1.5 rounded-full bg-slate-500" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating mini widget */}
              <div className="loopline-float absolute -bottom-6 -left-6 hidden w-64 rounded-2xl border border-white/10 bg-white p-3 shadow-[var(--shadow-pop)] dark:bg-card sm:block">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Loopline Bot
                    </p>
                    <p className="flex items-center gap-1 text-[10px] text-mint-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
                      Online
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="ml-auto w-fit rounded-2xl rounded-tr-sm bg-brand-50 px-2.5 py-1.5 text-[11px] text-brand-800 dark:bg-brand-500/15 dark:text-brand-100">
                    How do I reset my password?
                  </div>
                  <div className="w-fit rounded-2xl rounded-tl-sm bg-muted px-2.5 py-1.5 text-[11px] text-foreground">
                    Tap Settings → Security → Reset.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WaveDivider className="absolute inset-x-0 bottom-0" fill="text-background" />
    </section>
  );
}

export function LandingLogoBar() {
  const logos = ["Vercel", "Stripe", "Linear", "Notion", "Framer", "Resend", "Cursor", "Dub"];
  return (
    <section className="border-b border-border bg-background py-10">
      <div className="container-loopline">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Powering support at fast-moving SaaS companies
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((logo) => (
            <span
              key={logo}
              className="font-display text-lg text-muted-foreground/60 transition hover:text-foreground"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingStats() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-24">
      {/* aurora orbs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl loopline-float-slow" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-mint-500/15 blur-3xl loopline-float-slow" style={{ animationDelay: "5s" }} />
      <div className="absolute inset-0 bg-loopline-blueprint opacity-40" />
      <div className="container-loopline relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
            By the numbers
          </p>
          <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
            Built for teams that measure everything.
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s) => {
            const colorStyles: Record<string, { card: string; num: string; suffix: string; label: string }> = {
              brand: {
                card: "bg-brand-500/10 border-brand-500/30",
                num: "text-white",
                suffix: "text-brand-300",
                label: "text-brand-100",
              },
              mint: {
                card: "bg-mint-500/10 border-mint-500/30",
                num: "text-white",
                suffix: "text-mint-400",
                label: "text-mint-100",
              },
              violet: {
                card: "bg-violet-500/10 border-violet-500/30",
                num: "text-white",
                suffix: "text-violet-300",
                label: "text-violet-100",
              },
              amber: {
                card: "bg-amber-500/10 border-amber-500/30",
                num: "text-white",
                suffix: "text-amber-400",
                label: "text-amber-100",
              },
            };
            const c = colorStyles[s.color];
            return (
              <div
                key={s.label}
                className={`rounded-2xl border p-6 text-center backdrop-blur-sm transition hover:scale-105 ${c.card}`}
              >
                <p className={`font-display text-4xl lg:text-5xl tabular-nums ${c.num}`}>
                  {s.value}<span className={c.suffix}>{s.suffix}</span>
                </p>
                <p className={`mt-2 text-xs ${c.label}`}>{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function LandingFeatures() {
  return (
    <section id="features" className="bg-background section-padding">
      <div className="container-loopline">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            Everything included
          </p>
          <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            A complete support-chatbot SaaS,
            <br className="hidden sm:block" /> not a toy demo.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From auth and billing to a real embeddable widget — every piece a
            buyer actually needs, wired together and ready to ship.
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-16 grid gap-4 lg:grid-cols-6">
          {BENTO.map((f) => {
            const accentClasses: Record<string, string> = {
              brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
              violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
              mint: "bg-mint-500/15 text-mint-600",
              amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
            };
            return (
              <div
                key={f.title}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[var(--shadow-lift)] ${f.span}`}
              >
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-brand-500/5 transition group-hover:bg-brand-500/10" />
                <div className="relative">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accentClasses[f.accent]}`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary feature grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-5 transition hover:border-brand-300 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                  <f.icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-sm text-foreground">{f.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingSteps() {
  return (
    <section className="border-y border-border bg-muted/30 section-padding">
      <div className="container-loopline">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            Ship in three steps
          </p>
          <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            From signup to live widget
            <br className="hidden sm:block" /> in under five minutes.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className="relative rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-xs)]"
            >
              <span className="font-display text-5xl text-brand-500/20">
                {step.n}
              </span>
              <h3 className="mt-2 font-display text-xl text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
              {i < STEPS.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-brand-300 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Stable HTML syntax highlighter — tokenizes a single line of HTML into
 * typed spans (comment / tag / attr-name / string / text) and renders them
 * as React elements. Deterministic: same input always produces same output
 * on both server and client (no chained regex on already-modified HTML).
 */
function CodeLine({ line }: { line: string }) {
  // Comment line — entire line is gray
  if (line.trim().startsWith("<!--")) {
    return <span style={{ color: "#64748b" }}>{line}</span>;
  }

  const tokens: { text: string; color: string }[] = [];
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);

    // Tag open/close: < or </ followed by a word
    const tagMatch = rest.match(/^(<\/?)(\w+)/);
    if (tagMatch) {
      tokens.push({ text: tagMatch[1], color: "#94a3b8" }); // < or </
      tokens.push({ text: tagMatch[2], color: "#5a7ff5" }); // tag name
      i += tagMatch[0].length;
      continue;
    }

    // Attribute name (before =)
    const attrMatch = rest.match(/^(\s+)([\w-]+)(?==)/);
    if (attrMatch) {
      tokens.push({ text: attrMatch[1], color: "#e2e8f0" }); // whitespace
      tokens.push({ text: attrMatch[2], color: "#22c55e" }); // attr name
      i += attrMatch[0].length;
      continue;
    }

    // = sign
    if (rest[0] === "=") {
      tokens.push({ text: "=", color: "#94a3b8" });
      i += 1;
      continue;
    }

    // String value "..."
    if (rest[0] === '"') {
      const end = rest.indexOf('"', 1);
      const str = end >= 0 ? rest.slice(0, end + 1) : rest;
      tokens.push({ text: str, color: "#fbbf24" });
      i += str.length;
      continue;
    }

    // Tag close > or />
    if (rest.startsWith("/>")) {
      tokens.push({ text: "/>", color: "#94a3b8" });
      i += 2;
      continue;
    }
    if (rest[0] === ">") {
      tokens.push({ text: ">", color: "#94a3b8" });
      i += 1;
      continue;
    }

    // Bareword / whitespace / other — consume one char to avoid infinite loop
    tokens.push({ text: rest[0], color: "#e2e8f0" });
    i += 1;
  }

  return (
    <>
      {tokens.map((t, idx) => (
        <span key={idx} style={{ color: t.color }}>
          {t.text}
        </span>
      ))}
    </>
  );
}

export function LandingCodePreview() {
  const appUrl = "https://your-loopline-deployment.app";
  const code = `<!-- Paste this anywhere on your site -->
<script
  src="${appUrl}/widget.js"
  data-bot-id="bot_abc123"
  defer
></script>`;

  return (
    <section className="bg-background section-padding">
      <div className="container-loopline">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
              One-line install
            </p>
            <h2 className="mt-3 font-display text-4xl text-foreground">
              Drop it on any site.
              <br />
              No framework lock-in.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The widget loads as a self-contained iframe — works on WordPress,
              Webflow, plain HTML, or your existing Next.js app. Your visitors
              never see a flash of unstyled content.
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
                "Cross-origin safe — iframe sandboxed",
                "Per-bot theming propagates instantly",
                "Optional npm package for React apps",
                "Resizes via postMessage — never blocks page",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint-500/15 text-mint-600">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-brand-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-navy-900 shadow-[var(--shadow-pop)]">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 font-mono text-xs text-slate-400">
                  install.html
                </span>
              </div>
              <pre className="overflow-x-auto p-5 text-sm leading-relaxed scrollbar-loopline">
                <code className="font-mono text-slate-200">
                  {code.split("\n").map((line, i) => (
                    <div key={i} className="whitespace-pre">
                      <span className="mr-4 select-none text-slate-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <CodeLine line={line} />
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingAiBand() {
  return (
    <section className="relative overflow-hidden bg-navy-950 section-padding">
      <div className="absolute inset-0 bg-loopline-blueprint opacity-40" />
      {/* aurora accents */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl loopline-float-slow" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl loopline-float-slow" style={{ animationDelay: "8s" }} />
      <div className="container-loopline relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
              <Sparkles className="h-3.5 w-3.5" />
              AI that knows your product
            </div>
            <h2 className="mt-5 font-display text-4xl text-white sm:text-5xl">
              Resolve tickets 3× faster
              <br /> with AI grounded in your docs.
            </h2>
            <p className="mt-5 text-lg text-slate-300">
              Upload your FAQs, docs, and onboarding guides. Loopline chunks
              them and retrieves the top matches per question — so the AI
              answers are grounded in your actual content, not hallucinated.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <Lock className="h-5 w-5 text-brand-400" />
                <p className="mt-2 text-sm font-semibold text-white">Grounded answers</p>
                <p className="mt-1 text-xs text-slate-400">
                  Knowledge-base chunks injected into every system prompt.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <Zap className="h-5 w-5 text-mint-400" />
                <p className="mt-2 text-sm font-semibold text-white">Token streaming</p>
                <p className="mt-1 text-xs text-slate-400">
                  Visitors see answers form in real time, no spinners.
                </p>
              </div>
            </div>
          </div>

          {/* Right: fake AI conversation with KB grounding */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-brand-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-[var(--shadow-pop)]">
              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-500 px-3.5 py-2 text-sm text-white">
                    What&apos;s your refund policy?
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-300">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                  <div className="max-w-[80%] space-y-2">
                    <div className="rounded-2xl rounded-tl-sm bg-white/10 px-3.5 py-2 text-sm text-slate-100">
                      We offer a 7-day money-back guarantee on all paid plans. Email hello@acme.dev with your request and we&apos;ll process it within 1 business day.
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-mint-500/10 px-2 py-1 text-[10px] text-mint-300">
                      <span className="h-1 w-1 rounded-full bg-mint-400" />
                      Grounded in: <span className="font-mono">FAQ.md → refund-policy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingDisqualifier() {
  return (
    <section className="bg-background section-padding">
      <div className="container-loopline-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            Honest fit
          </p>
          <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            Built for some teams.
            <br />
            Not for everyone.
          </h2>
          <p className="mt-4 text-muted-foreground">
            We&apos;d rather you know upfront if Loopline isn&apos;t the right fit.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-mint-300 bg-mint-500/5 p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-500 text-white">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <h3 className="font-display text-lg text-foreground">Built for</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {[
                "SaaS teams that want AI to deflect Tier-1 tickets",
                "Inboxes under 50k conversations/month",
                "Agencies managing support for multiple client sites",
                "Teams that need a human-handoff path, not full autopilot",
                "Buyers who want to ship in an afternoon, not a sprint",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-500/20 text-mint-600">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                ✕
              </span>
              <h3 className="font-display text-lg text-foreground">Not for</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {[
                "Phone or voice-first support teams",
                "On-prem, air-gapped, or HIPAA-required deployments",
                "Teams that need to fully replace human agents with AI",
                "Inboxes over 50k convos/mo (use Intercom or Zendesk)",
                "Buyers who need a 6-month implementation cycle",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    ✕
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
