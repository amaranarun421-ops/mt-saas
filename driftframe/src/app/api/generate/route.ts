import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { generateImages } from "@/lib/ai";
import {
  GENERATION_COST_CREDITS,
  GENERATION_BATCH_SIZE,
  STYLE_PRESETS,
  ASPECT_RATIOS,
} from "@/lib/constants";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

const GenerateSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters").max(2000),
  negativePrompt: z.string().max(500).optional().nullable(),
  style: z.enum(STYLE_PRESETS.map((s) => s.id) as [string, ...string[]]),
  aspectRatio: z.enum(ASPECT_RATIOS.map((a) => a.id) as [string, ...string[]]),
});

function makeDemoImage(prompt: string, style: string, aspectRatio: string, index: number) {
  const label = encodeURIComponent(`${style} ${aspectRatio} demo ${index + 1}`);
  const caption = encodeURIComponent(prompt.slice(0, 72));
  return {
    id: `demo-image-${index + 1}`,
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="%237c3aed"/><rect x="48" y="48" width="928" height="928" rx="40" fill="%231a1028" fill-opacity="0.22"/><text x="512" y="436" text-anchor="middle" fill="white" font-family="Arial" font-size="54" font-weight="700">Driftframe Demo</text><text x="512" y="520" text-anchor="middle" fill="white" font-family="Arial" font-size="32">${label}</text><text x="512" y="590" text-anchor="middle" fill="white" font-family="Arial" font-size="24">${caption}</text></svg>`,
    width: 1024,
    height: 1024,
    isFavorite: false,
    isPublic: false,
  };
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

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

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({
      generationId: `demo-generation-${Date.now()}`,
      images: Array.from({ length: GENERATION_BATCH_SIZE }, (_, index) =>
        makeDemoImage(prompt, style, aspectRatio, index),
      ),
      creditsRemaining: Math.max(0, (session.user.creditsRemaining ?? 100) - GENERATION_COST_CREDITS),
      showcase: true,
    });
  }

  const { db } = await import("@/lib/db");
  const userId = session.user.id;

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

  let images: { url: string; width: number; height: number }[];
  try {
    images = await generateImages(prompt, GENERATION_BATCH_SIZE, aspectRatio, style);
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
    creditsRemaining: user.creditsRemaining - GENERATION_COST_CREDITS,
  });
}
