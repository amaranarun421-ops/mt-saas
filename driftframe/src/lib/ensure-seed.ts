/**
 * Lightweight auto-seed hook for the Driftframe demo user.
 *
 * In showcase deployments we do not require a live database, so this helper
 * quietly no-ops when DATABASE_URL is missing.
 */
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const DEMO_EMAIL = "demo@driftframe.app";
const DEMO_PASSWORD = "demo1234";
const DEMO_NAME = "Demo Creator";
const DEMO_CREDITS = 100;

let cached: Promise<void> | null = null;

export function ensureSeedUser(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    return Promise.resolve();
  }

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
        console.log("[ensure-seed] created demo user " + DEMO_EMAIL);
      } catch (err) {
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
