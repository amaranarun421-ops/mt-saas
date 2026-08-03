import { auth } from '@/auth';
import { SettingsClient } from '@/components/dashboard/settings-client';

export default async function SettingsPage() {
  const session = await auth();
  return (
    <SettingsClient
      user={{
        email: session!.user.email!,
        firstName: session!.user.firstName ?? '',
        lastName: session!.user.lastName ?? '',
        name: session!.user.name ?? '',
        image: session!.user.image ?? null,
        hasPassword: true, // we don't expose this; UI shows password form anyway
      }}
    />
  );
}
