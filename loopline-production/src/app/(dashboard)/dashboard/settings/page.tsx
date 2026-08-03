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

  const [workspace, user] = await Promise.all([
    db.workspace.findUnique({
      where: { id: wsId },
      select: { id: true, name: true, createdAt: true },
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true },
    }),
  ]);

  if (!workspace || !user) redirect("/signin");

  return (
    <>
      <DashboardTopbar title="Settings" subtitle="Manage your workspace and account" />
      <div className="container-loopline py-6">
        <SettingsClient
          workspace={{ id: workspace.id, name: workspace.name, createdAt: workspace.createdAt.toISOString() }}
          user={{ id: user.id, name: user.name || "", email: user.email, image: user.image }}
        />
      </div>
    </>
  );
}
