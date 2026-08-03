"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GradientButton } from "./gradient-button";
import { CREDIT_PACKS, SUBSCRIPTION_PLAN } from "@/lib/constants";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BuyCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful purchase — parent can refetch history etc. */
  onPurchased?: () => void;
}

/**
 * Quick-access modal for buying credit packs + subscription.
 *
 * Posts to /api/credits/purchase which, in the demo, directly credits the
 * user (mock Stripe flow). In production this would redirect to a Stripe
 * Checkout Session URL.
 */
export function BuyCreditsModal({
  open,
  onOpenChange,
  onPurchased,
}: BuyCreditsModalProps) {
  const { update } = useSession();
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function buy(packId: "50" | "200" | "500" | "subscription") {
    setBusyId(packId);
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "purchase_failed");
      }
      // Refresh the session JWT so the credit pill updates immediately.
      await update();
      toast.success(
        packId === "subscription"
          ? "Subscribed! 300 credits added monthly."
          : "Credits added to your account.",
      );
      onPurchased?.();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Purchase failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="driftframe-glass max-w-2xl border-border p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-display text-2xl">
            Buy credits
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            One-time packs never expire. Or subscribe for monthly auto-refill.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 p-6 pt-2 sm:grid-cols-2">
          {CREDIT_PACKS.map((pack) => (
            <PackCard
              key={pack.id}
              title={`${pack.credits} credits`}
              price={pack.priceLabel}
              sub={pack.perCredit}
              highlight={pack.highlight}
              loading={busyId === pack.id}
              disabled={busyId !== null}
              onClick={() => buy(pack.id)}
            />
          ))}

          <PackCard
            title="Pro subscription"
            price={`${SUBSCRIPTION_PLAN.priceLabel}`}
            sub={`${SUBSCRIPTION_PLAN.period} · 300 credits / mo`}
            highlight
            loading={busyId === "subscription"}
            disabled={busyId !== null}
            onClick={() => buy("subscription")}
            className="sm:col-span-2"
          />
        </div>

        <p className="px-6 pb-6 text-center text-xs text-muted-foreground">
          Demo mode — no real payment is processed. The mock checkout credits
          your account instantly.
        </p>
      </DialogContent>
    </Dialog>
  );
}

function PackCard({
  title,
  price,
  sub,
  highlight,
  loading,
  disabled,
  onClick,
  className,
}: {
  title: string;
  price: string;
  sub: string;
  highlight?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-4 transition-all",
        highlight
          ? "border-transparent bg-card ring-2 ring-[#7c3aed]"
          : "border-border bg-card/60",
        className,
      )}
    >
      {highlight && (
        <span className="absolute -top-2 left-4 bg-[#7c3aed] inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white">
          <Check className="h-2.5 w-2.5" /> Popular
        </span>
      )}
      <div className="flex items-baseline justify-between">
        <span className="font-medium">{title}</span>
        <span className="font-display text-xl">{price}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      <GradientButton
        className="mt-3 w-full"
        onClick={onClick}
        loading={loading}
        disabled={disabled}
      >
        {highlight ? "Get started" : "Buy now"}
      </GradientButton>
    </div>
  );
}
