import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

const schema = z.object({
  token: z.string().min(10),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[0-9]/, "Must include a number"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
      return NextResponse.json({
        ok: true,
        showcase: true,
        message: "Showcase mode active. Password reset is simulated only.",
      });
    }

    const { db } = await import("@/lib/db");
    const { token, password } = parsed.data;

    const reset = await db.passwordResetToken.findUnique({
      where: { token },
    });
    if (!reset || reset.used || reset.expires < new Date()) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired. Please request a new one." },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { email: reset.email },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { password: hashed },
      }),
      db.passwordResetToken.update({
        where: { id: reset.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[reset-password]", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

