/**
 * Lightweight auto-seed hook for the Driftframe demo user.
 *
 * Imported by server components that should "just work" even on a fresh DB
 * (signin page, gallery page). It runs the idempotent `ensureSeedUser()`
 * from prisma/seed.ts but never throws — if the DB is unreachable the page
 * still renders, signin just won't prefill anything.
 *
 * The check is a single indexed `findUnique` by email — cheap enough to
 * run on every page load.
 */
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const DEMO_EMAIL = "demo@driftframe.app";
const DEMO_PASSWORD = "demo1234";
const DEMO_NAME = "Demo Creator";
const DEMO_CREDITS = 100;

let cached: Promise<void> | null = null;

export function ensureSeedUser(): Promise<void> {
  if (!cached) {
    cached = (async () => {
      try {
        const existing = await db.user.findUnique({
          where: { email: DEMO_EMAIL },
          select: { id: true },
        });
        if (existing) return;

        const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
        const user = await db.user.create({
          data: {
            email: DEMO_EMAIL,
            passwordHash,
            name: DEMO_NAME,
            creditsRemaining: DEMO_CREDITS,
          },
        });
        await db.creditTransaction.create({
          data: {
            userId: user.id,
            amount: DEMO_CREDITS,
            type: "purchase",
          },
        });
        console.log(`[ensure-seed] created demo user ${DEMO_EMAIL}`);
      } catch (err) {
        // Swallow — the page should still render. The next call will retry.
        console.warn("[ensure-seed] failed:", err);
        cached = null;
      }
    })();
  }
  return cached;
}

export const DEMO_USER = {
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
  name: DEMO_NAME,
  credits: DEMO_CREDITS,
};
