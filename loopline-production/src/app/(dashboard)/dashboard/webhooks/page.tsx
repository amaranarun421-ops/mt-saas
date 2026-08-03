import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { WebhooksClient } from "./webhooks-client";

export default async function WebhooksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  return (
    <>
      <DashboardTopbar title="Webhooks" subtitle="Receive real-time events on your own server" />
      <div className="container-loopline py-6">
        <WebhooksClient />
      </div>
    </>
  );
}
