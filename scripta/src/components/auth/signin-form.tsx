'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, Loader2, Zap, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authValidation } from '@/lib/zod/auth.schema';
import { SocialAuthButtons } from './social-auth-buttons';

type Inputs = z.infer<typeof authValidation.login>;

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? '';
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? '';

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(authValidation.login),
    defaultValues: {
      // Prefill demo credentials so the tour is one click away.
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    },
  });

  // Surface query-string status messages
  const verified = params.get('verified');
  const error = params.get('error');

  async function onSubmit(data: Inputs) {
    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (!res || res.error) {
        toast.error('Invalid email or password.');
        return;
      }
      toast.success('Signed in. Redirecting…');
      setTimeout(() => router.push('/dashboard'), 300);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function signInDemo() {
    if (!DEMO_EMAIL || !DEMO_PASSWORD) {
      toast.error('Demo credentials are not configured.');
      return;
    }
    setIsDemoLoading(true);
    try {
      const res = await signIn('credentials', {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        redirect: false,
      });
      if (!res || res.error) {
        toast.error('Demo account is unavailable. Run `bun run scripts/seed-demo-user.ts`.');
        return;
      }
      toast.success('Signed in as the demo user.');
      setTimeout(() => router.push('/dashboard'), 300);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Try again.');
    } finally {
      setIsDemoLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to continue to your dashboard
        </p>
      </div>

      {/* One-click demo banner */}
      <div className="rounded-lg border border-primary-200/60 bg-gradient-to-br from-primary-50 to-amber-50 dark:from-primary-500/10 dark:to-amber-500/10 dark:border-primary-500/20 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-500 shrink-0" />
          <p className="text-xs font-semibold text-foreground">
            Tour the demo — no signup needed
          </p>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
          Sign in instantly as the demo user (10 free credits, all 4 modes
          accessible from the dashboard). The form below is pre-filled — just
          hit the button.
        </p>
        <Button
          type="button"
          onClick={signInDemo}
          disabled={isDemoLoading || isLoading}
          className="mt-3 w-full btn-elevated btn-press h-10 text-sm"
        >
          {isDemoLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Zap className="mr-2 h-4 w-4" />
          )}
          {isDemoLoading ? 'Signing in…' : 'Try demo account'}
        </Button>
      </div>

      {verified && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Your email is verified — sign in to continue.
        </div>
      )}
      {error === 'invalid-token' && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          That verification link is invalid. Request a new one.
        </div>
      )}
      {error === 'expired-token' && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          That link has expired. Request a new one.
        </div>
      )}

      <SocialAuthButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-9"
              disabled={isLoading}
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-xs text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/reset-password"
              className="text-xs text-primary-600 hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-9 pr-9"
              disabled={isLoading}
              {...form.register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((o) => !o)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full btn-elevated btn-press h-11"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        No account yet?{' '}
        <Link href="/signup" className="text-primary-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
