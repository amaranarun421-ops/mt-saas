import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import type { Provider } from 'next-auth/providers';

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
      const user = await db.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (!user || !user.password) return null;
      const valid = await bcrypt.compare(password, user.password);
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

// Conditionally add OAuth providers only when env vars are set
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
          // Prisma returns Date | null; coerce to boolean for the JWT.
          token.isEmailVerified = dbUser.emailVerified != null;
          token.firstName = dbUser.firstName ?? null;
          token.lastName = dbUser.lastName ?? null;
        }
      }
      // Refresh credit count on session resume for active users
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

      // Dashboard routes require both auth and verified email
      if (path.startsWith('/dashboard')) {
        if (!isAuthed) return false;
        if (!isEmailVerified) {
          return Response.redirect(
            new URL('/verify-email', request.nextUrl.origin)
          );
        }
        return true;
      }
      // Avoid showing signin/signup to already-authed users
      if (
        (path === '/signin' || path === '/signup') &&
        isAuthed &&
        isEmailVerified
      ) {
        return Response.redirect(
          new URL('/dashboard', request.nextUrl.origin)
        );
      }
      return true;
    },
  },
});
