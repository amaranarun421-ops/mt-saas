import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/utils";

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

    // Always return 200 — don't leak whether the email exists
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (user) {
      // Invalidate previous unused tokens for this email
      await db.passwordResetToken.updateMany({
        where: { email, used: false },
        data: { used: true },
      });

      const token = generateToken(40);
      const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 min
      await db.passwordResetToken.create({
        data: { email, token, expires },
      });

      // In production, send via email. For local dev, log the link.
      const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;
      if (process.env.NODE_ENV !== "production") {
        console.log("[forgot-password] reset link:", resetUrl);
      }
      // TODO: wire to a real email provider (Resend, SendGrid, etc.)
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[forgot-password]", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
