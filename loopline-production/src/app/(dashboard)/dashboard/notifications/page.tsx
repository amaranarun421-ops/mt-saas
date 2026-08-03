import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { NotificationsClient } from "./notifications-client";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");

  return (
    <>
      <DashboardTopbar title="Notifications" subtitle="Stay on top of conversations and account activity" />
      <div className="container-loopline py-6">
        <NotificationsClient />
      </div>
    </>
  );
}
