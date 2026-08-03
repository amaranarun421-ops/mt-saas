import { auth } from '@/auth';

// NextAuth v5 middleware — the `authorized` callback in auth.ts handles all redirects.
export default auth;

export const config = {
  // Protect these routes
  matcher: [
    '/dashboard/:path*',
    '/signin',
    '/signup',
    '/verify-email',
  ],
};
