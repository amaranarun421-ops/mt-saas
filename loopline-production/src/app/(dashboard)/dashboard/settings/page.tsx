import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  const wsId = session.user.workspaceId;

  let workspace: { id: string; name: string; createdAt: Date } | null = {
    id: wsId,
    name: "Loopline Demo Workspace",
    createdAt: new Date(),
  };
  let user: { id: string; name: string | null; email: string; image: string | null } | null = {
    id: session.user.id,
    name: session.user.name || "Loopline Demo",
    email: session.user.email!,
    image: session.user.image ?? null,
  };

  try {
    const [dbWorkspace, dbUser] = await Promise.all([
      db.workspace.findUnique({ where: { id: wsId }, select: { id: true, name: true, createdAt: true } }),
      db.user.findUnique({ where: { id: session.user.id }, select: { id: true, name: true, email: true, image: true } }),
    ]);
    workspace = dbWorkspace ?? workspace;
    user = dbUser ?? user;
  } catch (error) {
    console.error("[loopline settings] showcase fallback", error);
  }

  return (
    <>
      <DashboardTopbar title="Settings" subtitle="Manage your workspace and account" />
      <div className="container-loopline py-6">
        <SettingsClient
          workspace={{ id: workspace!.id, name: workspace!.name, createdAt: workspace!.createdAt.toISOString() }}
          user={{ id: user!.id, name: user!.name || "Loopline Demo", email: user!.email, image: user!.image }}
        />
      </div>
    </>
  );
}
