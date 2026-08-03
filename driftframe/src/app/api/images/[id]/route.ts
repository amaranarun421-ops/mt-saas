import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const PatchSchema = z.object({
  favorite: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

/**
 * PATCH /api/images/[id]
 *
 * Updates an image's `isFavorite` and/or `isPublic` flags. Only the owner
 * of the image's generation may mutate it.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Find the image and verify ownership via the generation's userId.
  const image = await db.image.findUnique({
    where: { id },
    select: { id: true, generation: { select: { userId: true } } },
  });
  if (!image) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (image.generation.userId !== session.user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const data: { isFavorite?: boolean; isPublic?: boolean } = {};
  if (parsed.data.favorite !== undefined) data.isFavorite = parsed.data.favorite;
  if (parsed.data.isPublic !== undefined) data.isPublic = parsed.data.isPublic;

  const updated = await db.image.update({
    where: { id },
    data,
    select: { id: true, isFavorite: true, isPublic: true },
  });

  return NextResponse.json(updated);
}

/**
 * GET /api/images/[id]
 *
 * Returns a single image with its parent generation's prompt/style/etc.
 * Used by the lightbox detail panel. Returns 403 for private images owned
 * by someone else.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  const image = await db.image.findUnique({
    where: { id },
    select: {
      id: true,
      url: true,
      width: true,
      height: true,
      isFavorite: true,
      isPublic: true,
      createdAt: true,
      generation: {
        select: {
          prompt: true,
          negativePrompt: true,
          style: true,
          aspectRatio: true,
          userId: true,
        },
      },
    },
  });

  if (!image) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const isOwner = image.generation.userId === session?.user?.id;
  if (!image.isPublic && !isOwner) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    id: image.id,
    url: image.url,
    width: image.width,
    height: image.height,
    isFavorite: image.isFavorite,
    isPublic: image.isPublic,
    prompt: image.generation.prompt,
    negativePrompt: image.generation.negativePrompt,
    style: image.generation.style,
    aspectRatio: image.generation.aspectRatio,
    isOwner,
  });
}
