"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";
import { GradientButton } from "@/components/driftframe/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialAuth } from "@/components/driftframe/social-auth";

const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE !== "0";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (SHOWCASE_MODE) {
      toast.message("Showcase mode is using the demo account only. Use the sign-in page to continue.");
      router.push("/signin");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.error === "email_taken") {
          toast.error("That email is already registered. Try signing in.");
        } else if (data?.error === "validation_error") {
          toast.error("Please check your email and password.");
        } else {
          toast.error("Signup failed. Please try again.");
        }
        return;
      }
      const sign = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!sign || sign.error) {
        toast.success("Account created. Please sign in.");
        router.push("/signin");
        return;
      }
      toast.success("Welcome to Driftframe! 10 free credits added.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name (optional)</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 pl-9"
              placeholder="Ada Lovelace"
            />
          </div>
        </div>

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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pl-9"
              placeholder="At least 8 characters"
            />
          </div>
        </div>

        <GradientButton type="submit" className="w-full" loading={loading}>
          Create account
        </GradientButton>

        <p className="text-center text-xs text-muted-foreground">
          {SHOWCASE_MODE
            ? "Showcase mode uses the demo account on the sign-in page."
            : "You&apos;ll get 10 free credits to start. No card required."}
        </p>
      </form>

      <SocialAuth />
    </>
  );
}
