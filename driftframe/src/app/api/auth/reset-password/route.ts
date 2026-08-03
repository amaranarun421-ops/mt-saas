import { NextResponse } from "next/server";

/**
 * POST /api/auth/reset-password
 *
 * STUB for the demo — always returns success. In production this would:
 *   1. Look up the user by email.
 *   2. Generate a signed, single-use reset token (store in VerificationToken).
 *   3. Send a transactional email (Resend / Postmark / SendGrid) with a link
 *      to /reset-password?token=<token>.
 *   4. The reset form POSTs the new password + token to a /api/auth/reset-password/confirm
 *      route that verifies the token and updates passwordHash.
 *
 * We deliberately never reveal whether an email exists (anti-enumeration).
 */
export async function POST() {
  // Simulate latency so the UI loading state is visible.
  await new Promise((resolve) => setTimeout(resolve, 600));
  return NextResponse.json({
    ok: true,
    message:
      "If that email exists, a reset link is on its way. (Demo: no email is actually sent.)",
  });
}
