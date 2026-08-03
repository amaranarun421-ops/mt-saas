import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const ProfileSchema = z.object({
  name: z.string().min(1).max(80).optional(),
});

/** PATCH /api/user/profile — update the signed-in user's display name. */
export async function PATCH(req: Request) {
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
  const parsed = ProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name?.trim() || null },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json(updated);
}
