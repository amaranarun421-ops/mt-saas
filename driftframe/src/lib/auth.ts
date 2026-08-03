import type { NextAuthOptions, Provider } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

/**
 * NextAuth v4 configuration for Driftframe.
 *
 * - PrismaAdapter persists sessions/accounts to the database.
 * - CredentialsProvider does email/password auth against User.passwordHash.
 * - OAuth providers (Google / GitHub) are added conditionally — if the
 *   matching env var is set, the provider is enabled; otherwise the demo
 *   runs credentials-only. Adding `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
 *   to `.env` instantly enables the "Continue with Google" button.
 *
 * OAuth users land without a `creditsRemaining` row until they sign in for
 * the first time — the `jwt` callback hydrates a default of 10 free credits
 * if the user was just created via OAuth (mirroring the email/password
 * signup flow).
 */

// Build the providers array conditionally so the demo runs without OAuth
// keys, but adding them to .env instantly enables the buttons.
const providers: Provider[] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = await db.user.findUnique({
        where: { email: credentials.email.toLowerCase().trim() },
      });
      if (!user || !user.passwordHash) return null;

      const valid = await bcrypt.compare(
        credentials.password,
        user.passwordHash,
      );
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        image: user.image ?? undefined,
      } as any;
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    // Use JWT-based sessions so getServerSession works without an extra DB hit
    // and the credentials provider can attach the user id + credits.
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        // First-time OAuth sign-in: the user was just created by the
        // PrismaAdapter with the default `creditsRemaining: 10` from the
        // schema. Hydrate from DB so the pill renders correctly.
        const dbUser = await db.user.findUnique({
          where: { id: (user as any).id },
          select: { creditsRemaining: true },
        });
        token.creditsRemaining = dbUser?.creditsRemaining ?? 0;
      } else if (token.id) {
        // Refresh credits on subsequent JWTs so the pill stays fresh.
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { creditsRemaining: true },
        });
        token.creditsRemaining = dbUser?.creditsRemaining ?? token.creditsRemaining;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).creditsRemaining = token.creditsRemaining;
      }
      return session;
    },
  },
};

export type AppSession = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    creditsRemaining: number;
  };
} | null;
