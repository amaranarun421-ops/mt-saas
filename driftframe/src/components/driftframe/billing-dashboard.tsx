"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Download,
  Receipt,
  Filter,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassPanel } from "@/components/driftframe/glass-panel";
import { cn } from "@/lib/utils";
import { formatCreditAmount } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/format";

export interface BillingRow {
  id: string;
  type: string;
  amount: number;
  createdAt: string;
  invoiceId?: string;
  creditsPurchased?: number;
  amountPaidCents?: number;
}

interface BillingDashboardProps {
  initialTransactions: BillingRow[];
  initialPurchases: BillingRow[];
}

const TYPE_LABELS: Record<string, string> = {
  purchase: "Credit pack",
  generation_spend: "Generation",
  refund: "Refund",
  subscription_refill: "Subscription refill",
};

export function BillingDashboard({
  initialTransactions,
  initialPurchases,
}: BillingDashboardProps) {
  const [filter, setFilter] = React.useState("all");
  const [downloading, setDownloading] = React.useState<string | null>(null);

  const filtered = initialTransactions.filter((tx) => {
    if (filter === "all") return true;
    if (filter === "purchases") return tx.type === "purchase" || tx.type === "subscription_refill";
    if (filter === "spend") return tx.type === "generation_spend";
    if (filter === "refunds") return tx.type === "refund";
    return true;
  });

  function downloadInvoice(tx: BillingRow) {
    setDownloading(tx.id);
    setTimeout(() => {
      const lines = [
        "DRIFTFRAME",
        "https://driftframe.app",
        "",
        `Invoice: ${tx.invoiceId ?? tx.id}`,
        `Date: ${formatDateTime(tx.createdAt)}`,
        `Type: ${TYPE_LABELS[tx.type] ?? tx.type}`,
        tx.creditsPurchased ? `Credits: ${tx.creditsPurchased}` : null,
        tx.amountPaidCents ? `Amount: $${(tx.amountPaidCents / 100).toFixed(2)} USD` : null,
        "",
        "Thanks for your purchase.",
        "This is a mock invoice generated for demo purposes.",
      ].filter(Boolean);
      const blob = new Blob([lines.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `driftframe-invoice-${tx.invoiceId ?? tx.id}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDownloading(null);
      toast.success("Invoice downloaded.");
    }, 500);
  }

  const totalPurchased = initialPurchases.reduce((sum, tx) => sum + (tx.creditsPurchased ?? 0), 0);
  const totalSpent = initialPurchases.reduce((sum, tx) => sum + (tx.amountPaidCents ?? 0), 0);

  return (
    <div className="driftframe-container-wide space-y-6 py-6">
      <div>
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-[#7c3aed]" />
          <h1 className="font-display text-2xl font-semibold tracking-tight">Billing</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Every credit transaction, every purchase. Download mock invoices for your records.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <GlassPanel>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Total credits purchased</p>
          <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{totalPurchased}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Total spent</p>
          <p className="mt-1 font-display text-3xl font-semibold tabular-nums">${(totalSpent / 100).toFixed(2)}</p>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Transactions</p>
          <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{initialTransactions.length}</p>
        </GlassPanel>
      </div>

      <GlassPanel padded={false} className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Transaction history</span>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All transactions</SelectItem>
              <SelectItem value="purchases">Purchases only</SelectItem>
              <SelectItem value="spend">Generation spend</SelectItem>
              <SelectItem value="refunds">Refunds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No transactions match this filter.
          </div>
        ) : (
          <div className="driftframe-scroll overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Invoice</th>
                  <th className="px-4 py-3 text-right font-medium">Credits</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-right font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((tx) => {
                  const isPurchase = tx.type === "purchase" || tx.type === "subscription_refill";
                  return (
                    <tr key={tx.id} className="hover:bg-muted/20">
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(tx.createdAt)}</td>
                      <td className="px-4 py-3">{TYPE_LABELS[tx.type] ?? tx.type}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{tx.invoiceId ?? "-"}</td>
                      <td
                        className={cn(
                          "px-4 py-3 text-right font-medium tabular-nums",
                          tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
                        )}
                      >
                        {formatCreditAmount(tx.amount)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                        {tx.amountPaidCents ? `$${(tx.amountPaidCents / 100).toFixed(2)}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-xs">
                          {isPurchase ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400">Paid</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">-</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isPurchase ? (
                          <button
                            type="button"
                            onClick={() => downloadInvoice(tx)}
                            disabled={downloading === tx.id}
                            className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/60 disabled:opacity-50"
                          >
                            {downloading === tx.id ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3" />
                            )}
                            Download
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>

      <p className="text-center text-xs text-muted-foreground">
        Demo mode - invoices are mock text files. Wire Stripe webhook in production to issue real PDF invoices.
      </p>
    </div>
  );
}