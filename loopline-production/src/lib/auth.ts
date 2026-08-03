import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";
const AUTH_SECRET_FALLBACK = "showcase-demo-secret-not-for-production";
const DEMO_USER = {
  id: "demo-user",
  email: "demo@loopline.dev",
  password: "loopline123",
  name: "Loopline Demo",
  workspaceId: "demo-workspace",
} as const;

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? AUTH_SECRET_FALLBACK,
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
  pages: { signIn: "/signin" },
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
        if (email !== DEMO_USER.email || creds.password !== DEMO_USER.password) return null;
        return {
          id: DEMO_USER.id,
          email: DEMO_USER.email,
          name: DEMO_USER.name,
          image: undefined,
          workspaceId: DEMO_USER.workspaceId,
        };
      },
    }),
    ...(!SHOWCASE_MODE && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    ...(!SHOWCASE_MODE && process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
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
        // @ts-expect-error showcase workspace id
        token.workspaceId = user.workspaceId ?? DEMO_USER.workspaceId;
      }
      if (!token.workspaceId) {
        token.workspaceId = DEMO_USER.workspaceId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? DEMO_USER.id;
        // @ts-expect-error workspaceId lives on token
        session.user.workspaceId = (token.workspaceId as string) ?? DEMO_USER.workspaceId;
      }
      return session;
    },
  },
};

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
