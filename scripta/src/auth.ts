import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { Provider } from 'next-auth/providers';

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== '0';
const AUTH_SECRET_FALLBACK = 'showcase-demo-secret-not-for-production';

const DEMO_USER = {
  id: 'demo-user',
  email: (process.env.NEXT_PUBLIC_DEMO_EMAIL ?? 'demo@scripta.app').toLowerCase(),
  password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'scripta123',
  firstName: 'Demo',
  lastName: 'Writer',
  name: 'Demo Writer',
  plan: 'free',
  creditsRemaining: 10,
} as const;

function createDemoSessionUser() {
  return {
    id: DEMO_USER.id,
    email: DEMO_USER.email,
    name: DEMO_USER.name,
    image: null,
  };
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
      if (email.toLowerCase() === DEMO_USER.email && password === DEMO_USER.password) {
        return createDemoSessionUser();
      }

      return null;
    },
  }),
];

if (!SHOWCASE_MODE && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (!SHOWCASE_MODE && process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: 'jwt' },
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? AUTH_SECRET_FALLBACK,
  pages: {
    signIn: '/signin',
    verifyRequest: '/verify-email',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        if (user.email?.toLowerCase() === DEMO_USER.email) {
          token.plan = DEMO_USER.plan;
          token.creditsRemaining = DEMO_USER.creditsRemaining;
          token.isEmailVerified = true;
          token.firstName = DEMO_USER.firstName;
          token.lastName = DEMO_USER.lastName;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? DEMO_USER.id;
        session.user.plan = (token.plan as string) ?? DEMO_USER.plan;
        session.user.creditsRemaining = (token.creditsRemaining as number) ?? DEMO_USER.creditsRemaining;
        session.user.isEmailVerified = (token.isEmailVerified as boolean) ?? true;
        session.user.firstName = (token.firstName as string | null) ?? DEMO_USER.firstName;
        session.user.lastName = (token.lastName as string | null) ?? DEMO_USER.lastName;
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
