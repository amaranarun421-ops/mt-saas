import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { BillingDashboard, type BillingRow } from "@/components/driftframe/billing-dashboard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin?callbackUrl=/dashboard/billing");

  let transactions: Array<{ id: string; amount: number; type: string; createdAt: Date }> = [];
  let purchases: Array<{
    id: string;
    stripePaymentIntentId: string | null;
    creditsPurchased: number;
    amountPaidCents: number;
    createdAt: Date;
  }> = [];

  try {
    [transactions, purchases] = await Promise.all([
      db.creditTransaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: { id: true, amount: true, type: true, createdAt: true },
      }),
      db.creditPurchase.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          stripePaymentIntentId: true,
          creditsPurchased: true,
          amountPaidCents: true,
          createdAt: true,
        },
      }),
    ]);
  } catch (error) {
    console.error("[driftframe billing] showcase fallback", error);
  }

  const purchaseByDate = new Map(purchases.map((p) => [p.createdAt.getTime(), p]));

  const rows: BillingRow[] = transactions.map((tx) => {
    const matchingPurchase = purchaseByDate.get(tx.createdAt.getTime());
    return {
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      createdAt: tx.createdAt.toISOString(),
      invoiceId: matchingPurchase?.stripePaymentIntentId ?? undefined,
      creditsPurchased: matchingPurchase?.creditsPurchased,
      amountPaidCents: matchingPurchase?.amountPaidCents,
    };
  });

  const purchaseRows: BillingRow[] = purchases.map((p) => ({
    id: p.id,
    type: "purchase",
    amount: p.creditsPurchased,
    createdAt: p.createdAt.toISOString(),
    invoiceId: p.stripePaymentIntentId ?? undefined,
    creditsPurchased: p.creditsPurchased,
    amountPaidCents: p.amountPaidCents,
  }));

  return <BillingDashboard initialTransactions={rows} initialPurchases={purchaseRows} />;
}
