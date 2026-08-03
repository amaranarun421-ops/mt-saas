"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2, CreditCard, ExternalLink, AlertCircle } from "lucide-react";
import { PLANS, type UsageState } from "@/lib/billing";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import type { Plan, SubscriptionStatus } from "@prisma/client";

interface Props {
  currentPlan: Plan;
  usage: UsageState;
  botCount: number;
  monthConvoCount: number;
  subscription: {
    status: SubscriptionStatus;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
  stripeConfigured: boolean;
}

export function BillingClient({
  currentPlan,
  usage,
  botCount,
  monthConvoCount,
  subscription,
  stripeConfigured,
}: Props) {
  const [upgrading, setUpgrading] = useState<Plan | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("upgraded=1")) {
      toast.success("Plan upgraded successfully!");
      window.history.replaceState({}, "", "/dashboard/billing");
    }
  }, []);

  async function onUpgrade(plan: Plan) {
    if (plan === currentPlan) return;
    setUpgrading(plan);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Checkout failed");
        setUpgrading(null);
        return;
      }
      // Redirect to Stripe Checkout (or simulated success URL)
      window.location.href = json.url;
    } catch (e) {
      toast.error("Checkout failed");
      setUpgrading(null);
    }
  }

  async function onPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Portal unavailable");
        setPortalLoading(false);
        return;
      }
      if (json.simulated) {
        toast.info("Stripe not configured — managing plan from this page.");
        setPortalLoading(false);
      } else {
        window.location.href = json.url;
      }
    } catch (e) {
      toast.error("Portal failed");
      setPortalLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Current plan summary */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Current plan
            </p>
            <p className="mt-1 font-display text-3xl text-foreground">
              {PLANS[currentPlan].name}
            </p>
            <p className="text-sm text-muted-foreground">
              {PLANS[currentPlan].priceMonthly === 0
                ? "Free forever"
                : `$${PLANS[currentPlan].priceMonthly}/month`}
            </p>
            {subscription?.currentPeriodEnd && (
              <p className="mt-2 text-xs text-muted-foreground">
                {subscription.cancelAtPeriodEnd
                  ? `Cancels on ${formatDate(subscription.currentPeriodEnd)}`
                  : `Renews on ${formatDate(subscription.currentPeriodEnd)}`}
              </p>
            )}
            {subscription?.status === "PAST_DUE" && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                <AlertCircle className="h-3 w-3" />
                Payment past due — update in portal
              </p>
            )}
          </div>
          {currentPlan !== "FREE" && (
            <Button variant="outline" onClick={onPortal} disabled={portalLoading}>
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Manage subscription
            </Button>
          )}
        </div>

        {/* Usage bars */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <UsageBar
            label="Bots"
            used={botCount}
            limit={usage.limit.bots}
          />
          <UsageBar
            label="Conversations this month"
            used={monthConvoCount}
            limit={usage.limit.conversations}
          />
        </div>
      </Card>

      {!stripeConfigured && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-amber-900 dark:text-amber-200">
                Simulated billing mode
              </p>
              <p className="mt-0.5 text-amber-700 dark:text-amber-300">
                Stripe isn&apos;t configured. Upgrades complete instantly without
                real payment — perfect for local dev and template demos. Add{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-500/20">
                  STRIPE_SECRET_KEY
                </code>{" "}
                and{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-500/20">
                  STRIPE_WEBHOOK_SECRET
                </code>{" "}
                to your .env to go live.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div>
        <h2 className="font-display text-xl text-foreground">Available plans</h2>
        <p className="text-sm text-muted-foreground">Upgrade or downgrade anytime.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {(Object.values(PLANS) as typeof PLANS[Plan][]).map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const isUpgrade = PLANS[plan.id].priceMonthly! > PLANS[currentPlan].priceMonthly!;
          return (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col p-6 transition",
                plan.highlight && !isCurrent
                  ? "border-brand-500 shadow-[var(--shadow-lift)]"
                  : "border-border",
                isCurrent && "ring-2 ring-brand-500/40",
              )}
            >
              {plan.highlight && !isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white shadow-[var(--shadow-soft)]">
                  Most popular
                </span>
              )}
              {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-mint-500 px-3 py-1 text-xs font-semibold text-white shadow-[var(--shadow-soft)]">
                  Current plan
                </span>
              )}

              <h3 className="font-display text-2xl text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl text-foreground">${plan.priceMonthly}</span>
                <span className="text-sm text-muted-foreground">
                  {plan.priceMonthly === 0 ? "/ forever" : "/ month"}
                </span>
              </div>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                        plan.highlight
                          ? "bg-brand-500 text-white"
                          : "bg-mint-500/15 text-mint-600",
                      )}
                    >
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="mt-6 w-full"
                variant={isCurrent ? "outline" : plan.highlight ? "default" : "outline"}
                disabled={isCurrent || upgrading !== null}
                onClick={() => onUpgrade(plan.id)}
              >
                {upgrading === plan.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirecting…
                  </>
                ) : isCurrent ? (
                  "Current plan"
                ) : isUpgrade ? (
                  `Upgrade to ${plan.name}`
                ) : (
                  `Switch to ${plan.name}`
                )}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | null;
}) {
  const pct = limit === null ? 0 : Math.min(100, (used / limit) * 100);
  const isWarning = limit !== null && used >= limit * 0.8;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {used} / {limit === null ? "∞" : limit}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isWarning ? "bg-amber-500" : "bg-brand-500",
          )}
          style={{ width: limit === null ? "100%" : `${pct}%` }}
        />
      </div>
      {limit !== null && isWarning && (
        <p className="mt-1 text-xs text-amber-600">
          Approaching limit — consider upgrading.
        </p>
      )}
    </div>
  );
}
