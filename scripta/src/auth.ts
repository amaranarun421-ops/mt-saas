import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import type { Provider } from 'next-auth/providers';

const DEMO_USER = {
  email: (process.env.NEXT_PUBLIC_DEMO_EMAIL ?? 'demo@scripta.app').toLowerCase(),
  password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'scripta123',
  firstName: 'Demo',
  lastName: 'Writer',
  name: 'Demo Writer',
} as const;

async function ensureDemoUser() {
  const hashed = await bcrypt.hash(DEMO_USER.password, 12);
  const existing = await db.user.findUnique({ where: { email: DEMO_USER.email } });

  if (existing) {
    return db.user.update({
      where: { id: existing.id },
      data: {
        password: hashed,
        emailVerified: new Date(),
        plan: 'free',
        creditsRemaining: 10,
        firstName: DEMO_USER.firstName,
        lastName: DEMO_USER.lastName,
        name: DEMO_USER.name,
      },
    });
  }

  return db.user.create({
    data: {
      email: DEMO_USER.email,
      password: hashed,
      firstName: DEMO_USER.firstName,
      lastName: DEMO_USER.lastName,
      name: DEMO_USER.name,
      emailVerified: new Date(),
      plan: 'free',
      creditsRemaining: 10,
    },
  });
}

const providers: Provider[] = [
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const parsed = z
        .object({
          email: z.string().email(),
          password: z.string().min(1),
        })
        .safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });
      if (!parsed.success) return null;

      const { email, password } = parsed.data;
      const normalizedEmail = email.toLowerCase();
      const isDemoCredentials =
        normalizedEmail === DEMO_USER.email && password === DEMO_USER.password;

      const user = isDemoCredentials
        ? await ensureDemoUser()
        : await db.user.findUnique({ where: { email: normalizedEmail } });
      if (!user || !user.password) return null;

      const valid = isDemoCredentials
        ? true
        : await bcrypt.compare(password, user.password);
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        image: user.image ?? null,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/signin',
    verifyRequest: '/verify-email',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id!;
        const dbUser = await db.user.findUnique({
          where: { id: user.id! },
          select: {
            plan: true,
            creditsRemaining: true,
            emailVerified: true,
            firstName: true,
            lastName: true,
          },
        });
        if (dbUser) {
          token.plan = dbUser.plan;
          token.creditsRemaining = dbUser.creditsRemaining;
          token.isEmailVerified = dbUser.emailVerified != null;
          token.firstName = dbUser.firstName ?? null;
          token.lastName = dbUser.lastName ?? null;
        }
      }

      if (trigger === 'update') {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true, creditsRemaining: true },
        });
        if (dbUser) {
          token.plan = dbUser.plan;
          token.creditsRemaining = dbUser.creditsRemaining;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as string) ?? 'free';
        session.user.creditsRemaining = (token.creditsRemaining as number) ?? 0;
        session.user.isEmailVerified = (token.isEmailVerified as boolean) ?? false;
        session.user.firstName = (token.firstName as string | null) ?? null;
        session.user.lastName = (token.lastName as string | null) ?? null;
      }
      return session;
    },
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isAuthed = !!auth?.user;
      const isEmailVerified = !!auth?.user?.isEmailVerified;

      if (path.startsWith('/dashboard')) {
        if (!isAuthed) return false;
        if (!isEmailVerified) {
          return Response.redirect(new URL('/verify-email', request.nextUrl.origin));
        }
        return true;
      }

      if ((path === '/signin' || path === '/signup') && isAuthed && isEmailVerified) {
        return Response.redirect(new URL('/dashboard', request.nextUrl.origin));
      }
      return true;
    },
  },
});
