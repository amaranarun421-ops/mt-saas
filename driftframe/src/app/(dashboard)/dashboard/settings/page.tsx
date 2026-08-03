import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingsPanel } from "@/components/driftframe/settings-panel";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin?callbackUrl=/dashboard/settings");

  let user: { name: string | null; email: string | null } | null = null;
  try {
    user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    });
  } catch (error) {
    console.error("[driftframe settings] showcase fallback", error);
  }

  return (
    <SettingsPanel
      initialName={user?.name ?? session.user.name ?? null}
      email={user?.email ?? session.user.email ?? null}
    />
  );
}
