import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { TeamClient } from "./team-client";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  return (
    <>
      <DashboardTopbar title="Team" subtitle="Manage workspace members and their roles" />
      <div className="container-loopline py-6">
        <TeamClient currentUserEmail={session.user.email!} />
      </div>
    </>
  );
}
