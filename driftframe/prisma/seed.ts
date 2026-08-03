/**
 * Idempotent test-user seeder for Driftframe.
 *
 * Creates `demo@driftframe.app` (password `demo1234`) with 100 credits if
 * it doesn't already exist, and seeds 3 public showcase images so the
 * /gallery page is never empty on a fresh DB.
 *
 * Safe to run multiple times — checks by email first.
 *
 * Run manually:  `bun run db:seed`
 * Auto-run:      `ensureSeedUser()` is called from the signin page server
 *                component on every visit (cheap — single indexed lookup).
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateSvgArt } from "../src/lib/ai/image-model";

const db = new PrismaClient();

const DEMO_EMAIL = "demo@driftframe.app";
const DEMO_PASSWORD = "demo1234";
const DEMO_NAME = "Demo Creator";
const DEMO_CREDITS = 100;

const SEED_IMAGES = [
  {
    prompt: "Bioluminescent jellyfish drifting over a neon city skyline at dusk",
    style: "photographic",
    seed: 9001,
    w: 768,
    h: 768,
  },
  {
    prompt: "Ancient forest cathedral with god rays piercing through morning mist",
    style: "painting",
    seed: 9002,
    w: 768,
    h: 768,
  },
  {
    prompt: "Cyberpunk samurai standing in the rain, reflective neon puddles",
    style: "anime",
    seed: 9003,
    w: 768,
    h: 768,
  },
];

export async function ensureSeedUser() {
  const existing = await db.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });
  if (existing) {
    // Already seeded — touch nothing. (Idempotent.)
    return existing.id;
  }

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
      type: "purchase", // free demo grant, recorded as a purchase-style gain
    },
  });

  // Seed 3 public showcase images so /gallery is never empty.
  for (const tile of SEED_IMAGES) {
    const url = generateSvgArt({
      prompt: tile.prompt,
      style: tile.style,
      seed: tile.seed,
      width: tile.w,
      height: tile.h,
    });
    const generation = await db.generation.create({
      data: {
        userId: user.id,
        prompt: tile.prompt,
        style: tile.style,
        aspectRatio: "1:1",
        status: "completed",
      },
    });
    await db.image.create({
      data: {
        generationId: generation.id,
        url,
        width: tile.w,
        height: tile.h,
        isPublic: true,
      },
    });
  }

  console.log(`[seed] created demo user ${DEMO_EMAIL} (${DEMO_CREDITS} credits) + 3 public images`);
  return user.id;
}

// When run directly via `bun run prisma/seed.ts`.
async function main() {
  try {
    await ensureSeedUser();
  } finally {
    await db.$disconnect();
  }
}

const isDirectRun =
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url === `file://${process.argv[1]}`;

if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
