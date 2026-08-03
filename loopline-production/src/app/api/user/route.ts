import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

const patchSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: parsed.data.name,
      },
      showcase: true,
    });
  }

  const { db } = await import("@/lib/db");
  const user = await db.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  });
  return NextResponse.json({ user });
}