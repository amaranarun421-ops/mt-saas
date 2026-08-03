import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateImages } from "@/lib/ai";
import {
  GENERATION_COST_CREDITS,
  GENERATION_BATCH_SIZE,
  STYLE_PRESETS,
  ASPECT_RATIOS,
} from "@/lib/constants";

const GenerateSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters").max(2000),
  negativePrompt: z.string().max(500).optional().nullable(),
  style: z.enum(STYLE_PRESETS.map((s) => s.id) as [string, ...string[]]),
  aspectRatio: z.enum(ASPECT_RATIOS.map((a) => a.id) as [string, ...string[]]),
});

/**
 * POST /api/generate
 *
 * 1. Auth check (401 if no session).
 * 2. Credit check (402 insufficient_credits if balance < 4).
 * 3. Create Generation row with status=pending.
 * 4. Call generateImages(prompt, 4, aspectRatio, style).
 * 5. Create 4 Image rows with returned URLs.
 * 6. Create CreditTransaction (amount: -4, type: generation_spend).
 * 7. Decrement user.creditsRemaining by 4.
 * 8. Update Generation status=completed.
 * 9. Return { generationId, images }.
 *
 * CRITICAL: if step 4 fails, do NOT deduct credits — return 500 and leave
 * status=failed.
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = GenerateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { prompt, negativePrompt, style, aspectRatio } = parsed.data;

  // Snapshot the user's current credits (avoid race by reading inside tx-ish flow).
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { creditsRemaining: true },
  });
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (user.creditsRemaining < GENERATION_COST_CREDITS) {
    return NextResponse.json(
      { error: "insufficient_credits", required: GENERATION_COST_CREDITS, balance: user.creditsRemaining },
      { status: 402 },
    );
  }

  // Create the Generation row (pending) BEFORE calling the model.
  const generation = await db.generation.create({
    data: {
      userId,
      prompt,
      negativePrompt: negativePrompt || null,
      style,
      aspectRatio,
      status: "pending",
    },
  });

  // Call the image model. If this fails, mark the generation failed and
  // bail out WITHOUT deducting credits.
  let images: { url: string; width: number; height: number }[];
  try {
    images = await generateImages(
      prompt,
      GENERATION_BATCH_SIZE,
      aspectRatio,
      style,
    );
  } catch (err) {
    await db.generation.update({
      where: { id: generation.id },
      data: { status: "failed" },
    });
    console.error("[generate] image model failed", err);
    return NextResponse.json(
      { error: "generation_failed", generationId: generation.id },
      { status: 500 },
    );
  }

  // Persist the image rows.
  const created = await Promise.all(
    images.map((img) =>
      db.image.create({
        data: {
          generationId: generation.id,
          url: img.url,
          width: img.width,
          height: img.height,
        },
      }),
    ),
  );

  // Deduct credits + record the transaction. Wrapped in a transaction so
  // the two writes are atomic.
  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { creditsRemaining: { decrement: GENERATION_COST_CREDITS } },
    }),
    db.creditTransaction.create({
      data: {
        userId,
        amount: -GENERATION_COST_CREDITS,
        type: "generation_spend",
      },
    }),
    db.generation.update({
      where: { id: generation.id },
      data: { status: "completed" },
    }),
  ]);

  return NextResponse.json({
    generationId: generation.id,
    images: created.map((img) => ({
      id: img.id,
      url: img.url,
      width: img.width,
      height: img.height,
      isFavorite: img.isFavorite,
      isPublic: img.isPublic,
    })),
    creditsRemaining:
      user.creditsRemaining - GENERATION_COST_CREDITS,
  });
}
