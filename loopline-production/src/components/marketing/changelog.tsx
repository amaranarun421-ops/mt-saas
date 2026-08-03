import { cn } from "@/lib/utils";
import { Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const ENTRIES = [
  {
    version: "1.2.0",
    date: "Aug 2, 2026",
    tag: "Feature",
    tagColor: "brand",
    title: "Streaming AI responses",
    body: "Widget now streams assistant tokens via Server-Sent Events. Visitors see answers form in real time instead of waiting for a complete response. Median first-token latency: 72ms.",
    author: { name: "Jane Doe", role: "Founder", avatar: "JD", color: "#1a56db" },
  },
  {
    version: "1.1.0",
    date: "Jul 28, 2026",
    tag: "Feature",
    tagColor: "brand",
    title: "Human handoff inbox",
    body: "Visitors can escalate to a human with one tap. The dashboard inbox now shows a 'Needs human' badge and lets agents reply directly — breaking the thread out of AI mode until resolved.",
    author: { name: "Jane Doe", role: "Founder", avatar: "JD", color: "#1a56db" },
  },
  {
    version: "1.0.2",
    date: "Jul 22, 2026",
    tag: "Improvement",
    tagColor: "mint",
    title: "Knowledge base chunking",
    body: "Long-form docs are now split into ~500-char passages at paragraph boundaries, with sentence-boundary fallback for very long paragraphs. Retrieval matches top-4 chunks by keyword overlap.",
    author: { name: "Marcus Patel", role: "Engineer", avatar: "MP", color: "#8b5cf6" },
  },
  {
    version: "1.0.1",
    date: "Jul 18, 2026",
    tag: "Fix",
    tagColor: "amber",
    title: "Widget postMessage resize",
    body: "Fixed an edge case where the widget iframe wouldn't resize correctly on mobile when the keyboard opened. Resizing now respects viewport height constraints.",
    author: { name: "Marcus Patel", role: "Engineer", avatar: "MP", color: "#8b5cf6" },
  },
  {
    version: "1.0.0",
    date: "Jul 15, 2026",
    tag: "Launch",
    tagColor: "brand",
    title: "Loopline is live",
    body: "Initial public release. Multi-bot workspaces, embeddable widget, knowledge base upload, human handoff inbox, per-bot analytics, 3-tier Stripe billing, dark mode across dashboard and widget.",
    author: { name: "Jane Doe", role: "Founder", avatar: "JD", color: "#1a56db" },
  },
];

export function ChangelogSection() {
  return (
    <section className="bg-loopline-mesh section-padding">
      <div className="container-loopline-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            What&apos;s new
          </div>
          <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            Shipping every week.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real changelog, real bylines, real updates.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {ENTRIES.map((entry, i) => {
            const tagColors: Record<string, string> = {
              brand: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
              mint: "bg-mint-500/15 text-mint-600",
              amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
            };
            return (
              <div
                key={i}
                className="group relative rounded-2xl border border-border bg-card p-6 transition hover:border-brand-300 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-muted-foreground">
                    v{entry.version}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      tagColors[entry.tagColor],
                    )}
                  >
                    {entry.tag}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg text-foreground">
                  {entry.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {entry.body}
                </p>
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: entry.author.color }}
                  >
                    {entry.author.avatar}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {entry.author.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{entry.author.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/docs#changelog"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:underline"
          >
            View full changelog
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
