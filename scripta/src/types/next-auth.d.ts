import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      plan: string;
      creditsRemaining: number;
      isEmailVerified: boolean;
      firstName: string | null;
      lastName: string | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    plan?: string;
    creditsRemaining?: number;
    firstName?: string | null;
    lastName?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    plan?: string;
    creditsRemaining?: number;
    isEmailVerified?: boolean;
    firstName?: string | null;
    lastName?: string | null;
  }
}
