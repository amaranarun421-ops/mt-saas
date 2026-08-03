import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingsPanel } from "@/components/driftframe/settings-panel";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin?callbackUrl=/dashboard/settings");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  return (
    <SettingsPanel
      initialName={user?.name ?? null}
      email={user?.email ?? session.user.email}
    />
  );
}
