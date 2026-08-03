'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.02c-3.2.7-3.88-1.37-3.88-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.97.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.3 1.2-3.1-.12-.3-.52-1.48.1-3.07 0 0 .98-.32 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.5 3.2-1.18 3.2-1.18.62 1.59.22 2.77.1 3.07.74.8 1.2 1.84 1.2 3.1 0 4.42-2.7 5.4-5.27 5.69.41.36.78 1.05.78 2.12v3.14c0 .3.21.66.79.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export function SocialAuthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<null | 'google' | 'github'>(null);

  async function handle(provider: 'google' | 'github') {
    setLoadingProvider(provider);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (err) {
      console.error(err);
      toast.error(`Could not start ${provider} sign-in.`);
      setLoadingProvider(null);
    }
  }

  const googleConfigured = !!process.env.NEXT_PUBLIC_GOOGLE_CONFIGURED;
  const githubConfigured = !!process.env.NEXT_PUBLIC_GITHUB_CONFIGURED;

  return (
    <div className="grid grid-cols-1 gap-2">
      {googleConfigured && (
        <Button
          type="button"
          variant="outline"
          className="h-11 justify-center border-[#DADCE0] bg-white text-slate-900 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          disabled={loadingProvider !== null}
          onClick={() => handle('google')}
        >
          <GoogleIcon />
          <span className="ml-2">
            {loadingProvider === 'google' ? 'Opening Google...' : 'Continue with Google'}
          </span>
        </Button>
      )}
      {githubConfigured && (
        <Button
          type="button"
          variant="outline"
          className="h-11 justify-center border-slate-200 bg-slate-950 text-white hover:bg-slate-900 hover:text-white dark:border-slate-700"
          disabled={loadingProvider !== null}
          onClick={() => handle('github')}
        >
          <GithubIcon />
          <span className="ml-2">
            {loadingProvider === 'github' ? 'Opening GitHub...' : 'Continue with GitHub'}
          </span>
        </Button>
      )}
      {!googleConfigured && !githubConfigured && (
        <p className="text-center text-xs text-muted-foreground">
          Social login will appear here when{' '}
          <code className="rounded bg-muted px-1">GOOGLE_CLIENT_ID</code> and{' '}
          <code className="rounded bg-muted px-1">GITHUB_CLIENT_ID</code> are set.
        </p>
      )}
    </div>
  );
}
