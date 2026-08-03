'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';

/**
 * Polls the credit balance client-side and surfaces a single source of
 * truth to the dashboard shell. On first render it shows the server-provided
 * seed; thereafter it polls `/api/user/credits` every 15s (and on focus).
 */
export function useCreditBadge(initialCredits: number, initialPlan: string) {
  const { data: session, update } = useSession();
  const [credits, setCredits] = React.useState(initialCredits);
  const [plan, setPlan] = React.useState(initialPlan);

  // Keep in sync with the session (server-side refresh)
  React.useEffect(() => {
    if (session?.user?.creditsRemaining !== undefined) {
      setCredits(session.user.creditsRemaining);
    }
    if (session?.user?.plan) {
      setPlan(session.user.plan);
    }
  }, [session?.user?.creditsRemaining, session?.user?.plan]);

  // Light polling — every 15s while the page is visible
  React.useEffect(() => {
    let cancelled = false;
    async function fetchCredits() {
      try {
        const res = await fetch('/api/user/credits');
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setCredits(data.creditsRemaining);
        setPlan(data.plan);
        // Refresh the JWT-encoded values too, so other tabs see them
        if (data.creditsRemaining !== session?.user?.creditsRemaining) {
          update?.().catch(() => {});
        }
      } catch {
        // silent
      }
    }
    const id = setInterval(fetchCredits, 15_000);
    document.addEventListener('visibilitychange', fetchCredits);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', fetchCredits);
    };
  }, [session?.user?.creditsRemaining, update]);

  return { credits, plan };
}
