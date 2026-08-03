import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreditsDashboard, type TransactionRow } from "@/components/driftframe/credits-dashboard";
import { redirect } from "next/navigation";

export default async function CreditsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin?callbackUrl=/dashboard/credits");

  let transactions: Array<{ id: string; amount: number; type: string; createdAt: Date }> = [];
  let subscription: { id: string } | null = null;

  try {
    [transactions, subscription] = await Promise.all([
      db.creditTransaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: { id: true, amount: true, type: true, createdAt: true },
      }),
      db.subscription.findFirst({
        where: { userId: session.user.id, status: "active" },
        select: { id: true },
      }),
    ]);
  } catch (error) {
    console.error("[driftframe credits] showcase fallback", error);
  }

  const rows: TransactionRow[] = transactions.map((t) => ({
    id: t.id,
    amount: t.amount,
    type: t.type,
    createdAt: t.createdAt.toISOString(),
  }));

  return <CreditsDashboard initialTransactions={rows} hasActiveSubscription={!!subscription} />;
}
