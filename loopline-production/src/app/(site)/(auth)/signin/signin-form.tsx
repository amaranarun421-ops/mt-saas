"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialAuth } from "../_components/social-auth";
import { Logo } from "@/components/brand/logo";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type Inputs = z.infer<typeof schema>;

const DEMO_EMAIL = "demo@loopline.dev";
const DEMO_PASSWORD = "loopline123";

export function SignInForm({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
  });

  async function onSubmit(data: Inputs) {
    setLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (!res || res.error) {
      toast.error("Invalid email or password.");
      return;
    }
    toast.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  }

  function fillDemo() {
    form.setValue("email", DEMO_EMAIL);
    form.setValue("password", DEMO_PASSWORD);
    toast.info("Demo credentials filled - click Sign in to continue");
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <h1 className="mt-5 font-display text-2xl text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your Loopline workspace.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-brand-50/30 p-4 dark:border-brand-500/30 dark:bg-brand-500/10">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-brand-800 dark:text-brand-200">
              Try the demo - one click to sign in
            </p>
            <div className="mt-1.5 space-y-0.5 font-mono text-xs text-brand-700 dark:text-brand-300">
              <p>Email: <span className="font-semibold">{DEMO_EMAIL}</span></p>
              <p>Password: <span className="font-semibold">{DEMO_PASSWORD}</span></p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 underline-offset-2 hover:underline dark:text-brand-300"
            >
              Fill credentials automatically
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <SocialAuth />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="mt-1.5"
                disabled={loading}
                {...field}
              />
              {fieldState.error && (
                <p className="mt-1 text-xs text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/reset-password"
              className="text-xs text-brand-500 underline-offset-4 hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="........"
              disabled={loading}
              {...form.register("password")}
            />
            <button
              type="button"
              aria-label={showPw ? "Hide password" : "Show password"}
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full" withArrow>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-brand-500 underline-offset-4 hover:underline">
          Start free
        </Link>
      </p>
    </div>
  );
}
