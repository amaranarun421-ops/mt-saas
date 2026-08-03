import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { AuditLogClient } from "./audit-log-client";

export default async function AuditLogPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.workspaceId) redirect("/signin");
  return (
    <>
      <DashboardTopbar title="Audit Log" subtitle="Immutable record of security-relevant events" />
      <div className="container-loopline py-6">
        <AuditLogClient />
      </div>
    </>
  );
}
