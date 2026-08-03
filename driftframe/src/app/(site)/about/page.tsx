import { Sparkles, Target, Users, Zap, Shield, Heart, Globe2 } from "lucide-react";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { GradientLink } from "@/components/driftframe/gradient-button";

export const metadata = {
  title: "About — Driftframe",
  description: "The story behind Driftframe — a calm, premium AI image generation studio.",
};

const VALUES = [
  {
    icon: Target,
    title: "Calm over loud",
    body: "Software should feel like a workshop, not a casino. We design for focus — generous whitespace, restrained colour, no nudge loops.",
  },
  {
    icon: Zap,
    title: "Fast by default",
    body: "Every interaction is sub-second. Image generation is the only slow thing, and we make the wait feel intentional.",
  },
  {
    icon: Shield,
    title: "Own your work",
    body: "Generated images belong to you. No watermark. No model-side retention of your prompts. Privacy by default.",
  },
  {
    icon: Heart,
    title: "Honest pricing",
    body: "Credit packs that never expire. No subscription lock-in. Buy what you need, when you need it.",
  },
];

const TEAM = [
  { name: "Mira Okonkwo", role: "Founder & CEO", initials: "MO", bio: "Ex-design lead. Started Driftframe after years of stock-photo fatigue." },
  { name: "Hiroshi Tanaka", role: "Head of Engineering", initials: "HT", bio: "Built the generation pipeline. Cares about latency more than is healthy." },
  { name: "Sofia Reyes", role: "Design Lead", initials: "SR", bio: "Owns the visual system. Believes every pixel should earn its place." },
  { name: "Daniel Park", role: "ML Research", initials: "DP", bio: "Tunes the style presets. Spends weekends retraining diffusion models." },
  { name: "Aisha Bello", role: "Product", initials: "AB", bio: "Talks to creators daily. Ships the features they actually need." },
  { name: "Lucas Meyer", role: "Developer Advocate", initials: "LM", bio: "Writes the docs. Lives in the API reference." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-radial-spotlight">
        <div className="driftframe-container py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="driftframe-pill">
              <Sparkles className="h-3 w-3" />
              About Driftframe
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              A studio that respects your time and your taste.
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Driftframe started as a side project in 2024 — a way to generate
              four variations of a prompt without paying $20/month for a tool
              we&apos;d forget to use. Today it powers image workflows for
              thousands of indie creators, designers, and small studios.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section>
        <div className="driftframe-container py-16 md:py-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <h2 className="font-display text-3xl font-semibold tracking-tight">
                Our mission
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Most AI image tools are built for hype — loud marketing,
                  aggressive upsells, bloated feature surfaces. We wanted the
                  opposite: a calm, focused studio that does one thing well.
                  Prompt in, four variations out, done.
                </p>
                <p>
                  Driftframe is built on three commitments: a credit-pack model
                  that respects your budget (credits never expire), a gallery
                  that respects your work (private by default, public only when
                  you opt in), and a generation pipeline that respects your
                  time (sub-second feedback, atomic credit deduction that
                  never charges on failure).
                </p>
                <p>
                  We&apos;re a small, fully remote team. We ship in small
                  increments. We answer support emails ourselves. And we
                  publish our roadmap openly so you know what&apos;s coming.
                </p>
              </div>
              <GradientLink href="/signup" leftIcon={<Sparkles className="h-4 w-4" />}>
                Try Driftframe free
              </GradientLink>
            </div>
            <GlassPanel className="space-y-4">
              <h3 className="font-display text-base font-medium">By the numbers</h3>
              <ul className="space-y-3 text-sm">
                <Stat label="Images generated" value="50,000+" />
                <Stat label="Active creators" value="3,200" />
                <Stat label="Avg. generation time" value="1.4s" />
                <Stat label="Team members" value="6" />
                <Stat label="Remote since" value="2024" />
              </ul>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-dot-grid border-y border-border">
        <div className="driftframe-container py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              What we value.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Four principles that shape every product decision we make.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <GlassPanel key={v.title} className="flex flex-col">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#7c3aed] text-white">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-medium">
                  {v.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section>
        <div className="driftframe-container py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="driftframe-pill">
              <Users className="h-3 w-3" />
              The team
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Six people. Five timezones. One studio.
            </h2>
            <p className="mt-3 text-muted-foreground">
              We&apos;re a remote-first team that ships like a much bigger one.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member) => (
              <GlassPanel key={member.name} className="flex items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-sm font-semibold text-white">
                  {member.initials}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-[#7c3aed]">{member.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-radial-spotlight border-t border-border">
        <div className="driftframe-container py-16 text-center">
          <Globe2 className="mx-auto h-8 w-8 text-[#7c3aed]" />
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Want to join the studio?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Start with 10 free credits — no card, no subscription, no nudge
            loops. Just a studio.
          </p>
          <div className="mt-6 flex justify-center">
            <GradientLink href="/signup" leftIcon={<Sparkles className="h-4 w-4" />}>
              Get started free
            </GradientLink>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-display text-lg font-semibold text-foreground">{value}</span>
    </li>
  );
}
