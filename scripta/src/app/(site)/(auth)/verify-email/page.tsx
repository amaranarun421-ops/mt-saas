'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Mail, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const { data: session, update } = useSession();
  const [resending, setResending] = useState(false);
  const [devUrl, setDevUrl] = useState<string | null>(null);

  async function resend() {
    setResending(true);
    setDevUrl(null);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Could not resend.');
        return;
      }
      toast.success('Verification email re-sent.');
      if (json.devVerifyUrl) setDevUrl(json.devVerifyUrl);
    } catch {
      toast.error('Network error.');
    } finally {
      setResending(false);
    }
  }

  // If the session is already verified, redirect
  useEffect(() => {
    if (session?.user?.isEmailVerified) {
      // Force a session refresh then redirect
      update?.().catch(() => {});
      window.location.href = '/dashboard';
    }
  }, [session?.user?.isEmailVerified, update]);

  if (!session?.user) {
    return (
      <div className="space-y-5 text-center">
        <Mail className="mx-auto h-12 w-12 text-primary-500" />
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to see your verification status.
        </p>
        <Button asChild className="w-full btn-elevated text-white h-11">
          <Link href="/signin">Sign in</Link>
        </Button>
      </div>
    );
  }

  if (session.user.isEmailVerified) {
    return (
      <div className="space-y-5 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary-500" />
        <p className="text-sm text-muted-foreground">
          Email verified — redirecting to your dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-primary-500">
        <Mail className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
      <p className="text-sm text-muted-foreground">
        We sent a verification link to{' '}
        <span className="font-medium text-foreground">{session.user.email}</span>.
        Click the link in the email to activate your account.
      </p>

      {devUrl && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <p className="font-medium">Dev mode — email not sent</p>
          <p className="text-xs mt-1">
            <Link href={devUrl} className="underline break-all">
              Click here to verify your email
            </Link>
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Button
          onClick={resend}
          disabled={resending}
          variant="outline"
          className="w-full h-11"
        >
          {resending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Resend verification email
        </Button>
        <Button asChild variant="ghost" className="w-full h-11">
          <Link href="/api/auth/signout">Sign out</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: check your spam folder if you don&apos;t see the email.
      </p>
    </div>
  );
}
