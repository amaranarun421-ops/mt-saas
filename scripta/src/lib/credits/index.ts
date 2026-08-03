import { db } from '@/lib/db';
import { auth } from '@/auth';

const FREE_MONTHLY_CREDITS = 10;
export const PRO_PLAN = 'pro';
export const FREE_PLAN = 'free';

/**
 * Deducts a single generation credit from the user.
 * Pro users are unlimited — we still increment a counter so they can see usage,
 * but the deduction never blocks generation.
 *
 * Returns { ok, remaining } so the caller can surface the new balance.
 */
export async function deductCredit(userId: string): Promise<{
  ok: boolean;
  remaining: number;
  reason?: 'no-credits' | 'no-user' | 'error';
}> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true, creditsRemaining: true },
    });
    if (!user) return { ok: false, remaining: 0, reason: 'no-user' };

    if (user.plan === PRO_PLAN) {
      // Unlimited — bump the counter but never block
      const updated = await db.user.update({
        where: { id: userId },
        data: { creditsRemaining: Math.max(0, user.creditsRemaining - 1) },
        select: { creditsRemaining: true },
      });
      return { ok: true, remaining: updated.creditsRemaining };
    }

    if (user.creditsRemaining <= 0) {
      return { ok: false, remaining: 0, reason: 'no-credits' };
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { creditsRemaining: user.creditsRemaining - 1 },
      select: { creditsRemaining: true },
    });
    return { ok: true, remaining: updated.creditsRemaining };
  } catch (err) {
    console.error('[credits] deductCredit error', err);
    return { ok: false, remaining: 0, reason: 'error' };
  }
}

/** Called by a scheduled job or the user's first request of the month. */
export async function maybeRefreshMonthlyCredits(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true, creditsRemaining: true, updatedAt: true },
  });
  if (!user) return;
  if (user.plan === PRO_PLAN) return;

  const now = new Date();
  const last = user.updatedAt;
  // If we crossed a calendar month since the last credit refresh, top up.
  if (
    last.getFullYear() !== now.getFullYear() ||
    last.getMonth() !== now.getMonth()
  ) {
    await db.user.update({
      where: { id: userId },
      data: { creditsRemaining: FREE_MONTHLY_CREDITS },
    });
  }
}

export async function getCurrentUserCredits(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { creditsRemaining: true },
  });
  return user?.creditsRemaining ?? 0;
}

export const FREE_MONTHLY_LIMIT = FREE_MONTHLY_CREDITS;
