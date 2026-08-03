import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { SIGNUP_FREE_CREDITS } from "@/lib/constants";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(80).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
    return NextResponse.json({
      ok: true,
      showcase: true,
      message: "Showcase mode active. Use the demo account to sign in.",
      demoEmail: "demo@driftframe.app",
    });
  }

  const { db } = await import("@/lib/db");
  const { email, password, name } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await db.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "email_taken" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      name: name?.trim() || null,
      creditsRemaining: SIGNUP_FREE_CREDITS,
    },
  });

  await db.creditTransaction.create({
    data: {
      userId: user.id,
      amount: SIGNUP_FREE_CREDITS,
      type: "purchase",
    },
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
