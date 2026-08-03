import { AuthShell } from "@/components/driftframe/auth-shell";
import { SignupForm } from "@/components/driftframe/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your studio"
      subtitle="10 free credits. No card required."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/signin" className="text-foreground font-medium hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
