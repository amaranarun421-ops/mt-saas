import { AuthShell } from "@/components/driftframe/auth-shell";
import { SigninForm } from "@/components/driftframe/signin-form";
import { ensureSeedUser, DEMO_USER } from "@/lib/ensure-seed";
import Link from "next/link";

export default async function SigninPage() {
  // Auto-seed the demo user (idempotent) so the pre-filled credentials
  // always work even on a fresh DB.
  await ensureSeedUser();

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to keep generating."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-foreground font-medium hover:underline">
            Sign up free
          </Link>
        </>
      }
    >
      <SigninForm defaultEmail={DEMO_USER.email} defaultPassword={DEMO_USER.password} />
    </AuthShell>
  );
}
