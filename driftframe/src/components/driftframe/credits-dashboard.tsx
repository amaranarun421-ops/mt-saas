"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Check, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { GradientButton } from "@/components/driftframe/gradient-button";
import {
  CREDIT_PACKS,
  SUBSCRIPTION_PLAN,
  formatCreditAmount,
} from "@/lib/constants";
import { formatDate } from "@/lib/format";

export interface TransactionRow {
  id: string;
  amount: number;
  type: string;
  createdAt: string;
}

interface CreditsDashboardProps {
  initialTransactions: TransactionRow[];
  hasActiveSubscription: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  purchase: "Credit pack",
  generation_spend: "Generation",
  refund: "Refund",
  subscription_refill: "Subscription refill",
};

export function CreditsDashboard({
  initialTransactions,
  hasActiveSubscription,
}: CreditsDashboardProps) {
  const { data: session, update } = useSession();
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [transactions, setTransactions] =
    React.useState<TransactionRow[]>(initialTransactions);
  const [subscribed, setSubscribed] = React.useState(hasActiveSubscription);

  const credits = session?.user?.creditsRemaining ?? 0;

  async function buy(packId: "50" | "200" | "500" | "subscription") {
    setBusyId(packId);
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "purchase_failed");
      await update();
      // Optimistically prepend a transaction row.
      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          amount: data.creditsAdded,
          type:
            packId === "subscription" ? "subscription_refill" : "purchase",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      if (packId === "subscription") setSubscribed(true);
      toast.success(
        packId === "subscription"
          ? "Subscribed! 300 credits added monthly."
          : `${data.creditsAdded} credits added.`,
      );
    } catch (e: any) {
      toast.error(e.message || "Purchase failed.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="driftframe-container-wide py-8">
      {/* Balance header */}
      <GlassPanel className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Credits remaining</p>
          <p className="font-display text-5xl font-semibold tabular-nums">
            {credits}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
              subscribed
                ? "bg-[#7c3aed] text-white"
                : "bg-muted text-muted-foreground",
            )}
          >
            {subscribed ? <Check className="h-3 w-3" /> : <RefreshCw className="h-3 w-3" />}
            {subscribed ? "Pro subscription active" : "No subscription"}
          </span>
        </div>
      </GlassPanel>

      <h2 className="mb-4 font-display text-2xl">Credit packs</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CREDIT_PACKS.map((pack) => (
          <GlassPanel
            key={pack.id}
            className={`relative flex flex-col ${pack.highlight ? "ring-2 ring-[#7c3aed]" : ""}`}
          >
            {pack.highlight && (
              <span className="absolute -top-2.5 left-6 bg-[#7c3aed] inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white">
                <Sparkles className="h-2.5 w-2.5" /> Most popular
              </span>
            )}
            <p className="text-sm text-muted-foreground">
              {pack.credits} credits
            </p>
            <p className="mt-1 font-display text-3xl font-semibold">
              {pack.priceLabel}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{pack.perCredit}</p>
            <div className="mt-auto pt-4">
              <GradientButton
                className="w-full"
                onClick={() => buy(pack.id)}
                loading={busyId === pack.id}
                disabled={busyId !== null}
              >
                Buy now
              </GradientButton>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Subscription */}
      <h2 className="mb-4 mt-10 font-display text-2xl">Subscription</h2>
      <GlassPanel className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <p className="font-display text-2xl font-semibold">
            Pro · {SUBSCRIPTION_PLAN.priceLabel}
            <span className="text-base font-normal text-muted-foreground">
              {" "}/ {SUBSCRIPTION_PLAN.period.replace("per ", "")}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Auto-refills {SUBSCRIPTION_PLAN.credits} credits every month.
            Cancel anytime.
          </p>
        </div>
        <GradientButton
          onClick={() => buy("subscription")}
          loading={busyId === "subscription"}
          disabled={busyId !== null || subscribed}
          variant={subscribed ? "glass" : "gradient"}
        >
          {subscribed ? "Active" : "Subscribe"}
        </GradientButton>
      </GlassPanel>

      {/* Transaction history */}
      <h2 className="mb-4 mt-10 font-display text-2xl">Transaction history</h2>
      {transactions.length === 0 ? (
        <GlassPanel className="text-center text-sm text-muted-foreground">
          No transactions yet. Buy a credit pack to get started.
        </GlassPanel>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 text-right font-medium">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(tx.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {TYPE_LABELS[tx.type] ?? tx.type}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right font-medium tabular-nums",
                      tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
                    )}
                  >
                    {formatCreditAmount(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Demo mode — no real payment is processed. The mock checkout credits
        your account instantly.
      </p>
    </div>
  );
}
