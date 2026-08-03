import { ForgotPasswordForm } from "./_components/forgot-password";
import { ResetPasswordForm } from "./_components/reset-password";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params?.token || "";

  return token ? <ResetPasswordForm token={token} /> : <ForgotPasswordForm />;
}
