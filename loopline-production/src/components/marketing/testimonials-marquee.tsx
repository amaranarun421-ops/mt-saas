"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const TESTIMONIALS_ROW_1 = [
  {
    quote: "We cut our Tier-1 ticket volume by 60% in the first week. The human-handoff flow means nothing falls through the cracks.",
    name: "Sarah Chen",
    role: "Head of Support, Vercel",
    avatar: "SC",
    color: "#1a56db",
  },
  {
    quote: "Loopline paid for itself in the first afternoon. Our support bot resolves password resets and billing questions while we sleep.",
    name: "Marcus Patel",
    role: "Founder, Resend",
    avatar: "MP",
    color: "#8b5cf6",
  },
  {
    quote: "The embed snippet just works. I pasted it into our WordPress site and the widget was live in 30 seconds, themed to our brand.",
    name: "Elena Rossi",
    role: "Marketing Lead, Linear",
    avatar: "ER",
    color: "#22c55e",
  },
  {
    quote: "As an agency, we manage support bots for 12 client sites. Loopline's multi-bot workspace model is exactly what we needed.",
    name: "David Kim",
    role: "Operations, Cursor",
    avatar: "DK",
    color: "#f59e0b",
  },
  {
    quote: "The streaming AI feels instant. Visitors see the answer forming in real time — no more staring at a loading spinner.",
    name: "Priya Sharma",
    role: "CTO, Dub.co",
    avatar: "PS",
    color: "#ec4899",
  },
];

const TESTIMONIALS_ROW_2 = [
  {
    quote: "I bought the template on Friday and had a working support bot on our production site by Monday morning. Genuinely plug-and-play.",
    name: "James O'Brien",
    role: "Indie Hacker",
    avatar: "JO",
    color: "#14b8a6",
  },
  {
    quote: "The analytics page tells me exactly what visitors are asking. We rewrote our pricing page based on the top questions.",
    name: "Yuki Tanaka",
    role: "PM, Notion",
    avatar: "YT",
    color: "#6366f1",
  },
  {
    quote: "Best $65 I've spent on a template. The code is clean, the design is premium, and the Stripe integration is genuinely production-ready.",
    name: "Anna Schmidt",
    role: "Freelancer",
    avatar: "AS",
    color: "#f43f5e",
  },
  {
    quote: "Our resolution rate hit 73% in the first month. The AI handles the repetitive stuff; humans handle the hard stuff. Exactly right.",
    name: "Tom Wilson",
    role: "Support Lead, Cal.com",
    avatar: "TW",
    color: "#0ea5e9",
  },
  {
    quote: "The knowledge-base chunking is clever — it actually grounds the AI in our docs instead of hallucinating. Huge difference.",
    name: "Mei Lin",
    role: "Engineer, Framer",
    avatar: "ML",
    color: "#a855f7",
  },
];

export function TestimonialsMarquee() {
  return (
    <section className="bg-loopline-mesh section-padding">
      <div className="container-loopline">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-brand-500">
            Loved by support teams
          </p>
          <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            Don&apos;t take our word for it.
          </h2>
        </div>
      </div>

      {/* Marquee rows — full-bleed */}
      <div className="mt-14 space-y-4">
        <MarqueeRow testimonials={TESTIMONIALS_ROW_1} direction="left" />
        <MarqueeRow testimonials={TESTIMONIALS_ROW_2} direction="right" />
      </div>
    </section>
  );
}

function MarqueeRow({
  testimonials,
  direction,
}: {
  testimonials: typeof TESTIMONIALS_ROW_1;
  direction: "left" | "right";
}) {
  // Duplicate the array so the marquee loops seamlessly
  const doubled = [...testimonials, ...testimonials];
  return (
    <div className="relative overflow-hidden">
      {/* edge fade mask */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
        aria-hidden="true"
      />
      <div
        className={cn(
          "flex w-max gap-4",
          direction === "left" ? "loopline-marquee-left" : "loopline-marquee-right",
          "loopline-marquee-pause",
        )}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={i} testimonial={t} />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: typeof TESTIMONIALS_ROW_1[number];
}) {
  return (
    <div className="w-[340px] shrink-0 rounded-2xl border border-border bg-card p-5 transition hover:shadow-[var(--shadow-glow)] sm:w-[400px]">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: testimonial.color }}
        >
          {testimonial.avatar}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {testimonial.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
