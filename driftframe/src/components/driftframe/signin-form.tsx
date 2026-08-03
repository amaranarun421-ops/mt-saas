"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Wand2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { GradientButton } from "@/components/driftframe/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialAuth } from "@/components/driftframe/social-auth";

interface SigninFormProps {
  defaultEmail?: string;
  defaultPassword?: string;
  callbackUrl?: string;
}

export function SigninForm({
  defaultEmail = "",
  defaultPassword = "",
  callbackUrl = "/dashboard",
}: SigninFormProps) {
  const router = useRouter();

  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState(defaultPassword);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  function fillTestCredentials() {
    setEmail(defaultEmail || "demo@driftframe.app");
    setPassword(defaultPassword || "demo1234");
    setShowPassword(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!res || res.error) {
        toast.error("Invalid email or password.");
        return;
      }
      toast.success("Welcome back!");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const hasDemoCreds = !!(defaultEmail || defaultPassword);

  return (
    <div className="space-y-5">
      {hasDemoCreds && (
        <div
          className="relative overflow-hidden rounded-2xl border border-[#7c3aed]/25 bg-[#7c3aed]/[0.06] p-4 pl-5"
          role="status"
          aria-live="polite"
        >
          <span
            className="absolute inset-y-0 left-0 w-1 bg-[#7c3aed]"
            aria-hidden
          />
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7c3aed] text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                Demo account - email and password are pre-filled.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Just click <span className="font-medium text-foreground">Sign in</span>{" "}
                to enter the studio. You start with 100 free credits.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <code className="rounded-md bg-card px-2 py-1 font-mono text-[11px] text-foreground">
                  {defaultEmail}
                </code>
                <code className="rounded-md bg-card px-2 py-1 font-mono text-[11px] text-foreground">
                  {defaultPassword}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 pl-9"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={() => router.push("/reset-password")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 px-9"
              placeholder="........"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground min-h-[40px] min-w-[40px]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <GradientButton type="submit" className="w-full" loading={loading}>
          Sign in
        </GradientButton>

        {hasDemoCreds && (
          <button
            type="button"
            onClick={fillTestCredentials}
            className="inline-flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Wand2 className="h-3 w-3" />
            Re-fill demo credentials
          </button>
        )}
      </form>

      <SocialAuth />
    </div>
  );
}
