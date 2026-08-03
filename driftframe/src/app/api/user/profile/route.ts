import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

const ProfileSchema = z.object({
  name: z.string().min(1).max(80).optional(),
});

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

  const name = parsed.data.name?.trim() || null;

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({
      id: session.user.id,
      name,
      email: session.user.email,
      showcase: true,
    });
  }

  const { db } = await import("@/lib/db");

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: { name },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json(updated);
}
