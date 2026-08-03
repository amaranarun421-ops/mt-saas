"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { SocialAuth } from "../_components/social-auth";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

const schema = z.object({
  name: z.string().min(1, "Your name is required").max(80),
  workspaceName: z
    .string()
    .min(2, "Workspace name is required")
    .max(60, "Workspace name is too long"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[0-9]/, "Must include a number"),
});

type Inputs = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", workspaceName: "", email: "", password: "" },
  });

  async function onSubmit(data: Inputs) {
    if (SHOWCASE_MODE) {
      toast.message("Showcase mode uses the demo account only. Open sign in to continue.");
      router.push("/signin");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Signup failed.");
        setLoading(false);
        return;
      }
      if (json.showcase) {
        toast.message(json.message || "Use the demo account to sign in.");
        router.push("/signin");
        return;
      }
      const signInRes = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (!signInRes || signInRes.error) {
        toast.success("Account created. Please sign in.");
        router.push("/signin");
        return;
      }
      toast.success("Welcome to Loopline!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-display text-2xl text-foreground">Start free</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {SHOWCASE_MODE
            ? "Showcase mode uses the demo account on the sign-in page."
            : "Create your workspace - no card required."}
        </p>
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
          name="name"
          render={({ field, fieldState }) => (
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
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

        <Controller
          control={form.control}
          name="workspaceName"
          render={({ field, fieldState }) => (
            <div>
              <Label htmlFor="workspaceName">Workspace name</Label>
              <Input
                id="workspaceName"
                placeholder="Acme Inc. Support"
                className="mt-1.5"
                disabled={loading}
                {...field}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                A workspace can hold multiple bots - useful for agencies.
              </p>
              {fieldState.error && (
                <p className="mt-1 text-xs text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <div>
              <Label htmlFor="email">Work email</Label>
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
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
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
              Creating workspace...
            </>
          ) : (
            "Create workspace"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account? 
        <Link href="/signin" className="font-medium text-brand-500 underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
