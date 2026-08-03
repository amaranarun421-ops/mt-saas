'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authValidation } from '@/lib/zod/auth.schema';

type ForgotInputs = z.infer<typeof authValidation.forgotPasswordForm>;
type ResetInputs = z.infer<typeof authValidation.resetPassword>;

export function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get('token');
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const forgotForm = useForm<ForgotInputs>({
    resolver: zodResolver(authValidation.forgotPasswordForm),
    defaultValues: { email: '' },
  });
  const resetForm = useForm<ResetInputs>({
    resolver: zodResolver(authValidation.resetPassword),
    defaultValues: { newPassword: '', confirmNewPassword: '' },
  });

  async function onForgot(data: ForgotInputs) {
    setIsLoading(true);
    setDevResetUrl(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Request failed.');
        return;
      }
      setEmailSent(true);
      setDevResetUrl(json.devResetUrl ?? null);
      toast.success('If that email exists, a reset link is on its way.');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  async function onReset(data: ResetInputs) {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/auth/reset-password?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Reset failed.');
        return;
      }
      setResetDone(true);
      toast.success('Password updated. Sign in with your new password.');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  // Reset step (token in URL)
  if (token) {
    if (resetDone) {
      return (
        <div className="space-y-5 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="text-2xl font-bold">Password updated</h1>
          <p className="text-sm text-muted-foreground">
            You can now sign in with your new password.
          </p>
          <Button asChild className="w-full btn-elevated text-white h-11">
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>
      );
    }
    return (
      <div className="space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a new password for your account
          </p>
        </div>
        <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 chars + 1 number"
                className="pl-9 pr-9"
                disabled={isLoading}
                {...resetForm.register('newPassword')}
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
            {resetForm.formState.errors.newPassword && (
              <p className="text-xs text-red-500">
                {resetForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmNewPassword">Confirm password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmNewPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat new password"
                className="pl-9"
                disabled={isLoading}
                {...resetForm.register('confirmNewPassword')}
              />
            </div>
            {resetForm.formState.errors.confirmNewPassword && (
              <p className="text-xs text-red-500">
                {resetForm.formState.errors.confirmNewPassword.message}
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
                Updating…
              </>
            ) : (
              'Update password'
            )}
          </Button>
        </form>
      </div>
    );
  }

  // Forgot step (no token)
  if (emailSent) {
    return (
      <div className="space-y-5 text-center">
        <Mail className="mx-auto h-12 w-12 text-primary-500" />
        <h1 className="text-2xl font-bold">Check your inbox</h1>
        <p className="text-sm text-muted-foreground">
          If an account exists for that email, you&apos;ll receive a reset link
          shortly. The link expires in 1 hour.
        </p>
        {devResetUrl && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            <p className="font-medium">Dev mode — email not sent</p>
            <p className="text-xs mt-1">
              <Link href={devResetUrl} className="underline break-all">
                Click here to open the reset link
              </Link>
            </p>
          </div>
        )}
        <Button asChild variant="outline" className="w-full h-11">
          <Link href="/signin">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Forgot password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ll email you a link to reset your password
        </p>
      </div>
      <form onSubmit={forgotForm.handleSubmit(onForgot)} className="space-y-4">
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
              {...forgotForm.register('email')}
            />
          </div>
          {forgotForm.formState.errors.email && (
            <p className="text-xs text-red-500">
              {forgotForm.formState.errors.email.message}
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
              Sending link…
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link href="/signin" className="text-primary-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
