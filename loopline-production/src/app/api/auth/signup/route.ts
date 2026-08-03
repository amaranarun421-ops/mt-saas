import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().min(1).max(80),
  workspaceName: z.string().min(2).max(60),
  email: z.string().email(),
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
    const { name, workspaceName, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user + workspace + free subscription in one transaction
    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          name,
          password: hashedPassword,
        },
      });
      const ws = await tx.workspace.create({
        data: {
          name: workspaceName,
          ownerId: newUser.id,
          plan: "FREE",
        },
      });
      await tx.user.update({
        where: { id: newUser.id },
        data: { workspaceId: ws.id },
      });
      await tx.subscription.create({
        data: {
          workspaceId: ws.id,
          plan: "FREE",
          status: "ACTIVE",
        },
      });
      return newUser;
    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (e: any) {
    console.error("[signup]", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
