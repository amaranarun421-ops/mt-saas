import { NextResponse } from "next/server";
import { z } from "zod";
import { generateToken } from "@/lib/utils";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 },
      );
    }
    const email = parsed.data.email.toLowerCase().trim();

    if (SHOWCASE_MODE || !process.env.DATABASE_URL) {
      return NextResponse.json({
        ok: true,
        showcase: true,
        message: "Showcase mode active. No reset email is sent.",
      });
    }

    const { db } = await import("@/lib/db");

    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (user) {
      await db.passwordResetToken.updateMany({
        where: { email, used: false },
        data: { used: true },
      });

      const token = generateToken(40);
      const expires = new Date(Date.now() + 30 * 60 * 1000);
      await db.passwordResetToken.create({
        data: { email, token, expires },
      });

      const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;
      if (process.env.NODE_ENV !== "production") {
        console.log("[forgot-password] reset link:", resetUrl);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[forgot-password]", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

