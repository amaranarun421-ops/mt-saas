// NextAuth v4 config — credentials provider with bcrypt + Prisma adapter.
// Signup creates a workspace automatically (workspace-name field on the form).

import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  // Trust the host from the request headers so NextAuth works behind
  // reverse proxies (Caddy, Vercel, preview gateways) without needing
  // a hardcoded NEXTAUTH_URL. This sets the cookie domain correctly for
  // whatever origin the user is actually visiting from.
  trustHost: true,
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const email = creds.email.toLowerCase().trim();
        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            image: true,
            workspaceId: true,
          },
        });
        if (!user || !user.password) return null;

        const ok = await bcrypt.compare(creds.password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          workspaceId: user.workspaceId ?? undefined,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error — workspaceId is added by our credentials provider
        token.workspaceId = user.workspaceId;
      }
      // Re-sync workspaceId from DB if missing (e.g. OAuth first-login flow)
      if (!token.workspaceId && token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: { workspaceId: true, id: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.workspaceId = dbUser.workspaceId ?? undefined;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // @ts-expect-error — workspaceId lives on token
        session.user.workspaceId = token.workspaceId as string | undefined;
      }
      return session;
    },
  },
  events: {
    // For OAuth first-login (no signup form), auto-create a workspace
    // named after the user, so they can start managing bots immediately.
    async createUser({ user }) {
      if (!user.id || !user.email) return;
      const existing = await db.user.findUnique({
        where: { id: user.id },
        select: { workspaceId: true },
      });
      if (existing?.workspaceId) return;
      const ws = await db.workspace.create({
        data: {
          name: `${user.name || user.email.split("@")[0]}'s Workspace`,
          ownerId: user.id,
          plan: "FREE",
        },
      });
      await db.user.update({
        where: { id: user.id },
        data: { workspaceId: ws.id },
      });
      await db.subscription.create({
        data: { workspaceId: ws.id, plan: "FREE", status: "ACTIVE" },
      });
    },
  },
};

// Augment session types with workspaceId + id.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      workspaceId?: string;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    workspaceId?: string;
  }
}
