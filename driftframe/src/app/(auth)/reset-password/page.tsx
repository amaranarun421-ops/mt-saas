import { AuthShell } from "@/components/driftframe/auth-shell";
import { ResetPasswordForm } from "@/components/driftframe/reset-password-form";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Reset password"
      subtitle="We'll send a reset link to your email."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/signin" className="text-foreground font-medium hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
