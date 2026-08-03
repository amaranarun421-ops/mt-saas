import { Sparkles, Check, ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { GradientLink } from "@/components/driftframe/gradient-button";

export const metadata = {
  title: "Changelog — Driftframe",
  description: "Version history and feature releases for Driftframe.",
};

interface Release {
  version: string;
  date: string;
  title: string;
  blurb: string;
  features: string[];
  fixes?: string[];
  breaking?: string[];
}

const RELEASES: Release[] = [
  {
    version: "v3.0.0",
    date: "2025-12-01",
    title: "Calm premium refresh + 25-page expansion",
    blurb:
      "The signature gradient is now a rare premium accent (4 sanctioned spots). 12 new pages: about, blog, docs, changelog, plus 7 dashboard pages (favorites, showcase, billing, API keys, usage, notifications, trash). Image rendering simplified to a CSS-only fade-in. Auth moved to a full-screen split-panel layout.",
    features: [
      "Toned-down gradient — solid #7c3aed for CTAs, gradient reserved for logo / credit pill / progress ring / favicon",
      "New (auth) route group with full-screen split-panel layout (no site header/footer)",
      "Dashboard sidebar nav with 11 destinations + mobile drawer",
      "Dashboard home: welcome card + quick stats + recent activity feed",
      "Image card: CSS-only fade-in, explicit width/height, onError fallback",
      "Show/hide password toggle on signin + prominent demo banner",
    ],
    fixes: [
      "SVG data URLs no longer get stuck at blur(20px) (onLoad unreliability)",
      "Auth pages no longer sandwiched between site header + footer",
      "Theme toggle no longer causes hydration warnings on first paint",
    ],
  },
  {
    version: "v2.0.0",
    date: "2025-10-15",
    title: "Premium template upgrade",
    blurb:
      "Major upgrade: hydration fix, light-mode default, local SVG generative art replacing unreachable picsum URLs, real OAuth (Google + GitHub), unique custom logo, consistent responsive padding, 12-section landing page, modern scrollbar + dropdowns, glass UI polish.",
    features: [
      "Hydration-safe theme toggle (stable pre-mount)",
      "Light-mode default with warm #f7f7f8 background",
      "Local SVG generative art (5 distinct style palettes)",
      "Config-gated Google + GitHub OAuth with brand SVG icons",
      "Original 'drift frame' SVG logo mark",
      "12-section landing page with varied section backgrounds",
      "Full shadcn DropdownMenu for the user avatar (Settings, Billing, Theme submenu, Sign out)",
      "Auto-seeded demo user (demo@driftframe.app / demo1234) with 100 credits",
    ],
    fixes: [
      "Replaced picsum.photos (unreachable in many sandboxed browsers → broken images) with local SVG art",
      "Download works for both data: URLs and http(s) URLs (fetch-as-blob fallback)",
    ],
  },
  {
    version: "v1.0.0",
    date: "2025-08-02",
    title: "Initial release",
    blurb:
      "Driftframe v1 — a premium AI image generation SaaS template. Batch-of-4 generation, credit packs, masonry gallery, public showcase, history + lightbox, mock Stripe billing.",
    features: [
      "NextAuth v4 with CredentialsProvider + PrismaAdapter (JWT strategy)",
      "Atomic credit deduction (no charge on generation failure)",
      "5 style presets × 4 aspect ratios = 20 generation configurations",
      "Pinterest-style CSS-columns masonry with shimmer + reveal",
      "Public showcase gallery + per-image public/private toggle",
      "Mock Stripe credit packs ($9/$29/$59) + subscription ($19/mo)",
      "Buy-credits modal accessible from the dashboard header pill",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-radial-spotlight">
        <div className="driftframe-container py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="driftframe-pill">
              <Sparkles className="h-3 w-3" />
              Changelog
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              What&apos;s new in Driftframe.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Every release, every fix, every breaking change — documented.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div className="driftframe-container py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="relative space-y-12">
              {/* Vertical line */}
              <div
                className="absolute left-4 top-2 bottom-2 w-px bg-border sm:left-1/2"
                aria-hidden
              />

              {RELEASES.map((rel, i) => (
                <div
                  key={rel.version}
                  className={`relative pl-12 sm:pl-0 ${
                    i % 2 === 0 ? "sm:pr-1/2" : "sm:pl-1/2"
                  }`}
                >
                  {/* Dot */}
                  <span
                    className={`absolute left-[9px] top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#7c3aed] text-[10px] font-bold text-white ring-4 ring-background sm:left-1/2 sm:-translate-x-1/2 ${
                      i % 2 === 0 ? "sm:translate-x-1/2" : "sm:-translate-x-1/2"
                    }`}
                  >
                    {i + 1}
                  </span>

                  <div className={i % 2 === 0 ? "sm:text-right" : ""}>
                    <div className={`flex items-center gap-3 ${i % 2 === 0 ? "sm:justify-end" : ""}`}>
                      <span className="font-display text-lg font-semibold text-foreground">
                        {rel.version}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(rel.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <h2 className="mt-1 font-display text-xl font-semibold tracking-tight">
                      {rel.title}
                    </h2>
                  </div>

                  <GlassPanel className="mt-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {rel.blurb}
                    </p>

                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed]">
                        Features
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {rel.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            <span className="text-foreground/90">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {rel.fixes && rel.fixes.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Fixes
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {rel.fixes.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                              <span className="text-muted-foreground">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {rel.breaking && rel.breaking.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-destructive">
                          Breaking changes
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {rel.breaking.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-destructive" />
                              <span className="text-foreground/90">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </GlassPanel>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-radial-spotlight border-t border-border">
        <div className="driftframe-container py-12 text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Try the latest.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            v3 is live. Start with 10 free credits — no card required.
          </p>
          <div className="mt-6 flex justify-center">
            <GradientLink href="/signup" leftIcon={<ArrowRight className="h-4 w-4" />}>
              Get started
            </GradientLink>
          </div>
        </div>
      </section>
    </div>
  );
}
