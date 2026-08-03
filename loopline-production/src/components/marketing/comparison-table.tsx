"use client";

import { cn } from "@/lib/utils";
import { Check, Minus, X } from "lucide-react";

const TIERS = ["Free", "Pro", "Agency"];

const ROWS: { label: string; values: (string | boolean)[]; group?: string }[] = [
  { group: "Bots & conversations", label: "Bots", values: ["1", "5", "Unlimited"] },
  { label: "Conversations / month", values: ["50", "Unlimited", "Unlimited"] },
  { label: "Knowledge base upload", values: [true, true, true] },
  { label: "Streaming AI responses", values: [true, true, true] },
  { label: "Per-bot theming", values: [true, true, true] },
  { label: "Loopline branding in widget", values: [true, false, false] },

  { group: "Inbox & handoff", label: "Live conversation inbox", values: [true, true, true] },
  { label: "Human handoff", values: [false, true, true] },
  { label: "Two-pane inbox UI", values: [false, true, true] },
  { label: "Resolve conversations", values: [true, true, true] },

  { group: "Analytics", label: "Conversation volume (14 days)", values: [true, true, true] },
  { label: "Top questions", values: [false, true, true] },
  { label: "Resolution rate", values: [false, true, true] },
  { label: "Per-bot analytics breakdown", values: [false, true, true] },

  { group: "Billing", label: "Stripe Checkout", values: [false, true, true] },
  { label: "Customer portal", values: [false, true, true] },
  { label: "Usage gating", values: [true, true, true] },
  { label: "Workspace member seats", values: [false, false, true] },
  { label: "White-label widget", values: [false, false, true] },
  { label: "Priority support", values: [false, false, true] },
];

export function ComparisonTable() {
  return (
    <section className="bg-background section-padding">
      <div className="container-loopline-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">
            Compare plans
          </p>
          <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            Every feature, side by side.
          </h2>
          <p className="mt-4 text-muted-foreground">
            No hidden limits. What you see is what ships.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border">
          {/* Header row */}
          <div className="grid grid-cols-4 border-b border-border bg-muted/50">
            <div className="p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Feature
            </div>
            {TIERS.map((tier, i) => (
              <div
                key={tier}
                className={cn(
                  "p-4 text-center",
                  i === 1 && "bg-brand-50/50 dark:bg-brand-500/5",
                )}
              >
                <p className="font-display text-base text-foreground">{tier}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {i === 0 ? "$0" : i === 1 ? "$29/mo" : "$79/mo"}
                </p>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="divide-y divide-border bg-card">
            {ROWS.map((row, i) => (
              <div key={i}>
                {row.group && (
                  <div className="bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-300">
                    {row.group}
                  </div>
                )}
                <div className="grid grid-cols-4 items-center">
                  <div className="p-4 text-sm text-foreground">{row.label}</div>
                  {row.values.map((v, j) => (
                    <div
                      key={j}
                      className={cn(
                        "flex items-center justify-center p-4 text-sm",
                        j === 1 && "bg-brand-50/30 dark:bg-brand-500/5",
                      )}
                    >
                      {typeof v === "boolean" ? (
                        v ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint-500/15 text-mint-600">
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </span>
                        ) : (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <X className="h-3.5 w-3.5" />
                          </span>
                        )
                      ) : (
                        <span className="font-medium text-foreground">{v}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
