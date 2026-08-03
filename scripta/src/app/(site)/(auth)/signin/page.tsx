import { Suspense } from 'react';
import { SignInForm } from '@/components/auth/signin-form';

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="h-32" />}>
      <SignInForm />
    </Suspense>
  );
}
