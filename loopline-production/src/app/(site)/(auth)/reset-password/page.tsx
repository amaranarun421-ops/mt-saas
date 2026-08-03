"use client";

import { useState } from "react";
import { ForgotPasswordForm } from "./_components/forgot-password";
import { ResetPasswordForm } from "./_components/reset-password";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const hasToken = params.has("token");
  const [showReset] = useState(hasToken);

  return showReset ? <ResetPasswordForm /> : <ForgotPasswordForm />;
}
