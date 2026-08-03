import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { ActivityClient } from "./activity-client";

export default async function ActivityPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  return (
    <>
      <DashboardTopbar title="Activity" subtitle="Everything happening across your workspace" />
      <div className="container-loopline py-6">
        <ActivityClient />
      </div>
    </>
  );
}
