import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { IntegrationsClient } from "./integrations-client";

export default async function IntegrationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  return (
    <>
      <DashboardTopbar title="Integrations" subtitle="Connect Loopline to your existing stack" />
      <div className="container-loopline py-6">
        <IntegrationsClient />
      </div>
    </>
  );
}
