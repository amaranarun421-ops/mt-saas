import type { NextAuthOptions, Provider } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";
const AUTH_SECRET_FALLBACK = "showcase-demo-secret-not-for-production";
const DEMO_USER = {
  id: "demo-user",
  email: "demo@driftframe.app",
  password: "demo1234",
  name: "Demo Creator",
  creditsRemaining: 100,
} as const;

const providers: Provider[] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      if (
        credentials.email.toLowerCase().trim() === DEMO_USER.email &&
        credentials.password === DEMO_USER.password
      ) {
        return {
          id: DEMO_USER.id,
          email: DEMO_USER.email,
          name: DEMO_USER.name,
          image: undefined,
        } as any;
      }
      return null;
    },
  }),
];

if (!SHOWCASE_MODE && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (!SHOWCASE_MODE && process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers,
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? AUTH_SECRET_FALLBACK,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.creditsRemaining = DEMO_USER.creditsRemaining;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token.id as string) ?? DEMO_USER.id;
        (session.user as any).creditsRemaining =
          (token.creditsRemaining as number) ?? DEMO_USER.creditsRemaining;
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
