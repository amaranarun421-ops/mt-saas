import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { ApiKeysClient } from "./api-keys-client";

export default async function ApiKeysPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  return (
    <>
      <DashboardTopbar title="API Keys" subtitle="Programmatic access to the Loopline REST API" />
      <div className="container-loopline py-6">
        <ApiKeysClient />
      </div>
    </>
  );
}
