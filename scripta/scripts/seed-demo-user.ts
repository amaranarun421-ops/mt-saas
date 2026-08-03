// Seed a verified demo user so the Gumroad listing can be toured without
// going through signup + email verification each time.
//
// Demo credentials (also surfaced on the signin page):
//   email:    demo@scripta.app
//   password: scripta123
//
// Run with: bun run scripts/seed-demo-user.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  const email = 'demo@scripta.app';
  const password = 'scripta123';

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    // Re-verify + reset password in case the demo got into a weird state.
    const hashed = await bcrypt.hash(password, 12);
    await db.user.update({
      where: { id: existing.id },
      data: {
        password: hashed,
        emailVerified: new Date(),
        plan: 'free',
        creditsRemaining: 10,
        firstName: 'Demo',
        lastName: 'Writer',
        name: 'Demo Writer',
      },
    });
    console.log(`Demo user reset: ${email}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  await db.user.create({
    data: {
      email,
      password: hashed,
      firstName: 'Demo',
      lastName: 'Writer',
      name: 'Demo Writer',
      emailVerified: new Date(),
      plan: 'free',
      creditsRemaining: 10,
    },
  });
  console.log(`Demo user created: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
