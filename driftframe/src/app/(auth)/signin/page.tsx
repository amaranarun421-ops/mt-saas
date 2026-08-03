import { AuthShell } from "@/components/driftframe/auth-shell";
import { SigninForm } from "@/components/driftframe/signin-form";
import { DEMO_USER } from "@/lib/ensure-seed";
import Link from "next/link";

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl || "/dashboard";

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
      <SigninForm
        defaultEmail={DEMO_USER.email}
        defaultPassword={DEMO_USER.password}
        callbackUrl={callbackUrl}
      />
    </AuthShell>
  );
}
