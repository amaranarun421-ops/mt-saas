import { Resend } from 'resend';

let _client: Resend | null = null;

function getClient(): Resend | null {
  if (_client) return _client;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  _client = new Resend(apiKey);
  return _client;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? 'Scripta <noreply@scripta.app>';
const APP_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

/** Sends a verification email; gracefully no-ops (returns a fake token URL) when no API key is set. */
export async function sendVerificationEmail(opts: {
  to: string;
  token: string;
}): Promise<{ url: string | null; devOnly: boolean }> {
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${opts.token}`;
  const client = getClient();

  if (!client) {
    // Dev fallback: return the URL so the caller can show it inline.
    return { url: verifyUrl, devOnly: true };
  }

  await client.emails.send({
    from: FROM,
    to: opts.to,
    subject: 'Verify your Scripta account',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #7a5af8; font-size: 24px;">Welcome to Scripta</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #1f2937;">
          Please verify your email address to start writing with AI.
        </p>
        <p style="margin: 32px 0;">
          <a href="${verifyUrl}" style="background: #7a5af8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600;">
            Verify Email
          </a>
        </p>
        <p style="font-size: 14px; color: #6b7280;">
          Or copy this link into your browser:<br/>
          <span style="color: #7a5af8; word-break: break-all;">${verifyUrl}</span>
        </p>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="font-size: 12px; color: #9ca3af;">
          If you didn't sign up for Scripta, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  return { url: null, devOnly: false };
}

export async function sendPasswordResetEmail(opts: {
  to: string;
  token: string;
}): Promise<{ url: string | null; devOnly: boolean }> {
  const resetUrl = `${APP_URL}/reset-password?token=${opts.token}`;
  const client = getClient();

  if (!client) {
    return { url: resetUrl, devOnly: true };
  }

  await client.emails.send({
    from: FROM,
    to: opts.to,
    subject: 'Reset your Scripta password',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #7a5af8; font-size: 24px;">Reset your password</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #1f2937;">
          We received a request to reset your Scripta password. This link expires in 1 hour.
        </p>
        <p style="margin: 32px 0;">
          <a href="${resetUrl}" style="background: #7a5af8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600;">
            Reset Password
          </a>
        </p>
        <p style="font-size: 14px; color: #6b7280;">
          Or copy this link into your browser:<br/>
          <span style="color: #7a5af8; word-break: break-all;">${resetUrl}</span>
        </p>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="font-size: 12px; color: #9ca3af;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  return { url: null, devOnly: false };
}
